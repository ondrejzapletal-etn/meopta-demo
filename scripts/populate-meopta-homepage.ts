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

const PAGE_SLUG = 'homepage';
const PAGE_TITLE = 'Meopta | Precision Optics Since 1933';

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

async function buildHeroSliderBlock(): Promise<Record<string, unknown>> {
  const industrialImage = await ensureMedia(
    'placeholder',
    'Industrial optical systems for semiconductor manufacturing',
    'meopta-industrial-semicon.png',
  );
  const sportImage = await ensureMedia(
    'placeholder',
    'Sport optics including riflescopes and binoculars',
    'meopta-sport-optics.png',
  );
  const defenceImage = await ensureMedia(
    'placeholder',
    'Defence optical systems for military applications',
    'meopta-defence-optics.png',
  );

  return {
    blockType: 'heroSliderBlock',
    slides: [
      {
        title: 'Precision Optics for Semiconductor Industry',
        description:
          'Meopta develops high-precision optical assemblies for lithography systems, EUV process tools, and metrology equipment, produced in ISO-certified clean room environments with strict process control.',
        image: industrialImage,
        backgroundColor: 'green',
        linkLabel: 'Explore Industrial Solutions',
        linkUrl: '/industrial/all-in-one-service',
        secondaryLinkLabel: 'Contact Engineering Team',
        secondaryLinkUrl: '/industrial/contact',
      },
      {
        title: 'See Nature in Perfect Clarity',
        description:
          'From premium riflescopes to binoculars and spotting scopes, Meopta sport optics deliver exceptional light transmission, rugged construction, and precision performance for hunters and outdoor professionals.',
        image: sportImage,
        backgroundColor: 'white',
        linkLabel: 'Discover Sport Optics',
        linkUrl: '/sport/hunting',
        secondaryLinkLabel: 'View Product Portfolio',
        secondaryLinkUrl: '/sport/products',
      },
      {
        title: 'Battle-Proven Optical Systems',
        description:
          'Meopta supplies military sights, night vision modules, and advanced fire control optics engineered for reliability in demanding field conditions and mission-critical defence operations.',
        image: defenceImage,
        backgroundColor: 'lightGrey',
        linkLabel: 'Military Capabilities',
        linkUrl: '/military/soldiers-personal-systems',
        secondaryLinkLabel: 'Request Defence Consultation',
        secondaryLinkUrl: '/military/contact',
      },
    ],
    autoPlay: true,
    autoPlayInterval: 5000,
  };
}

async function buildBenefitsBlock(): Promise<Record<string, unknown>> {
  const benefitsIcon = await ensureMedia('placeholder', 'Meopta benefits icon', 'meopta-benefit-icon.png');

  return {
    blockType: 'benefitsColumnsBlock',
    title: 'Why Meopta',
    description: htmlToLexical(
      '<p>Since 1933, Meopta has combined optical design expertise, advanced manufacturing, and uncompromising quality standards to deliver world-class solutions for semiconductors, sport optics, and defence.</p>',
    ),
    items: [
      { icon: benefitsIcon, text: '90+ Years of Optical Excellence' },
      { icon: benefitsIcon, text: 'Vertically Integrated Manufacturing' },
      { icon: benefitsIcon, text: 'ISO 9001 & ISO 14001 Certified' },
      { icon: benefitsIcon, text: 'From R&D to Final Assembly Under One Roof' },
      { icon: benefitsIcon, text: 'Global Presence in 50+ Countries' },
    ],
    linkLabel: 'Learn More About Meopta',
    linkUrl: '/about-us',
  };
}

async function buildLinkCardsBlock(): Promise<Record<string, unknown>> {
  const cardImage = await ensureMedia('placeholder', 'Meopta segment illustration', 'meopta-segment-card.png');

  return {
    blockType: 'linkCardsBlock',
    title: 'Explore Our Core Segments',
    items: [
      {
        image: cardImage,
        title: 'Industrial & OEM',
        description:
          'Custom optical modules and precision assemblies for semiconductor and industrial equipment manufacturers.',
        linkLabel: 'All-in-One Service',
        linkUrl: '/industrial/all-in-one-service',
      },
      {
        image: cardImage,
        title: 'Sport & Lifestyle',
        description:
          'High-performance riflescopes, binoculars, and spotting optics designed for demanding real-world use.',
        linkLabel: 'Sport Hunting',
        linkUrl: '/sport/hunting',
      },
      {
        image: cardImage,
        title: 'Military Applications',
        description:
          'Robust optical systems supporting soldiers, armored platforms, and integrated fire control solutions.',
        linkLabel: 'Soldier Systems',
        linkUrl: '/military/soldiers-personal-systems',
      },
    ],
  };
}

async function buildLogoCarouselBlock(): Promise<Record<string, unknown>> {
  const logoImage = await ensureMedia('placeholder', 'Partner logo placeholder', 'meopta-partner-logo.png');

  return {
    blockType: 'logoCarouselBlock',
    title: 'Trusted by Industry Leaders',
    description:
      'Global partners and institutions rely on Meopta for precision optics, reliable manufacturing, and long-term collaboration.',
    logos: [
      { image: logoImage, name: 'ASML' },
      { image: logoImage, name: 'ZEISS' },
      { image: logoImage, name: 'Czech Armed Forces' },
      { image: logoImage, name: 'NATO' },
      { image: logoImage, name: 'Lockheed Martin' },
      { image: logoImage, name: 'BAE Systems' },
    ],
  };
}

async function main(): Promise<void> {
  void textToLexical;

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');

  if (doReset && !dryRun) {
    console.log('Resetting Meopta homepage...');
    const existing = await findPage(PAGE_SLUG);
    if (existing) {
      await deletePage(existing.id);
      console.log(`Deleted page ${existing.id}`);
    }
  }

  console.log('Building Meopta homepage blocks...');
  const blocks: Record<string, unknown>[] = [];

  blocks.push(await buildHeroSliderBlock());
  blocks.push(await buildBenefitsBlock());
  blocks.push(await buildLinkCardsBlock());
  blocks.push(await buildLogoCarouselBlock());

  if (dryRun) {
    console.log('\n[DRY RUN] Full layout JSON:');
    console.log(JSON.stringify(blocks, null, 2));
    return;
  }

  const existing = await findPage(PAGE_SLUG);
  if (existing) {
    await updatePage(existing.id, blocks);
    console.log(`\nUpdated existing page (id=${existing.id})`);
  } else {
    const page = await createPage(PAGE_TITLE, PAGE_SLUG, blocks);
    console.log(`\nCreated new page (id=${page.id})`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
