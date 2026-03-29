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

// Helper to upsert a page
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

async function buildAllInOneServicePage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Meopta engineers collaborating on an industrial optical assembly program',
    'meopta-industrial-all-in-one-hero.png',
  );
  const designIcon = await ensureMedia(
    'placeholder',
    'Optical design and simulation icon',
    'meopta-industrial-design-icon.png',
  );
  const manufacturingIcon = await ensureMedia(
    'placeholder',
    'Precision manufacturing icon',
    'meopta-industrial-manufacturing-icon.png',
  );
  const qualityIcon = await ensureMedia(
    'placeholder',
    'Quality assurance and testing icon',
    'meopta-industrial-quality-icon.png',
  );
  const stepConceptImage = await ensureMedia(
    'placeholder',
    'Concept and feasibility workshop at Meopta',
    'meopta-industrial-step-concept.png',
  );
  const stepPrototypeImage = await ensureMedia(
    'placeholder',
    'Design and prototyping process in optical lab',
    'meopta-industrial-step-prototype.png',
  );
  const stepManufacturingImage = await ensureMedia(
    'placeholder',
    'Industrial optical manufacturing and assembly line',
    'meopta-industrial-step-manufacturing.png',
  );
  const stepDeliveryImage = await ensureMedia(
    'placeholder',
    'Final testing and delivery preparation',
    'meopta-industrial-step-delivery.png',
  );
  const consultationIcon = await ensureMedia(
    'placeholder',
    'Consultation icon',
    'meopta-industrial-consultation-icon.png',
  );
  const brochureIcon = await ensureMedia(
    'placeholder',
    'Brochure download icon',
    'meopta-industrial-brochure-icon.png',
  );
  const facilityIcon = await ensureMedia(
    'placeholder',
    'Facility visit icon',
    'meopta-industrial-facility-icon.png',
  );

  return [
    {
      blockType: 'heroWithImageBlock',
      backgroundColor: 'green',
      imagePosition: 'right',
      title: 'Your Complete Optical Manufacturing Partner',
      description: htmlToLexical(
        '<p>Meopta covers the complete product lifecycle for Industrial & OEM partners, from early concept definition and feasibility studies to validated mass production and long-term lifecycle support.</p>',
      ),
      image: heroImage,
      links: [
        { label: 'Get a Quote', url: '#', appearance: 'primary' },
        { label: 'Our Capabilities', url: '/industrial/manufacturing', appearance: 'outline' },
      ],
    },
    {
      blockType: 'benefitsBlock',
      title: 'End-to-End Capabilities',
      description: 'Integrated engineering, manufacturing, and quality under one roof.',
      columns: '3',
      items: [
        {
          icon: designIcon,
          title: 'Optical Design & Simulation',
          description: htmlToLexical(
            '<p>Our engineering teams use advanced optical modeling, tolerance analysis, and illumination simulation to design robust systems ready for industrial production.</p>',
          ),
        },
        {
          icon: manufacturingIcon,
          title: 'Precision Manufacturing',
          description: htmlToLexical(
            '<p>From precision glass grinding and polishing to CNC machining, coating, and cleanroom assembly, we provide tightly controlled in-house manufacturing workflows.</p>',
          ),
        },
        {
          icon: qualityIcon,
          title: 'Quality Assurance & Testing',
          description: htmlToLexical(
            '<p>Each assembly undergoes rigorous metrology, functional verification, and environmental validation to ensure repeatable performance in demanding OEM applications.</p>',
          ),
        },
      ],
    },
    {
      blockType: 'stepsBlock',
      title: 'How We Work With You',
      description: 'A structured process that de-risks development and scales into production.',
      items: [
        {
          stepNumber: 1,
          title: '1. Concept & Feasibility',
          description:
            'We align on requirements, performance targets, and manufacturability constraints to establish a reliable project baseline.',
          image: stepConceptImage,
        },
        {
          stepNumber: 2,
          title: '2. Design & Prototyping',
          description:
            'Our teams create detailed optical and mechanical designs, then validate them through rapid prototypes and iterative testing.',
          image: stepPrototypeImage,
        },
        {
          stepNumber: 3,
          title: '3. Manufacturing & Assembly',
          description:
            'After design freeze, we transition to controlled production with process documentation, tooling, and scalable assembly methods.',
          image: stepManufacturingImage,
        },
        {
          stepNumber: 4,
          title: '4. Testing & Delivery',
          description:
            'Final products are verified against agreed specifications, documented, and delivered with traceability and quality records.',
          image: stepDeliveryImage,
        },
      ],
    },
    {
      blockType: 'ctaCardsBlock',
      title: 'Ready to Start Your Project?',
      description: htmlToLexical(
        '<p>Let us help you move from concept to production with predictable quality, schedule, and cost.</p>',
      ),
      items: [
        {
          icon: consultationIcon,
          title: 'Request a Consultation',
          description: 'Discuss your optical requirements with our Industrial & OEM engineering specialists.',
          linkLabel: 'Book a Meeting',
          linkUrl: '#',
        },
        {
          icon: brochureIcon,
          title: 'Download Capabilities Brochure',
          description: 'Get a concise overview of Meopta manufacturing, metrology, and integration capabilities.',
          linkLabel: 'Download PDF',
          linkUrl: '#',
        },
        {
          icon: facilityIcon,
          title: 'Visit Our Facility',
          description: 'See our cleanrooms, coating lines, and precision production operations in action.',
          linkLabel: 'Plan a Visit',
          linkUrl: '#',
        },
      ],
    },
  ];
}

