#!/usr/bin/env npx tsx
/**
 * Populate CMS with "Pojištění hypotéky" product page
 * Replicates airbank.cz/produkty/pojisteni/pojisteni-hypoteky/
 *
 * Usage:
 *   npx tsx scripts/populate-pojisteni-hypoteky.ts           # create/update page
 *   npx tsx scripts/populate-pojisteni-hypoteky.ts --reset    # delete page and re-create
 *   npx tsx scripts/populate-pojisteni-hypoteky.ts --dry-run  # print JSON only
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
import { htmlToLexical, textToLexical } from './lib/lexical.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PAGE_SLUG = 'produkty/pojisteni/pojisteni-hypoteky';
const PAGE_TITLE = 'Pojištění hypotéky | Air Bank';

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
    'https://cdn.siteone.io/img.siteone.cz/rs_648x452_fit/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2477-type-pojisteni-hypoteky-color-green-80ccdcb9-c122e6da62ac7f10416e65a8f1f3e6a0.png',
    'Pojištění hypotéky — ilustrace',
    'pojisteni-hypoteky-hero.png',
  );

  return {
    blockType: 'heroPlainBlock',
    backgroundColor: 'green',
    textAlign: 'left',
    title: 'Pojistěte si svou hypotéku i\u00a0nižší úrok',
    description: htmlToLexical(
      '<p>Naše pojištění hypotéky zvládne 6\u00a0rizik najednou, a\u00a0ještě vám sníží úrokovou sazbu hypotéky.</p>',
    ),
    image,
    links: [
      { label: 'Chci hypotéku s\u00a0pojištěním', url: '#', appearance: 'primary' },
      { label: 'Nahlásit pojistnou událost', url: 'https://online.cardif.cz', appearance: 'outline' },
    ],
  };
}

async function buildBenefitsBlock(): Promise<Record<string, unknown>> {
  const iconDestnik = await ensureSvgFileMedia(
    'assets/pojisteni-hypoteky-icons/pojisteni-icon-destnik.svg',
    'pojisteni-icon-destnik',
  );
  const iconRodina = await ensureSvgFileMedia(
    'assets/pojisteni-hypoteky-icons/pojisteni-icon-rodina.svg',
    'pojisteni-icon-rodina',
  );
  const iconSnizeni = await ensureSvgFileMedia(
    'assets/pojisteni-hypoteky-icons/pojisteni-icon-snizeni-uroku.svg',
    'pojisteni-icon-snizeni-uroku',
  );

  return {
    blockType: 'benefitsBlock',
    columns: '3',
    items: [
      {
        icon: iconDestnik,
        title: 'Jedno pojištění pro 6\u00a0různých rizik',
        description: htmlToLexical(
          '<p>Pomůže při pracovní neschopnosti, ztrátě zaměstnání, ošetřování blízkých, hospitalizaci, invaliditě 2.\u00a0a\u00a03.\u00a0stupně i\u00a0úmrtí.</p>',
        ),
      },
      {
        icon: iconRodina,
        title: 'Postará se, když se staráte o\u00a0člena rodiny',
        description: htmlToLexical(
          '<p>Pojištění za vás uhradí splátky, když budete muset vy nebo váš partner zůstat doma s\u00a0nemocným příbuzným.</p>',
        ),
      },
      {
        icon: iconSnizeni,
        title: 'Sníží vám úrok na hypotéce',
        description: htmlToLexical(
          '<p>Roční úrokovou sazbu vám při sjednání pojištění snížíme o\u00a00,1\u00a0%. <a href="#">Reprezentativní příklad</a>.</p>',
        ),
      },
    ],
  };
}

function buildBenefitsListBlock(): Record<string, unknown> {
  return {
    blockType: 'benefitsWithListBlock',
    items: [
      { text: 'Během pracovní neschopnosti a\u00a0po ztrátě zaměstnání budete dostávat peníze z\u00a0pojištění až 12\u00a0měsíců.' },
      { text: 'Při ošetřování člena rodiny platí pojišťovna až 36\u00a0splátek hypotéky.' },
      { text: 'Poradí si s\u00a0nově diagnostikovanými bolestmi zad i\u00a0psychickými nemocemi.' },
      { text: 'Pomůže při ztrátě zaměstnání u\u00a0smluv na dobu určitou i\u00a0služebních poměrů.' },
    ],
  };
}

function buildInfoBlock(): Record<string, unknown> {
  return {
    blockType: 'richTextBlock',
    backgroundColor: 'lightGrey',
    title: 'Komu pojištění hypotéky pomůže a\u00a0kolik stojí',
    content: htmlToLexical(
      '<p>Pojistíme každého, kdo nás požádá o\u00a0hypotéku. Stačí, že:</p>' +
      '<ul>' +
      '<li>jste ve věku mezi 18 a\u00a065\u00a0lety</li>' +
      '<li>nejste invalidní (žádný stupeň invalidity)</li>' +
      '</ul>' +
      '<p>Pojistit se můžete, i\u00a0když jste právě kvůli nemoci v\u00a0pracovní neschopnosti. S\u00a0touto nemocí vám ale pojištění ještě nepomůže.</p>' +
      '<p><strong>Za pojištění uhradíte pravidelně 8,7\u00a0% z\u00a0předepsané splátky hypotéky.</strong></p>' +
      '<p>O\u00a0placení pojistného se starat nemusíte. Jednou měsíčně si ho z\u00a0vašeho účtu určeného ke splácení hypotéky strhneme sami, a\u00a0to vždy v\u00a0den splátky vaší hypotéky.</p>' +
      '<p><a href="#">Podmínky pojištění hypotéky</a></p>',
    ),
    linkLabel: 'Chci hypotéku s\u00a0pojištěním',
    linkUrl: '#',
  };
}

async function buildFeaturePracovniNeschopnost(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_900x550_fit_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2062-osa-pracovni-neschopnost-hypo-01-fe90b165-f378ff147cd712737bda88e5402e3263.png',
    'Pojištění — pracovní neschopnost',
    'pojisteni-pracovni-neschopnost.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Co pro vás pojištění udělá při pracovní neschopnosti',
    description: htmlToLexical(
      '<p>Pokud budete v\u00a0pracovní neschopnosti déle než 30\u00a0dnů, vyplatí vám pojišťovna splátky hypotéky navýšené o\u00a0poplatek za pojištění zpětně od začátku neschopnosti. Peníze tak dostanete už za první měsíc pracovní neschopnosti.</p>' +
      '<p>Pojištění pro případ pracovní neschopnosti platí hned od sjednání pojištění, jen u\u00a0rizikového těhotenství musí pojištění trvat alespoň 8\u00a0měsíců, aby pomohlo.</p>',
    ),
    image,
    imagePosition: 'left',
    backgroundColor: 'white',
  };
}

async function buildFeatureZtrataZamestnani(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_900x550_fit_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2063-osa-ztrata-zamestnani-hypo-02-30034a7f-f6d320d53b364748d0969ee10a6ffa23.png',
    'Pojištění — ztráta zaměstnání',
    'pojisteni-ztrata-zamestnani.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Při ztrátě zaměstnání nemusíte ztrácet hlavu',
    description: htmlToLexical(
      '<p>Při nedobrovolné ztrátě zaměstnání trvající déle než 30\u00a0dnů ode dne registrace na úřadu práce vám pojišťovna vyplatí splátky hypotéky navýšené o\u00a0poplatek za pojištění zpětně od začátku vaší nezaměstnanosti. I\u00a0v\u00a0tomto případě dostanete peníze už za první měsíc bez zaměstnání.</p>' +
      '<p>Na pomoc máte nárok, když ke ztrátě zaměstnání dojde nejdříve po 3\u00a0měsících od začátku pojištění.</p>',
    ),
    image,
    imagePosition: 'right',
    backgroundColor: 'lightGrey',
  };
}

async function buildFeatureOsetrovani(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_900x550_fit_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2064-osa-osetreni-rodiny-hypo-03-f886cded-0f988f6e69cc64b834e3898bb8de3279.png',
    'Pojištění — ošetřování člena rodiny',
    'pojisteni-osetrovani-rodiny.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Ošetřujete člena rodiny? Splátky ošetří pojistka',
    description: htmlToLexical(
      '<p>Při péči o\u00a0nemocného člena rodiny trvající déle než 30\u00a0dní, která bude potvrzena lékařem a\u00a0bude mít za následek pokles vašeho příjmu, za vás pojišťovna zaplatí až 36\u00a0splátek hypotéky navýšené o\u00a0úhradu za pojištění zpětně od počátku pojistné události.</p>' +
      '<p>Pojištění ošetřování člena rodiny z\u00a0důvodu nemoci pomůže nejdříve po 60\u00a0dnech od začátku pojištění. U\u00a0ošetřování z\u00a0důvodu úrazu pomáhá pojištění ihned.</p>',
    ),
    image,
    imagePosition: 'left',
    backgroundColor: 'white',
  };
}

async function buildFeatureHospitalizace(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_280_fill_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2452-o-nas-air-bank-on-green-web-new-1451f63f-779c1291ab86b375c818a2d84298be4b.png',
    'Balónek srdce',
    'pojisteni-balonek-srdce.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Když zůstanete v\u00a0nemocnici, nezůstanete nic dlužni',
    description: htmlToLexical(
      '<p>Pokud budete muset zůstat nějakou dobu v\u00a0nemocnici, pojišťovna vám vyplatí peníze ve výši jedné splátky, která je splatná v\u00a0době vaší hospitalizace. Pokud navíc kvůli hospitalizaci budete v\u00a0pracovní neschopnosti déle než 30\u00a0dní, pojišťovna za vás zaplatí tuto splátku ještě jednou.</p>',
    ),
    image,
    imagePosition: 'right',
    backgroundColor: 'lightGrey',
    layoutStyles: { variant: 'small-image' },
  };
}

function buildInvaliditaBlock(): Record<string, unknown> {
  return {
    blockType: 'richTextBlock',
    variant: 'compact',
    title: 'Invalidida 2.\u00a0a\u00a03.\u00a0stupně nebo vydání ZTP/P',
    content: htmlToLexical(
      '<p>V\u00a0případě přiznání invalidity 2.\u00a0nebo 3.\u00a0stupně Českou správou sociálního zabezpečení nebo vydání průkazu ZTP/P za vás pojišťovna hypotéku doplatí. Přesněji půjde o\u00a0částku, která zůstala nesplacená ke dni přiznání invalidity nebo vydání ZTP/P, a\u00a0to až do výše 30\u00a0000\u00a0000\u00a0Kč.</p>',
    ),
  };
}

function buildUmrtiBlock(): Record<string, unknown> {
  return {
    blockType: 'richTextBlock',
    backgroundColor: 'lightGrey',
    variant: 'compact',
    title: 'Úmrtí klienta',
    content: htmlToLexical(
      '<p>Není to příjemné téma, ale člověk nikdy neví. Každopádně při úmrtí pojišťovna jednorázově uhradí dlužnou část hypotéky, kterou jste do té doby nesplatili, a\u00a0to až do výše 30\u00a0000\u00a0000\u00a0Kč.</p>',
    ),
  };
}

function buildDownloadSectionBlock(): Record<string, unknown> {
  return {
    blockType: 'downloadSectionBlock',
    items: [
      {
        title: 'Noste své pojištění',
        description: 'v\u00a0aplikaci',
      },
    ],
  };
}

async function buildCtaCardsBlock(): Promise<Record<string, unknown>> {
  const iconKlient = await ensureSvgFileMedia(
    'assets/pojisteni-hypoteky-icons/pojisteni-cta-jsem-klient.svg',
    'pojisteni-cta-jsem-klient',
  );
  const iconNeklient = await ensureSvgFileMedia(
    'assets/pojisteni-hypoteky-icons/pojisteni-cta-nejsem-klient.svg',
    'pojisteni-cta-nejsem-klient',
  );
  const iconZavolejte = await ensureSvgFileMedia(
    'assets/pojisteni-hypoteky-icons/pojisteni-cta-zavolejte-mi.svg',
    'pojisteni-cta-zavolejte-mi',
  );

  return {
    blockType: 'ctaCardsBlock',
    title: 'Chcete hypotéku s\u00a0pojištěním?',
    description: textToLexical(
      'Beze všeho. Stačí si u\u00a0nás požádat o\u00a0hypotéku a\u00a0být ve věku mezi 18 a\u00a065\u00a0lety.',
    ),
    items: [
      {
        icon: iconKlient,
        title: 'Jsem klient Air Bank',
        description: 'Skvělé! Zažádejte si o\u00a0hypotéku teď hned ve svém internetovém bankovnictví.',
        linkLabel: 'Přihlásit se',
        linkUrl: '#',
      },
      {
        icon: iconNeklient,
        title: 'Nejsem klient Air Bank',
        description: 'Nevadí, účet si založíte na pár kliků a\u00a0hned poté si v\u00a0internetovém bankovnictví o\u00a0hypotéku zažádáte.',
        linkLabel: 'Založit účet',
        linkUrl: '#',
      },
      {
        icon: iconZavolejte,
        title: 'Zavoláme, poradíme',
        description: 'Nechte nám na sebe číslo a\u00a0my vám rádi s\u00a0hypotékou poradíme.',
        linkLabel: 'Zavolejte mi',
        linkUrl: '#',
      },
    ],
  };
}

function buildFaqBlock(): Record<string, unknown> {
  return {
    blockType: 'faqItemsBlock',
    title: 'Co vás nejvíc zajímá',
    numbered: false,
    allowMultiple: false,
    items: [
      {
        title: 'Hlášení pojistné události pojištění hypotéky a\u00a0výplata pojistného plnění',
        content: htmlToLexical(
          '<p>Pojistnou událost nahlásíte přes <a href="https://online.cardif.cz/" target="_blank">on-line portál pojišťovny</a>, který vás provede celou pojistnou událostí.</p>' +
          '<h4>Kdo může hlásit pojistnou událost?</h4>' +
          '<ul>' +
          '<li>vy, jakožto náš klient nebo vámi zmocněná osoba</li>' +
          '<li>v\u00a0případě úmrtí klienta mohou pojistnou událost nahlásit pozůstalí</li>' +
          '</ul>' +
          '<p>Někdy se může stát, že se o\u00a0pojistné události dozvíme přímo od pojišťovny, a\u00a0to pokud jste pojištěný i\u00a0jinde než u\u00a0nás a\u00a0pojistnou událost hlásíte přímo pojišťovně.</p>' +
          '<h4>Kdo a\u00a0kdy dostane pojistné plnění?</h4>' +
          '<p>Vyřešení a\u00a0následná výplata pojistného plnění trvá maximálně 9\u00a0pracovních dnů od nahlášení a\u00a0dodání všech potřebných dokumentů. Délku procesu ovlivňuje i\u00a0vaše součinnost při dokládání potřebných podkladů a\u00a0vaše aktivita v\u00a0následných šetřeních.</p>' +
          '<p><strong>Pokud máte na pojistné plnění nárok, vyplácí ho pojišťovna na vnitřní účet banky</strong>, ze kterého je převedeno buď na úvěrový účet, pokud jste zde v\u00a0prodlení, nebo na váš běžný účet, pokud máte všechny splátky hypotéky řádně uhrazené.</p>' +
          '<h4>DOKLADY POTŘEBNÉ K\u00a0ŠETŘENÍ POJISTNÉ UDÁLOSTI</h4>' +
          '<p>Před nahlášením pojistné události byste měli mít k\u00a0dispozici\u00a0sadu dokumentů, které pojišťovna potřebuje k\u00a0tomu, aby mohla událost vyřešit. Pokud máte v\u00a0ruce jen některé z\u00a0požadovaných dokumentů, nahlášení to nebrání a\u00a0pojišťovna si o\u00a0zbývající dokumenty řekne.</p>' +
          '<h4>Pracovní neschopnost a\u00a0hospitalizace:</h4>' +
          '<ul>' +
          '<li>formulář oznámení škodní události a\u00a0lékařský dotazník vyplněný ošetřujícím lékařem</li>' +
          '<li>potvrzení o\u00a0dočasné pracovní neschopnosti, případně jiné potvrzení od lékaře, pokud jste OSVČ</li>' +
          '<li>pokud došlo k\u00a0hospitalizaci, propouštěcí zpráva z\u00a0nemocnice (kopie s\u00a0čitelnou adresou lékaře)</li>' +
          '</ul>' +
          '<h4>Ztráta zaměstnání:</h4>' +
          '<ul>' +
          '<li>kopie ukončované pracovní smlouvy včetně všech podepsaných dodatků k\u00a0pracovní smlouvě</li>' +
          '<li>kopie dokladu o\u00a0rozvázání pracovního poměru (výpověď z\u00a0pracovního poměru, dohoda o\u00a0ukončení pracovního poměru z\u00a0organizačních důvodů)</li>' +
          '<li>kopie potvrzení, že jste veden v\u00a0evidenci úřadu práce jako uchazeč o\u00a0zaměstnání (toto potvrzení vystaví úřad práce na vaši žádost)</li>' +
          '</ul>' +
          '<h4>Ošetřování člena rodiny:</h4>' +
          '<ul>' +
          '<li>formulář oznámení škodní události a\u00a0lékařský dotazník vyplněný ošetřujícím lékařem</li>' +
          '<li>kopie rozhodnutí ošetřujícího lékaře ošetřovaného o\u00a0vzniku nebo trvání potřeby dlouhodobé péče</li>' +
          '<li>v\u00a0případě dlouhodobé péče kopie rozhodnutí krajské pobočky Úřadu práce ve věci žádosti o\u00a0příspěvek na péči</li>' +
          '<li>potvrzení zaměstnavatele o\u00a0čerpání pracovního volna nebo kopie zápočtového listu a\u00a0potvrzení zaměstnavatele o\u00a0skončení pracovního poměru z\u00a0důvodu ošetřování, nebo v\u00a0případě osoby doposud samostatně výdělečně činné doklad o\u00a0zrušení živnosti vydaný živnostenským úřadem</li>' +
          '<li>doklad prokazující vztah ošetřovatele k\u00a0ošetřovanému členu rodiny</li>' +
          '<li>souhlas ošetřovaného člena rodiny se zpracováním údajů o\u00a0jeho zdravotním stavu pro účely šetření pojistné události a\u00a0výplaty pojistného plnění</li>' +
          '</ul>' +
          '<h4>Invalidita 2.\u00a0nebo 3.\u00a0stupně / přiznání mimořádných výhod ZTP/P:</h4>' +
          '<ul>' +
          '<li>kopie „Posudku o\u00a0invaliditě" vydaného Okresní správou sociálního zabezpečení s\u00a0vyznačeným dnem vzniku invalidity III.\u00a0stupně</li>' +
          '</ul>' +
          '<h4>Úmrtí:</h4>' +
          '<ul>' +
          '<li>kopie úmrtního listu pojištěného</li>' +
          '<li>lékařem vyplněný „List o\u00a0prohlídce mrtvého" (kopie s\u00a0čitelnou adresou lékaře)</li>' +
          '<li>pokud byla provedena soudní pitva, pitevní zpráva (kopie s\u00a0čitelnou adresou lékaře)</li>' +
          '<li>jestli nějaká existuje, pak i\u00a0policejní zpráva</li>' +
          '</ul>' +
          '<p>Veškeré náklady na lékařské zprávy nebo další případná vyšetření, které si pojišťovna vyžádá, vám <strong>plně uhradí pojišťovna</strong>. Stačí jí jen odeslat doklady o\u00a0zaplacení.</p>',
        ),
      },
    ],
    linkLabel: 'Všechny otázky',
    linkUrl: '#',
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');

  if (doReset && !dryRun) {
    console.log('Resetting Pojištění hypotéky page...');
    const existing = await findPage(PAGE_SLUG);
    if (existing) {
      await deletePage(existing.id);
      console.log(`Deleted page ${existing.id}`);
    }
  }

  console.log('Building Pojištění hypotéky page blocks...');

  const blocks: Record<string, unknown>[] = [];

  console.log('\n1/13 Hero...');
  blocks.push(await buildHeroBlock());

  console.log('2/13 Benefits (3 columns)...');
  blocks.push(await buildBenefitsBlock());

  console.log('3/13 Benefits list (4 items)...');
  blocks.push(buildBenefitsListBlock());

  console.log('4/13 Info section (pricing & conditions)...');
  blocks.push(buildInfoBlock());

  console.log('5/13 Feature: Pracovní neschopnost...');
  blocks.push(await buildFeaturePracovniNeschopnost());

  console.log('6/13 Feature: Ztráta zaměstnání...');
  blocks.push(await buildFeatureZtrataZamestnani());

  console.log('7/13 Feature: Ošetřování člena rodiny...');
  blocks.push(await buildFeatureOsetrovani());

  console.log('8/13 Feature: Hospitalizace...');
  blocks.push(await buildFeatureHospitalizace());

  console.log('9/13 Invalidita...');
  blocks.push(buildInvaliditaBlock());

  console.log('10/13 Úmrtí klienta...');
  blocks.push(buildUmrtiBlock());

  console.log('11/13 Download section (My Air app)...');
  blocks.push(buildDownloadSectionBlock());

  console.log('12/13 CTA cards...');
  blocks.push(await buildCtaCardsBlock());

  console.log('13/13 FAQ...');
  blocks.push(buildFaqBlock());

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

  console.log(`View on FE:  http://localhost:3000/cs/produkty/pojisteni/pojisteni-hypoteky`);
  console.log('\nDone! Pojištění hypotéky page has been populated with 13 blocks.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
