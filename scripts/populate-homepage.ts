#!/usr/bin/env npx tsx
/**
 * Populate CMS with homepage content replicating airbank.cz main page.
 *
 * Usage:
 *   npx tsx scripts/populate-homepage.ts           # create/update homepage
 *   npx tsx scripts/populate-homepage.ts --reset    # delete homepage and re-create
 *   npx tsx scripts/populate-homepage.ts --dry-run  # print JSON only
 */

import {
  findPage,
  createPage,
  updatePage,
  deletePage,
  uploadMedia,
} from './lib/cms-api.js';
import {
  downloadImage,
  saveSvg,
  createPlaceholderImage,
  safeFilename,
} from './lib/image-utils.js';
import { textToLexical, htmlToLexical } from './lib/lexical.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PAGE_SLUG = 'homepage';
const PAGE_TITLE = 'I banku můžete mít rádi | Air Bank';

// ─── Media cache ─────────────────────────────────────────────────────────────

const mediaCache: Record<string, number> = {};

async function ensureMedia(
  url: string,
  alt: string,
  filename?: string,
): Promise<number> {
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

async function ensureSvgMedia(svgContent: string, name: string): Promise<number> {
  const key = `svg:${name}`;
  if (mediaCache[key]) return mediaCache[key]!;

  const localPath = saveSvg(svgContent, `${name}.svg`);
  const id = await uploadMedia(localPath, name);
  mediaCache[key] = id;
  return id;
}

async function ensureSvgFileMedia(filePath: string, name: string): Promise<number> {
  const key = `svgfile:${name}`;
  if (mediaCache[key]) return mediaCache[key]!;

  const absPath = resolve(__dirname, filePath);
  const svgContent = readFileSync(absPath, 'utf-8');
  const localPath = saveSvg(svgContent, `${name}.svg`);
  const id = await uploadMedia(localPath, name);
  mediaCache[key] = id;
  return id;
}

async function ensureFileMedia(filePath: string, name: string): Promise<number> {
  const key = `file:${name}`;
  if (mediaCache[key]) return mediaCache[key]!;

  const absPath = resolve(__dirname, filePath);
  const id = await uploadMedia(absPath, name);
  mediaCache[key] = id;
  return id;
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const svgIcons = {
  account: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#497D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
  loan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#497D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  mortgage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#497D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  investment: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#497D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  insurance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#497D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  branches: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#497D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  // Benefits icons
  piggybank: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="38" fill="#e8f5cc"/><path d="M25 45c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15z" fill="#99cc33"/><circle cx="35" cy="40" r="2" fill="white"/><path d="M45 42a3 3 0 0 1-3 3h-4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  travel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="38" fill="#e8f5cc"/><path d="M40 15v50M35 15h10l-5 12-5-12z" fill="#99cc33"/><rect x="30" y="45" width="20" height="20" rx="2" fill="#99cc33"/></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="38" fill="#e8f5cc"/><path d="M20 40l20-15 20 15v18a2 2 0 0 1-2 2H22a2 2 0 0 1-2-2V40z" fill="#99cc33"/><rect x="34" y="48" width="12" height="12" rx="1" fill="white"/></svg>`,
  village: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="38" fill="#e8f5cc"/><rect x="15" y="35" width="20" height="25" rx="2" fill="#99cc33"/><rect x="45" y="25" width="20" height="35" rx="2" fill="#99cc33"/><rect x="20" y="45" width="8" height="8" fill="white"/><rect x="50" y="35" width="8" height="8" fill="white"/></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="38" fill="#e8f5cc"/><rect x="20" y="45" width="10" height="15" rx="1" fill="#99cc33"/><rect x="35" y="35" width="10" height="25" rx="1" fill="#99cc33"/><rect x="50" y="25" width="10" height="35" rx="1" fill="#99cc33"/></svg>`,
  // CTA icons
  myair: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><rect width="48" height="48" rx="12" fill="#99cc33"/><text x="24" y="30" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="sans-serif">My</text></svg>`,
  monitor: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="#497D00" stroke-width="2" width="48" height="48"><rect x="4" y="6" width="40" height="28" rx="3"/><path d="M16 38h16M24 34v4"/></svg>`,
  branch: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="#497D00" stroke-width="2" width="48" height="48"><rect x="6" y="14" width="36" height="28" rx="3"/><path d="M6 14l18-8 18 8"/><path d="M18 28h12M18 34h12"/></svg>`,
  // Flag icons
  flagEU: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16"><rect width="24" height="16" fill="#003399" rx="2"/><circle cx="12" cy="8" r="4" fill="none" stroke="#FFCC00" stroke-width="0.5"/><g fill="#FFCC00"><polygon points="12,3 12.4,4.2 13.6,4.2 12.6,4.9 13,6.1 12,5.4 11,6.1 11.4,4.9 10.4,4.2 11.6,4.2"/><polygon points="12,10 12.4,11.2 13.6,11.2 12.6,11.9 13,13.1 12,12.4 11,13.1 11.4,11.9 10.4,11.2 11.6,11.2"/><polygon points="8,5 8.4,6.2 9.6,6.2 8.6,6.9 9,8.1 8,7.4 7,8.1 7.4,6.9 6.4,6.2 7.6,6.2"/><polygon points="16,5 16.4,6.2 17.6,6.2 16.6,6.9 17,8.1 16,7.4 15,8.1 15.4,6.9 14.4,6.2 15.6,6.2"/><polygon points="8,8 8.4,9.2 9.6,9.2 8.6,9.9 9,11.1 8,10.4 7,11.1 7.4,9.9 6.4,9.2 7.6,9.2"/><polygon points="16,8 16.4,9.2 17.6,9.2 16.6,9.9 17,11.1 16,10.4 15,11.1 15.4,9.9 14.4,9.2 15.6,9.2"/></g></svg>`,
  flagUS: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16"><rect width="24" height="16" fill="#B22234" rx="2"/><g fill="white"><rect y="1.23" width="24" height="1.23"/><rect y="3.69" width="24" height="1.23"/><rect y="6.15" width="24" height="1.23"/><rect y="8.62" width="24" height="1.23"/><rect y="11.08" width="24" height="1.23"/><rect y="13.54" width="24" height="1.23"/></g><rect width="9.6" height="8.62" fill="#3C3B6E"/></svg>`,
  flagGB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16"><rect width="24" height="16" fill="#012169" rx="2"/><path d="M0,0 L24,16 M24,0 L0,16" stroke="white" stroke-width="2.5"/><path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" stroke-width="1.5"/><path d="M12,0 V16 M0,8 H24" stroke="white" stroke-width="4"/><path d="M12,0 V16 M0,8 H24" stroke="#C8102E" stroke-width="2.5"/></svg>`,
  flagCH: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="24" height="16"><rect width="24" height="16" fill="#D52B1E" rx="2"/><rect x="10" y="3" width="4" height="10" fill="white"/><rect x="7" y="6" width="10" height="4" fill="white"/></svg>`,
};

// ─── Block builders ──────────────────────────────────────────────────────────

async function buildHeroReasonsSimplifiedBlock(): Promise<Record<string, unknown>> {
  const reasonCards = [
    { number: 5, title: 'Vše v aplikaci jednoduše', url: '#', imageFile: 'assets/reason-cards/vse-v-aplikaci-jednoduse.png' },
    { number: 98, title: 'Více výhod pro věrné klienty', url: '#', imageFile: 'assets/reason-cards/vice-vyhod-pro-verne-klienty.png' },
    { number: 61, title: 'Účet a většina služeb zdarma', url: '#', imageFile: 'assets/reason-cards/ucet-a-vetsina-sluzeb-zdarma.png' },
    { number: 38, title: 'Založení účtu přes mobil', url: '#', imageFile: 'assets/reason-cards/zalozeni-uctu-pres-mobil.png' },
    { number: 36, title: 'Až 10 účtů zdarma pro různé potřeby', url: '#', imageFile: 'assets/reason-cards/az-10-uctu-zdarma-pro-ruzne-potreby.png' },
    { number: 56, title: 'Výhody navíc díky Unity', url: '#', imageFile: 'assets/reason-cards/vyhody-navic-diky-unity.png' },
    { number: 17, title: 'Virtuální karty pro platby bez obav', url: '#', imageFile: 'assets/reason-cards/virtualni-karty-pro-platby-bez-obav.png' },
    { number: 41, title: 'Snadné rozdělení společné útraty', url: '#', imageFile: 'assets/reason-cards/snadne-rozdeleni-spolecne-utraty.png' },
    { number: 20, title: 'Snadné spárování nového telefonu', url: '#', imageFile: 'assets/reason-cards/snadne-sparovani-noveho-telefonu.png' },
    { number: 69, title: 'Úspory díky Odměnám za placení', url: '#', imageFile: 'assets/reason-cards/uspory-diky-odmenam-za-placeni.png' },
    { number: 66, title: 'Tuzemské a SEPA platby zdarma', url: '#', imageFile: 'assets/reason-cards/tuzemske-a-sepa-platby-zdarma.png' },
  ];

  const items = [];
  for (const card of reasonCards) {
    const imageId = await ensureFileMedia(card.imageFile, `reason-card-${card.number}`);
    items.push({
      number: card.number,
      title: card.title,
      url: card.url,
      image: imageId,
    });
  }

  return {
    blockType: 'heroReasonsSimplifiedBlock',
    title: '100 důvodů, proč i banku můžete mít rádi',
    counterText: '/100',
    linkLabel: 'Poznejte všechny důvody',
    linkUrl: '#',
    items,
  };
}

async function buildProductBannerBlock(): Promise<Record<string, unknown>> {
  const items = [
    { label: 'Založit účet', url: '#zalozit-ucet', isButton: false, iconFile: 'assets/product-icons/0-zalozit-ucet.svg' },
    { label: 'Půjčka', url: '/produkty/pujcka/', isButton: false, iconFile: 'assets/product-icons/1-pujcka.svg' },
    { label: 'Hypotéka', url: '/produkty/hypoteka/', isButton: false, iconFile: 'assets/product-icons/2-hypoteka.svg' },
    { label: 'Investice a spoření', url: '/produkty/investice-a-sporeni/', isButton: false, iconFile: 'assets/product-icons/3-investice-a-sporeni.svg' },
    { label: 'Pojištění', url: '/produkty/pojisteni/pojisteni-hypoteky/', isButton: false, iconFile: 'assets/product-icons/4-pojisteni.svg' },
    { label: 'Pobočky', url: '/mapa-pobocek-a-bankomatu/', isButton: false, iconFile: 'assets/product-icons/5-pobocky.svg' },
  ];

  const builtItems = [];
  for (const item of items) {
    const iconId = await ensureSvgFileMedia(item.iconFile, `product-icon-${item.label.toLowerCase().replace(/\s+/g, '-')}`);
    builtItems.push({
      icon: iconId,
      label: item.label,
      url: item.url,
      isButton: item.isButton,
    });
  }

  return {
    blockType: 'productBannerBlock',
    items: builtItems,
  };
}

async function buildHomepageIntroBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'heroPlainBlock',
    backgroundColor: 'white',
    textAlign: 'center',
    title: 'S námi zvládnete všechno, co kolem peněz řešíte',
    description: htmlToLexical(
      '<p>Od každodenních drobností až po ta největší finanční rozhodnutí. Neustále hledáme cesty, jak dělat bankovnictví <strong>jednodušší, férovější, přátelštější</strong> a <strong>výhodnější</strong>. Máme více než 100 důvodů, proč i banku můžete mít rádi. Žádnou jinou už nepotřebujete.</p>',
    ),
    links: [],
  };
}

async function buildFeatureBeznyUcetBlock(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_660_fill_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2465-ucty-a-placeni-on-grey-web-e1dfc7fd-2f0c96443022f4cf3eb505f1e7022ced.png',
    'Běžný účet zdarma - bankéř ukazuje kartu',
    'feature-bezny-ucet.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Vše u nás začíná běžným účtem zdarma',
    subtitle: 'Bankování s ním je tak snadné, že ho zvládnou už děti od 8 let.',
    description: textToLexical(
      'Základní výbava našeho účtu je tak bohatá, že při běžném bankování nezaplatíte ani korunu. K účtu navíc dostanete zdarma 2 karty a spoustu výhod. Můžete si o nich přečíst nebo je rovnou zažít.',
    ),
    image,
    imagePosition: 'right',
    backgroundColor: 'lightGrey',
    links: [
      { label: 'Více o účtu', url: '#', appearance: 'outline' },
      { label: 'Založit účet', url: '#', appearance: 'primary' },
    ],
  };
}

async function buildBenefitsColumnsBlock(): Promise<Record<string, unknown>> {
  const benefitItems = [
    { text: 'Bonusová sazba na korunovém spořicím účtu 2,6 % až do výše 500 000 Kč', iconFile: 'assets/benefit-icons/0-sporici-ucet.svg' },
    { text: '1 % zpět z plateb naší kartou v zahraničí', iconFile: 'assets/benefit-icons/1-platby-zahranici.svg' },
    { text: 'Sleva 0,1 % z úrokové sazby vaší hypotéky', iconFile: 'assets/benefit-icons/2-hypoteka-sleva.svg' },
    { text: 'Výběry z bankomatů v zahraničí bez poplatků', iconFile: 'assets/benefit-icons/3-bankomaty-zahranici.svg' },
    { text: 'První nákup akcií nebo ETF v měsíci bez poplatku', iconFile: 'assets/benefit-icons/4-akcie-etf.svg' },
  ];

  const items = [];
  for (const item of benefitItems) {
    const iconId = await ensureSvgFileMedia(item.iconFile, `benefit-icon-${items.length}`);
    items.push({ icon: iconId, text: item.text });
  }

  return {
    blockType: 'benefitsColumnsBlock',
    title: 'Získejte za svou věrnost výhody navíc',
    description: textToLexical(
      'Čím víc naše služby a náš účet používáte, tím víc výhod pro vás máme.',
    ),
    items,
    linkLabel: 'Více o Výhodách za věrnost',
    linkUrl: '#',
  };
}

// InfoPlainBlock removed — link merged into BenefitsColumnsBlock

async function buildFeatureApplicationBlock(): Promise<Record<string, unknown>> {
  const phoneImage = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_660_fill_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2251-app-login-2da01b4b-76dc0f5c62325821135df26862daa638.png',
    'Mobilní aplikace',
    'feature-app-phone.png',
  );

  return {
    blockType: 'featureApplicationBlock',
    title: 'V mobilní aplikaci vyřídíte vše na to ťuk',
    subtitle: 'Všechny své peníze máte v My Air pěkně pod palcem.',
    description: 'Samozřejmě, že máme i internetové bankovnictví. V mobilní aplikaci ale vyřídíte všechno o dost pohodlněji. Účet v ní založíte opravdu na pár ťuknutí, ofocením QR kódu zadáte platbu, snadno si půjčíte peníze, pojistíte se na dovolenou nebo ušetříte za nákupy.',
    image: phoneImage,
    linkLabel: 'Více o aplikaci',
    linkUrl: '#',
    rating: '4.9',
    ratingCount: '134K',
    reviews: [
      {
        author: 'JV. P',
        date: '14. 2. 2021',
        title: 'Bezva',
        text: 'Aplikace pro telefon je naprosto úžasná a stále ji vylepšujete, což je super. Tuhle banku mám fakt rád…',
        stars: 5,
        store: 'appStore',
      },
      {
        author: 'Martin Č.',
        date: '10. února 2021',
        title: '',
        text: 'Naprosto přehledná aplikace. Nemusíte kvůli každý prkotině chodit do banky, asi snad vše na co jsem narazil jde udělat přes aplikaci.',
        stars: 5,
        store: 'googlePlay',
      },
    ],
  };
}

async function buildFeatureOdmenyBlock(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_344_fill_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2254-odmeny-v-aplikaci-new-75c1b022-82db4e548e74b90fb70e0d667e76b9e8.png',
    'Odměny v mobilní aplikaci',
    'feature-odmeny.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Když dělá banka věci jednoduše, ušetříte u nákupu na pár ťuknutí',
    subtitle: 'Ušetřete při nákupech třeba 4 500 Kč ročně.',
    description: textToLexical(
      'Za to, že platíte naší kartou, vám za některé nákupy vrátíme část peněz zpět na účet. Odměnu si jednoduše zapnete ťuknutím v aplikaci a nic více neřešíte. Takhle můžete ušetřit ve více než 100 klasických obchodech a e-shopech.',
    ),
    image,
    imagePosition: 'right',
    backgroundColor: 'green',
    imageOverflow: true,
    links: [
      { label: 'Více o odměnách', url: '#', appearance: 'primary' },
    ],
  };
}

async function buildFeaturePujckaBlock(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_420_fill_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2252-pujcka-applikace-index-new-a9d25316-f4c3091403b45d7f6b3762a7a38cb476.png',
    'Detail půjčky v mobilní aplikaci',
    'feature-pujcka.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Na větší nákupy férová půjčka',
    subtitle: 'Naše půjčka pravidelně vítězí v Indexu odpovědného úvěrování Člověka v tísni.',
    description: textToLexical(
      'Vytuhne vám lednice nebo dovrčí auto? Půjčíme vám, ať můžete co nejrychleji zase fungovat. Navíc u nové nebo převedené půjčky si můžete každý rok na 2 měsíce odložit splátky.',
    ),
    image,
    imagePosition: 'left',
    backgroundColor: 'white',
    links: [
      { label: 'Nová půjčka', url: '/produkty/pujcka/', appearance: 'outline' },
      { label: 'Převedení půjčky k nám', url: '#', appearance: 'outline' },
    ],
  };
}

async function buildFeatureHypotekaBlock(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_522x999_fill_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2255-hypotela-aplikace-new-f4130478-b497ae4d798fd3ef7df453015a497e1c.png',
    'Hypotéční kalkulačka v aplikaci',
    'feature-hypoteka.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Hledáte přátelskou hypotéku? Jste doma',
    subtitle: 'Na byt nebo dům vám půjčíme férově a bez složitého papírování.',
    description: textToLexical(
      'Naše hypotéka vám vyjde vstříc. Výši splátky máte proto ve svých rukou, hypotéku můžete kdykoliv doplatit nebo si k ní přidat pojištění 6 různých rizik.',
    ),
    image,
    imagePosition: 'right',
    backgroundColor: 'lightGrey',
    imageOverflow: true,
    links: [
      { label: 'Nová hypotéka', url: '/produkty/hypoteka/', appearance: 'outline' },
      { label: 'Chci převést hypotéku', url: '#', appearance: 'outline' },
    ],
  };
}

async function buildFeatureInvesticeBlock(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_370_fill_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2253-investice-aplikace-new-6d1d9a5a-d6217c4d047ea5bbc871bb8f2f095a2b.png',
    'Chytrý přehled v mobilní aplikaci',
    'feature-investice.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Myslíme na to, jak se zítra můžete mít lépe',
    subtitle: 'Spoření na důchod nebo možnost zhodnocení úspor? Zkuste s námi investovat.',
    description: textToLexical(
      'Investice u nás jsou opravdu pro každého. Můžete investovat 100 korun měsíčně nebo třeba milion. Vybrat si můžete z několika druhů investic, od pravidelného spoření na penzi přes půjčování lidem, jako jste vy, až po podílové fondy.',
    ),
    image,
    imagePosition: 'left',
    backgroundColor: 'white',
    links: [
      { label: 'Investice a spoření', url: '/produkty/investice-a-sporeni/', appearance: 'outline' },
    ],
  };
}

async function buildReasonBannerBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'omnichannelBannerBlock',
    title: 'Jeden ze /100 důvodů',
    description: ', proč i banku můžete mít rádi',
    items: [
      {
        icon: '',
        label: 'Poznejte všechny důvody',
        linkUrl: '#',
      },
    ],
    backgroundColor: 'green',
  };
}

async function buildCtaCardsBlock(): Promise<Record<string, unknown>> {
  const ctaItems = [
    {
      iconFile: './assets/pujcka-icons/cta-icon-myair.svg',
      iconName: 'cta-icon-myair',
      title: 'Jednoduše v mobilní aplikaci My Air',
      description: 'Nejlepší, nejrychlejší a nejsnadnější cesta k vašemu účtu.',
      linkLabel: 'Založit účet',
      linkUrl: '#',
    },
    {
      iconFile: './assets/pujcka-icons/cta-icon-online.svg',
      iconName: 'cta-icon-online',
      title: 'Na pár kliknutí online',
      description: 'Sotva si účet založíte, už ho můžete používat.',
      linkLabel: 'Založit účet',
      linkUrl: '#',
    },
    {
      iconFile: './assets/pujcka-icons/cta-icon-pobocka.svg',
      iconName: 'cta-icon-pobocka',
      title: 'Zastavte se u nás',
      description: 'Účet vám raz dva založíme na jakékoliv pobočce.',
      linkLabel: 'Najít nejbližší',
      linkUrl: '/mapa-pobocek-a-bankomatu/',
    },
  ];

  const items = [];
  for (const item of ctaItems) {
    const svgContent = readFileSync(resolve(__dirname, item.iconFile), 'utf-8');
    const iconId = await ensureSvgMedia(svgContent, item.iconName);
    items.push({
      icon: iconId,
      title: item.title,
      description: item.description,
      linkLabel: item.linkLabel,
      linkUrl: item.linkUrl,
    });
  }

  return {
    blockType: 'ctaCardsBlock',
    title: 'Chcete si založit účet? Nedivíme se',
    description: textToLexical('Není na co čekat. Účet si můžete založit online, v aplikaci My Air i na pobočce a samo sebou zdarma.'),
    items,
  };
}

async function buildHomepageBottomBlock(): Promise<Record<string, unknown>> {
  const flagItems = [
    { currency: 'EUR', buyRate: '25,070', sellRate: '25,570', svgKey: 'flagEU' as const },
    { currency: 'USD', buyRate: '22,980', sellRate: '23,480', svgKey: 'flagUS' as const },
    { currency: 'GBP', buyRate: '29,110', sellRate: '29,810', svgKey: 'flagGB' as const },
    { currency: 'CHF', buyRate: '26,280', sellRate: '26,880', svgKey: 'flagCH' as const },
  ];

  const rates = [];
  for (const item of flagItems) {
    const flagId = await ensureSvgMedia(svgIcons[item.svgKey], `flag-${item.svgKey}`);
    rates.push({
      currency: item.currency,
      buyRate: item.buyRate,
      sellRate: item.sellRate,
      flagIcon: flagId,
    });
  }

  return {
    blockType: 'homepageBottomBlock',
    ratesTitle: 'Kurzovní lístek',
    rates,
    ratesLinkLabel: 'Další měny a kurzy',
    ratesLinkUrl: '#',
    newsTitle: 'Co je u nás nového',
    news: [
      {
        date: '28. 1. 2026',
        title: 'Podnikatelský účet Air Bank je nově dostupný i pro vícečlenné s.r.o.',
        url: '#',
      },
      {
        date: '20. 1. 2026',
        title: 'Další čtyři miliony na účtech. Protože s námi klienti bankují naplno.',
        url: '#',
      },
      {
        date: '17. 12. 2025',
        title: 'Jak vybrat běžný účet, který vám sedne',
        url: '#',
      },
    ],
    newsLinkLabel: 'Starší novinky',
    newsLinkUrl: '#',
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');

  if (doReset && !dryRun) {
    console.log('Resetting homepage...');
    const existing = await findPage(PAGE_SLUG);
    if (existing) {
      await deletePage(existing.id);
      console.log(`Deleted page ${existing.id}`);
    }
  }

  console.log('Building homepage blocks...');

  // Build all blocks in order
  const blocks: Record<string, unknown>[] = [];

  console.log('\n1/13 HeroReasonsSimplified...');
  blocks.push(await buildHeroReasonsSimplifiedBlock());

  console.log('2/13 ProductBanner...');
  blocks.push(await buildProductBannerBlock());

  console.log('3/13 HomepageIntro (heroPlainBlock)...');
  blocks.push(await buildHomepageIntroBlock());

  console.log('4/13 Feature: Běžný účet...');
  blocks.push(await buildFeatureBeznyUcetBlock());

  console.log('5/13 BenefitsColumns: Výhody za věrnost...');
  blocks.push(await buildBenefitsColumnsBlock());

  console.log('6/13 FeatureApplication: V mobilní aplikaci...');
  blocks.push(await buildFeatureApplicationBlock());

  console.log('7/13 Feature: Odměny za placení (green)...');
  blocks.push(await buildFeatureOdmenyBlock());

  console.log('8/13 Feature: Půjčka...');
  blocks.push(await buildFeaturePujckaBlock());

  console.log('9/13 Feature: Hypotéka...');
  blocks.push(await buildFeatureHypotekaBlock());

  console.log('10/13 Feature: Investice a spoření...');
  blocks.push(await buildFeatureInvesticeBlock());

  console.log('11/13 ReasonBanner (omnichannelBannerBlock)...');
  blocks.push(await buildReasonBannerBlock());

  console.log('12/13 CTA Cards: Založit účet...');
  blocks.push(await buildCtaCardsBlock());

  console.log('13/13 HomepageBottom: Kurzy + Novinky...');
  blocks.push(await buildHomepageBottomBlock());

  if (dryRun) {
    console.log('\n[DRY RUN] Full layout JSON:');
    console.log(JSON.stringify(blocks, null, 2));
    return;
  }

  // Create or update page
  const existing = await findPage(PAGE_SLUG);
  if (existing) {
    await updatePage(existing.id, blocks);
    console.log(`\nUpdated existing page (id=${existing.id})`);
    console.log(`View in CMS: http://localhost:3001/admin/collections/pages/${existing.id}`);
  } else {
    const page = await createPage(PAGE_TITLE, PAGE_SLUG, blocks);
    console.log(`\nCreated new page (id=${page.id})`);
    console.log(`View in CMS: http://localhost:3001/admin/collections/pages/${page.id}`);
  }

  console.log(`View on FE:  http://localhost:3000/cs`);
  console.log('\nDone! Homepage has been populated with 13 blocks.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
