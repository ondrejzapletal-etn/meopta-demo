/**
 * Populates the CMS header global with Meopta navigation items and CTA buttons.
 * Run: npx tsx scripts/populate-header.ts
 */

import { getToken, getCmsUrl } from './lib/auth.js';

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    Authorization: `JWT ${token}`,
    'Content-Type': 'application/json',
  };
}

const navigation = [
  {
    label: 'Industrial & OEM',
    link: { type: 'custom', url: '/industrial/all-in-one-service' },
    children: [
      {
        label: 'All-in-one Service',
        link: { type: 'custom', url: '/industrial/all-in-one-service' },
        description: 'Complete optical manufacturing partner — from concept to mass production.',
      },
      {
        label: 'Research & Development',
        link: { type: 'custom', url: '/industrial/research-development' },
        description: 'Optical design, simulation, and prototyping expertise.',
      },
      {
        label: 'Manufacturing',
        link: { type: 'custom', url: '/industrial/manufacturing' },
        description: 'Precision glass processing, CNC machining, and thin film coating.',
      },
      {
        label: 'System Integration',
        link: { type: 'custom', url: '/industrial/system-integration' },
        description: 'Cleanroom assembly from ISO Class 5 to Class 8.',
      },
      {
        label: 'Testing & Measurement',
        link: { type: 'custom', url: '/industrial/testing-measurement' },
        description: 'Interferometry, MTF, spectrophotometry, and environmental testing.',
      },
    ],
  },
  {
    label: 'Sport & Lifestyle',
    link: { type: 'custom', url: '/sport/hunting' },
    children: [
      {
        label: 'Hunting',
        link: { type: 'custom', url: '/sport/hunting' },
        description: 'Riflescopes and binoculars for serious hunters.',
      },
      {
        label: 'Birdwatching',
        link: { type: 'custom', url: '/sport/birdwatching' },
        description: 'Spotting scopes and binoculars with true color fidelity.',
      },
      {
        label: 'Tactical',
        link: { type: 'custom', url: '/sport/tactical' },
        description: 'Precision optics for competitive shooting and law enforcement.',
      },
      {
        label: 'Service & Warranty',
        link: { type: 'custom', url: '/sport/service-warranty' },
        description: '30-year transferable warranty and factory repair service.',
      },
    ],
  },
  {
    label: 'Military',
    link: { type: 'custom', url: '/military/soldiers-personal-systems' },
    children: [
      {
        label: 'Soldiers Personal Systems',
        link: { type: 'custom', url: '/military/soldiers-personal-systems' },
        description: 'Weapon sights, magnifiers, and night vision for the modern warfighter.',
      },
      {
        label: 'Armored Vehicles',
        link: { type: 'custom', url: '/military/armored-vehicles' },
        description: 'Periscopes, gunner sights, and commander observation devices.',
      },
      {
        label: 'OEM Defense',
        link: { type: 'custom', url: '/military/oem-defense' },
        description: 'Optical subsystems for global defense integrators.',
      },
    ],
  },
  {
    label: 'About',
    link: { type: 'custom', url: '/about/history' },
    children: [
      {
        label: 'History & Heritage',
        link: { type: 'custom', url: '/about/history' },
        description: 'Nine decades of optical excellence since 1933.',
      },
      {
        label: 'Career',
        link: { type: 'custom', url: '/about/career' },
        description: 'Join 2,600+ professionals shaping the future of optics.',
      },
      {
        label: 'Sustainability',
        link: { type: 'custom', url: '/about/sustainability' },
        description: 'Responsible manufacturing for a better future.',
      },
    ],
  },
  {
    label: 'Support',
    link: { type: 'custom', url: '/support/download-center' },
    children: [
      {
        label: 'Download Center',
        link: { type: 'custom', url: '/support/download-center' },
        description: 'Product catalogs, manuals, and technical documentation.',
      },
      {
        label: 'Find a Dealer',
        link: { type: 'custom', url: '/support/dealer-locator' },
        description: 'Locate your nearest authorized Meopta dealer.',
      },
    ],
  },
];

const ctaButtons = [
  { label: 'Contact Us', url: '#', appearance: 'outline' },
  { label: 'Find a Dealer', url: '/support/dealer-locator', appearance: 'primary' },
];

async function run() {
  const url = `${getCmsUrl()}/api/globals/header`;
  const h = await authHeaders();

  const res = await fetch(url, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ navigation, ctaButtons }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update header global (${res.status}): ${text}`);
  }

  const data = await res.json();
  console.log('Header global updated:', JSON.stringify(data, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
