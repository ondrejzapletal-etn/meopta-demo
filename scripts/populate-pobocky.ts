#!/usr/bin/env npx tsx
/**
 * Populate CMS with branch data (pobočky) scraped from airbank.cz
 *
 * Usage:
 *   npx tsx scripts/populate-pobocky.ts           # create/update branches + listing page
 *   npx tsx scripts/populate-pobocky.ts --reset    # delete all branches and re-create
 *   npx tsx scripts/populate-pobocky.ts --dry-run  # print JSON only
 */

import {
  findPage,
  createPage,
  updatePage,
  deletePage,
  uploadMedia,
  createCollectionItem,
  findCollectionItems,
  updateCollectionItem,
  deleteCollectionItem,
} from './lib/cms-api.js';
import {
  downloadImage,
  decodeCdnUrl,
  safeFilename,
} from './lib/image-utils.js';

const PAGE_SLUG = 'mapa-pobocek-a-bankomatu/nase-pobocky';
const PAGE_TITLE = 'Seznam poboček | Air Bank';
const MAP_PAGE_SLUG = 'mapa-pobocek-a-bankomatu';
const MAP_PAGE_TITLE = 'Mapa poboček a bankomatů | Air Bank';
const BASE_URL = 'https://www.airbank.cz';
const LISTING_URL = `${BASE_URL}/mapa-pobocek-a-bankomatu/nase-pobocky/`;

// ─── Media cache ─────────────────────────────────────────────────────────────

const mediaCache: Record<string, number> = {};

async function ensureMedia(url: string, alt: string, filename?: string): Promise<number> {
  const key = url;
  if (mediaCache[key]) return mediaCache[key]!;

  let localPath: string;
  try {
    localPath = await downloadImage(url, filename || safeFilename(url, '.jpg'));
  } catch (err) {
    console.warn(`  Could not download ${url}: ${(err as Error).message}`);
    throw err;
  }

  const id = await uploadMedia(localPath, alt);
  mediaCache[key] = id;
  return id;
}

// ─── Branch data types ───────────────────────────────────────────────────────

interface BranchInfo {
  name: string;
  street: string;
  city: string;
  zip: string;
  slug: string;
  latitude: number;
  longitude: number;
  openingHours: Array<{ days: string; hours: string }>;
  amenities: string[];
  galleryUrls: string[];
  listingImageUrl: string;
}

// ─── Hardcoded branch data ───────────────────────────────────────────────────
// Scraped from airbank.cz — 32 branches

