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

async function buildSoldiersPersonalSystemsPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Soldier aiming with Meopta combat optic in field conditions',
    'meopta-military-soldier-hero.png',
  );
  const sightIcon = await ensureMedia(
    'placeholder',
    'Combat sight product icon',
    'meopta-military-zd-ri-icon.png',
  );
  const magnifierIcon = await ensureMedia(
    'placeholder',
    'Magnifier product icon',
    'meopta-military-meoday-icon.png',
  );
  const nightVisionIcon = await ensureMedia(
    'placeholder',
    'Night vision scope product icon',
    'meopta-military-zd-nv-icon.png',
  );

  return [
    {
      blockType: 'heroWithImageBlock',
      backgroundColor: 'green',
      imagePosition: 'right',
      title: 'Battle-Proven Optical Systems for the Modern Warfighter',
      description: htmlToLexical(
        '<p>Meopta equips soldiers with weapon sights and magnification systems engineered for rapid target acquisition, repeatable precision, and mission reliability. Our optics are night vision compatible, MIL-STD tested, and built to perform in harsh operational environments.</p>',
      ),
      image: heroImage,
      links: [
        { label: 'Request Product Briefing', url: '#', appearance: 'primary' },
        { label: 'Talk to Defence Team', url: '#', appearance: 'outline' },
      ],
    },
    {
      blockType: 'productDetailCardsBlock',
      title: 'Personal Weapon Sights',
      columns: '3',
      items: [
        {
          icon: sightIcon,
          name: 'ZD-RI 1-4x22 RD',
          subtitle: 'Combat Sight',
          description: htmlToLexical(
            '<p>A rugged variable-magnification sight delivering close-quarters speed and mid-range precision in one compact package.</p>',
          ),
          features: [
            { text: 'MIL-STD-810H Tested' },
            { text: 'True 1x Magnification' },
            { text: 'Illuminated BDC Reticle' },
            { text: 'Night Vision Compatible' },
            { text: 'Aircraft-Grade Aluminum' },
          ],
          linkLabel: 'Request Datasheet',
          linkUrl: '#',
        },
        {
          icon: magnifierIcon,
          name: 'MEODAY 3x Magnifier',
          subtitle: 'Flip Mount',
          description: htmlToLexical(
            '<p>Mission-flexible magnifier with rapid transition between unmagnified and magnified engagement modes.</p>',
          ),
          features: [
            { text: '3x Magnification' },
            { text: 'Quick Detach Mount' },
            { text: 'Compatible with Red Dots' },
            { text: 'Waterproof IP68' },
          ],
          linkLabel: 'View Configuration',
          linkUrl: '#',
        },
        {
          icon: nightVisionIcon,
          name: 'ZD-NV 3-12x56',
          subtitle: 'Night Vision Scope',
          description: htmlToLexical(
            '<p>Long-range day/night capability for designated marksman and precision applications in low-light operations.</p>',
          ),
          features: [
            { text: 'Gen III Compatible' },
            { text: 'Long Range Precision' },
            { text: 'Mil/Mil Turrets' },
            { text: '56mm Objective' },
          ],
          linkLabel: 'Contact Specialist',
          linkUrl: '#',
        },
      ],
    },
  ];
}

async function buildArmoredVehiclesPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Armored vehicle with integrated optical systems',
    'meopta-military-armored-hero.png',
  );
  const vehicleCardImage = await ensureMedia(
    'placeholder',
    'Armored platform optical subsystem visual',
    'meopta-military-vehicle-card.png',
  );

  return [
    {
      blockType: 'heroWithImageCompactBlock',
      backgroundColor: 'green',
      title: 'Integrated Optical Systems for Armored Platforms',
      description:
        'Meopta provides periscopes, fire-control optics, and thermal-imaging-ready channels that improve situational awareness and lethality across tracked and wheeled armored fleets.',
      image: heroImage,
      links: [
        { label: 'Discuss Vehicle Program', url: '#', appearance: 'primary' },
        { label: 'Download Capability Overview', url: '#', appearance: 'outline' },
      ],
    },
    {
      blockType: 'productCardsHorizontalBlock',
      title: 'Vehicle Optics Portfolio',
      items: [
        {
          image: vehicleCardImage,
          title: 'NV-3P Periscope',
          description: 'Day/night driver\'s periscope with passive infrared capability for IFVs and APCs',
          linkLabel: 'Request Technical Data',
          linkUrl: '#',
        },
        {
          image: vehicleCardImage,
          title: 'BPK-3 Gunner\'s Sight',
          description: 'Multi-channel gunner\'s sight with thermal imaging and laser rangefinder integration',
          linkLabel: 'View Integration Notes',
          linkUrl: '#',
        },
        {
          image: vehicleCardImage,
          title: 'TKN-3BP Commander\'s Sight',
          description: 'Combined day/night observation device for armored vehicle commanders',
          linkLabel: 'Contact Vehicle Optics Team',
          linkUrl: '#',
        },
      ],
    },
  ];
}