async function buildResearchDevelopmentPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Research and development team working on optical simulation',
    'meopta-industrial-rd-hero.png',
  );
  const itemImage = await ensureMedia(
    'placeholder',
    'R&D expertise card image',
    'meopta-industrial-rd-item.png',
  );
  const featureImage = await ensureMedia(
    'placeholder',
    'Computational optics and simulation workstation',
    'meopta-industrial-rd-feature.png',
  );

  return [
    {
      blockType: 'heroWithImageCompactBlock',
      backgroundColor: 'green',
      title: 'Engineering Excellence in Optical Design',
      description:
        'Our multidisciplinary R&D teams combine computational optics, system simulation, and mechanical FEA analysis to accelerate development of production-ready optical assemblies.',
      image: heroImage,
      links: [
        { label: 'Talk to R&D Team', url: '#', appearance: 'primary' },
        { label: 'All-in-one Service', url: '/industrial/all-in-one-service', appearance: 'outline' },
      ],
    },
    {
      blockType: 'benefitsWithImageBlock',
      title: 'Our R&D Expertise',
      description: 'From simulation to validation, we engineer optical products for robust real-world performance.',
      columns: '3',
      items: [
        {
          image: itemImage,
          title: 'Optical Design & Ray Tracing',
          description: 'Advanced lens and illumination design with tolerance optimization for manufacturability.',
        },
        {
          image: itemImage,
          title: 'Mechanical Engineering & FEA',
          description:
            'Structural and thermal analyses ensure system stability under vibration, temperature, and load conditions.',
        },
        {
          image: itemImage,
          title: 'Thin Film Coating Development',
          description:
            'Custom coating stacks are engineered for spectral performance, durability, and process repeatability.',
        },
        {
          image: itemImage,
          title: 'Prototype Manufacturing',
          description: 'Rapid prototype builds provide early verification of optical, mechanical, and assembly concepts.',
        },
        {
          image: itemImage,
          title: 'Environmental Simulation',
          description:
            'Environmental scenarios are modeled and tested to predict long-term behavior in industrial applications.',
        },
        {
          image: itemImage,
          title: 'Metrology & Testing',
          description: 'High-precision measurement workflows validate performance before design transfer to production.',
        },
      ],
    },
    {
      blockType: 'featureBlock',
      title: 'Computational Optics at the Cutting Edge',
      subtitle: 'Simulation-driven engineering for faster, lower-risk product development',
      description: htmlToLexical(
        '<p>Meopta engineers leverage ZEMAX, CODE V, and proprietary simulation toolchains to model optical behavior from first principles. By coupling optical design with mechanical and thermal analysis, we identify risks early, optimize tolerance budgets, and shorten the path from concept to validated prototype.</p><p>This integrated approach enables predictable scaling from pilot builds to high-volume production while maintaining strict optical performance targets.</p>',
      ),
      image: featureImage,
      imagePosition: 'right',
      backgroundColor: 'white',
      imageOverflow: false,
      links: [
        { label: 'Explore Manufacturing', url: '/industrial/manufacturing', appearance: 'primary' },
      ],
    },
  ];
}

