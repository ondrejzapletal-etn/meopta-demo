#!/usr/bin/env npx tsx
import {
  findPage,
  createPage,
  updatePage,
  deletePage,
  uploadMedia,
} from './lib/cms-api.js';
import {
  downloadImage,
  createPlaceholderImage,
  safeFilename,
} from './lib/image-utils.js';
import { htmlToLexical, textToLexical } from './lib/lexical.js';

const mediaCache: Record<string, number> = {};

async function ensureMedia(url: string, alt: string, filename?: string): Promise<number> {
  const key = url;
  if (mediaCache[key]) return mediaCache[key]!;
  let localPath: string;
  try {
    if (url === 'placeholder' || !url) {
      localPath = createPlaceholderImage(filename || 'placeholder.png');
    } else {
      localPath = await downloadImage(url, filename || safeFilename(url));
    }
  } catch {
    console.warn(`  Could not download ${url}, using placeholder`);
    localPath = createPlaceholderImage(filename || 'placeholder.png');
  }
  const id = await uploadMedia(localPath, alt);
  mediaCache[key] = id;
  return id;
}

async function upsertPage(title: string, slug: string, blocks: Record<string, unknown>[], doReset: boolean): Promise<void> {
  if (doReset) {
    const existing = await findPage(slug);
    if (existing) { await deletePage(existing.id); console.log(`Deleted ${slug}`); }
  }
  const existing = await findPage(slug);
  if (existing) {
    await updatePage(existing.id, blocks);
    console.log(`Updated ${slug} (id=${existing.id})`);
  } else {
    const page = await createPage(title, slug, blocks);
    console.log(`Created ${slug} (id=${page.id})`);
  }
}

async function buildDownloadCenterPage(): Promise<Record<string, unknown>[]> {
  const cardImage = await ensureMedia(
    'placeholder',
    'Meopta support document thumbnail',
    'meopta-support-download-card.png',
  );

  return [
    {
      blockType: 'heroPlainBlock',
      backgroundColor: 'white',
      textAlign: 'center',
      title: 'Download Center',
      description: htmlToLexical(
        '<p>Access product catalogs, technical documentation, user manuals, and software updates.</p>',
      ),
      links: [],
    },
    {
      blockType: 'contentCardsBlock',
      title: 'Available Downloads',
      items: [
        {
          image: cardImage,
          title: 'Sport Optics Catalog 2025',
          description: 'Complete catalog of MeoStar, MeoPro, and MeoTac product lines with full specifications.',
          labels: 'Catalog',
          linkLabel: 'Download PDF',
          linkUrl: '#',
        },
        {
          image: cardImage,
          title: 'Industrial Capabilities Brochure',
          description: "Overview of Meopta's OEM manufacturing services, cleanroom facilities, and quality certifications.",
          labels: 'Brochure',
          linkLabel: 'Download PDF',
          linkUrl: '#',
        },
        {
          image: cardImage,
          title: 'Defense Product Portfolio',
          description: 'Technical specifications for military weapon sights, periscopes, and vehicle optical systems.',
          labels: 'Brochure',
          linkLabel: 'Download PDF',
          linkUrl: '#',
        },
        {
          image: cardImage,
          title: 'MeoStar S2 82 HD User Manual',
          description: 'Complete user guide for the MeoStar S2 82 HD spotting scope including maintenance instructions.',
          labels: 'Manual',
          linkLabel: 'Download PDF',
          linkUrl: '#',
        },
        {
          image: cardImage,
          title: 'Riflescope Mounting Guide',
          description: 'Step-by-step instructions for properly mounting Meopta riflescopes with torque specifications.',
          labels: 'Guide',
          linkLabel: 'Download PDF',
          linkUrl: '#',
        },
        {
          image: cardImage,
          title: 'Warranty Registration Form',
          description: 'Register your Meopta product to activate the 30-year transferable warranty.',
          labels: 'Form',
          linkLabel: 'Download PDF',
          linkUrl: '#',
        },
      ],
    },
  ];
}

async function buildDealerLocatorPage(): Promise<Record<string, unknown>[]> {
  const benefitIcon = await ensureMedia(
    'placeholder',
    'Authorized Meopta dealer benefit icon',
    'meopta-support-dealer-benefit-icon.png',
  );

  return [
    {
      blockType: 'heroPlainBlock',
      backgroundColor: 'green',
      textAlign: 'center',
      title: 'Find an Authorized Dealer',
      description: htmlToLexical(
        '<p>Locate your nearest Meopta authorized dealer or service center. Our global network of over 200 dealers ensures expert advice and support wherever you are.</p>',
      ),
      links: [],
    },
    {
      blockType: 'benefitsBlock',
      title: 'Why Buy From an Authorized Dealer',
      description: htmlToLexical(
        '<p>Authorized partners deliver trusted products, professional consultation, and dependable service throughout ownership.</p>',
      ),
      columns: '3',
      items: [
        {
          icon: benefitIcon,
          title: 'Genuine Products',
          description: htmlToLexical(
            '<p>Every product from an authorized dealer comes with full factory warranty and authenticity guarantee.</p>',
          ),
        },
        {
          icon: benefitIcon,
          title: 'Expert Advice',
          description: htmlToLexical(
            '<p>Our dealers are trained professionals who can help you choose the right optic for your needs.</p>',
          ),
        },
        {
          icon: benefitIcon,
          title: 'After-Sales Support',
          description: htmlToLexical(
            "<p>Authorized dealers provide warranty service, repairs, and direct communication with Meopta's service team.</p>",
          ),
        },
      ],
    },
    {
      blockType: 'richTextBlock',
      backgroundColor: 'lightGrey',
      variant: 'info-box',
      title: 'Become a Dealer',
      content: htmlToLexical(
        '<p>Interested in joining the Meopta dealer network? We welcome qualified retail and distribution partners who share our focus on premium optics and customer care. Send your company profile, market coverage, and sales capabilities to dealers@meopta.com, and our regional team will guide you through the authorization review and onboarding process.</p>',
      ),
      linkLabel: 'Apply Now',
      linkUrl: '#',
    },
  ];
}

async function main(): Promise<void> {
  void textToLexical;

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');
  console.log('Building Meopta Support pages...');

  const pages: Array<{ title: string; slug: string; blocks: Record<string, unknown>[] }> = [
    {
      title: 'Download Center | Meopta',
      slug: 'support/download-center',
      blocks: await buildDownloadCenterPage(),
    },
    {
      title: 'Find a Dealer | Meopta',
      slug: 'support/dealer-locator',
      blocks: await buildDealerLocatorPage(),
    },
  ];

  if (dryRun) {
    console.log('\n[DRY RUN] Generated page layouts:');
    for (const page of pages) {
      console.log(`\n--- ${page.slug} ---`);
      console.log(JSON.stringify(page.blocks, null, 2));
    }
    return;
  }

  for (const page of pages) {
    await upsertPage(page.title, page.slug, page.blocks, doReset);
  }
}

main().catch((err) => { console.error('Fatal error:', err); process.exit(1); });
