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

async function buildHuntingPage(): Promise<Record<string, unknown>[]> {
  const heroSlideImage1 = await ensureMedia(
    'placeholder',
    'Hunter at sunrise using MeoStar riflescope in low-light conditions',
    'meopta-hunting-hero-meostar-r2.png',
  );
  const heroSlideImage2 = await ensureMedia(
    'placeholder',
    'Bird’s-eye valley landscape observed through MeoPro binoculars',
    'meopta-hunting-hero-meopro-binoculars.png',
  );
  const meostarIcon = await ensureMedia(
    'placeholder',
    'MeoStar R2 riflescope product icon',
    'meopta-hunting-card-meostar-r2.png',
  );
  const optika6Icon = await ensureMedia(
    'placeholder',
    'MeoPro Optika6 riflescope product icon',
    'meopta-hunting-card-optika6.png',
  );
  const b1PlusIcon = await ensureMedia(
    'placeholder',
    'MeoStar B1 Plus binoculars product icon',
    'meopta-hunting-card-b1-plus.png',
  );
  const dealerIcon = await ensureMedia(
    'placeholder',
    'Dealer locator card icon',
    'meopta-hunting-cta-dealer.png',
  );
  const compareIcon = await ensureMedia(
    'placeholder',
    'Compare products card icon',
    'meopta-hunting-cta-compare.png',
  );
  const catalogIcon = await ensureMedia(
    'placeholder',
    'Download catalog card icon',
    'meopta-hunting-cta-catalog.png',
  );

  return [
    {
      blockType: 'heroSliderBlock',
      slides: [
        {
          title: 'MeoStar Riflescopes — Unmatched Light Transmission',
          description:
            'Built for first and last light, MeoStar riflescopes deliver exceptional contrast and reliable point-of-impact performance when every second in the field matters.',
          image: heroSlideImage1,
          backgroundColor: 'green',
          linkLabel: 'Explore MeoStar Series',
          linkUrl: '#',
        },
        {
          title: 'MeoPro Binoculars — Nature as It Was Meant to Be Seen',
          description:
            'MeoPro binoculars combine bright, neutral color rendering with durable mechanics, helping hunters identify detail quickly in changing terrain and weather.',
          image: heroSlideImage2,
          backgroundColor: 'white',
          linkLabel: 'See MeoPro Binoculars',
          linkUrl: '#',
        },
      ],
      autoPlay: true,
      autoPlayInterval: 5000,
    },
    {
      blockType: 'productDetailCardsBlock',
      title: 'Our Hunting Optics',
      columns: '3',
      items: [
        {
          icon: meostarIcon,
          name: 'MeoStar R2',
          subtitle: '1-6x24 RD',
          description: htmlToLexical(
            '<p>A premium driven-hunt riflescope engineered for fast target acquisition and outstanding image clarity in dense woodland and twilight hunting conditions.</p>',
          ),
          features: [
            { text: 'HD Optics' },
            { text: '90%+ Light Transmission' },
            { text: 'Ion Assisted Coatings' },
            { text: '30mm Tube' },
          ],
          linkLabel: 'View Details',
          linkUrl: '#',
        },
        {
          icon: optika6Icon,
          name: 'MeoPro Optika6',
          subtitle: '3-18x56',
          description: htmlToLexical(
            '<p>Designed for versatile hunting distances, Optika6 offers a broad zoom range and precise reticle control for both woodland stalking and open-field shots.</p>',
          ),
          features: [
            { text: '6x Zoom' },
            { text: 'European Glass' },
            { text: 'Waterproof/Fogproof' },
            { text: 'Second Focal Plane' },
          ],
          linkLabel: 'View Details',
          linkUrl: '#',
        },
        {
          icon: b1PlusIcon,
          name: 'MeoStar B1 Plus',
          subtitle: '10x42 HD',
          description: htmlToLexical(
            '<p>Trusted by experienced hunters, this binocular delivers high-edge sharpness, natural color fidelity, and reliable ergonomics for all-day tracking.</p>',
          ),
          features: [
            { text: 'Fluoride HD Glass' },
            { text: 'Phase Corrected Prisms' },
            { text: 'Open Bridge Design' },
            { text: '565g' },
          ],
          linkLabel: 'View Details',
          linkUrl: '#',
        },
      ],
    },
    {
      blockType: 'ctaCardsBlock',
      title: 'Find Your Perfect Optic',
      description: htmlToLexical(
        '<p>Get expert support choosing optics that match your hunting style, terrain, and expected light conditions.</p>',
      ),
      items: [
        {
          icon: dealerIcon,
          title: 'Visit a Dealer',
          description: 'Get hands-on guidance, compare models, and test ergonomics with a certified Meopta partner.',
          linkLabel: 'Find Dealer',
          linkUrl: '/support/dealer-locator',
        },
        {
          icon: compareIcon,
          title: 'Compare Products',
          description: 'Review magnification ranges, reticles, and transmission performance side by side.',
          linkLabel: 'Start Comparison',
          linkUrl: '#',
        },
        {
          icon: catalogIcon,
          title: 'Download Catalog',
          description: 'Access full specifications, feature highlights, and recommended use cases in one place.',
          linkLabel: 'Download PDF',
          linkUrl: '/support/download-center',
        },
      ],
    },
  ];
}