async function buildOemDefenseProductsPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Meopta OEM optical subsystem production for defense integrators',
    'meopta-military-oem-hero.png',
  );
  const capabilityImage = await ensureMedia(
    'placeholder',
    'OEM capability card image',
    'meopta-military-oem-capability.png',
  );
  const consultationIcon = await ensureMedia(
    'placeholder',
    'Technical consultation icon',
    'meopta-military-consultation-icon.png',
  );
  const downloadIcon = await ensureMedia(
    'placeholder',
    'Download defense capabilities icon',
    'meopta-military-download-icon.png',
  );
  const visitIcon = await ensureMedia(
    'placeholder',
    'Facility visit icon',
    'meopta-military-visit-icon.png',
  );

  return [
    {
      blockType: 'heroPlainBlock',
      backgroundColor: 'green',
      textAlign: 'left',
      title: 'Optical Subsystems for Global Defense Integrators',
      description: htmlToLexical(
        '<p>Meopta develops and manufactures OEM optical components and integrated subsystems for major defense primes, supporting high-volume programs with strict quality, traceability, and long-term sustainment requirements.</p>',
      ),
      image: heroImage,
      links: [
        { label: 'Start OEM Discussion', url: '#', appearance: 'primary' },
        { label: 'View Defense Expertise', url: '#', appearance: 'outline' },
      ],
    },
    {
      blockType: 'benefitsWithImageBlock',
      title: 'OEM Capabilities',
      columns: '3',
      items: [
        {
          image: capabilityImage,
          title: 'Weapon Sight Assemblies',
          description: 'Fully integrated sight modules engineered for repeatable field performance and scalable production.',
        },
        {
          image: capabilityImage,
          title: 'Periscope Systems',
          description: 'Ruggedized periscope units tailored for armored platform integration and lifecycle support.',
        },
        {
          image: capabilityImage,
          title: 'Thermal Imaging Optics',
          description: 'Optical trains optimized for thermal channels with stable performance in extreme environments.',
        },
        {
          image: capabilityImage,
          title: 'Laser Rangefinder Optics',
          description: 'Precision optical assemblies supporting accurate ranging and robust electro-optical integration.',
        },
        {
          image: capabilityImage,
          title: 'Head-Up Display Optics',
          description: 'Custom projection optics and combiner solutions for land and airborne defense applications.',
        },
        {
          image: capabilityImage,
          title: 'Helmet-Mounted Display Optics',
          description: 'Compact, lightweight optical modules for next-generation soldier and pilot display systems.',
        },
      ],
    },
    {
      blockType: 'ctaCardsBlock',
      title: 'Partner With Meopta',
      description: htmlToLexical(
        '<p>Engage our defense engineering and manufacturing teams to accelerate your next program milestone.</p>',
      ),
      items: [
        {
          icon: consultationIcon,
          title: 'Request Technical Consultation',
          description: 'Align system requirements, interfaces, and qualification strategy with our OEM specialists.',
          linkLabel: 'Book Consultation',
          linkUrl: '#',
        },
        {
          icon: downloadIcon,
          title: 'Download Defense Capabilities',
          description: 'Get a concise overview of Meopta OEM optical competencies, facilities, and compliance standards.',
          linkLabel: 'Download Overview',
          linkUrl: '#',
        },
        {
          icon: visitIcon,
          title: 'Schedule Facility Visit',
          description: 'Visit our manufacturing and testing operations to review program readiness and quality controls.',
          linkLabel: 'Plan a Visit',
          linkUrl: '#',
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
  console.log('Building Meopta Military pages...');

  const pages: Array<{ title: string; slug: string; blocks: Record<string, unknown>[] }> = [
    {
      title: 'Soldiers Personal Systems | Meopta Defence',
      slug: 'military/soldiers-personal-systems',
      blocks: await buildSoldiersPersonalSystemsPage(),
    },
    {
      title: 'Armored Vehicle Systems | Meopta Defence',
      slug: 'military/armored-vehicles',
      blocks: await buildArmoredVehiclesPage(),
    },
    {
      title: 'OEM Defense Products | Meopta Defence',
      slug: 'military/oem-defense',
      blocks: await buildOemDefenseProductsPage(),
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
