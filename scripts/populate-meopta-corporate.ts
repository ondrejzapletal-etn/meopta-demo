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

async function buildHistoryHeritagePage(): Promise<Record<string, unknown>[]> {
  return [
    {
      blockType: 'heroPlainBlock',
      backgroundColor: 'green',
      textAlign: 'center',
      title: 'Nine Decades of Optical Excellence',
      description: htmlToLexical(
        '<p>Since 1933, Meopta has combined Czech engineering tradition with relentless innovation to deliver world-class optical systems for defense, industry, and sport optics customers around the globe.</p>',
      ),
      links: [],
    },
    {
      blockType: 'timelineBlock',
      title: 'Our Journey',
      items: [
        {
          year: '1933',
          title: 'Foundation',
          description: 'Optikotechna founded in Přerov, Czech Republic, beginning production of cameras and projection equipment.',
        },
        {
          year: '1946',
          title: 'Post-War Rebirth',
          description: 'Renamed to Meopta, expanding into military optics and precision instruments for the Czechoslovak Army.',
        },
        {
          year: '1960',
          title: 'Industrial Expansion',
          description: 'Becomes a leading manufacturer of cinema projectors and optical instruments, exported worldwide.',
        },
        {
          year: '1970',
          title: 'Military Optics Leadership',
          description: 'Develops advanced weapon sights and periscope systems for Warsaw Pact armies.',
        },
        {
          year: '1989',
          title: 'New Era Begins',
          description: 'Velvet Revolution opens doors to Western markets and partnerships.',
        },
        {
          year: '1992',
          title: 'Privatization',
          description: 'Company privatized, begins transformation into a global optical manufacturer.',
        },
        {
          year: '2005',
          title: 'U.S. Expansion',
          description: 'Meopta USA established in Long Island City, New York, serving North American sport optics market.',
        },
        {
          year: '2010',
          title: 'Semiconductor Entry',
          description: 'Enters high-end lithography lens manufacturing for semiconductor industry.',
        },
        {
          year: '2018',
          title: 'New Facility',
          description: 'Opens state-of-the-art 75,000 m² manufacturing campus in Přerov.',
        },
        {
          year: '2024',
          title: 'Global Leader',
          description: 'Employs over 2,600 people, serving customers in 50+ countries across three segments.',
        },
      ],
    },
  ];
}

async function buildCareerPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Meopta professionals collaborating in advanced optical manufacturing',
    'meopta-career-hero.png',
  );
  const technologyIcon = await ensureMedia(
    'placeholder',
    'Cutting-edge optical technology icon',
    'meopta-career-technology-icon.png',
  );
  const impactIcon = await ensureMedia(
    'placeholder',
    'Global impact icon',
    'meopta-career-impact-icon.png',
  );
  const growthIcon = await ensureMedia(
    'placeholder',
    'Career growth icon',
    'meopta-career-growth-icon.png',
  );
  const stabilityIcon = await ensureMedia(
    'placeholder',
    'Stable employer icon',
    'meopta-career-stability-icon.png',
  );
  const benefitsIcon = await ensureMedia(
    'placeholder',
    'Competitive benefits icon',
    'meopta-career-benefits-icon.png',
  );
  const campusIcon = await ensureMedia(
    'placeholder',
    'Modern campus icon',
    'meopta-career-campus-icon.png',
  );

  return [
    {
      blockType: 'heroWithImageBlock',
      backgroundColor: 'green',
      imagePosition: 'right',
      title: 'Shape the Future of Optics',
      description: htmlToLexical(
        '<p>Join 2,600+ professionals at a company that combines tradition with cutting-edge technology.</p>',
      ),
      image: heroImage,
      links: [
        { label: 'View Open Positions', url: '#', appearance: 'primary' },
      ],
    },
    {
      blockType: 'benefitsBlock',
      title: 'Why Work at Meopta',
      description: htmlToLexical(
        '<p>Build a meaningful career in a company where precision engineering, long-term stability, and global impact come together every day.</p>',
      ),
      columns: '3',
      items: [
        {
          icon: technologyIcon,
          title: 'Cutting-Edge Technology',
          description: htmlToLexical(
            '<p>Work with the latest in optical design, CNC machining, and cleanroom manufacturing.</p>',
          ),
        },
        {
          icon: impactIcon,
          title: 'Global Impact',
          description: htmlToLexical(
            '<p>Your work reaches 50+ countries — from semiconductor fabs to nature reserves to active combat zones.</p>',
          ),
        },
        {
          icon: growthIcon,
          title: 'Career Growth',
          description: htmlToLexical(
            '<p>We invest in continuous learning, university partnerships, and internal mobility programs.</p>',
          ),
        },
        {
          icon: stabilityIcon,
          title: 'Stable Employer',
          description: htmlToLexical(
            '<p>90+ years of continuous operation. Family-owned with long-term vision.</p>',
          ),
        },
        {
          icon: benefitsIcon,
          title: 'Competitive Benefits',
          description: htmlToLexical(
            '<p>Above-market compensation, meal vouchers, pension contributions, and flexible work arrangements.</p>',
          ),
        },
        {
          icon: campusIcon,
          title: 'Modern Campus',
          description: htmlToLexical(
            '<p>Brand-new 75,000 m² facility with cafeteria, gym, and green spaces in Přerov.</p>',
          ),
        },
      ],
    },
    {
      blockType: 'ctaCardsBlock',
      title: 'Start Your Meopta Journey',
      items: [
        {
          title: 'Engineering & R&D',
          description: 'Optical design, mechanical engineering, software development, and quality assurance.',
          linkLabel: 'Explore Roles',
          linkUrl: '#',
        },
        {
          title: 'Manufacturing & Operations',
          description: 'CNC operation, glass polishing, coating technology, and cleanroom assembly.',
          linkLabel: 'Explore Roles',
          linkUrl: '#',
        },
        {
          title: 'Students & Graduates',
          description: 'Internships, diploma theses, and graduate programs in partnership with Czech universities.',
          linkLabel: 'Explore Opportunities',
          linkUrl: '#',
        },
      ],
    },
  ];
}

