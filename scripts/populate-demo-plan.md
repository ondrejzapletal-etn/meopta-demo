# Pipeline: Replikace komponent z Airbank preview do CMS

## Context

Vsech 41 bloku ma CMS schema i FE komponentu. Databaze je cista (fresh). Nyni je cil naplnit CMS realnym obsahem z Airbank preview stranky (`https://www.airbank.cz/page-preview/?idPage=506&rev=1-fmxfs4qn419axbna1s`), postupne budovat demo stranku a vizualne validovat shodu s predlohou.

CMS: `http://localhost:3001` (admin@airbank.cz / admin123)
FE: `http://localhost:3000`

## Krok 0: Lokalni kopie preview stranky

Preview stranka se renderuje pomalu (SPA, tezke assety). Proto si pred zacatkem prace stahneme lokalni kopii a budeme pracovat nad ni.

### Stazeni
```bash
# Stahnout HTML + CSS + JS + obrazky (pouze domena airbank.cz, ne externi)
wget --mirror --convert-links --adjust-extension --page-requisites \
  --restrict-file-names=windows --domains=airbank.cz,cdn.siteone.io \
  --no-parent --directory-prefix=scripts/reference/local-preview \
  "https://www.airbank.cz/page-preview/?idPage=506&rev=1-fmxfs4qn419axbna1s"
```

Alternativne pres playwright-cli (MHTML snapshot):
```bash
# Ulozit kompletni stranku jako MHTML
playwright-cli open "https://www.airbank.cz/page-preview/?idPage=506&rev=1-fmxfs4qn419axbna1s"
playwright-cli eval "document.documentElement.outerHTML" > scripts/reference/local-preview/page.html
# Nebo screenshot cele stranky
playwright-cli screenshot --filename=scripts/reference/local-preview/full-page.png
playwright-cli close
```

### Ucely lokalni kopie
- Rychlejsi parsovani HTML (bez sitoveho latency)
- Obrazky dostupne z lokalniho filesystemu (ne z CDN)
- Moznost pracovat offline
- Stabilni reference (preview se muze zmenit)

## Postup pro jednu komponentu (7 kroku)

### 1. Nacist referencni data
- `scripts/reference/{slug}/structure.html` — HTML z preview s realnym obsahem
- `scripts/reference/{slug}/screenshot.png` — vizualni predloha
- `scripts/reference/component-mapping.json` → `primaryReferencePerSlug` urcuje ktery HTML pouzit

### 2. Parsovat HTML (cheerio)
- Extrahovat texty: `h1`/`h2` → title, `p` → description
- Extrahovat obrazky: `<img src>` (pres `extractImages`) NEBO `background-image: url(...)`
  (pres `extractBackgroundImages`) — vzdy pouzit fallback!
- Extrahovat SVG ikony: inline `<svg>` s viewBox > 30px (odfiltrovat sipky 25x25)
- Extrahovat linky: `<a href><span>Label</span></a>` NEBO `<button><span>Label</span></button>`
- Extrahovat pole (array items): opakovane `<article>` elementy
  - POZOR na hloubku vnoreni (`article article` vs `article article article`)
  - VZDY overit pocet matchu oproti referencnimu HTML
  - NEFILTROVAT polozky podle povinneho title — pouzit alt/fallback

### 3. Stahnout obrazky
- CDN pattern: `https://cdn.siteone.io/img.siteone.cz/rs_{size}_fill_auto/{encoded_url}`
- Stahnout do `/tmp/demo-media/`
- SVG ikony ulozit jako `.svg` soubory

### 4. Nahrat media do CMS
```
POST http://localhost:3001/api/media
Content-Type: multipart/form-data
Authorization: JWT {token}
Body: file + alt
→ Response: { doc: { id: 123 } }
```
- Cachovat `url → mediaId` v `demo-state.json` aby se neopakoval upload

### 5. Sestavit block JSON
- Mapovat extrahovana data na CMS schema bloku
- Texty → `text`/`textarea` pole
- Popisy → Lexical JSON pro `richText` pole (struktura: `{ root: { children: [{ type: 'paragraph', children: [{ type: 'text', text, format: 0 }] }] } }`)
- Obrazky → `mediaId` (integer)
- Pole (items) → array objektu s vnorenym obsahem