async function buildManufacturingPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'High-precision optical manufacturing environment',
    'meopta-industrial-manufacturing-hero.png',
  );
  const grindingIcon = await ensureMedia(
    'placeholder',
    'Glass grinding and polishing icon',
    'meopta-industrial-grinding-icon.png',
  );
  const cncIcon = await ensureMedia(
    'placeholder',
    'CNC machining center icon',
    'meopta-industrial-cnc-icon.png',
  );
  const coatingIcon = await ensureMedia(
    'placeholder',
    'Thin film coating icon',
    'meopta-industrial-coating-icon.png',
  );
  const assemblyIcon = await ensureMedia(
    'placeholder',
    'Precision assembly icon',
    'meopta-industrial-assembly-icon.png',
  );
  const campusImage = await ensureMedia(
    'placeholder',
    'Meopta 75,000 square meter manufacturing campus',
    'meopta-industrial-manufacturing-campus.png',
  );

  return [
    {
      blockType: 'heroWithImageBlock',
      backgroundColor: 'white',
      imagePosition: 'right',
      title: 'Precision Manufacturing at Scale',
      description: htmlToLexical(
        '<p>Meopta combines precision glass grinding, CNC machining, thin film coating, and high-accuracy assembly to deliver industrial optical systems with consistent quality from prototype to serial production.</p>',
      ),
      image: heroImage,
      links: [
        { label: 'Request Manufacturing Review', url: '#', appearance: 'primary' },
        { label: 'System Integration', url: '/industrial/system-integration', appearance: 'outline' },
      ],
    },
    {
      blockType: 'benefitsBlock',
      title: 'Manufacturing Capabilities',
      description: 'Vertically integrated operations engineered for precision, repeatability, and throughput.',
      columns: '4',
      items: [
        {
          icon: grindingIcon,
          title: 'Glass Grinding & Polishing',
          description: htmlToLexical(
            '<p>Advanced grinding and polishing processes deliver tight surface form, low roughness, and high optical quality.</p>',
          ),
        },
        {
          icon: cncIcon,
          title: 'CNC Machining Center',
          description: htmlToLexical(
            '<p>Precision machining cells produce mechanical components and housings with micron-level accuracy and repeatability.</p>',
          ),
        },
        {
          icon: coatingIcon,
          title: 'Thin Film Coating',
          description: htmlToLexical(
            '<p>In-house coating lines apply robust anti-reflective and functional stacks tuned for demanding spectral requirements.</p>',
          ),
        },
        {
          icon: assemblyIcon,
          title: 'Precision Assembly',
          description: htmlToLexical(
            '<p>Controlled assembly workflows ensure alignment integrity, process traceability, and stable product performance.</p>',
          ),
        },
      ],
    },
    {
      blockType: 'imageBlock',
      title: 'Our 75,000 m² Manufacturing Campus',
      description:
        'Meopta operates a large integrated campus where optical fabrication, coating, precision mechanics, metrology, and final assembly are tightly connected.',
      image: campusImage,
      imagePosition: 'right',
      linkLabel: 'Contact Manufacturing Team',
      linkUrl: '#',
    },
  ];
}