async function buildSustainabilityPage(): Promise<Record<string, unknown>[]> {
  const pillarIcon = await ensureMedia(
    'placeholder',
    'Sustainability pillar icon',
    'meopta-sustainability-pillar-icon.png',
  );

  return [
    {
      blockType: 'heroPlainBlock',
      backgroundColor: 'white',
      textAlign: 'center',
      title: 'Responsible Manufacturing for a Better Future',
      description: htmlToLexical(
        '<p>We are committed to environmental stewardship and social responsibility across every stage of our operations.</p>',
      ),
      links: [],
    },
    {
      blockType: 'benefitsColumnsBlock',
      title: 'Our Sustainability Pillars',
      description: htmlToLexical(
        '<p>Our ESG priorities are embedded into manufacturing, people development, and long-term product strategy.</p>',
      ),
      items: [
        { icon: pillarIcon, text: 'ISO 14001 Environmental Management' },
        { icon: pillarIcon, text: 'Energy-Efficient Manufacturing' },
        { icon: pillarIcon, text: 'Waste Reduction & Recycling Programs' },
        { icon: pillarIcon, text: 'Community Engagement & Education' },
        { icon: pillarIcon, text: 'Responsible Supply Chain' },
      ],
    },
    {
      blockType: 'richTextBlock',
      backgroundColor: 'lightGrey',
      content: htmlToLexical(
        '<p>Meopta continuously improves its environmental performance through ISO 14001-certified processes, rigorous energy management initiatives, and practical waste-reduction programs across production lines and support operations.</p><p>Our responsibility also extends beyond factory walls. We collaborate with universities, support STEM education, and create high-value long-term employment opportunities in the Přerov region and broader Czech ecosystem.</p><p>Product longevity is a central principle in our design philosophy. With robust engineering and long service life, many Meopta products remain in operation for decades.</p><p>Our 30-year warranty on selected products reflects this commitment to durability, helping reduce material waste and reinforcing a circular approach where quality and reliability come first.</p>',
      ),
    },
  ];
}

async function main(): Promise<void> {
  void textToLexical;

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');
  console.log('Building Meopta Corporate pages...');

  const pages: Array<{ title: string; slug: string; blocks: Record<string, unknown>[] }> = [
    {
      title: 'History & Heritage | Meopta',
      slug: 'about/history',
      blocks: await buildHistoryHeritagePage(),
    },
    {
      title: 'Career at Meopta',
      slug: 'about/career',
      blocks: await buildCareerPage(),
    },
    {
      title: 'Sustainability | Meopta',
      slug: 'about/sustainability',
      blocks: await buildSustainabilityPage(),
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