const BRANCHES: BranchInfo[] = [
  {
    name: 'Brno, Joštova',
    street: 'Joštova 2',
    city: 'Brno',
    zip: '602 00',
    slug: 'mapa-pobocek-a-bankomatu/brno-jostova-2',
    latitude: 49.1978,
    longitude: 16.6082,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–18.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/361-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/350-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/351-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/352-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/353-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/354-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/355-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/356-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/357-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/359-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/360-brno.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/361-brno.jpg',
  },
  {
    name: 'Brno, Olympia',
    street: 'U Dálnice 777',
    city: 'Brno',
    zip: '664 42',
    slug: 'mapa-pobocek-a-bankomatu/brno-u-dalnice-777',
    latitude: 49.1274,
    longitude: 16.6686,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–19.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/546-brno-olympia.jpg',
      'https://www.airbank.cz/data/branch-photo/547-brno-olympia.jpg',
      'https://www.airbank.cz/data/branch-photo/548-brno-olympia.jpg',
      'https://www.airbank.cz/data/branch-photo/549-brno-olympia.jpg',
      'https://www.airbank.cz/data/branch-photo/550-brno-olympia.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/546-brno-olympia.jpg',
  },
  {
    name: 'Brno, Vaňkovka',
    street: 'Ve Vaňkovce 462/1',
    city: 'Brno',
    zip: '602 00',
    slug: 'mapa-pobocek-a-bankomatu/brno-ve-vankovce-462-1',
    latitude: 49.1901,
    longitude: 16.6126,
    openingHours: [
      { days: 'Po–So', hours: '9.00–21.00' },
      { days: 'Ne', hours: '10.00–20.00' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/332-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/333-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/334-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/336-brno.jpg',
      'https://www.airbank.cz/data/branch-photo/337-brno.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/337-brno.jpg',
  },
  {
    name: 'České Budějovice, NC IGY',
    street: 'Pražská tř. 1247/24',
    city: 'České Budějovice',
    zip: '370 04',
    slug: 'mapa-pobocek-a-bankomatu/ceske-budejovice-prazska-tr-1247-24',
    latitude: 48.9862,
    longitude: 14.4632,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–19.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/84-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/85-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/86-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/87-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/88-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/89-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/90-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/91-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/92-ceske-budejovice-nc-igy.jpg',
      'https://www.airbank.cz/data/branch-photo/93-ceske-budejovice-nc-igy.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/84-ceske-budejovice-nc-igy.jpg',
  },
  {
    name: 'Frýdek-Místek, Pivovarská',
    street: 'Pivovarská 2182',
    city: 'Frýdek-Místek',
    zip: '738 01',
    slug: 'mapa-pobocek-a-bankomatu/frydek-mistek-pivovarska-2182',
    latitude: 49.6878,
    longitude: 18.3531,
    openingHours: [
      { days: 'Po–Pá', hours: '9.00–17.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/68-frydek-mistek.jpg',
      'https://www.airbank.cz/data/branch-photo/69-frydek-mistek.jpg',
      'https://www.airbank.cz/data/branch-photo/70-frydek-mistek.jpg',
      'https://www.airbank.cz/data/branch-photo/72-frydek-mistek.jpg',
      'https://www.airbank.cz/data/branch-photo/73-frydek-mistek.jpg',
      'https://www.airbank.cz/data/branch-photo/74-frydek-mistek.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/69-frydek-mistek.jpg',
  },
  {
    name: 'Hradec Králové, Aupark Shopping Center',
    street: 'Gočárova 1754/48a',
    city: 'Hradec Králové',
    zip: '500 02',
    slug: 'mapa-pobocek-a-bankomatu/hradec-kralove-gocarova-1754-48a',
    latitude: 50.2092,
    longitude: 15.8256,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–19.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/319-hradec-kralove.jpg',
      'https://www.airbank.cz/data/branch-photo/320-hradec-kralove.jpg',
      'https://www.airbank.cz/data/branch-photo/321-hradec-kralove.jpg',
      'https://www.airbank.cz/data/branch-photo/322-hradec-kralove.jpg',
      'https://www.airbank.cz/data/branch-photo/323-hradec-kralove.jpg',
      'https://www.airbank.cz/data/branch-photo/331-hradec-kralove.jpg',
      'https://www.airbank.cz/data/branch-photo/446-hradec-kralove-aupark-shopping-center.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/446-hradec-kralove-aupark-shopping-center.jpg',
  },
  {
    name: 'Jihlava, City Park',
    street: 'Hradební 1',
    city: 'Jihlava',
    zip: '586 01',
    slug: 'mapa-pobocek-a-bankomatu/jihlava-hradebni-1',
    latitude: 49.3961,
    longitude: 15.5912,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–19.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/112-jihlava.jpg',
      'https://www.airbank.cz/data/branch-photo/113-jihlava.jpg',
      'https://www.airbank.cz/data/branch-photo/114-jihlava.jpg',
      'https://www.airbank.cz/data/branch-photo/116-jihlava.jpg',
      'https://www.airbank.cz/data/branch-photo/117-jihlava.jpg',
      'https://www.airbank.cz/data/branch-photo/119-jihlava.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/119-jihlava.jpg',
  },
  {
    name: 'Karlovy Vary, T. G. Masaryka',
    street: 'T. G. Masaryka 937/30',
    city: 'Karlovy Vary',
    zip: '360 01',
    slug: 'mapa-pobocek-a-bankomatu/karlovy-vary-t-g-masaryka-937-30',
    latitude: 50.2316,
    longitude: 12.8714,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–18.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/139-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/140-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/141-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/142-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/143-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/144-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/145-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/146-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/147-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/149-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/150-karlovy-vary.jpg',
      'https://www.airbank.cz/data/branch-photo/151-karlovy-vary.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/139-karlovy-vary.jpg',
  },
  {
    name: 'Central Kladno',
    street: 'Petra Bezruče 3388',
    city: 'Kladno',
    zip: '272 01',
    slug: 'mapa-pobocek-a-bankomatu/kladno-petra-bezruce-3388',
    latitude: 50.1432,
    longitude: 14.1059,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–19.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/371-kladno.jpg',
      'https://www.airbank.cz/data/branch-photo/372-kladno.jpg',
      'https://www.airbank.cz/data/branch-photo/373-kladno.jpg',
      'https://www.airbank.cz/data/branch-photo/374-kladno.jpg',
      'https://www.airbank.cz/data/branch-photo/375-kladno.jpg',
      'https://www.airbank.cz/data/branch-photo/377-kladno.jpg',
      'https://www.airbank.cz/data/branch-photo/379-kladno.jpg',
      'https://www.airbank.cz/data/branch-photo/380-kladno.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/379-kladno.jpg',
  },
  {
    name: 'Liberec, Pražská',
    street: 'Pražská 13, č. p. 19',
    city: 'Liberec',
    zip: '460 01',
    slug: 'mapa-pobocek-a-bankomatu/liberec-prazska-13-c-p-19',
    latitude: 50.7671,
    longitude: 15.0545,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–18.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/309-liberec.jpg',
      'https://www.airbank.cz/data/branch-photo/310-liberec.jpg',
      'https://www.airbank.cz/data/branch-photo/311-liberec.jpg',
      'https://www.airbank.cz/data/branch-photo/312-liberec.jpg',
      'https://www.airbank.cz/data/branch-photo/313-liberec.jpg',
      'https://www.airbank.cz/data/branch-photo/314-liberec.jpg',
      'https://www.airbank.cz/data/branch-photo/315-liberec.jpg',
      'https://www.airbank.cz/data/branch-photo/316-liberec.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/315-liberec.jpg',
  },
  {
    name: 'Most, OC Central Most',
    street: 'Radniční 3400',
    city: 'Most',
    zip: '434 01',
    slug: 'mapa-pobocek-a-bankomatu/most-radnicni-3400',
    latitude: 50.5031,
    longitude: 13.6364,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–19.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/362-most.jpg',
      'https://www.airbank.cz/data/branch-photo/363-most.jpg',
      'https://www.airbank.cz/data/branch-photo/365-most.jpg',
      'https://www.airbank.cz/data/branch-photo/366-most.jpg',
      'https://www.airbank.cz/data/branch-photo/367-most.jpg',
      'https://www.airbank.cz/data/branch-photo/368-most.jpg',
      'https://www.airbank.cz/data/branch-photo/369-most.jpg',
      'https://www.airbank.cz/data/branch-photo/370-most.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/362-most.jpg',
  },
  {
    name: 'Olomouc, Galerie Šantovka',
    street: 'Polská 1201/1',
    city: 'Olomouc',
    zip: '779 00',
    slug: 'mapa-pobocek-a-bankomatu/olomouc-polska-1201-1',
    latitude: 49.6009,
    longitude: 17.2563,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–20.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/173-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/174-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/175-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/176-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/177-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/178-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/179-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/180-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/181-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/182-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/183-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/184-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/185-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/186-olomouc.jpg',
      'https://www.airbank.cz/data/branch-photo/187-olomouc.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/173-olomouc.jpg',
  },
  {
    name: 'Opava, Kolářská',
    street: 'Kolářská 147/1',
    city: 'Opava',
    zip: '746 01',
    slug: 'mapa-pobocek-a-bankomatu/opava-kolarska-147-1',
    latitude: 49.9381,
    longitude: 17.9028,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–18.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/152-opava.jpg',
      'https://www.airbank.cz/data/branch-photo/153-opava.jpg',
      'https://www.airbank.cz/data/branch-photo/154-opava.jpg',
      'https://www.airbank.cz/data/branch-photo/156-opava.jpg',
      'https://www.airbank.cz/data/branch-photo/157-opava.jpg',
      'https://www.airbank.cz/data/branch-photo/158-opava.jpg',
      'https://www.airbank.cz/data/branch-photo/159-opava.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/153-opava.jpg',
  },
  {
    name: 'Ostrava, Forum Nová Karolina',
    street: 'Jantarová 3344/4',
    city: 'Ostrava',
    zip: '702 00',
    slug: 'mapa-pobocek-a-bankomatu/ostrava-jantarova-3344-4',
    latitude: 49.8385,
    longitude: 18.2868,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–21.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/94-ostrava.jpg',
      'https://www.airbank.cz/data/branch-photo/95-ostrava.jpg',
      'https://www.airbank.cz/data/branch-photo/96-ostrava.jpg',
      'https://www.airbank.cz/data/branch-photo/97-ostrava.jpg',
      'https://www.airbank.cz/data/branch-photo/98-ostrava.jpg',
      'https://www.airbank.cz/data/branch-photo/99-ostrava.jpg',
      'https://www.airbank.cz/data/branch-photo/100-ostrava.jpg',
      'https://www.airbank.cz/data/branch-photo/101-ostrava.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/100-ostrava.jpg',
  },
  {
    name: 'Ostrava, Avion Shopping Park',
    street: 'Rudná 114/3114',
    city: 'Ostrava-Zábřeh',
    zip: '700 30',
    slug: 'mapa-pobocek-a-bankomatu/ostrava-zabreh-rudna-114-3114',
    latitude: 49.7834,
    longitude: 18.2377,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–21.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/102-ostrava-zabreh.jpg',
      'https://www.airbank.cz/data/branch-photo/103-ostrava-zabreh.jpg',
      'https://www.airbank.cz/data/branch-photo/104-ostrava-zabreh.jpg',
      'https://www.airbank.cz/data/branch-photo/106-ostrava-zabreh.jpg',
      'https://www.airbank.cz/data/branch-photo/108-ostrava-zabreh.jpg',
      'https://www.airbank.cz/data/branch-photo/109-ostrava-zabreh.jpg',
      'https://www.airbank.cz/data/branch-photo/110-ostrava-zabreh.jpg',
      'https://www.airbank.cz/data/branch-photo/111-ostrava-zabreh.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/102-ostrava-zabreh.jpg',
  },
  {
    name: 'Palác Pardubice',
    street: 'Masarykovo náměstí 2799',
    city: 'Pardubice',
    zip: '530 02',
    slug: 'mapa-pobocek-a-bankomatu/pardubice-masarykovo-namesti-2799',
    latitude: 50.0376,
    longitude: 15.7697,
    openingHours: [
      { days: 'Po–So', hours: '9.00–20.00' },
      { days: 'Ne', hours: '10.00–20.00' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/197-pardubice.jpg',
      'https://www.airbank.cz/data/branch-photo/198-pardubice.jpg',
      'https://www.airbank.cz/data/branch-photo/199-pardubice.jpg',
      'https://www.airbank.cz/data/branch-photo/200-pardubice.jpg',
      'https://www.airbank.cz/data/branch-photo/201-pardubice.jpg',
      'https://www.airbank.cz/data/branch-photo/202-pardubice.jpg',
      'https://www.airbank.cz/data/branch-photo/203-pardubice.jpg',
      'https://www.airbank.cz/data/branch-photo/204-pardubice.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/204-pardubice.jpg',
  },
  {
    name: 'Plzeň, Americká',
    street: 'Americká 56',
    city: 'Plzeň',
    zip: '301 00',
    slug: 'mapa-pobocek-a-bankomatu/plzen-americka-56',
    latitude: 49.7474,
    longitude: 13.3776,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–18.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/128-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/129-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/130-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/131-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/132-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/133-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/134-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/135-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/136-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/137-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/138-plzen.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/128-plzen.jpg',
  },
  {
    name: 'Plzeň, náměstí Republiky',
    street: 'náměstí Republiky 11, č. p. 104',
    city: 'Plzeň',
    zip: '301 00',
    slug: 'mapa-pobocek-a-bankomatu/plzen-namesti-republiky-11-c-p-104',
    latitude: 49.7476,
    longitude: 13.3776,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–18.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/120-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/121-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/122-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/123-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/124-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/125-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/126-plzen.jpg',
      'https://www.airbank.cz/data/branch-photo/127-plzen.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/120-plzen.jpg',
  },
  {
    name: 'Praha, Vodičkova',
    street: 'Vodičkova 24',
    city: 'Praha 1',
    zip: '110 00',
    slug: 'mapa-pobocek-a-bankomatu/praha-1-vodickova-24',
    latitude: 50.0811,
    longitude: 14.4241,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–19.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'bez-barier', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/294-praha-1.jpg',
      'https://www.airbank.cz/data/branch-photo/295-praha-1.jpg',
      'https://www.airbank.cz/data/branch-photo/297-praha-1.jpg',
      'https://www.airbank.cz/data/branch-photo/298-praha-1.jpg',
      'https://www.airbank.cz/data/branch-photo/299-praha-1.jpg',
      'https://www.airbank.cz/data/branch-photo/300-praha-1.jpg',
      'https://www.airbank.cz/data/branch-photo/301-praha-1.jpg',
      'https://www.airbank.cz/data/branch-photo/387-praha-vodickova.jpg',
      'https://www.airbank.cz/data/branch-photo/537-praha-vodickova.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/298-praha-1.jpg',
  },
  {
    name: 'Praha, NC Eden',
    street: 'U Slavie 1527',
    city: 'Praha 10',
    zip: '100 00',
    slug: 'mapa-pobocek-a-bankomatu/praha-10-u-slavie-1527',
    latitude: 50.0687,
    longitude: 14.4700,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–20.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/253-praha-10.jpg',
      'https://www.airbank.cz/data/branch-photo/254-praha-10.jpg',
      'https://www.airbank.cz/data/branch-photo/255-praha-10.jpg',
      'https://www.airbank.cz/data/branch-photo/256-praha-10.jpg',
      'https://www.airbank.cz/data/branch-photo/258-praha-10.jpg',
      'https://www.airbank.cz/data/branch-photo/259-praha-10.jpg',
      'https://www.airbank.cz/data/branch-photo/260-praha-10.jpg',
      'https://www.airbank.cz/data/branch-photo/261-praha-10.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/253-praha-10.jpg',
  },
  {
    name: 'Praha, Arkády Pankrác',
    street: 'Na Pankráci 86',
    city: 'Praha 4',
    zip: '140 00',
    slug: 'mapa-pobocek-a-bankomatu/praha-4-na-pankraci-86',
    latitude: 50.0571,
    longitude: 14.4371,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–21.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/502-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/505-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/508-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/511-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/514-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/517-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/520-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/523-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/526-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/529-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/532-praha-arkady-pankrac.jpg',
      'https://www.airbank.cz/data/branch-photo/535-praha-arkady-pankrac.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/502-praha-arkady-pankrac.jpg',
  },
  {
    name: 'Praha, Westfield Chodov',
    street: 'Roztylská 2321/19',
    city: 'Praha 4',
    zip: '148 00',
    slug: 'mapa-pobocek-a-bankomatu/praha-4-roztylska-2321-19',
    latitude: 50.0312,
    longitude: 14.4913,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–20.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/235-praha-4.jpg',
      'https://www.airbank.cz/data/branch-photo/237-praha-4.jpg',
      'https://www.airbank.cz/data/branch-photo/238-praha-4.jpg',
      'https://www.airbank.cz/data/branch-photo/239-praha-4.jpg',
      'https://www.airbank.cz/data/branch-photo/240-praha-4.jpg',
      'https://www.airbank.cz/data/branch-photo/241-praha-4.jpg',
      'https://www.airbank.cz/data/branch-photo/536-praha-westfield-chodov-centrum-chodov.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/239-praha-4.jpg',
  },
  {
    name: 'Praha, Metropole Zličín',
    street: 'Řevnická 1',
    city: 'Praha 5',
    zip: '155 21',
    slug: 'mapa-pobocek-a-bankomatu/praha-5-revnicka-1',
    latitude: 50.0531,
    longitude: 14.2932,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–20.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/226-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/227-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/228-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/230-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/231-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/232-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/233-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/234-praha-5.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/233-praha-5.jpg',
  },
  {
    name: 'Praha, OC Zlatý Anděl',
    street: 'Nádražní 344/23',
    city: 'Praha 5',
    zip: '151 34',
    slug: 'mapa-pobocek-a-bankomatu/praha-5-nadrazni-344-23',
    latitude: 50.0704,
    longitude: 14.4034,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–19.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/284-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/285-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/286-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/287-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/288-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/289-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/290-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/291-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/292-praha-5.jpg',
      'https://www.airbank.cz/data/branch-photo/293-praha-5.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/289-praha-5.jpg',
  },
  {
    name: 'Praha, Evropská',
    street: 'Evropská 2690/17',
    city: 'Praha 6',
    zip: '160 00',
    slug: 'mapa-pobocek-a-bankomatu/praha-6-evropska-2690-17',
    latitude: 50.1001,
    longitude: 14.3889,
    openingHours: [
      { days: 'Po–Pá', hours: '8.30–18.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/404-praha-evropska.jpg',
      'https://www.airbank.cz/data/branch-photo/407-praha-evropska.jpg',
      'https://www.airbank.cz/data/branch-photo/410-praha-evropska.jpg',
      'https://www.airbank.cz/data/branch-photo/413-praha-evropska.jpg',
      'https://www.airbank.cz/data/branch-photo/416-praha-evropska.jpg',
      'https://www.airbank.cz/data/branch-photo/419-praha-evropska.jpg',
      'https://www.airbank.cz/data/branch-photo/422-praha-evropska.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/422-praha-evropska.jpg',
  },
  {
    name: 'Praha, Strossmayerovo náměstí',
    street: 'Strossmayerovo nám. 967/12',
    city: 'Praha 7 - Holešovice',
    zip: '170 00',
    slug: 'mapa-pobocek-a-bankomatu/praha-7-holesovice-strossmayerovo-nam-967-12',
    latitude: 50.0990,
    longitude: 14.4295,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–19.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/539-praha-strossmayerovo-namesti-otevirame-19-6.jpg',
      'https://www.airbank.cz/data/branch-photo/540-praha-strossmayerovo-namesti.jpg',
      'https://www.airbank.cz/data/branch-photo/541-praha-strossmayerovo-namesti.jpg',
      'https://www.airbank.cz/data/branch-photo/542-praha-strossmayerovo-namesti.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/539-praha-strossmayerovo-namesti-otevirame-19-6.jpg',
  },
  {
    name: 'Praha, Centrum Černý Most',
    street: 'Chlumecká 765/6',
    city: 'Praha 9',
    zip: '198 19',
    slug: 'mapa-pobocek-a-bankomatu/praha-9-chlumecka-765-6',
    latitude: 50.1064,
    longitude: 14.5753,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–20.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/205-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/206-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/207-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/208-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/209-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/210-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/211-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/212-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/214-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/215-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/216-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/217-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/218-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/219-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/220-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/221-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/225-praha-9.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/205-praha-9.jpg',
  },
  {
    name: 'Praha, Galerie Harfa',
    street: 'Českomoravská 15a, č. p. 2420',
    city: 'Praha 9',
    zip: '190 93',
    slug: 'mapa-pobocek-a-bankomatu/praha-9-ceskomoravska-15a-c-p-2420',
    latitude: 50.1063,
    longitude: 14.4937,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–20.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/457-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/460-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/463-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/466-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/469-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/472-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/475-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/478-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/481-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/484-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/487-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/490-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/493-praha-galerie-harfa.jpg',
      'https://www.airbank.cz/data/branch-photo/499-praha-galerie-harfa.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/457-praha-galerie-harfa.jpg',
  },
  {
    name: 'Praha, OC Letňany',
    street: 'Veselská č. p. 663',
    city: 'Praha 9',
    zip: '199 00',
    slug: 'mapa-pobocek-a-bankomatu/praha-9-veselska-c-p-663',
    latitude: 50.1263,
    longitude: 14.5167,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–20.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/262-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/263-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/264-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/265-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/266-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/267-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/268-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/269-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/270-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/271-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/272-praha-9.jpg',
      'https://www.airbank.cz/data/branch-photo/273-praha-9.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/271-praha-9.jpg',
  },
  {
    name: 'Teplice, náměstí Svobody',
    street: 'náměstí Svobody 3316',
    city: 'Teplice',
    zip: '415 01',
    slug: 'mapa-pobocek-a-bankomatu/teplice-namesti-svobody-3316',
    latitude: 50.6405,
    longitude: 13.8244,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–19.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/76-teplice.jpg',
      'https://www.airbank.cz/data/branch-photo/77-teplice.jpg',
      'https://www.airbank.cz/data/branch-photo/78-teplice.jpg',
      'https://www.airbank.cz/data/branch-photo/79-teplice.jpg',
      'https://www.airbank.cz/data/branch-photo/80-teplice.jpg',
      'https://www.airbank.cz/data/branch-photo/81-teplice.jpg',
      'https://www.airbank.cz/data/branch-photo/82-teplice.jpg',
      'https://www.airbank.cz/data/branch-photo/83-teplice.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/79-teplice.jpg',
  },
  {
    name: 'Ústí nad Labem, Revoluční',
    street: 'Revoluční 551/6',
    city: 'Ústí nad Labem',
    zip: '400 01',
    slug: 'mapa-pobocek-a-bankomatu/usti-nad-labem-revolucni-551-6',
    latitude: 50.6611,
    longitude: 14.0407,
    openingHours: [
      { days: 'Po–Pá', hours: '8.00–18.00' },
      { days: 'So–Ne', hours: 'zavřeno' },
    ],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/19-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/20-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/21-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/22-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/23-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/24-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/25-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/27-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/28-usti-nad-labem.jpg',
      'https://www.airbank.cz/data/branch-photo/29-usti-nad-labem.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/24-usti-nad-labem.jpg',
  },
  {
    name: 'Zlín, NC Zlaté Jablko',
    street: 'náměstí Míru 174',
    city: 'Zlín',
    zip: '760 01',
    slug: 'mapa-pobocek-a-bankomatu/zlin-namesti-miru-174',
    latitude: 49.2248,
    longitude: 17.6668,
    openingHours: [{ days: 'Po–Ne', hours: '9.00–19.00' }],
    amenities: ['bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev'],
    galleryUrls: [
      'https://www.airbank.cz/data/branch-photo/302-zlin.jpg',
      'https://www.airbank.cz/data/branch-photo/303-zlin.jpg',
      'https://www.airbank.cz/data/branch-photo/304-zlin.jpg',
      'https://www.airbank.cz/data/branch-photo/305-zlin.jpg',
      'https://www.airbank.cz/data/branch-photo/306-zlin.jpg',
      'https://www.airbank.cz/data/branch-photo/307-zlin.jpg',
      'https://www.airbank.cz/data/branch-photo/308-zlin.jpg',
    ],
    listingImageUrl: 'https://www.airbank.cz/data/branch-photo/305-zlin.jpg',
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');

  if (doReset && !dryRun) {
    console.log('Resetting branches...');
    const existing = await findCollectionItems('branches', 'limit=100&depth=0');
    for (const doc of existing.docs) {
      await deleteCollectionItem('branches', doc.id);
      console.log(`  Deleted branch ${doc.id}`);
    }

    const existingPage = await findPage(PAGE_SLUG);
    if (existingPage) {
      await deletePage(existingPage.id);
      console.log(`  Deleted listing page ${existingPage.id}`);
    }

    const existingMapPage = await findPage(MAP_PAGE_SLUG);
    if (existingMapPage) {
      await deletePage(existingMapPage.id);
      console.log(`  Deleted map page ${existingMapPage.id}`);
    }
  }

  // Build slug → id index from existing branches for upsert
  const existingBranches = await findCollectionItems('branches', 'limit=100&depth=0');
  const slugToId = new Map<string, number>();
  for (const doc of existingBranches.docs) {
    if (doc.slug) slugToId.set(doc.slug, doc.id);
  }

  console.log(`\nCreating/updating ${BRANCHES.length} branches (${slugToId.size} already exist)...\n`);

  for (let i = 0; i < BRANCHES.length; i++) {
    const branch = BRANCHES[i]!;
    console.log(`${i + 1}/${BRANCHES.length} ${branch.name}`);

    if (dryRun) {
      console.log(`  [DRY RUN] Would create/update: ${branch.slug}`);
      continue;
    }

    // Upload gallery images
    const galleryItems: Array<{ image: number }> = [];
    for (const photoUrl of branch.galleryUrls) {
      try {
        const filename = safeFilename(photoUrl, '.jpg');
        const mediaId = await ensureMedia(photoUrl, `${branch.name} - foto`, filename);
        galleryItems.push({ image: mediaId });
      } catch {
        console.warn(`  Skipped gallery photo: ${photoUrl}`);
      }
    }

    // Upload listing image
    let listingImageId: number | undefined;
    if (branch.listingImageUrl) {
      try {
        const filename = safeFilename(branch.listingImageUrl, '.jpg');
        listingImageId = await ensureMedia(
          branch.listingImageUrl,
          `${branch.name} - listing`,
          filename,
        );
      } catch {
        console.warn(`  Skipped listing image`);
      }
    }

    const data: Record<string, unknown> = {
      name: branch.name,
      slug: branch.slug,
      street: branch.street,
      city: branch.city,
      zip: branch.zip,
      latitude: branch.latitude,
      longitude: branch.longitude,
      openingHours: branch.openingHours,
      amenities: branch.amenities,
      gallery: galleryItems,
    };
    if (listingImageId) {
      data.listingImage = listingImageId;
    }

    try {
      const existingId = slugToId.get(branch.slug);
      if (existingId) {
        await updateCollectionItem('branches', existingId, data);
        console.log(`  Updated branch id=${existingId}`);
      } else {
        const created = await createCollectionItem('branches', data);
        console.log(`  Created branch id=${created.id}`);
      }
    } catch (err) {
      console.error(`  Failed to create/update ${branch.name}: ${(err as Error).message}`);
    }
  }

  if (dryRun) {
    console.log('\n[DRY RUN] Would create listing page');
    return;
  }

  // Create listing page
  const blocks = [
    {
      blockType: 'branchListBlock',
      title: 'Seznam poboček',
    },
  ];

  const existingPage = await findPage(PAGE_SLUG);
  if (existingPage) {
    await updatePage(existingPage.id, blocks);
    console.log(`\nUpdated listing page (id=${existingPage.id})`);
  } else {
    const page = await createPage(PAGE_TITLE, PAGE_SLUG, blocks);
    console.log(`\nCreated listing page (id=${page.id})`);
  }

  // Create map page
  const mapBlocks = [
    {
      blockType: 'branchMapBlock',
      title: 'Mapa poboček',
      defaultZoom: 7,
    },
  ];

  const existingMapPage = await findPage(MAP_PAGE_SLUG);
  if (existingMapPage) {
    await updatePage(existingMapPage.id, mapBlocks);
    console.log(`Updated map page (id=${existingMapPage.id})`);
  } else {
    const mapPage = await createPage(MAP_PAGE_TITLE, MAP_PAGE_SLUG, mapBlocks);
    console.log(`Created map page (id=${mapPage.id})`);
  }

  console.log(`\nView listing:  http://localhost:3000/cs/mapa-pobocek-a-bankomatu/nase-pobocky`);
  console.log(`View map:      http://localhost:3000/cs/mapa-pobocek-a-bankomatu`);
  console.log(`Done! Created ${BRANCHES.length} branches + listing page + map page.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