### 6. Vytvorit/aktualizovat stranku v CMS
- Prvni beh: `POST /api/pages` s prazdnym `layout: []`
- Dalsi behy: `GET /api/pages/{id}` → vzit `layout`, pripojit novy blok → `PATCH /api/pages/{id}`
- Slug stranky: `airbank-demo` → dostupna na `http://localhost:3000/cs/airbank-demo`

### 7. Vizualni validace (per-block, NE jen full-page)

**PRED validaci — dry-run kontrola:**
```bash
npx tsx scripts/populate-demo.ts --dry-run --block={slug}
```
Overit v JSON: images > 0 (pokud reference ma obrazky), items > 0 (pokud reference ma polozky),
title neni fallback, backgroundColor odpovida referenci.

**Vizualni kontrola:**
1. `playwright-cli open http://localhost:3000/cs/airbank-demo --browser=chromium`
2. Scrollovat na konkretni blok
3. Screenshot oblasti bloku
4. Porovnat s `scripts/reference/{slug}/screenshot.png` — kontrolovat:
   - **Layout**: 1-sloupcovy vs 2-sloupcovy, pozice obrazku (left/right)
   - **Obsah**: text, pocet polozek, pritomnost obrazku (realne vs placeholder)
   - **Barvy**: pozadi bloku, barva tlacitek (green/lightGrey/lightGreen/white)
   - **Obrazky**: Skutecne stazene z CDN, ne zeleny placeholder
   - **Linky**: Pocet a texty CTA tlacitek

**HTML/DOM validace** (doplnkova):
- `playwright-cli eval` ke cteni DOM a porovnani s referencnim `structure.html`
- Kontrolovat pritomnost CSS animaci/transition trid

> **DULEZITE**: Vizualni validace VZDY per-block. Full-page screenshot slouzi jen
> jako finalni kontrola poradi a celkoveho dojmu, NE jako jediny validacni nastroj.
> Kazdy blok porovnat SAMOSTATNE s jeho referencnim screenshotem.

## Technologie a tooling

| Nastroj | Ucel |
|---|---|
| **TypeScript + tsx** | Orchestracni skript (konzistentni s existujicim `scrape-components.ts`) |
| **cheerio** | Parsovani HTML na serveru (jedina nova devDependency) |
| **Node fetch + FormData** | CMS REST API volani (nativne v Node 22+) |
| **playwright-cli** | Vizualni validace — screenshoty nasi stranky + scrapovani preview |
| **curl** | Ad-hoc testovani API |

> **Poznamka k playwright-cli**: Vzdy pouzivat bundled Chromium z `.cache/` adresare.
> NIKDY neinstalovat dalsi prohlizece (zadne `npx playwright install`).
> Pouzit `--browser=chromium` pro explicitni vyber bundled Chromium.
> NIKDY nezabijet procesy (kill) — muzou bezet dulezite veci v jinych prohlizecich.

## Struktura skriptu

```
scripts/
  populate-demo.ts              # Hlavni orchestrace (CLI)
  lib/
    auth.ts                     # CMS login → JWT token
    cms-api.ts                  # createPage, appendBlock, uploadMedia
    html-parser.ts              # Spolecne extrakce (title, description, links, images)
    lexical.ts                  # text/HTML → Lexical JSON
    image-utils.ts              # Download z CDN, MIME type detekce
    state.ts                    # demo-state.json persistence (pageId, mediaCache, processedBlocks)
  parsers/                      # Jeden soubor per block typ
    heroPlainBlock.ts
    benefitsBlock.ts
    featureBlock.ts
    ...
```

### Parser interface (kazdy parser exportuje)
```typescript
interface ParsedBlock {
  blockType: string;
  data: Record<string, unknown>;           // pole primo mapovatelna na CMS
  images: Array<{ fieldPath: string; url: string; alt: string }>;
  svgs: Array<{ fieldPath: string; content: string; name: string }>;
}
export function parse(html: string): ParsedBlock;
```

### CLI pouziti
```bash
npx tsx scripts/populate-demo.ts --block=heroPlainBlock   # jeden blok
npx tsx scripts/populate-demo.ts --all                    # vsechny bloky (v poradi PREVIEW_ORDER)
npx tsx scripts/populate-demo.ts --reset                  # smazat stranku + media, zacit znovu
npx tsx scripts/populate-demo.ts --dry-run                # vypsat JSON bez API volani
npx tsx scripts/populate-demo.ts --dry-run --block=X      # dry-run jednoho parseru
```

