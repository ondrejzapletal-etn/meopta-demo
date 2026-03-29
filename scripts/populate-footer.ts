/**
 * Populates the CMS footer global (columns, copyright) and
 * the settings global (social links) with Meopta content.
 * Run: npx tsx scripts/populate-footer.ts
 */

import { getToken, getCmsUrl } from './lib/auth.js';

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    Authorization: `JWT ${token}`,
    'Content-Type': 'application/json',
  };
}

async function patchGlobal(slug: string, data: unknown) {
  const url = `${getCmsUrl()}/api/globals/${slug}`;
  const h = await authHeaders();
  const res = await fetch(url, {
    method: 'POST',
    headers: h,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update global "${slug}" (${res.status}): ${text}`);
  }
  return res.json();
}

function link(label: string, url: string) {
  return { link: { type: 'custom', url, label } };
}

const footerData = {
  columns: [
    {
      title: 'Industrial & OEM',
      items: [
        link('All-in-one Service', '/industrial/all-in-one-service'),
        link('Research & Development', '/industrial/research-development'),
        link('Manufacturing', '/industrial/manufacturing'),
        link('System Integration', '/industrial/system-integration'),
        link('Testing & Measurement', '/industrial/testing-measurement'),
      ],
    },
    {
      title: 'Sport & Lifestyle',
      items: [
        link('Hunting', '/sport/hunting'),
        link('Birdwatching', '/sport/birdwatching'),
        link('Tactical', '/sport/tactical'),
        link('Service & Warranty', '/sport/service-warranty'),
        link('Find a Dealer', '/support/dealer-locator'),
        link('Download Center', '/support/download-center'),
      ],
    },
    {
      title: 'Military',
      items: [
        link('Soldiers Personal Systems', '/military/soldiers-personal-systems'),
        link('Armored Vehicles', '/military/armored-vehicles'),
        link('OEM Defense', '/military/oem-defense'),
      ],
    },
    {
      title: 'About Meopta',
      items: [
        link('History & Heritage', '/about/history'),
        link('Career', '/about/career'),
        link('Sustainability', '/about/sustainability'),
        link('Contact Us', '#'),
        link('Privacy Policy', '#'),
        link('Terms & Conditions', '#'),
      ],
    },
  ],
  copyrightText:
    '© 2025 Meopta — optika, s.r.o. | Kabelíkova 1, 750 02 Přerov, Czech Republic | IČ 47677023 | Registered at Regional Court in Ostrava, Section C, File 9549.',
};

const settingsData = {
  socials: [
    { type: 'facebook', url: 'https://www.facebook.com/MeoptaSportsOptics' },
    { type: 'instagram', url: 'https://www.instagram.com/meoptasportsoptics/' },
    { type: 'youtube', url: 'https://www.youtube.com/user/MeoptaSportsOptics' },
    { type: 'linkedin', url: 'https://www.linkedin.com/company/meopta/' },
  ],
};

async function run() {
  console.log('Updating footer global…');
  await patchGlobal('footer', footerData);
  console.log('✓ footer');

  console.log('Updating settings global…');
  await patchGlobal('settings', settingsData);
  console.log('✓ settings');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