async function buildSystemIntegrationPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Cleanroom assembly and optical system integration',
    'meopta-industrial-system-integration-hero.png',
  );
  const isoClass5Icon = await ensureMedia(
    'placeholder',
    'ISO Class 5 cleanroom icon',
    'meopta-industrial-iso-class-5-icon.png',
  );
  const isoClass7Icon = await ensureMedia(
    'placeholder',
    'ISO Class 7 cleanroom icon',
    'meopta-industrial-iso-class-7-icon.png',
  );
  const isoClass8Icon = await ensureMedia(
    'placeholder',
    'ISO Class 8 cleanroom icon',
    'meopta-industrial-iso-class-8-icon.png',
  );

  return [
    {
      blockType: 'heroWithImageCompactBlock',
      backgroundColor: 'green',
      title: 'Cleanroom Assembly & System Integration',
      description:
        'Meopta performs critical assembly operations in Class 100 to Class 10 cleanroom environments to protect optical performance and process stability.',
      image: heroImage,
      links: [
        { label: 'Discuss Integration Needs', url: '#', appearance: 'primary' },
        { label: 'Testing & Measurement', url: '/industrial/testing-measurement', appearance: 'outline' },
      ],
    },
    {
      blockType: 'benefitsWithListBlock',
      backgroundColor: 'lightGrey',
      title: 'Cleanroom Capabilities',
      description:
        'Our integration lines combine precision alignment expertise with contamination-controlled assembly workflows.',
      cards: [
        { icon: isoClass5Icon, title: 'ISO Class 5', text: 'Critical optical assembly for highest contamination control.' },
        { icon: isoClass7Icon, title: 'ISO Class 7', text: 'System-level assembly and validation for industrial modules.' },
        { icon: isoClass8Icon, title: 'ISO Class 8', text: 'Pre-assembly and controlled handling operations.' },
      ],
      items: [
        { text: 'Optical alignment to sub-micron precision' },
        { text: 'Particle-free bonding and cementing' },
        { text: 'Controlled UV curing and adhesive processes' },
        { text: 'Cleanroom-compatible handling and packaging' },
        { text: 'Integrated process monitoring and traceability' },
        { text: 'Functional verification before release' },
      ],
    },
  ];
}