## Poradi bloku na strance (PREVIEW_ORDER)

Bloky na demo strance se NE radi po fazich implementace, ale podle referencniho poradi
z `scripts/reference/full-page.png`. Toto poradi je definovano v `PREVIEW_ORDER` uvnitr
`populate-demo.ts` a odpovida indexum z `component-mapping.json → primaryReferencePerSlug`.

```
 0  heroPlainBlock               19  flashMessageBlock
 1  heroWithImageBlock           31  infoCenterFaqBlock
 2  heroWithImageAndSearchBlock  32  featureBlock
 3  heroWithImageCompactBlock    33  infoDoubleImageBlock
 4  heroSliderBlock              35  infoImageBigBlock
 5  benefitsBlock                36  richTextBlock
 7  benefitsWithImageBlock       37  infoVideoBlock
 8  benefitsWithListBlock        40  contentCardsBlock
10  callbackSimplifiedBlock      41  featureApplicationBlock
11  compareTableBlock            44  pressCenterContactBlock
13  loyalCustomerBenefitsBlock   45  productCardHorizontalBlock
14  exchangeTradedFundsTableBlock 46 productCardsVerticalBlock
15  discountsBlock               51  timelineBlock
16  exchangeRatesBlock           52  topManagementCardsBlock
19  contactStripBlock            54  youtubeVideoBlock
20  callbackBlock                55  zoneInterestBlock
21  faqItemsBlock                56  zonkyCalculatorBlock
22  downloadSectionBlock         57  inflationCalculatorBlock
25  flashMessageBlock            58  loanCalculatorBlock
                                 59  mortgageCalculatorBlock
                                 63  compareBondsTableBlock
                                 65  infoCardNarrowBlock
                                 66  logoCarouselBlock
```

> **DULEZITE**: `--all` pouziva `PREVIEW_ORDER`, ne faze. Poradi na strance musi
> odpovídat referenci. Kdyz se prida novy blok, MUSI se vlozit na spravnou pozici
> v `PREVIEW_ORDER`.

## Znamé pitfally pri psani parseru (lessons learned)

### 1. Obrazky mohou byt v CSS, ne v `<img>`
Nektere bloky (featureBlock, infoImageBigBlock) pouzivaji `background-image: url(...)` na
`<div>` misto `<img>`. Parser MUSI pouzit `extractBackgroundImages($)` jako fallback kdyz
`extractImages($)` vrati prazdne pole.

### 2. Selektor nesmi byt prilis siroky
Typicky problem: `$('[class*="slide"], article, section > div > div')` matchne desitky
elementu misto 2 slidu. **Vzdy otestovat pocet matchnutych elementu** oproti referencnimu
HTML pred pouzitim selektoru v parseru:
```bash
npx tsx -e "..." # nebo cheerio v REPL
```
**Spravny postup**: Cist referencni HTML, identifikovat presny selektor (napr. `li.slide`),
a overit ze vraci presne ocekavany pocet elementu.

### 3. CTA muze byt `<button>`, ne jen `<a>`
Nektera tlacitka (heroSliderBlock slide 1) pouzivaji `<button>` misto `<a href>`.
Parser musi handlovat oba pripady.

### 4. Opakujici se polozky nemusi mit nadpisy
BenefitsWithImageBlock ma polozky s `<img>` + `<p>`, ale ZADNE `<h3>`/`<h4>`.
Parser nesmi filtrovat polozky podle pritomnosti nadpisu. Jako fallback title pouzit
`img.alt` nebo genericky nazev.

### 5. CMS schema MUSI obsahovat pole pro vsechna vizualni data
Kdyz referencni screenshot ukazuje obrazek a CTA linky, ale CMS schema je nema →
vizualni neshoda. **Pred psanim parseru ověřit ze CMS schema ma vsechna potrebna pole.**
Pokud chybi, DOPLNIT schema, FE komponentu i parser soucasne.

### 6. Barvy: Nikdy nehardcodovat bez overeni
Vzdy porovnat barvu pozadi v referencnim screenshotu s dostupnymi hodnotami v CMS
schema (BackgroundColor field). Nepredpokladat 'green' jako default.

### 7. Vnorene `<article>` elementy
HTML z Airbank preview casto pouziva vicenasobne vnorene `<article>` tagy.
Pri psani selektoru overit hloubku vnoreni v referencnim HTML — `article article`
(2 urovne) neni totez co `article article article` (3 urovne).