async function buildBirdwatchingPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Birdwatcher using Meopta binoculars in a wetland reserve',
    'meopta-birdwatching-hero.png',
  );
  const spottingScopeImage = await ensureMedia(
    'placeholder',
    'MeoStar S2 82 HD spotting scope on tripod',
    'meopta-birdwatching-s2-82.png',
  );
  const meoproImage = await ensureMedia(
    'placeholder',
    'MeoPro HD Plus 8x56 binoculars in early morning light',
    'meopta-birdwatching-meopro-hd-plus.png',
  );
  const b1PlusImage = await ensureMedia(
    'placeholder',
    'MeoStar B1 Plus 8x32 HD compact field binoculars',
    'meopta-birdwatching-b1-plus-832.png',
  );

  return [
    {
      blockType: 'heroWithImageBlock',
      backgroundColor: 'white',
      imagePosition: 'right',
      title: 'Experience Nature in True Color',
      description: htmlToLexical(
        '<p>Meopta optics are engineered for birders who depend on faithful color rendition and high contrast to identify species quickly and confidently.</p><p>From dawn migrations to extended hide sessions, our ergonomic designs reduce fatigue while preserving optical precision throughout the day.</p>',
      ),
      image: heroImage,
      links: [
        { label: 'Explore Birding Optics', url: '#', appearance: 'primary' },
        { label: 'Find a Dealer', url: '/support/dealer-locator', appearance: 'outline' },
      ],
    },
    {
      blockType: 'productCardsHorizontalBlock',
      title: 'Binoculars & Spotting Scopes for Birders',
      items: [
        {
          image: spottingScopeImage,
          title: 'MeoStar S2 82 HD Spotting Scope',
          description: 'Fluoride HD glass for true color, 20-70x zoom, lightweight magnesium body',
          linkLabel: 'View Product',
          linkUrl: '#',
        },
        {
          image: meoproImage,
          title: 'MeoPro HD Plus 8x56',
          description: 'Exceptional twilight performance, perfect for dawn and dusk observation',
          linkLabel: 'View Product',
          linkUrl: '#',
        },
        {
          image: b1PlusImage,
          title: 'MeoStar B1 Plus 8x32 HD',
          description: 'Compact, lightweight, ideal for all-day field use',
          linkLabel: 'View Product',
          linkUrl: '#',
        },
      ],
    },
  ];
}

async function buildTacticalPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Tactical marksman with Meopta riflescope at training range',
    'meopta-tactical-hero.png',
  );
  const meotacIcon = await ensureMedia(
    'placeholder',
    'MeoTac riflescope product icon',
    'meopta-tactical-meotac.png',
  );
  const optika5Icon = await ensureMedia(
    'placeholder',
    'MeoPro Optika5 riflescope product icon',
    'meopta-tactical-optika5.png',
  );

  return [
    {
      blockType: 'heroWithImageCompactBlock',
      backgroundColor: 'green',
      title: 'Precision Under Pressure',
      description:
        'Meopta tactical riflescopes are built for competitive shooting and law enforcement teams who need rapid target transition, repeatable adjustments, and dependable optical clarity in high-stress scenarios.',
      image: heroImage,
      links: [
        { label: 'Request Product Info', url: '#', appearance: 'primary' },
        { label: 'Contact Tactical Team', url: '#', appearance: 'outline' },
      ],
    },
    {
      blockType: 'productDetailCardsBlock',
      title: 'Tactical Riflescope Series',
      columns: '2',
      items: [
        {
          icon: meotacIcon,
          name: 'MeoTac',
          subtitle: '3-18x56 RD',
          description: htmlToLexical(
            '<p>Purpose-built for precision engagements, MeoTac delivers robust turret mechanics, reliable reticle tracking, and outstanding image quality under dynamic range conditions.</p>',
          ),
          features: [
            { text: 'Zero Stop Turrets' },
            { text: 'First Focal Plane' },
            { text: 'Illuminated Reticle' },
            { text: '34mm Tube' },
          ],
          linkLabel: 'View Details',
          linkUrl: '#',
        },
        {
          icon: optika5Icon,
          name: 'MeoPro Optika5',
          subtitle: '2-10x42 RD',
          description: htmlToLexical(
            '<p>A versatile tactical optic combining practical magnification, intuitive illumination control, and reliable construction for training and operational use.</p>',
          ),
          features: [
            { text: '5x Zoom Range' },
            { text: 'Dichroic Reticle Illumination' },
            { text: 'Side Focus Parallax' },
            { text: '1-inch Tube' },
          ],
          linkLabel: 'View Details',
          linkUrl: '#',
        },
      ],
    },
  ];
}

