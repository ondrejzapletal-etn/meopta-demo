#!/usr/bin/env npx tsx
/**
 * Populate CMS with "Půjčka" product page replicating airbank.cz/produkty/pujcka/
 *
 * Usage:
 *   npx tsx scripts/populate-pujcka.ts           # create/update page
 *   npx tsx scripts/populate-pujcka.ts --reset    # delete page and re-create
 *   npx tsx scripts/populate-pujcka.ts --dry-run  # print JSON only
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
  createPlaceholderImage,
  safeFilename,
} from './lib/image-utils.js';
import { htmlToLexical, uploadNode, wrapRoot } from './lib/lexical.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PAGE_SLUG = 'produkty/pujcka';
const PAGE_TITLE = 'Půjčka | Air Bank';

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

async function ensureSvgFileMedia(filePath: string, name: string): Promise<number> {
  const key = `svgfile:${name}`;
  if (mediaCache[key]) return mediaCache[key]!;

  const absPath = resolve(__dirname, filePath);
  const id = await uploadMedia(absPath, name);
  mediaCache[key] = id;
  return id;
}

// ─── Block builders ──────────────────────────────────────────────────────────

async function buildHeroBlock(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_648x452_fit/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2426-pujcka-on-green-web-new-9d11c529-1d713e076f87f7642be3cb056978712e.png',
    'Půjčka - bankéř s telefonem',
    'pujcka-hero.png',
  );

  return {
    blockType: 'heroPlainBlock',
    backgroundColor: 'green',
    textAlign: 'left',
    title: 'Půjčte si až 2 000 000 Kč s úrokem od 4,4 %',
    description: htmlToLexical(
      '<p>Snadno a na pár kliknutí. Získáte tak půjčku, která pravidelně vítězí v Indexu odpovědného úvěrování Člověka v tísni.</p>',
    ),
    image,
    links: [
      { label: 'Spočítat půjčku', url: '#kalkulacka', appearance: 'primary' },
    ],
  };
}

async function buildFeatureCardsBlock(): Promise<Record<string, unknown>> {
  const iconInterestRate = await ensureSvgFileMedia('assets/pujcka-icons/urok.svg', 'pujcka-icon-urok');
  const iconHoliday = await ensureSvgFileMedia('assets/pujcka-icons/prazdniny.svg', 'pujcka-icon-prazdniny');
  const iconNoFees = await ensureSvgFileMedia('assets/pujcka-icons/poplatky.svg', 'pujcka-icon-poplatky');
  const iconInsurance = await ensureSvgFileMedia('assets/pujcka-icons/pojisteni.svg', 'pujcka-icon-pojisteni');

  return {
    blockType: 'benefitsBlock',
    columns: '4',
    items: [
      {
        icon: iconInterestRate,
        title: 'Půjčky umíme s úrokem od 4,4 % ročně',
        description: htmlToLexical('<p>Půjčit si můžete na cokoliv, a to až do výše 2 000 000 Kč.</p>'),
      },
      {
        icon: iconHoliday,
        title: 'Dva měsíce splátkových prázdnin',
        description: htmlToLexical('<p>Potřebujete si od půjčky odpočinout? Každý rok si můžete splátky o dva měsíce posunout. <a href="#">Jak to funguje?</a></p>'),
      },
      {
        icon: iconNoFees,
        title: 'Nesmyslným poplatkům vstup zakázán',
        description: htmlToLexical('<p>U nás žádný poplatek za sjednání, vedení nebo předčasné splacení nepotkáte.</p>'),
      },
      {
        icon: iconInsurance,
        title: 'Jedinečné pojištění pro klidné splácení',
        description: htmlToLexical('<p>Půjčku si můžete <a href="#">pojistit</a> pro případ nečekaných životních situací.</p>'),
      },
    ],
  };
}

async function buildBenefitsWithListBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'benefitsWithListBlock',
    items: [
      { text: 'Předčasné splacení kdykoli chcete a zadarmo. Navíc při splacení první půjčky do 30 dnů od načerpání vracíme úroky.' },
      { text: 'Snížení měsíční splátky nebo mimořádná splátka? Jak jinak než zdarma.' },
      { text: 'Sjednání a vedení půjčky zdarma.' },
    ],
  };
}

async function buildLoanCalculatorBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'loanCalculatorBlock',
    layoutStyles: {
      anchorId: 'kalkulacka',
    },
    title: 'Půjčková kalkulačka',
    description: 'Tento výpočet je orientační a slouží jen pro vaši představu.',
    minAmount: 5000,
    maxAmount: 2000000,
    defaultAmount: 80000,
    minMonths: 6,
    maxMonths: 114,
    defaultMonths: 55,
    interestRate: 4.4,
  };
}

async function buildInterestRateInfoBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'richTextBlock',
    backgroundColor: 'lightGrey',
    variant: 'info-box',
    content: htmlToLexical(
      '<h3>Jaký úrok u nás nejčastěji získáte</h3>' +
      '<p>Úrok na kalkulačce je opravdu orientační. Pro ještě lepší představu proto uvádíme, s jakým bonusovým úrokem jsme schválili půjčky do 200 000 Kč v období od 1. 1. do 30. 6. 2025.</p>' +
      '<ul>' +
      '<li>76 % klientů získalo roční úrok do 7,9 %</li>' +
      '<li>15 % klientů získalo roční úrok od 8 do 10,9 %</li>' +
      '<li>Jen 8 % klientů získalo roční úrok vyšší než 10,9 %</li>' +
      '</ul>',
    ),
  };
}

async function buildCtaCardsBlock(): Promise<Record<string, unknown>> {
  const iconKlient = await ensureSvgFileMedia('assets/pujcka-icons/cta-card-0.svg', 'pujcka-cta-klient');
  const iconNeklient = await ensureSvgFileMedia('assets/pujcka-icons/cta-icon-online.svg', 'pujcka-cta-neklient');
  const iconPobocka = await ensureSvgFileMedia('assets/pujcka-icons/cta-icon-pobocka.svg', 'pujcka-cta-pobocka');

  return {
    blockType: 'ctaCardsBlock',
    title: 'Chcete naši půjčku?',
    description: htmlToLexical(
      '<p>Beze všeho. Půjčit si můžete, ať už jste naším klientem nebo ne.</p>',
    ),
    items: [
      {
        icon: iconKlient,
        title: 'Jsem klient Air Bank',
        description: 'Skvělé! Pojďte se rovnou podívat, kolik si můžete půjčit.',
        linkLabel: 'Přihlásit se',
        linkUrl: '#',
      },
      {
        icon: iconNeklient,
        title: 'Nejsem klient Air Bank',
        description: 'Nevadí, půjčku si sjednáte v online formuláři během pár minut.',
        linkLabel: 'Požádat online',
        linkUrl: '#',
      },
      {
        icon: iconPobocka,
        title: 'Zastavte se u nás',
        description: 'Půjčku získáte raz dva také na jakékoliv naší pobočce.',
        linkLabel: 'Najít nejbližší',
        linkUrl: '/mapa-pobocek-a-bankomatu/',
      },
    ],
  };
}

async function buildAppBannerBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'downloadSectionBlock',
    items: [
      {
        title: 'Svoji půjčku vyřídíte',
        description: 'rovnou v aplikaci',
      },
    ],
  };
}

async function buildReasonsBannerBlock(): Promise<Record<string, unknown>> {
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

async function buildFaqBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'faqItemsBlock',
    title: 'Co vás nejvíc zajímá',
    numbered: false,
    allowMultiple: false,
    items: [
      {
        title: 'Jaké dokumenty budu k vyřízení půjčky nebo kontokorentu potřebovat?',
        content: htmlToLexical(
          '<h3>1.\u00a0Doklady</h3>' +
          '<p>Jestli jste občanem České republiky — občanský průkaz a\u00a0k\u00a0němu druhý doklad totožnosti (řidičský průkaz, cestovní pas nebo rodný list).</p>' +
          '<p>Jako cizinec — dva různé druhy z\u00a0těchto dokladů: cestovní pas, potvrzení o\u00a0povolení pobytu, národní doklad totožnosti (jen pro občany EU), řidičský průkaz.</p>' +
          '<p>Pokud jste ženatý či vdaná, u\u00a0vyšších částek po vás ještě můžeme chtít podepisovat dokument o\u00a0Společném jmění manželů, který podepisuje manžel nebo manželka.</p>' +
          '<h3>2.\u00a0Potvrzení</h3>' +
          '<p><strong>Zaměstnanec:</strong> Poslední 3\u00a0výpisy z\u00a0účtu, kde příjem chodí. Potvrzení o\u00a0výši příjmu (ne starší 30\u00a0dní). Pracovní smlouva (pokud máte zkrácenou zkušební dobu nebo jste bez zkušební doby).</p>' +
          '<p><strong>Podnikatel/Svobodné povolání:</strong> Daňové přiznání. 3×\u00a0Výpis z\u00a0bankovního účtu. Doklad o\u00a0bezdlužnosti.</p>' +
          '<p><strong>Důchodce:</strong> Důchodový výměr. Potvrzení o\u00a0pobírání důchodů / Ústřižek z\u00a0pošty. 1×\u00a0Výpis z\u00a0bankovního účtu.</p>' +
          '<p><strong>Výsluha:</strong> 3×\u00a0Výpis z\u00a0bankovního účtu. Rozhodnutí o\u00a0přiznání výsluhy.</p>' +
          '<p><strong>Rodičovská dovolená:</strong> 3×\u00a0Výpis z\u00a0bankovního účtu. Oznámení o\u00a0přiznání dávky státní sociální podpory. Oznámení o\u00a0změně výše dávky státní sociální podpory. Přehled vyplacených dávek státní sociální podpory.</p>' +
          '<p><strong>Mateřská dovolená:</strong> 3×\u00a0Výpis z\u00a0bankovního účtu. Potvrzení o\u00a0výši příjmu (Potvrzení o\u00a0MD).</p>' +
          '<p><strong>Pronájem:</strong> Daňové přiznání.</p>' +
          '<h4>Jak mají výpisy vypadat</h4>' +
          '<p>Musí se jednat o\u00a0výpisy z\u00a0účtu, na který dostáváte výplatu, výpisy musí být kompletní a\u00a0s\u00a0označením čísla účtu, majitele účtu a\u00a0jeho adresou. Musí na nich být výše mzdy a\u00a0její odesílatel a\u00a0nesmí se jednat o\u00a0pouhé přehledy transakcí ani printscreeny z\u00a0internetového bankovnictví.</p>' +
          '<h4>Jde to i\u00a0jednodušeji</h4>' +
          '<p>Jestli vám výplata chodí na účet v\u00a0jiné bance a\u00a0máte možnost dodat nám k\u00a0žádosti výpis z\u00a0účtu, máme pro vás o\u00a0fous jednodušší řešení, jak to udělat. Můžete využít možnosti propojení účtu v\u00a0jiné bance. Kontrola dokladů se tak může velmi zrychlit.</p>' +
          '<p>To zvládnete přímo během žádosti. Stačí jako doklad pro ověření příjmu vybrat Výpis z\u00a0účtu. Pak se můžete rovnou přihlásit do své druhé banky. Výpis si pak stáhneme sami a\u00a0během chvilky budeme moci v\u00a0žádosti pokračovat.</p>' +
          '<h4>Doklad k\u00a0převedení půjček, kreditní karty nebo kontokorentu:</h4>' +
          '<p>U\u00a0půjčky — úvěrová smlouva k\u00a0převáděné půjčce včetně dodatků.</p>' +
          '<p>Kreditní karta nebo kontokorent — místo smlouvy můžete doložit výpis z\u00a0kreditní karty nebo kontokorentu.</p>' +
          '<p><strong>A\u00a0nakonec, jaké dokumenty vás při žádosti o\u00a0půjčku mohou potkat, ale možná vás minou:</strong></p>' +
          '<h4>Formuláře, které můžete vyplňovat:</h4>' +
          '<ul>' +
          '<li>Potvrzení o\u00a0příjmu</li>' +
          '<li>Potvrzení o\u00a0prodloužení pracovního poměru</li>' +
          '<li>Souhlas manžela/manželky</li>' +
          '</ul>' +
          '<h4>Smluvní náležitosti:</h4>' +
          '<ul>' +
          '<li>Produktové podmínky k\u00a0úvěru</li>' +
          '<li>Ceník</li>' +
          '</ul>' +
          '<h4>Úvěrové registry:</h4>' +
          '<ul>' +
          '<li>Informační memorandum (BRKI, NRKI)</li>' +
          '</ul>' +
          '<p>Doklady nám můžete nahrát přímo k\u00a0žádosti v\u00a0<strong>internetovém bankovnictví</strong> v\u00a0části <strong>Nastavení / Žádosti a\u00a0smlouvy / Rozpracované žádosti</strong>. Nebo <strong>zasláním mailem</strong> na doklady@airbank.cz.</p>' +
          '<p>Doklady, které od vás budeme potřebovat, vám pošleme mailem po dokončení žádosti.</p>' +
          '<p>Jakmile podepíšete smlouvu a\u00a0pošlete nám všechny potřebné doklady, zvládáme vaši žádost zpravidla zpracovat do následujícího dne.</p>',
        ),
      },
      {
        title: 'Navýšení půjčky',
        content: await (async () => {
          // Download and upload the banking interface screenshot
          const imgPath = await downloadImage(
            'https://www.airbank.cz/data/wysiwyg/poradna/NavyseniPujckyIB_1.png',
            'pujcka-navyseni-ib.png',
          );
          const imgMediaId = await uploadMedia(imgPath, 'Navýšení půjčky - internetové bankovnictví');

          // Build content with image inserted after first paragraph
          const textContent = htmlToLexical(
            '<p>Půjčku si navýšíte v\u00a0<strong>internetovém bankovnictví</strong> v\u00a0části <strong>Půjčky a\u00a0hypotéky</strong> <strong>(1)</strong>. Vlevo dále kliknete na <strong>Nabídka půjček</strong> <strong>(2)</strong> a\u00a0zvolíte <strong>Navýšení půjčky</strong> <strong>(3)</strong>.</p>' +
            '<p>Stačí jen zadat částku, o\u00a0kterou chcete stávající půjčku navýšit, aktualizovat údaje o\u00a0sobě a\u00a0projít celou žádostí. Po vyhodnocení hned uvidíte, kolik vám ještě můžeme půjčit a\u00a0za jakých podmínek.</p>' +
            '<p>Mějte prosím na paměti, že navýšit můžete pouze půjčku, u\u00a0které už proběhla alespoň jedna řádná splátka.</p>',
          );
          const children = textContent.root.children;
          // Insert upload node after first paragraph
          children.splice(1, 0, uploadNode(imgMediaId));
          return wrapRoot(children);
        })(),
      },
    ],
  };
}

async function buildLegalTextBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'richTextBlock',
    content: htmlToLexical(
      '<p>Bonusová úroková sazba 4,4 % p.a. platí pro nové klienty, kteří si sjednají půjčku online a splní podmínky pro její získání. Standardní úroková sazba je od 4,9 % p.a. Maximální roční úroková sazba činí 17,9 % p.a.</p>' +
      '<p>Reprezentativní příklad: Celková výše spotřebitelského úvěru 80 000 Kč, roční úroková sazba 4,4 % p.a., doba trvání 51 měsíců. Měsíční splátka 1 760 Kč. Celková částka splatná spotřebitelem 89 760 Kč. RPSN 4,49 %.</p>' +
      '<p>Podmínkou získání bonusové úrokové sazby je aktivní běžný účet Air Bank s pravidelnými příjmy a sjednání pojištění k půjčce.</p>',
    ),
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');

  if (doReset && !dryRun) {
    console.log('Resetting Půjčka page...');
    const existing = await findPage(PAGE_SLUG);
    if (existing) {
      await deletePage(existing.id);
      console.log(`Deleted page ${existing.id}`);
    }
  }

  console.log('Building Půjčka page blocks...');

  const blocks: Record<string, unknown>[] = [];

  console.log('\n1/10 Hero...');
  blocks.push(await buildHeroBlock());

  console.log('2/10 Feature cards (4 columns)...');
  blocks.push(await buildFeatureCardsBlock());

  console.log('3/10 Benefits checklist...');
  blocks.push(await buildBenefitsWithListBlock());

  console.log('4/10 Loan calculator...');
  blocks.push(await buildLoanCalculatorBlock());

  console.log('5/10 Interest rate info...');
  blocks.push(await buildInterestRateInfoBlock());

  console.log('6/10 CTA cards (Chcete naši půjčku?)...');
  blocks.push(await buildCtaCardsBlock());

  console.log('7/10 App banner...');
  blocks.push(await buildAppBannerBlock());

  console.log('8/10 Reasons banner...');
  blocks.push(await buildReasonsBannerBlock());

  console.log('9/10 FAQ...');
  blocks.push(await buildFaqBlock());

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

  console.log(`View on FE:  http://localhost:3000/cs/produkty/pujcka`);
  console.log('\nDone! Půjčka page has been populated with 9 blocks.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
