#!/usr/bin/env npx tsx
/**
 * Populate CMS with "Hypotéka" product page replicating airbank.cz/produkty/hypoteka/
 *
 * Usage:
 *   npx tsx scripts/populate-hypoteka.ts           # create/update page
 *   npx tsx scripts/populate-hypoteka.ts --reset    # delete page and re-create
 *   npx tsx scripts/populate-hypoteka.ts --dry-run  # print JSON only
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
import {
  htmlToLexical,
  textToLexical,
  wrapRoot,
  paragraphNode,
  textNode,
  headingNode,
  listNode,
  listItemNode,
  linkNode,
  uploadNode,
} from './lib/lexical.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PAGE_SLUG = 'produkty/hypoteka';
const PAGE_TITLE = 'Hypotéka s chytrou rezervou | Air Bank';

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
  const image = await uploadMedia(
    resolve(__dirname, 'assets/hypoteka-hero.png'),
    'Hypotéka - klíč od domu',
  );

  return {
    blockType: 'heroPlainBlock',
    backgroundColor: 'green',
    textAlign: 'left',
    title: 'Spočítejte si, jak je naše hypotéka výhodná',
    description: htmlToLexical(
      '<p>Využijte na to naši hypoteční kalkulačku. A\u00a0hypotéku si pak z\u00a0klidu domova zařiďte.</p>',
    ),
    image,
    links: [
      { label: 'Výhody hypotéky u nás', url: '#vyhody', appearance: 'primary' },
    ],
  };
}

async function buildMortgageCalculatorBlock(): Promise<Record<string, unknown>> {
  const dosPersonImage = await uploadMedia(
    resolve(__dirname, 'assets/hypoteka-icons/calc-person.png'),
    'Hypoteční poradce — kalkulačka',
  );

  return {
    blockType: 'mortgageCalculatorBlock',
    layoutStyles: {
      anchorId: 'kalkulacka',
    },
    title: 'Hypoteční kalkulačka',
    minAmount: 500000,
    maxAmount: 30000000,
    defaultAmount: 3000000,
    minYears: 1,
    maxYears: 30,
    defaultYears: 20,
    interestRate: 4.39,
    description: 'Tento výpočet je orientační a\u00a0slouží jen pro vaši představu.',
    dosPersonImage,
  };
}


async function buildBenefitsBlock(): Promise<Record<string, unknown>> {
  const icons = [
    { file: 'assets/hypoteka-icons/benefit-z-domova.svg', name: 'hypoteka-benefit-z-domova' },
    { file: 'assets/hypoteka-icons/benefit-prizpusobi.svg', name: 'hypoteka-benefit-prizpusobi' },
    { file: 'assets/hypoteka-icons/benefit-penize-navic.svg', name: 'hypoteka-benefit-penize-navic' },
    { file: 'assets/hypoteka-icons/benefit-setreni.svg', name: 'hypoteka-benefit-setreni' },
  ];

  const data = [
    {
      title: 'Hypotéku vyřídíte jednoduše z\u00a0domova',
      description: htmlToLexical('<p><a href="#">O\u00a0hypotéku požádáte</a> pohodlně v\u00a0internetovém bankovnictví nebo jednoduše v\u00a0<a href="#">mobilní aplikaci</a>. Následně vám se vším pomůže náš hypoteční expert.</p>'),
    },
    {
      title: 'Dokonale se vám přizpůsobí',
      description: htmlToLexical('<p>Naši hypotéku můžete částečně nebo předčasně splatit, a\u00a0to zdarma. Výši i\u00a0termín splátek si nastavíte podle sebe. Navíc díky odkládání peněz do <a href="#">Chytré rezervy</a> můžete zaplatit méně na úrocích.</p>'),
    },
    {
      title: 'Půjčte si peníze navíc',
      description: htmlToLexical('<p>K\u00a0hypotéce si můžete vzít bez dokládání navíc až 1,5\u00a0milionu Kč, pokud peníze využijete na bydlení.</p>'),
    },
    {
      title: 'Šetříme vaši peněženku',
      description: htmlToLexical('<p>Neplatíte sjednání hypotéky ani její čerpání. A\u00a0ocenění nemovitosti mají naši klienti ve většině případů zdarma.</p>'),
    },
  ];

  const items = [];
  for (let i = 0; i < icons.length; i++) {
    const iconId = await ensureSvgFileMedia(icons[i]!.file, icons[i]!.name);
    items.push({
      icon: iconId,
      title: data[i]!.title,
      description: data[i]!.description,
    });
  }

  return {
    blockType: 'benefitsBlock',
    columns: '4',
    layoutStyles: { anchorId: 'vyhody' },
    items,
  };
}

async function buildBenefitsWithListBlock(): Promise<Record<string, unknown>> {
  const icons = [
    { file: 'assets/hypoteka-icons/list-koupe.svg', name: 'hypoteka-list-koupe' },
    { file: 'assets/hypoteka-icons/list-rekonstrukce.svg', name: 'hypoteka-list-rekonstrukce' },
    { file: 'assets/hypoteka-icons/list-stavba.svg', name: 'hypoteka-list-stavba' },
    { file: 'assets/hypoteka-icons/list-druzstevni-byt.svg', name: 'hypoteka-list-druzstevni-byt' },
    { file: 'assets/hypoteka-icons/list-vyporadani.svg', name: 'hypoteka-list-vyporadani' },
  ];

  const data = [
    {
      title: 'Koupě bytu, domu, nebo rekreační nemovitosti',
      text: 'Koupit můžete starší i\u00a0novou nemovitost, nebo připravený projekt. U\u00a0nás, ale i\u00a0v\u00a0zahraničí.',
    },
    {
      title: 'Rekonstrukce',
      text: 'Naše hypotéka vám pomůže i\u00a0s\u00a0jakoukoliv opravou bytu nebo domu.',
    },
    {
      title: 'Stavba nového domu',
      text: 'Plánujete stavbu nového domu? I\u00a0na to můžete naši hypotéku použít a\u00a0čerpat ji klidně postupně.',
    },
    {
      title: 'Družstevní byt',
      text: 'Na hypotéku si můžete pořídit i\u00a0družstevní byt, stačí ručit jinou nemovitostí.',
    },
    {
      title: 'Vypořádání dědictví nebo společného jmění manželů',
      text: 'Všechno jednou končí a\u00a0něco nového začíná. Proto se na nás můžete spolehnout i\u00a0v\u00a0těchto případech.',
    },
  ];

  const cards = [];
  for (let i = 0; i < icons.length; i++) {
    const iconId = await ensureSvgFileMedia(icons[i]!.file, icons[i]!.name);
    cards.push({
      icon: iconId,
      title: data[i]!.title,
      text: data[i]!.text,
    });
  }

  return {
    blockType: 'benefitsWithListBlock',
    backgroundColor: 'lightGrey',
    title: 'U\u00a0nás si můžete vzít hypotéku téměř na vše',
    description: 'A\u00a0můžete ji vyčerpat celou naráz nebo ji čerpat postupně třeba podle toho, jak stavba půjde.',
    cards,
  };
}

function buildStepsBlock(): Record<string, unknown> {
  return {
    blockType: 'stepsVerticalCollapsibleBlock',
    title: 'Jak probíhá žádost o\u00a0hypotéku?',
    items: [
      {
        title: 'Vyplnění žádosti o\u00a0hypotéku',
        content: htmlToLexical(
          '<p>Žádost o\u00a0hypotéku vyplníte jednoduše buď v\u00a0internetovém bankovnictví, v\u00a0mobilní aplikaci, nebo s\u00a0asistentem na pobočce. Poté se s\u00a0vámi spojí náš hypoteční expert.</p>',
        ),
      },
      {
        title: 'Dodání dokumentů a\u00a0schválení',
        content: htmlToLexical(
          '<p>Hypoteční expert vám vysvětlí, jaké dokumenty od vás budeme potřebovat, jak je získáte a\u00a0kolik času budete mít na to, nám je poslat.</p>',
        ),
      },
      {
        title: 'Podpis smlouvy',
        content: htmlToLexical(
          '<p>Jakmile od vás budeme mít vše potřebné, vytvoříme smluvní dokumenty. S\u00a0hypotečním expertem smlouvy proberete a\u00a0domluvíte se na způsobu podpisu.</p>',
        ),
      },
      {
        title: 'Čerpání hypotéky',
        content: htmlToLexical(
          '<p>Hypotéku vám načerpáme jednorázově nebo postupně, záleží, jak se vám to bude hodit.</p>',
        ),
      },
      {
        title: 'Splnění závazků po čerpání',
        content: htmlToLexical(
          '<p>Většinou jde o\u00a0zajištění výmazu zástavního práva původní banky při převedení hypotéky nebo o\u00a0doklad, že jste vlastníkem nemovitosti, na kterou si od nás půjčujete.</p>',
        ),
      },
    ],
  };
}

async function buildCtaCardsBlock(): Promise<Record<string, unknown>> {
  const iconMamUcet = await ensureSvgFileMedia('assets/hypoteka-icons/cta-mam-ucet.svg', 'hypoteka-cta-mam-ucet');
  const iconNemamUcet = await ensureSvgFileMedia('assets/hypoteka-icons/cta-nemam-ucet.svg', 'hypoteka-cta-nemam-ucet');
  const iconPobocky = await ensureSvgFileMedia('assets/hypoteka-icons/cta-pobocky.svg', 'hypoteka-cta-pobocky');

  return {
    blockType: 'ctaCardsBlock',
    title: 'Jak naši hypotéku získáte',
    description: textToLexical(
      'Založte si u\u00a0nás běžný účet zdarma. Žádost budete mít hotovou raz dva.',
    ),
    items: [
      {
        icon: iconMamUcet,
        title: 'Už mám účet v\u00a0Air Bank',
        description: 'Skvělé! Zažádejte si o\u00a0hypotéku teď hned ve svém internetovém bankovnictví nebo v\u00a0aplikaci My Air.',
        linkLabel: 'Přihlásit se',
        linkUrl: '#',
      },
      {
        icon: iconNemamUcet,
        title: 'Nemám účet v\u00a0Air Bank',
        description: 'Nevadí, účet si založíte na pár kliků a\u00a0hned poté si v\u00a0internetovém bankovnictví o\u00a0hypotéku zažádáte.',
        linkLabel: 'Založit účet',
        linkUrl: '#',
      },
    ],
    footnoteIcon: iconPobocky,
    footnoteText: htmlToLexical('<p>S\u00a0hypotékou vám rádi poradíme i\u00a0na <a href="/mapa-pobocek-a-bankomatu/">našich pobočkách</a>.</p>'),
  };
}

function buildDownloadSectionBlock(): Record<string, unknown> {
  return {
    blockType: 'downloadSectionBlock',
    items: [
      {
        title: 'Mějte stálý přehled',
        description: 'o\u00a0své hypotéce',
      },
    ],
  };
}

async function buildContentCardsBlock(): Promise<Record<string, unknown>> {
  const img1 = await uploadMedia(
    resolve(__dirname, 'assets/hypoteka-articles/article-1.png'),
    'Air Bank a Zonky v Indexu odpovědného úvěrování',
  );
  const img2 = await uploadMedia(
    resolve(__dirname, 'assets/hypoteka-articles/article-2.jpg'),
    'Zlatá koruna',
  );
  const img3 = await uploadMedia(
    resolve(__dirname, 'assets/hypoteka-articles/article-3.png'),
    'Férovost se počítá',
  );
  const img4 = await uploadMedia(
    resolve(__dirname, 'assets/hypoteka-articles/article-4.jpg'),
    'Hypotéka od Air Bank',
  );

  return {
    blockType: 'contentCardsBlock',
    items: [
      {
        image: img1,
        date: '26. 11. 2025',
        labels: 'Air Bank, Půjčky a\u00a0hypotéky, Zonky',
        title: 'Air Bank a\u00a0Zonky znovu mezi nejférovějšími: v\u00a0Indexu odpovědného úvěrování bereme stříbro a\u00a0bronz',
        description: 'V\u00a0aktuálním Indexu odpovědného úvěrování, který dvakrát ročně vydává organizace Člověk v\u00a0tísni, se půjčky Air Bank a\u00a0Zonky opět zařadily mezi nejzodpovědnější na českém trhu.',
        linkLabel: 'Přečíst celé',
        linkUrl: '#',
      },
      {
        image: img2,
        date: '14. 7. 2025',
        labels: 'Air Bank, Mobilní aplikace, Půjčky a\u00a0hypotéky, Podnikatelé',
        title: 'Zlatá koruna nám tento rok cinkla hned pětkrát!',
        description: 'Dělat banku tak, aby z\u00a0ní lidi měli radost. To je pro nás pořád na prvním místě. Ocenění jsou jen třešničkou navíc — ale příjemnou. Letos nám jich přibylo hned pět.',
        linkLabel: 'Přečíst celé',
        linkUrl: '#',
      },
      {
        image: img3,
        date: '20. 6. 2025',
        labels: 'Air Bank, Půjčky a\u00a0hypotéky',
        title: 'Férovost se počítá. A\u00a0počítá se nám už podeváté v\u00a0řadě',
        description: 'Lidé nám věří. A\u00a0odborníci taky. Už podeváté jsme první v\u00a0Indexu odpovědného úvěrování od organizace Člověk v\u00a0tísni. Dáváme si záležet, aby naše půjčky byly férové.',
        linkLabel: 'Přečíst celé',
        linkUrl: '#',
      },
      {
        image: img4,
        date: '16. 6. 2025',
        labels: 'Air Bank, Půjčky a\u00a0hypotéky',
        title: 'Hypotéka od Air Bank je teď zase o\u00a0chlup výhodnější. Nově se sazbou už od 4,19\u00a0%',
        description: 'Pořídit si vlastní bydlení je velký krok — a\u00a0taky závazek na spoustu let. Víme, že každé procento dolů se počítá. Od pátku 13.\u00a0června jsme proto snížili sazby.',
        linkLabel: 'Přečíst celé',
        linkUrl: '#',
      },
    ],
  };
}

async function buildFaqBlock(): Promise<Record<string, unknown>> {
  // Upload infographic image for Q1
  const infographicId = await uploadMedia(
    resolve(__dirname, 'assets/hypoteka-articles/faq-prubeh-hypoteky.png'),
    'Průběh řešení hypotéky — infografika',
  );

  // Q1: Build manually with Lexical helpers to embed the infographic image
  const faq1Content = wrapRoot([
    paragraphNode([
      textNode('Po úspěšném dokončení žádosti o\u00a0hypotéku se vás ujme náš '),
      textNode('zkušený hypoteční expert', 1),
      textNode(', zavolá vám a\u00a0provede vás hypotékou až do úspěšného načerpání peněz. Na nic tedy nebudete sami. V\u00a0jakýkoliv pracovní den se můžete s\u00a0hypotečním expertem spojit a\u00a0poradit se.'),
    ]),
    headingNode([textNode('Průběh od žádosti po čerpání hypotéky:')], 'h4'),
    uploadNode(infographicId),
    headingNode([textNode('Krok za krokem od hovoru s\u00a0hypotečním expertem po závěrečné posouzení hypotéky:')], 'h4'),
    listNode([
      listItemNode([
        textNode('Ověření maximální výše hypotéky', 1),
        { type: 'linebreak', version: 1 },
        textNode('Po prokázání vašich příjmů (příjmů spolužadatelů) a\u00a0výdajů například pomocí výpisu z\u00a0účtu nebo daňového přiznání, propočítáme, na jak vysokou hypotéku dosáhnete. To je důležité pro ověření, že výše hypotéky bude dostačující na vaši plánovanou investici.'),
      ]),
      listItemNode([
        textNode('Kontrola účelu hypotéky', 1),
        { type: 'linebreak', version: 1 },
        textNode('Co se týká hypotéky na bydlení, tak dokážeme dát peníze téměř na vše. I\u00a0tak je důležité si na začátku společně ověřit, že můžete doložit, na co si hypotéku berete. Na dalším postupu se domluvíme tak, abychom vše bezpečně stihli.'),
      ]),
      listItemNode([
        textNode('Ocenění nemovitosti', 1),
        { type: 'linebreak', version: 1 },
        textNode('Dnes si už 70\u00a0% ocenění nemovitostí děláme sami. Pro vás to znamená to, že ocenění nemovitosti budete mít zdarma. Byty dokážeme ocenit online bez osobní návštěvy. Máme i\u00a0vlastní odhadce v\u00a0terénu, kteří pokrývají oblasti, kde oceňujeme největší počet nemovitostí našich klientů. Pokud ani jedna možnost pro ocenění vaší nemovitosti nejde využít, hypoteční expert vám zajistí našeho smluvního odhadce.'),
      ]),
      listItemNode([
        textNode('Závěrečné posouzení hypotéky', 1),
        { type: 'linebreak', version: 1 },
        textNode('Jakmile jsou podklady k\u00a0hypotéce kompletní, hypoteční expert je posílá k\u00a0závěrečnému posouzení. Pokud je vše v\u00a0pořádku, hypotéku vám schválíme, většinou do dvou pracovních dnů. Hypoteční expert vám poté zavolá, aby vám šťastnou novinu oznámil. Zároveň vám připravíme smlouvu o\u00a0hypotéce a\u00a0další dokumenty, které uvidíte ve svém internetovém bankovnictví.'),
      ]),
    ], 'number'),
    headingNode([textNode('Hypoteční expert vám dále pomůže zařídit:', 1)], 'h4'),
    listNode([
      listItemNode([textNode('Stažení listu vlastnictví z\u00a0katastru.')]),
      listItemNode([textNode('Podání zástavní smlouvy na katastr.')]),
      listItemNode([textNode('Zprostředkování pojištění nemovitosti a\u00a0zajištění vinkulace.')]),
      listItemNode([textNode('Koordinaci koupě s\u00a0realitním makléřem nebo developerem.')]),
    ], 'bullet'),
    paragraphNode([
      textNode('Jak může vypadat vaše hypotéka zjistíte raz dva díky '),
      linkNode([textNode('hypoteční kalkulačce pro převedení hypotéky')], '#'),
      textNode(' nebo '),
      linkNode([textNode('pro novou hypotéku')], '/produkty/hypoteka/'),
      textNode('. Podle nás je to ten nejsnadnější způsob, jak si o\u00a0naší hypotéce udělat jasný obrázek. Stejně tak se spolu můžeme '),
      linkNode([textNode('spojit')], '#'),
      textNode(', stačí nám na sebe nechat telefonní číslo a\u00a0my se vám ozveme.'),
    ]),
  ]);

  // Q2: Interest rates — using htmlToLexical
  const faq2Content = htmlToLexical(
    '<h4>Převedení hypotéky a\u00a0otočka fixace</h4>' +
    '<p>Roční úroková sazba pro věrné klienty</p>' +
    '<table>' +
    '<tr><th>Typ úvěru</th><th>2\u00a0roky</th><th>3\u00a0roky</th><th>5\u00a0let</th><th>7\u00a0let</th><th>10\u00a0let</th></tr>' +
    '<tr><td>S\u00a0pojištěním schopnosti splácet</td><td>4,19\u00a0%</td><td>4,19\u00a0%</td><td>4,29\u00a0%</td><td>4,49\u00a0%</td><td>4,69\u00a0%</td></tr>' +
    '<tr><td>Bez pojištění schopnosti splácet</td><td>4,29\u00a0%</td><td>4,29\u00a0%</td><td>4,39\u00a0%</td><td>4,59\u00a0%</td><td>4,79\u00a0%</td></tr>' +
    '</table>' +
    '<h4>Nová hypotéka například pro koupi, výstavbu a\u00a0rekonstrukci</h4>' +
    '<p>Roční úroková sazba pro věrné klienty</p>' +
    '<table>' +
    '<tr><th>Typ úvěru</th><th>2\u00a0roky</th><th>3\u00a0roky</th><th>5\u00a0let</th><th>7\u00a0let</th><th>10\u00a0let</th></tr>' +
    '<tr><td>S\u00a0pojištěním schopnosti splácet</td><td>4,29\u00a0%</td><td>4,29\u00a0%</td><td>4,39\u00a0%</td><td>4,59\u00a0%</td><td>4,79\u00a0%</td></tr>' +
    '<tr><td>Bez pojištění schopnosti splácet</td><td>4,39\u00a0%</td><td>4,39\u00a0%</td><td>4,49\u00a0%</td><td>4,69\u00a0%</td><td>4,89\u00a0%</td></tr>' +
    '</table>' +
    '<p>Úrokové sazby platné od 13.\u00a06.\u00a02025</p>' +
    '<ul>' +
    '<li>Uvedené úrokové sazby v\u00a0tabulce už obsahují slevu 0,1\u00a0% z\u00a0úrokové sazby hypotéky, kterou získají věrní klienti díky <a href="#">Výhodám za věrnost</a>. Více se dočtete v\u00a0<a href="#">podmínkách Výhod za věrnost</a>.\u00a0Stejně tak je zahrnuto i\u00a0snížení 0,1\u00a0% za sjednání <a href="/produkty/pojisteni/pojisteni-hypoteky/">pojištění schopnosti splácet</a> hypotéku.</li>' +
    '<li>Při využívání Chytré rezervy sazbu navyšujeme o\u00a00,2\u00a0procentního bodu. Seznámit se s\u00a0ní více můžete v\u00a0<a href="#">tomto návodu</a>.</li>' +
    '</ul>' +
    '<p>V\u00a0Air Bank máme pro úrokové sazby hypotéky jasné pravidlo: férový přístup. To znamená, že\u00a0ještě, než si u\u00a0nás o\u00a0hypotéku zažádáte, na\u00a0<a href="/produkty/hypoteka/">hypoteční kalkulačce pro novou hypotéku</a> nebo pro <a href="#">převedení hypotéky</a> si spočítáte, jaký úrok můžete získat. Pak už stačí jen založit žádost o\u00a0hypotéku a\u00a0úrok je váš. Hypotéky poskytujeme až do 90\u00a0% odhadní hodnoty nemovitosti, a\u00a0to za stejných úrokových sazeb.</p>' +
    '<p>O\u00a0výši sazby nerozhoduje to, jak zdatní jste vyjednavači. Od začátku víte, jakou úrokovou sazbu můžete získat. A\u00a0to bez ohledu na to, jestli o\u00a0hypotéku žádáte na webu, v\u00a0mobilu nebo na pobočce.</p>' +
    '<p>Stejně jako nových klientů si vážíme i\u00a0těch, kteří jsou s\u00a0námi už nějaký ten pátek. Proto se můžete spolehnout, že férový přístup platí i\u00a0při <a href="#">nové fixaci</a> úrokové sazby\u00a0stávající hypotéky. Nabídku dostanete stejnou, jakou máme pro převedení hypotéky pro nové klienty.</p>',
  );

  // Q3: Fees — using htmlToLexical with all tables
  const faq3Content = htmlToLexical(
    '<p>Hypotéka\u00a0Air Bank není plná poplatků. Pro pořádek ovšem férově uvádíme ty, se kterými se můžete setkat, i\u00a0jejich výši. Chceme, abyste v\u00a0nich měli jasno ještě před tím, než si u\u00a0nás hypotéku vezmete. Tak by to přece mělo být.</p>' +
    '<h4>Jaké poplatky můžou být s\u00a0hypotékou spojené od 6.\u00a011.\u00a02024</h4>' +
    '<table>' +
    '<tr><td>Poplatek za čerpání hypotéky — třetí a\u00a0každé další</td><td>500\u00a0Kč / čerpání</td></tr>' +
    '<tr><td>Podání návrhu na vklad zástavního práva na katastr nemovitostí</td><td>2\u00a0000\u00a0Kč správní poplatek katastru nemovitostí</td></tr>' +
    '<tr><td>Podání návrhu na výmaz zástavního práva na katastr nemovitostí</td><td>1\u00a0600\u00a0Kč správní poplatek katastru nemovitostí</td></tr>' +
    '<tr><td>Zajištění podání návrhu na vklad zástavního práva na katastr nemovitostí, když od vás dostaneme zástavní smlouvu převedenou do digitální podoby pomocí autorizované konverze</td><td>0\u00a0Kč</td></tr>' +
    '<tr><td>Poplatek za vámi požadovanou změnu hypoteční smlouvy, třeba za změnu zajištění hypotéky</td><td>5\u00a0000\u00a0Kč</td></tr>' +
    '<tr><td>Poplatek za zrychlené čerpání peněz, například při výstavbě</td><td>0,2\u00a0% z\u00a0výše hypotéky</td></tr>' +
    '<tr><td>Poplatek za načerpání nebo nedočerpání hypotéky</td><td>0\u00a0Kč</td></tr>' +
    '<tr><td>Úředně ověřené podpisy na zástavní smlouvě, většinou za poplatek veřejné správy, třeba Czech POINTu</td><td>50\u00a0Kč / podpis</td></tr>' +
    '<tr><td><a href="#">Autorizovaná konverze</a> zástavní smlouvy do digitální podoby. Zástavní smlouva má zpravidla 8\u00a0stran (poplatek veřejné správy, třeba Czech POINTu)</td><td>30\u00a0Kč / strana</td></tr>' +
    '</table>' +
    '<h4>Ocenění zastavované nemovitosti</h4>' +
    '<table>' +
    '<tr><th>Typ ocenění</th><th>Nová hypotéka — Byt a\u00a0ateliér</th><th>Nová hypotéka — Ostatní nemovitosti</th><th>Převedení hypotéky — Všechny nemovitosti</th></tr>' +
    '<tr><td>Ocenění smluvním odhadcem</td><td>Zdarma</td><td>5\u00a0000\u00a0Kč</td><td>Zdarma</td></tr>' +
    '<tr><td>Online ocenění naším odhadcem s\u00a0podklady od klienta</td><td>Zdarma</td><td>5\u00a0000\u00a0Kč</td><td>Zdarma</td></tr>' +
    '<tr><td>Ocenění naším odhadcem s\u00a0osobní návštěvou</td><td>Zdarma</td><td>5\u00a0000\u00a0Kč</td><td>Zdarma</td></tr>' +
    '<tr><td>Dohlídka s\u00a0osobní návštěvou</td><td>2\u00a0000\u00a0Kč</td><td>2\u00a0000\u00a0Kč</td><td>2\u00a0000\u00a0Kč</td></tr>' +
    '<tr><td>Online dohlídka naším odhadcem s\u00a0podklady od klienta</td><td>Zdarma</td><td>Zdarma</td><td>Zdarma</td></tr>' +
    '</table>' +
    '<h4>Flexibilita hypotéky</h4>' +
    '<table>' +
    '<tr><td>Sjednání flexibility</td><td>0\u00a0Kč</td></tr>' +
    '<tr><td>Změna výše splátky</td><td>0\u00a0Kč</td></tr>' +
    '<tr><td>Změna data splacení</td><td>0\u00a0Kč</td></tr>' +
    '<tr><td>Předčasné splacení a\u00a0mimořádná splátka</td><td>0\u00a0Kč</td></tr>' +
    '</table>' +
    '<h4>Chytrá rezerva</h4>' +
    '<table>' +
    '<tr><td>Cena za používání — nejnižší vklad 1\u00a0koruna</td><td>Navýšení úrokové sazby o\u00a00,2\u00a0procentního bodu</td></tr>' +
    '<tr><td>Cena při nepoužívání</td><td>0\u00a0Kč</td></tr>' +
    '<tr><td>Vklad do Chytré rezervy</td><td>0\u00a0Kč</td></tr>' +
    '<tr><td>Výběr z\u00a0Chytré rezervy</td><td>0\u00a0Kč</td></tr>' +
    '</table>' +
    '<h4>Pojištění schopnosti splácet hypotéku</h4>' +
    '<table>' +
    '<tr><td>Cena pojištění</td><td>8,7\u00a0% z\u00a0výše aktuální splátky</td></tr>' +
    '<tr><td>Poplatek za sjednání/zrušení pojištění</td><td>0\u00a0Kč</td></tr>' +
    '</table>' +
    '<p>Při sjednání <a href="/produkty/pojisteni/pojisteni-hypoteky/">pojištění schopnosti splácet</a> vám úrokovou sazbu snížíme o\u00a00,1\u00a0procentního bodu.</p>' +
    '<h4>Co se může stát, když zapomenete včas zaplatit nebo splnit, na čem jsme se ve smlouvě domluvili</h4>' +
    '<table>' +
    '<tr><td>Porušení smluvních podmínek, za které vám můžeme naúčtovat smluvní pokutu. Tu vám můžeme naúčtovat i\u00a0opakovaně, nejvíce ale jedenkrát za měsíc.</td><td>5\u00a0000\u00a0Kč</td></tr>' +
    '</table>' +
    '<p>Více podrobností, jak vše probíhá, když nestihnete zaplatit včas, najdete v\u00a0<a href="#">tomto návodu</a> v\u00a0Poradně.</p>' +
    '<p>Jak může vypadat vaše hypotéka zjistíte raz dva díky <a href="#">hypoteční kalkulačce pro převedení hypotéky</a> nebo <a href="/produkty/hypoteka/">pro novou hypotéku</a>. Podle nás je to ten nejsnadnější způsob, jak si o\u00a0naší hypotéce udělat jasný obrázek. Stejně tak se spolu můžeme <a href="#">spojit</a>, stačí nám na sebe dát vaše telefonní číslo a\u00a0my se vám ozveme.</p>',
  );

  return {
    blockType: 'faqItemsBlock',
    title: 'Co vás nejvíc zajímá',
    backgroundColor: 'lightGrey',
    numbered: false,
    allowMultiple: false,
    items: [
      {
        title: 'Jak probíhá vyřízení hypotéky',
        content: faq1Content,
      },
      {
        title: 'Úrokové sazby u\u00a0hypotéky',
        content: faq2Content,
      },
      {
        title: 'Poplatky u\u00a0hypotéky',
        content: faq3Content,
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
    console.log('Resetting Hypotéka page...');
    const existing = await findPage(PAGE_SLUG);
    if (existing) {
      await deletePage(existing.id);
      console.log(`Deleted page ${existing.id}`);
    }
  }

  console.log('Building Hypotéka page blocks...');

  const blocks: Record<string, unknown>[] = [];

  console.log('\n1/9 Hero...');
  blocks.push(await buildHeroBlock());

  console.log('2/9 Mortgage calculator...');
  blocks.push(await buildMortgageCalculatorBlock());

  console.log('3/9 Benefits (4 columns)...');
  blocks.push(await buildBenefitsBlock());

  console.log('4/9 Benefits with list (5 cards)...');
  blocks.push(await buildBenefitsWithListBlock());

  console.log('5/9 Steps (5 kroků)...');
  blocks.push(buildStepsBlock());

  console.log('6/9 CTA cards...');
  blocks.push(await buildCtaCardsBlock());

  console.log('7/9 Download section...');
  blocks.push(buildDownloadSectionBlock());

  console.log('8/9 Content cards (novinky)...');
  blocks.push(await buildContentCardsBlock());

  console.log('9/9 FAQ...');
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

  console.log(`View on FE:  http://localhost:3000/cs/produkty/hypoteka`);
  console.log('\nDone! Hypotéka page has been populated with 9 blocks.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
