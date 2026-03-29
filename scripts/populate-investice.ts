#!/usr/bin/env npx tsx
/**
 * Populate CMS with "Investice a spoření" page content.
 * Replicates https://www.airbank.cz/produkty/investice-a-sporeni/
 *
 * Usage:
 *   npx tsx scripts/populate-investice.ts           # create/update page
 *   npx tsx scripts/populate-investice.ts --reset    # delete and re-create
 *   npx tsx scripts/populate-investice.ts --dry-run  # print JSON only
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

const PAGE_SLUG = 'produkty/investice-a-sporeni';
const PAGE_TITLE = 'Investice a spoření | Air Bank';

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
  const svgContent = readFileSync(absPath, 'utf-8');
  const localPath = saveSvg(svgContent, `${name}.svg`);
  const id = await uploadMedia(localPath, name);
  mediaCache[key] = id;
  return id;
}

// ─── Block builders ──────────────────────────────────────────────────────────

async function buildHeroBlock(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_648x452_fit/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2434-investice-on-green-web-new-2c62dc18-4edbfb191340f1a8b983c6d3cd519b43.png',
    'Investice a spoření - ilustrace',
    'investice-hero.png',
  );

  return {
    blockType: 'heroPlainBlock',
    backgroundColor: 'green',
    textAlign: 'left',
    title: 'Investování jednodušší, než jste čekali',
    description: htmlToLexical(
      '<p>Ať chcete chytře zhodnotit své úspory v\u00a0delším období, nebo spoříte na krátkodobé cíle, máme pro vás řešení.</p>',
    ),
    image,
    links: [
      { label: 'Možnosti investování', url: '#investice', appearance: 'primary' },
      { label: 'Možnosti spoření', url: '#sporeni', appearance: 'outline' },
    ],
  };
}

async function buildBenefitsBlock(): Promise<Record<string, unknown>> {
  const icons = [
    { file: 'assets/investice-icons/feature-invest-100kc.svg', name: 'invest-feature-100kc' },
    { file: 'assets/investice-icons/feature-wide-selection.svg', name: 'invest-feature-selection' },
    { file: 'assets/investice-icons/feature-simple-setup.svg', name: 'invest-feature-setup' },
  ];

  const titles = [
    'Investujte už od 100 Kč měsíčně',
    'Široký výběr investic na různě dlouhou dobu',
    'Jednoduché založení a\u00a0správa v\u00a0aplikaci nebo internetovém bankovnictví',
  ];

  const items = [];
  for (let i = 0; i < icons.length; i++) {
    const iconId = await ensureSvgFileMedia(icons[i]!.file, icons[i]!.name);
    items.push({ icon: iconId, title: titles[i] });
  }

  return {
    blockType: 'benefitsBlock',
    columns: '3',
    items,
  };
}

async function buildInvestmentProductsBlock(): Promise<Record<string, unknown>> {
  const products = [
    {
      iconFile: 'assets/investice-icons/product-portu.svg',
      iconName: 'invest-portu',
      name: 'Portu investice na míru',
      subtitle: 'Sledujte, jak peníze pracují za vás',
      description:
        '<p>Portu vám navrhne <strong>portfolio na míru</strong> a\u00a0na vás je, kolik a\u00a0jak často budete vkládat. Portu peníze <strong>zainvestuje za vás</strong>. <strong>Vhodné i\u00a0na důchod jako DIP</strong>.</p>',
      features: [
        '10 portfolií s různým výnosem a rizikem',
        'Doporučeno na 3 roky a více',
        'Investice už od 500 Kč',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
    {
      iconFile: 'assets/investice-icons/product-zonky.svg',
      iconName: 'invest-zonky',
      name: 'Zonky Rentiér',
      subtitle: 'Půjčujte lidem za úrok jako banka',
      description:
        '<p>Investujete do stovek námi <strong>pečlivě schválených</strong> a\u00a0převážně <strong>málo rizikových půjček</strong>.</p>',
      features: [
        'Stabilní výnos s nízkým rizikem',
        'Doporučeno na 1 rok a více',
        'Investice od 10 000 Kč',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
    {
      iconFile: 'assets/investice-icons/product-akcie.svg',
      iconName: 'invest-akcie',
      name: 'Investování do akcií',
      subtitle: 'Investujte do firem, kterým fandíte',
      description:
        '<p><strong>Akcie světově známých firem</strong> i\u00a0oblíbené ETF u\u00a0nás <strong>nakoupíte</strong> i\u00a0<strong>prodáte</strong> přímo v\u00a0aplikaci My Air.</p>',
      features: [
        'Možný vyšší výnos za vyššího rizika',
        'Doporučeno na 8 let a více',
        'Investice od 1 000 Kč',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
    {
      iconFile: 'assets/investice-icons/product-podilove-fondy.svg',
      iconName: 'invest-podilove-fondy',
      name: 'Podílové fondy',
      subtitle: 'Investujte do fondů spravovaných odborníky',
      description:
        '<p>Nakupujte podílové <strong>fondy ve správě profesionálů</strong>. Investice pro opatrnější i\u00a0odvážnější investory.</p>',
      features: [
        '8 fondů s různým rizikem a výnosem',
        'Doporučeno na 1 rok a více',
        'Investice už od 100 Kč',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
    {
      iconFile: 'assets/investice-icons/product-penzijni-sporeni.svg',
      iconName: 'invest-penzijni-sporeni',
      name: 'Doplňkové penzijní spoření',
      subtitle: 'Odkládejte si na penzi se státním příspěvkem',
      description:
        '<p>Začněte si spořit co nejdříve, ať se v\u00a0<strong>důchodu nemusíte omezovat</strong>. Možný příspěvek od státu i\u00a0zaměstnavatele.</p>',
      features: [
        '3 strategie spoření s různým výnosem a rizikem',
        'Peníze si vyberete nejdříve v 60 letech a po 10 letech spoření',
        'Investice od 500 Kč',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
    {
      iconFile: 'assets/investice-icons/product-investice-airbank.svg',
      iconName: 'invest-airbank',
      name: 'Investice do Air Bank',
      subtitle: 'Investujte do banky, kterou máte rádi',
      description:
        '<p>Investujte úspory do <strong>Air Bank</strong> a\u00a0<strong>těšte se z\u00a0pravidelného výdělku</strong>. Je to snadné.</p>',
      features: [
        'Pravidelný výnos s pevným úrokem',
        'Doporučeno aspoň na 2 roky',
        'Investovat můžete od 100 000 Kč',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
    {
      iconFile: 'assets/investice-icons/product-dluhopisy.svg',
      iconName: 'invest-dluhopisy',
      name: 'Dluhopisy',
      subtitle: 'Užijte si dluhopisy s pevným výnosem',
      description:
        '<p>Investujte do dluhopisů stabilních a\u00a0úspěšných firem nejen ze skupiny PPF.</p>',
      features: [
        'Výnos podle zvoleného dluhopisu',
        'Investice na 1 rok a déle',
        'Investujte již od 10 000 CZK',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
  ];

  const items = [];
  for (const p of products) {
    const iconId = await ensureSvgFileMedia(p.iconFile, p.iconName);
    items.push({
      icon: iconId,
      name: p.name,
      subtitle: p.subtitle,
      description: htmlToLexical(p.description),
      features: p.features.map((text) => ({ text })),
      linkLabel: p.linkLabel,
      linkUrl: p.linkUrl,
    });
  }

  return {
    blockType: 'productDetailCardsBlock',
    title: 'Vyberte si investici, která vám sedne',
    columns: '3',
    layoutStyles: { anchorId: 'investice' },
    items,
  };
}

async function buildSavingsProductsBlock(): Promise<Record<string, unknown>> {
  const products = [
    {
      iconFile: 'assets/investice-icons/savings-terminovany-vklad.svg',
      iconName: 'savings-terminovany-vklad',
      name: 'Termínovaný vklad',
      subtitle: 'Nechte své peníze růst s ročním úrokem až 3 %',
      description:
        '<p>Zajistěte si <strong>pevný úrok</strong> na delší dobu a\u00a0nedělejte si hlavu ze <strong>změn úrokových sazeb</strong>.</p>',
      features: [
        'Vklad bude pojištěný jako spořicí účet',
        'Na 3 až 12 měsíců',
        'Pro vklady od 30 000 Kč',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
    {
      iconFile: 'assets/investice-icons/savings-sporici-ucet.svg',
      iconName: 'savings-sporici-ucet',
      name: 'Spořicí účet',
      subtitle: 'Spořte jednoduše s bonusovou úrokovou sazbou 2,6 % ročně',
      description:
        '<p>Peníze na své sny si <strong>přetáhnete snadno prstem</strong>, a\u00a0mohou vám tak přibývat mnohem rychleji.</p>',
      features: [
        'Vklady pojištěné až do 100 000 eur',
        'Peníze kdykoliv po ruce',
        'Jednotná sazba až do 500 000 Kč',
      ],
      linkLabel: 'Zjistit více',
      linkUrl: '#',
    },
  ];

  const items = [];
  for (const p of products) {
    const iconId = await ensureSvgFileMedia(p.iconFile, p.iconName);
    items.push({
      icon: iconId,
      name: p.name,
      subtitle: p.subtitle,
      description: htmlToLexical(p.description),
      features: p.features.map((text) => ({ text })),
      linkLabel: p.linkLabel,
      linkUrl: p.linkUrl,
    });
  }

  return {
    blockType: 'productDetailCardsBlock',
    title: 'Bezpečně zhodnocujte peníze na své krátkodobé cíle',
    backgroundColor: 'white',
    columns: '2',
    layoutStyles: { anchorId: 'sporeni' },
    items,
  };
}

async function buildAppCtaBlock(): Promise<Record<string, unknown>> {
  const image = await ensureMedia(
    'https://cdn.siteone.io/img.siteone.cz/rs_900x400_fit_auto/https%3A%2F%2Fwww.airbank.cz%2Fdata%2Fml%2F2405-investicni-pomocnik-01-086f65fa-032cac3b944939a6f6bd4cd9d8b85826.png',
    'Investiční pomocník v aplikaci',
    'investice-app-helper.png',
  );

  return {
    blockType: 'featureBlock',
    title: 'Váháte, jakou investici vybrat?',
    description: textToLexical(
      'Investiční pomocník v\u00a0naší aplikaci vám rozhodování ulehčí.',
    ),
    image,
    imagePosition: 'right',
    backgroundColor: 'green',
    links: [
      { label: 'Přejít do aplikace', url: '#', appearance: 'primary' },
    ],
  };
}

async function buildContactCtaBlock(): Promise<Record<string, unknown>> {
  const ctaItems = [
    {
      iconFile: 'assets/investice-icons/cta-phone.svg',
      iconName: 'invest-cta-phone',
      title: 'Ozveme se vám telefonicky',
      description:
        'Nechte nám své číslo a\u00a0naši investiční specialisté vám zavolají zpět.',
      linkLabel: 'Zavolejte mi',
      linkUrl: '#',
    },
    {
      iconFile: 'assets/investice-icons/cta-specialist.svg',
      iconName: 'invest-cta-specialist',
      title: 'Spojte se s\u00a0našimi investičními specialisty',
      description:
        'Dovoláte se nám od pondělí do pátku, a\u00a0to od 9.00 do 17.00 na čísle 547 134 165.',
      linkLabel: '+420 547 134 165',
      linkUrl: 'tel:+420547134165',
    },
    {
      iconFile: 'assets/investice-icons/cta-pobocka.svg',
      iconName: 'invest-cta-pobocka',
      title: 'Zastavte se u nás',
      description:
        'Investice s\u00a0vámi rádi probereme a\u00a0se založením vám pomůžeme i\u00a0osobně na pobočce.',
      linkLabel: 'Najít nejbližší',
      linkUrl: '/mapa-pobocek-a-bankomatu/',
    },
  ];

  const items = [];
  for (const item of ctaItems) {
    const iconId = await ensureSvgFileMedia(item.iconFile, item.iconName);
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
    title: 'Potřebujete pomoci s\u00a0investováním?',
    description: textToLexical(
      'Nejste si jistí, jakou investiční službu vybrat, nebo potřebujete pomoci se založením investice? Rádi to s\u00a0vámi probereme.',
    ),
    items,
  };
}

async function buildFaqBlock(): Promise<Record<string, unknown>> {
  return {
    blockType: 'faqItemsBlock',
    title: 'Co vás nejvíce zajímá',
    backgroundColor: 'lightGrey',
    numbered: false,
    allowMultiple: false,
    items: [
      {
        title: 'Co je to Portu a\u00a0jak funguje',
        content: htmlToLexical(
          '<p>Zaměřuje se na <strong>pasivní investování</strong>, při kterém místo jednotlivých akcií hromadně nakupujete větší množství akcií nebo jiných cenných papírů z\u00a0určité části trhu nebo nějakého odvětví. Portu k\u00a0tomu využívá zejména <strong>fondy ETF</strong>, což jsou fondy, se kterými se normálně obchoduje na burze a\u00a0akcie se do nich vybírají nejčastěji podle takzvaných indexů, které sledují, jak se které části trhu daří. Mezi nejznámější indexy patří například index největších amerických společností <strong>S&amp;P 500</strong> nebo <strong>NASDAQ 100</strong> s\u00a0úspěšnými technologickými firmami. Jiné ETF sledují zase třeba dluhopisy nebo komodity. Přes jeden ETF tak můžete investovat do stovek až tisíců firem současně, čímž <strong>rozkládáte riziko</strong>.</p>' +
          '<p>Podle informací, které vyplníte v\u00a0úvodním investičním dotazníku, vám Portu z\u00a0těchto ETF <strong>zdarma sestaví portfolio na míru</strong>. O\u00a0další nákupy a\u00a0prodeje se už automaticky postará Portu. Proto je pro vás pasivní investování obvykle <strong>levnější než klasická správa portfolia</strong> přes makléře. U\u00a0Portu za využívání služby <strong>zaplatíte jen 0,4\u00a0–\u00a01\u00a0% ročně</strong> z\u00a0hodnoty portfolia, a\u00a0když si investici zafixujete na delší dobu, může to být až o\u00a040\u00a0% méně. Další výhoda pasivního investování je, že pokud se rozhodnete investovat pravidelně, stačí si jen nastavit trvalý příkaz a\u00a0dál nemusíte nic řešit.</p>' +
          '<p>K\u00a0investicím s\u00a0Portu se dostanete jednoduše přes <strong>internetové bankovnictví</strong>. Stačí kliknout na <strong>Investice a\u00a0spoření / Portu investice na míru</strong>.</p>',
        ),
      },
      {
        title: 'Co je to ETF',
        content: htmlToLexical(
          '<p><strong>ETF</strong>, což je zkratka z\u00a0anglického Exchange Traded Fund, <strong>je investiční fond obchodovaný na burze</strong>. Ten v\u00a0jednom kroku umožňuje investorům nakupovat akcie, dluhopisy, komodity nebo jejich kombinace z\u00a0určité oblasti trhu, jako je sektor IT, zdravotnictví, nebo z\u00a0regionu. Investice do široké škály nástrojů a\u00a0firem jim umožňuje snížit rizikovost investice a\u00a0má i\u00a0další výhody.</p>' +
          '<p>ETF může kopírovat například výkonnost indexu. Typickým příkladem jsou <strong>ETF sledující index S&amp;P 500</strong>, který zahrnuje 500 největších veřejně obchodovaných společností v\u00a0USA jako jsou Apple, Google, Microsoft, Nvidia, Meta nebo třeba Amazon. Samotné kopírování indexu nebo určitého sektoru trhu může provádět algoritmus, což snižuje náklady na správu.</p>' +
          '<p>Nákupem takového ETF v\u00a0podstatě investujete do všech těchto 500 společností najednou, aniž byste museli kupovat jednotlivé akcie.</p>' +
          '<h4>Proč investovat do ETF</h4>' +
          '<ol><li><strong>Rozložení rizika:</strong> S\u00a0ETF můžete jednoduše diverzifikovat portfolio a\u00a0snížit tak rizikovost investice. Místo toho, abyste museli kupovat jednotlivé akcie nebo dluhopisy, může si koupit ETF, které vlastní širokou škálu aktiv.</li>' +
          '<li><strong>Úspora času:</strong> ETF jsou ideální pro pasivní a\u00a0dlouhodobé investování. Hodí se, když se nechcete zabývat výběrem jednotlivých akcií nebo dluhopisů.</li>' +
          '<li><strong>Nízké náklady:</strong> Náklady spojené s\u00a0ETF jsou často nižší než u\u00a0tradičních podílových fondů. ETF obvykle sledují předem stanovený index a\u00a0nevyžadují tak aktivní správu portfolio manažerem.</li>' +
          '<li><strong>Transparentnost:</strong> ETF jsou navázané na určitý index, sektor, komoditu nebo jiné podkladové aktivum. Díky tomu mají investoři přesnou představu o\u00a0tom, jaké konkrétní tituly jejich ETF obsahuje.</li></ol>' +
          '<h4>Jak koupit ETF s\u00a0Air Bank</h4>' +
          '<p><strong>Pokud chcete investovat sami</strong>, můžete si ETF koupit napřímo přes službu Investování do akcií v\u00a0mobilní aplikaci My Air.</p>' +
          '<p><strong>Jestli se raději chcete poradit</strong>, můžete si portfolio složené z\u00a0ETF nechat zdarma vytvořit digitální investiční platformou Portu. Ta vám na základě vyplněného investičního dotazníku pomocí chytrých algoritmů složí portfolio na míru. Portu si snadno založíte v\u00a0mobilní aplikaci My Air nebo ve svém internetovém bankovnictví.</p>',
        ),
      },
      {
        title: 'Co je a\u00a0jak funguje dlouhodobý investiční produkt neboli DIP',
        content: htmlToLexical(
          '<p><strong>Dlouhodobý investiční produkt neboli DIP je nová forma investování a\u00a0zajištění na důchod se státní podporou</strong>, kterou si v\u00a0Česku můžete sjednat od 1.\u00a01.\u00a02024.</p>' +
          '<p><strong>DIP však není označení pro konkrétní produkt, ale spíše pro daňové zvýhodnění dlouhodobého investování do státem určeného okruhu investičních nástrojů.</strong> Stává se tak součástí III.\u00a0pilíře českého penzijního systému, kam patří i\u00a0doplňkové penzijní spoření neboli DPS, penzijní připojištění neboli PP a\u00a0investiční životní pojištění neboli IŽP.</p>' +
          '<p>Cílem DIP je shromažďovat vaše příspěvky i\u00a0příspěvky vašeho zaměstnavatele a\u00a0dlouhodobě je zhodnocovat až do doby, kdy se rozhodnete je ve stáří vybrat. DIP si můžete představit jako investiční „schránku", kam můžete vložit peníze do státem definovaných produktů a\u00a0volně je mezi nimi přesouvat, pokud máte všechny pod jedním poskytovatelem. Můžete mít také vícero DIPů od různých poskytovatelů.</p>' +
          '<p>Přes Air Bank si dlouhodobý investiční produkt sjednáte na investiční platformě Portu. V\u00a0režimu DIP můžete s\u00a0Portu investovat do portfolií složených na míru, z\u00a0ETF, dluhopisů a\u00a0akcií. Můžete si také sestavit portfolio podle sebe nebo peníze nechat krátkodobě úročit na investiční rezervě, než je investujete do vybraných portfolií. V\u00a0průběhu investování můžete peníze v\u00a0rámci „schránky" DIP přesouvat mezi jednotlivými investicemi, investiční rezervou nebo třeba peněženkou.</p>' +
          '<h4>Hlavní výhody DIP:</h4>' +
          '<ul><li><strong>Daňová úspora: Každý rok si můžete odečíst investici do DIP až do hodnoty 48\u00a0000 korun ze základu daně.</strong> Můžete tak získat slevu na dani až 7\u00a0200 korun za rok, nebo až 11\u00a0040 korun, pokud daníte 23% daní.</li></ul>' +
          '<p>Myslete prosím na to, že odpočet je souhrnný za všechny prostředky poslané v\u00a0daném roce na všechny typy spoření na stáří s\u00a0daňovou podporou (PP, DPS, DIP) a\u00a0daňově podporované pojištění dlouhodobé péče.</p>' +
          '<p>V\u00a0penzijním připojištění a\u00a0doplňkovém penzijním spoření si můžete ze základu daně odečíst příspěvky přesahující částku spojenou s\u00a0výplatou státního příspěvku. To jsou příspěvky nad 20\u00a0400 korun ročně, u\u00a0starobních důchodců se jedná o\u00a0jakékoliv nenulové příspěvky.</p>' +
          '<p><strong>Příklad:</strong> Pokud si na dani za rok odečítáte například 12\u00a0000 korun z\u00a0vkladů do DPS, což odpovídá měsíčnímu příspěvku 2\u00a0700 korun, pak si z\u00a0titulu DIP můžete odečíst maximálně 36\u00a0000 korun.</p>' +
          '<ul><li><strong>Přispívat na DIP vám může zaměstnavatel</strong>, který z\u00a0příspěvku do výše 50\u00a0000 korun ročně nemusí platit odvody. Ani vy tento příspěvek zaměstnavatele nedaníte.</li>' +
          '<li><strong>Investovat můžete úplně podle svého:</strong> vklady můžete posílat v\u00a0jakékoliv výši a\u00a0kdykoliv se vám to bude hodit. A\u00a0to třeba menší částku každý měsíc nebo větší částku před koncem roku, o\u00a0kterou si snížíte základ daně.</li></ul>' +
          '<p>Portu vám navrhne investiční portfolio a\u00a0když budete chtít, můžete si ho nastavit zcela sami, jak vám to vyhovuje podle vaší investiční strategie — dynamicky nebo konzervativně. V\u00a0průběhu investování <strong>můžete rozložení své investice libovolně obměňovat</strong>.</p>' +
          '<h4>Pravidlo 120/60: Kdy můžete vybrat svou investici z\u00a0DIP</h4>' +
          '<p>Stejně jako u\u00a0DPS, i\u00a0u\u00a0DIP platí takzvané pravidlo 120/60. Abyste mohli své prostředky z\u00a0DIP vybrat a\u00a0nepřišli přitom o\u00a0daňovou výhodu, musíte splnit dvě podmínky současně:</p>' +
          '<ul><li><strong>Dosažení věku 60 let</strong> – Výběr je možný nejdříve k\u00a01.\u00a0lednu roku, kdy dosáhnete 60 let.</li>' +
          '<li><strong>Doba investování minimálně 10 let</strong> – To znamená, že musíte mít investici v\u00a0DIP minimálně 120 měsíců.</li></ul>' +
          '<p>V\u00a0případě splnění obou podmínek si můžete vybrat prostředky z\u00a0DIP, a\u00a0to všechny najednou nebo můžete dál pokračovat v\u00a0investování a\u00a0prostředky si vybírat postupně podle potřeby.</p>' +
          '<p>Pokud byste chtěli vybrat jakoukoliv částku z\u00a0<strong>DIP před splněním obou podmínek, musíte daňovou úlevu dodanit zpětně až za 10 let</strong>. To platí i\u00a0v\u00a0případě, že vyberete třeba jen jedinou korunu. Pečlivě tedy zvažte své plány, ať využijete všechny výhody, které vám DIP nabízí.</p>' +
          '<p>V\u00a0případě investování do DIP s\u00a0Portu, platíte za využívání portfolií zvýhodněný poplatek 0,5\u00a0% ročně, což je méně než standardní poplatek ve výši 1\u00a0% ročně. V\u00a0případě předčasného výběru před splněním pravidla 120/60, budete muset doplatit zpětně slevu na poplatku.</p>',
        ),
      },
      {
        title: 'Jaký je rozdíl mezi DPS a\u00a0DIP',
        content: htmlToLexical(
          '<p>Hledáte ten správný způsob, jak se zajistit na stáří, a\u00a0zvažujete, zda je pro vás vhodnější dlouhodobý investiční produkt, doplňkové penzijní spoření nebo penzijní připojištění? Každý z\u00a0nich má své výhody a\u00a0limity. V\u00a0našem srovnání se podíváme na klíčové rozdíly – abyste se mohli správně rozhodnout.</p>' +
          '<table>' +
          '<tr><td> </td><th><h5>Penzijní připojištění</h5></th><th><h5>Doplňkové penzijní spoření</h5></th><th><h5>Dlouhodobý investiční produkt</h5></th></tr>' +
          '<tr><td><strong>Je možné ho sjednat?</strong></td><td>Ne od roku 2013.</td><td>Ano, od roku 2013.</td><td>Ano, od roku 2024.</td></tr>' +
          '<tr><td><strong>Možné zhodnocení</strong></td><td>Nízké – jeden konzervativní fond.</td><td>Nízké až vyšší dle vybraného fondu.</td><td>Nízké až vyšší podle zvolené kombinace investic.</td></tr>' +
          '<tr><td><strong>Možné riziko</strong></td><td>Bez rizika, nelze jít do mínusu.</td><td>Dle vybraného fondu.</td><td>Dle zvolené kombinace investic.</td></tr>' +
          '<tr><td><strong>Státní příspěvek</strong></td><td>Až 340 Kč měsíčně.</td><td>Až 340 Kč měsíčně.</td><td>Bez příspěvku</td></tr>' +
          '<tr><td><strong>Odpočet z\u00a0daní</strong></td><td>Ano, od 1700 Kč měsíčně.</td><td>Ano, nad 1700 Kč měsíčně.</td><td>Ano, již od příspěvku 1 Kč.</td></tr>' +
          '<tr><td><strong>Příspěvek zaměstnavatele</strong></td><td>Ano, až 50\u00a0000 Kč ročně.</td><td>Ano, až 50\u00a0000 Kč ročně.</td><td>Ano, až 50\u00a0000 Kč ročně.</td></tr>' +
          '<tr><td><strong>Možnost výběru, do čeho investovat</strong></td><td>Žádná – jediný transformovaný fond, zákon reguluje, do čeho investuje.</td><td>Výběr ze zákonem regulovaných fondů, obvykle 3-4 fondy.</td><td>Poskytovatel určí, do čeho může klient investovat. U\u00a0Portu do portfolií / strategií (složených z\u00a0ETF), investiční rezervy, peněženky.</td></tr>' +
          '<tr><td><strong>Možnost změny strategie</strong></td><td>Žádná</td><td>Jednou za rok lze přejít mezi fondy, bez poplatku.</td><td>Kdykoliv a\u00a0bez poplatku.</td></tr>' +
          '<tr><td><strong>Další výhody</strong></td><td> </td><td>Možnost určené osoby, obchází dědické řízení, předdůchod lze.</td><td>DIP je předmětem dědického řízení, předdůchod nelze.</td></tr>' +
          '</table>',
        ),
      },
      {
        title: 'Co to je Investice do Air Bank a\u00a0kolik stojí',
        content: htmlToLexical(
          '<p>Prostě do nás, respektive do námi vydaného investičního certifikátu, na nějakou předem určenou dobu <strong>investujete peníze</strong> a\u00a0my vám z\u00a0nich budeme každý měsíc na váš běžný nebo spořicí účet <strong>posílat úrok</strong>. Až doba investice vyprší, všechny investované peníze vám zase vrátíme. Výhoda Investice do Air Bank je, že výši úroku máte pevnou, a\u00a0vyhnete se tak kolísání sazeb na spořicím účtu. Je ale dobré vědět, že <strong>investované peníze nejde vybrat předčasně ani s\u00a0nimi nijak nakládat</strong>. Proto investujte jen tolik, kolik můžete těch pár let bezpečně postrádat.</p>' +
          '<p>Investice do Air Bank je pro vás možnost, jak si pěkně zhodnotit peníze a\u00a0zároveň tím pomáhat bance, kterou máte rádi. Nám zase pomáhá naplnit požadavky zákona na takzvané způsobilé závazky, tedy zjednodušeně řečeno na to, abychom měli dost peněz v\u00a0rezervě.</p>' +
          '<h4>Poplatky u\u00a0Investic do Air Bank</h4>' +
          '<p>Jsme rádi, že do toho jdete s\u00a0námi, takže za Investici do Air Bank po vás nebudeme chtít ani korunu.</p>',
        ),
      },
    ],
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');

  if (doReset && !dryRun) {
    console.log('Resetting Investice a spoření page...');
    const existing = await findPage(PAGE_SLUG);
    if (existing) {
      await deletePage(existing.id);
      console.log(`Deleted page ${existing.id}`);
    }
  }

  console.log('Building Investice a spoření blocks...');

  const blocks: Record<string, unknown>[] = [];

  console.log('\n1/7 Hero...');
  blocks.push(await buildHeroBlock());

  console.log('2/7 Benefits (3 feature karty)...');
  blocks.push(await buildBenefitsBlock());

  console.log('3/7 Investment products (7 karet)...');
  blocks.push(await buildInvestmentProductsBlock());

  console.log('4/7 Savings products (2 karty)...');
  blocks.push(await buildSavingsProductsBlock());

  console.log('5/7 App CTA (featureBlock)...');
  blocks.push(await buildAppCtaBlock());

  console.log('6/7 Contact CTA (ctaCardsBlock)...');
  blocks.push(await buildContactCtaBlock());

  console.log('7/7 FAQ...');
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

  console.log(`View on FE:  http://localhost:3000/cs/produkty/investice-a-sporeni`);
  console.log('\nDone! Investice a spoření page has been populated with 7 blocks.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