async function buildServiceWarrantyPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Meopta service technician inspecting sport optic in workshop',
    'meopta-service-warranty-hero.png',
  );
  const warrantyIcon = await ensureMedia(
    'placeholder',
    'Warranty shield icon',
    'meopta-service-warranty-icon.png',
  );
  const repairIcon = await ensureMedia(
    'placeholder',
    'Factory repair icon',
    'meopta-service-repair-icon.png',
  );
  const registrationIcon = await ensureMedia(
    'placeholder',
    'Product registration icon',
    'meopta-service-registration-icon.png',
  );

  return [
    {
      blockType: 'heroPlainBlock',
      backgroundColor: 'green',
      textAlign: 'center',
      title: 'We Stand Behind Every Product',
      description: htmlToLexical(
        '<p>Every Meopta Sport Optics product is backed by a 30-year transferable warranty, reflecting our long-term commitment to reliability, craftsmanship, and customer confidence.</p>',
      ),
      image: heroImage,
      links: [
        { label: 'Register Your Product', url: '#registration', appearance: 'primary' },
        { label: 'Start a Service Request', url: '#repair', appearance: 'outline' },
      ],
    },
    {
      blockType: 'benefitsBlock',
      title: 'Our Service Promise',
      columns: '3',
      items: [
        {
          icon: warrantyIcon,
          title: '30-Year Transferable Warranty',
          description: htmlToLexical(
            '<p>Your warranty follows the product, increasing long-term value and ensuring confidence for both original and future owners.</p>',
          ),
        },
        {
          icon: repairIcon,
          title: 'Factory Repair Service',
          description: htmlToLexical(
            '<p>Our trained technicians use original parts, verified procedures, and factory tools to restore performance to Meopta standards.</p>',
          ),
        },
        {
          icon: registrationIcon,
          title: 'Product Registration',
          description: htmlToLexical(
            '<p>Registering your optic helps us provide faster support, easier proof of ownership, and timely updates about service programs.</p>',
          ),
        },
      ],
    },
    {
      blockType: 'faqItemsBlock',
      title: 'Frequently Asked Questions',
      numbered: false,
      allowMultiple: true,
      items: [
        {
          title: 'What does the 30-year warranty cover?',
          content: htmlToLexical(
            '<p>The warranty covers defects in materials and workmanship under normal use. It does not cover misuse, unauthorized modifications, or accidental damage.</p>',
          ),
        },
        {
          title: 'How do I request a repair?',
          content: htmlToLexical(
            '<p>Contact Meopta support or your authorized dealer with the product model, serial number, and issue description. We will provide next steps for inspection and service intake.</p>',
          ),
        },
        {
          title: 'How long does service usually take?',
          content: htmlToLexical(
            '<p>Turnaround depends on product type and parts availability, but most standard repairs are completed within 2-4 weeks after receipt at our service center.</p>',
          ),
        },
        {
          title: 'Why should I register my product?',
          content: htmlToLexical(
            '<p>Registration simplifies future support requests, accelerates warranty validation, and ensures we can notify you of relevant product service updates.</p>',
          ),
        },
      ],
    },
  ];
}

async function main(): Promise<void> {
  void textToLexical;

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');
  console.log('Building Meopta Sport pages...');

  const pages: Array<{ title: string; slug: string; blocks: Record<string, unknown>[] }> = [
    {
      title: 'Hunting Optics | Meopta Sport',
      slug: 'sport/hunting',
      blocks: await buildHuntingPage(),
    },
    {
      title: 'Birdwatching Optics | Meopta Sport',
      slug: 'sport/birdwatching',
      blocks: await buildBirdwatchingPage(),
    },
    {
      title: 'Tactical Optics | Meopta Sport',
      slug: 'sport/tactical',
      blocks: await buildTacticalPage(),
    },
    {
      title: 'Service & Warranty | Meopta Sport',
      slug: 'sport/service-warranty',
      blocks: await buildServiceWarrantyPage(),
    },
  ];

  if (dryRun) {
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