async function buildTestingMeasurementPage(): Promise<Record<string, unknown>[]> {
  const heroImage = await ensureMedia(
    'placeholder',
    'Optical metrology and quality control laboratory',
    'meopta-industrial-testing-hero.png',
  );
  const interferometryIcon = await ensureMedia(
    'placeholder',
    'Interferometric testing icon',
    'meopta-industrial-interferometry-icon.png',
  );
  const mtfIcon = await ensureMedia(
    'placeholder',
    'MTF measurement icon',
    'meopta-industrial-mtf-icon.png',
  );
  const environmentalIcon = await ensureMedia(
    'placeholder',
    'Environmental testing icon',
    'meopta-industrial-environmental-icon.png',
  );
  const spectroIcon = await ensureMedia(
    'placeholder',
    'Spectrophotometry icon',
    'meopta-industrial-spectro-icon.png',
  );
  const dimensionalIcon = await ensureMedia(
    'placeholder',
    'Dimensional metrology icon',
    'meopta-industrial-dimensional-icon.png',
  );
  const reliabilityIcon = await ensureMedia(
    'placeholder',
    'Reliability testing icon',
    'meopta-industrial-reliability-icon.png',
  );

  return [
    {
      blockType: 'heroWithImageCompactBlock',
      backgroundColor: 'white',
      title: 'Uncompromising Quality Control',
      description:
        'Our testing laboratories combine interferometry, metrology, and environmental qualification to verify every optical assembly against strict industrial requirements.',
      image: heroImage,
      links: [
        { label: 'Request Test Plan Review', url: '#', appearance: 'primary' },
        { label: 'Contact Quality Team', url: '#', appearance: 'outline' },
      ],
    },
    {
      blockType: 'benefitsBlock',
      title: 'Testing & Measurement Capabilities',
      description: 'Comprehensive verification workflows ensure optical performance, durability, and reliability.',
      columns: '3',
      items: [
        {
          icon: interferometryIcon,
          title: 'Interferometric Testing',
          description: htmlToLexical(
            '<p>Wavefront and surface accuracy measurements confirm optical elements meet tight specification limits.</p>',
          ),
        },
        {
          icon: mtfIcon,
          title: 'MTF Measurement',
          description: htmlToLexical(
            '<p>Modulation transfer function testing validates imaging performance across operating conditions.</p>',
          ),
        },
        {
          icon: environmentalIcon,
          title: 'Environmental Testing',
          description: htmlToLexical(
            '<p>Temperature, humidity, and mechanical stress testing verify robustness in demanding field environments.</p>',
          ),
        },
        {
          icon: spectroIcon,
          title: 'Spectrophotometry',
          description: htmlToLexical(
            '<p>Spectral transmission and reflection checks confirm coating and filter performance targets.</p>',
          ),
        },
        {
          icon: dimensionalIcon,
          title: 'Dimensional Metrology',
          description: htmlToLexical(
            '<p>High-precision dimensional inspection ensures geometric conformity for assembly-critical components.</p>',
          ),
        },
        {
          icon: reliabilityIcon,
          title: 'Reliability Testing',
          description: htmlToLexical(
            '<p>Accelerated life testing supports confidence in long-term product stability and operational uptime.</p>',
          ),
        },
      ],
    },
    {
      blockType: 'faqItemsBlock',
      backgroundColor: 'lightGrey',
      title: 'Quality Standards & Certifications',
      numbered: true,
      allowMultiple: true,
      items: [
        {
          title: 'ISO 9001 Certified Quality Management',
          content: htmlToLexical(
            '<p>Meopta operates an ISO 9001-certified quality management system that governs design control, production workflows, and continuous improvement practices.</p>',
          ),
        },
        {
          title: 'ISO 14001 Environmental Management',
          content: htmlToLexical(
            '<p>Our ISO 14001-certified environmental framework supports responsible manufacturing, waste reduction, and resource-efficient operations.</p>',
          ),
        },
        {
          title: 'MIL-STD Compliance Support',
          content: htmlToLexical(
            '<p>For defense-oriented or ruggedized programs, Meopta supports qualification testing aligned with applicable MIL-STD environmental and durability requirements.</p>',
          ),
        },
        {
          title: 'ITAR Registration for Controlled Programs',
          content: htmlToLexical(
            '<p>Meopta supports regulated projects through ITAR-registered operations and secure handling processes for controlled technical data and hardware.</p>',
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

  console.log('Building Meopta Industrial pages...');

  const pages: Array<{ title: string; slug: string; blocks: Record<string, unknown>[] }> = [
    {
      title: 'All-in-one Service | Meopta Industrial',
      slug: 'industrial/all-in-one-service',
      blocks: await buildAllInOneServicePage(),
    },
    {
      title: 'Research & Development | Meopta Industrial',
      slug: 'industrial/research-development',
      blocks: await buildResearchDevelopmentPage(),
    },
    {
      title: 'Manufacturing | Meopta Industrial',
      slug: 'industrial/manufacturing',
      blocks: await buildManufacturingPage(),
    },
    {
      title: 'System Integration | Meopta Industrial',
      slug: 'industrial/system-integration',
      blocks: await buildSystemIntegrationPage(),
    },
    {
      title: 'Testing & Measurement | Meopta Industrial',
      slug: 'industrial/testing-measurement',
      blocks: await buildTestingMeasurementPage(),
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