## Aktualizace nahledovych obrazku v CMS

Po uspesne replikaci kazde komponenty je potreba aktualizovat nahledovy obrazek (`imageURL`) v CMS block definici. Stare nahledove obrazky (`/block-thumbnails/*.png`) nereflektuji animace — nekdy obsahuji rozmazane casti z probihajiciho pohybu.

### Postup
1. Po replikaci bloku na demo stranku pockej na dokonceni vsech uvodnich animaci (fade-in, slide-in apod.)
2. Pockej dostatecnou dobu po `load` eventu — typicky 2–3 sekundy, nebo detekovat konec animace pres `getComputedStyle().animationPlayState`
3. Teprve pak porizit screenshot komponenty pres `playwright-cli screenshot`
4. Orezat screenshot na oblast komponenty
5. Ulozit jako `/public/block-thumbnails/{slug}.png` v CMS aplikaci
6. Overit v CMS admin UI ze nahled zobrazuje komponentu v klidovem stavu (po animaci)

### Detekce konce animace
```bash
# Pockej na konec CSS animaci
playwright-cli eval "new Promise(r => setTimeout(r, 3000))"
# Nebo presneji:
playwright-cli eval "document.getAnimations().length === 0 || await Promise.all(document.getAnimations().map(a => a.finished))"
# Pak screenshot
playwright-cli screenshot --filename=block-thumbnail.png
```

> **Poznamka**: Screenshoty se vzdy poridaji az po dokonceni uvodnich animaci. Nikdy ne behem animace — vysledkem by byl rozmazany/neuplny snimek.

## Implementacni kroky

### Etapa A: Infrastruktura + parsery (DONE)
- [x] Zakladni infrastruktura (lib/, parsery, CLI)
- [x] 41 parseru pro vsechny bloky
- [x] `npm run populate:all` — uspesna populace 41 bloku

### Etapa B: Vizualni ladeni (aktualni)
Pro kazdy blok kde se demo lisi od reference:
1. Precist referencni HTML + screenshot
2. Identifikovat pricinu (parser / CMS schema / FE komponenta)
3. Opravit na spravne urovni
4. Projit validacni pipeline (viz nize)
5. Opakovat dokud blok neodpovida

---

## Validacni pipeline (POVINNY pri kazde zmene parseru)

Kazda zmena parseru / CMS schema / FE komponenty MUSI projit timto pipeline.
Cil: Odhalit chyby PRED vizualni kontrolou a minimalizovat pocet iteraci.

### Faze 1: Pre-validace parseru (dry-run)

```bash
npx tsx scripts/populate-demo.ts --dry-run --block={slug}
```

Kontrolovat v JSON vystupu:
- [ ] **Obrazky**: Pokud referencni HTML obsahuje `<img>` nebo `background-image` →
      parser MUSI vratit `images.length > 0`. Pokud vraci 0, parser je vadny.
- [ ] **Polozky (items)**: Pokud referencni HTML obsahuje opakovane elementy
      (articles, cards, rows) → `items.length > 0`. Prazdne `items: []` = chyba.
- [ ] **Title**: `title` nesmi byt fallback hodnota, pokud je v HTML k dispozici.
- [ ] **Linky**: Pokud referencni screenshot ukazuje CTA tlacitka →
      parser musi extrahovat `links` nebo `linkLabel`/`linkUrl`.
- [ ] **Barva**: `backgroundColor` musi odpovidat referencnimu screenshotu,
      ne byt hardcoded default.

### Faze 2: Kontrola zarovnani schema ↔ parser ↔ FE

Pro kazdy blok overit PRED populaci:

```
Referencni screenshot ukazuje X → CMS schema MA pole pro X → Parser EXTRAHUJE X → FE RENDERUJE X
```

Typicke chyby:
- Screenshot ukazuje obrazek, ale CMS schema nema `image` pole → FE ho nezobrazi
- Screenshot ukazuje CTA linky, ale CMS schema nema `links` pole → FE je nezobrazi
- Parser extrahuje data, ale pro pole ktere CMS schema nema → data se zahodi

**Checklist pro kazdy blok:**
1. Otevrit referencni screenshot (`scripts/reference/{slug}/screenshot.png`)
2. Vypsat viditelne elementy: nadpis, popis, obrazek(y), linky, ikony, polozky
3. Overit ze CMS schema (`apps/cms/src/blocks/.../{Slug}.ts`) ma pole pro kazdy element
4. Overit ze FE komponenta (`apps/fe/src/blocks/.../{slug}.tsx`) renderuje kazdy element
5. Overit ze parser extrahuje data pro kazdy element

### Faze 3: Populace + per-block screenshot porovnani

```bash
# 1. Reset a populace
npm run populate:reset && npm run populate:all

# 2. Otevrit v prohlizeci (playwright-cli s bundled Chromium)
playwright-cli open http://localhost:3000/cs/airbank-demo --browser=chromium
playwright-cli resize 1280 800

# 3. Per-block screenshoty (scrollovat a fotit po sekcich)
# Pouzit run-code s page.setViewportSize + page.evaluate(scrollTo) + page.screenshot
```

**Per-block porovnani** (NE jen full-page od oka!):
- Pro KAZDY opraveny blok:
  1. Najit blok na demo strance (scrollovat)
  2. Vyfotit oblast bloku
  3. Otevrit `scripts/reference/{slug}/screenshot.png`
  4. Porovnat TVAR layoutu (1-sloupcovy vs 2-sloupcovy, pozice obrazku)
  5. Porovnat OBSAH (text, pocet polozek, pritomnost obrazku)
  6. Porovnat BARVY (pozadi bloku, barva tlacitek)
  7. Porovnat OBRAZKY (realne vs placeholder)

### Faze 4: Kontrola integrity cele stranky

Po per-block validaci:
1. Full-page screenshot demo stranky
2. Porovnat s `scripts/reference/full-page.png`
3. Overit poradi bloku (shora dolu)
4. Overit ze zadny blok neni prazdny/kolapsovany
5. Overit celkovou vysku stranky (mela by byt srovnatelna s referenci)

---

## Systematicky postup opravy jednoho bloku

Kdyz se demo lisi od reference, pouzit tento postup (ne pokus-omyl):

### Krok 1: Diagnostika (PRED jakoukoli zmenou kodu)
```bash
# a) Precist referencni HTML — co tam je?
cat scripts/reference/{slug}/structure.html | head -200

# b) Precist referencni screenshot — jak to ma vypadat?
# (otevrit v image vieweru nebo playwright-cli)

# c) Spustit dry-run parseru — co parser vraci?
npx tsx scripts/populate-demo.ts --dry-run --block={slug}

# d) Precist CMS schema — co schema podporuje?
cat apps/cms/src/blocks/.../{Slug}.ts

# e) Precist FE komponentu — co FE renderuje?
cat apps/fe/src/blocks/.../{slug}/{slug}.tsx
```

### Krok 2: Identifikace priciny
Na zaklade diagnostiky urcit PRESNOU pricinu:
- **Parser nema selektor** → opravit parser
- **Parser ma prilis siroky selektor** → zuzit selektor, overit pocet matchu
- **CMS schema chybi pole** → doplnit schema + FE + parser + typy
- **FE nerenduje pole** → doplnit FE komponentu
- **Spatna barva/hodnota** → opravit hardcoded hodnotu v parseru

### Krok 3: Implementace opravy
- Opravit VSECHNY dotcene soubory najednou (parser + schema + FE)
- Vzdy overit selektor na referencnim HTML (pocet matchu)

### Krok 4: Validace
- Projit Faze 1-3 validacniho pipeline (viz vyse)

---

## Verifikace

1. **Dry-run test**: `npx tsx scripts/populate-demo.ts --dry-run --block={slug}` →
   JSON musi obsahovat vsechna ocekavana data (images, items, links)
2. **Populace**: `npm run populate:reset && npm run populate:all` → 41/41 Success, 0 Failed
3. **Per-block screenshot**: Kazdy opraveny blok porovnat s referencnim screenshotem
4. **Full-page screenshot**: Celkove poradi a rozvrzeni odpovida `full-page.png`
5. **Schema alignment**: Kazdy vizualni element v referenci ma odpovidajici pole v CMS schema
6. **TypeScript**: `npx tsc --noEmit` pro parsery a lib soubory

> **DULEZITE**: Validace NIKDY nesmi byt jen full-page screenshot "od oka".
> Vzdy per-block porovnani s referencnim screenshotem. Kazdy blok je samostatna
> validacni jednotka.
