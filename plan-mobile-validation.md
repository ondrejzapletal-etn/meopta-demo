# Validace mobilního zobrazení

## Context

Migrace proběhla desktop-first přístupem. Mobilní zobrazení nebylo systematicky kontrolováno. Cílem je rychle identifikovat rozbitá místa a opravit je, aby mobilní verze odpovídala předloze (airbank.cz).

Existující tooling v `scripts/` už podporuje multi-viewport screenshoty a porovnání - stačí ho využít.

---

## Inventář stránek (6 reálných stránek)

| Stránka | Slug | Bloků |
|---------|------|-------|
| Homepage | `homepage` | 13 |
| Půjčka | `produkty/pujcka` | ~10 |
| Investice | `produkty/investice-a-sporeni` | 7 |
| Hypotéka | `produkty/hypoteka` | ~10 |
| Pojištění hypotéky | `produkty/pojisteni/pojisteni-hypoteky` | ~7 |
| Pobočky | `mapa-pobocek-a-bankomatu/nase-pobocky` | ~3 |

---

## Plán - 3 fáze

### Fáze 1: Automatické block-level porovnání (existující tooling)

Využijeme `compare-screenshots.ts`, který už podporuje `--viewport=375` a `--viewport=768`.

**Krok 1a:** Ověřit, že existují mobilní referenční screenshoty (`scripts/reference/{slug}/screenshot-375.png`). Pokud chybí, zachytit je z originálu:

```bash
npm run scrape:missing -- --all    # zachytí 3 viewporty pro všech 68 bloků
```

**Krok 1b:** Spustit automatické porovnání na mobilním viewportu:

```bash
npm run compare -- --viewport=375   # mobilní srovnání všech 47 bloků
npm run compare -- --viewport=768   # tabletové srovnání
```

**Výstup:** `scripts/comparison-output/375px/comparison-report.json` - JSON report s pass/fail pro každý blok + side-by-side diff obrázky pro ty, co failnou.

**Tohle pokryje ~47 bloků automaticky.** Vyhodnotí se, které bloky jsou vizuálně rozbitá na mobilu (diff > 15%).

### Fáze 2: Full-page vizuální kontrola (Playwright)

Block-level porovnání neodhalí problémy se stacking/spacing mezi bloky na celé stránce. Pro to potřebujeme full-page screenshoty.

Napsat jednoduchý Playwright skript, který:
1. Otevře každou z 6 reálných stránek v mobilním viewportu (375×812)
2. Udělá full-page screenshot
3. Uloží do `scripts/comparison-output/mobile-pages/`

Tyto screenshoty pak ručně porovnáme s originálem (nebo s referenčními screenshoty z `scrape-components.ts`). Při 6 stránkách je to ~5 minut práce.

### Fáze 3: Opravy

Na základě výstupů z Fází 1 a 2 sepíšeme konkrétní seznam bloků/komponent k opravě a budeme je řešit po jednom.

Typické mobilní problémy k očekávání (na základě analýzy kódu):
- **Tabulky** (`compareTable`, `compareBondsTable`) - `min-w-[480px]` může přetékat
- **Horizontální scroll karty** (`infoCardNarrow`) - `w-[280px]` může být moc na malých telefonech
- **Skoky v paddingu** - `px-4` → `md:px-12` (16px → 48px bez mezikroku)
- **Obrázky** - některé mají fixní výšky bez `xs`/`sm` variant
- **Texty** - velké skoky ve velikostech (`text-24` → `lg:text-[32px]`)

---

## Soubory k využití (existující)

| Soubor | Účel |
|--------|------|
| `scripts/compare-screenshots.ts` | Automatické pixel-diff porovnání per-block |
| `scripts/scrape-missing.ts` | Zachycení referenčních screenshotů z originálu (3 viewporty) |
| `scripts/reference/` | Referenční screenshoty (desktop + tablet + mobile) |
| `playwright.config.ts` | Playwright konfigurace (Chromium) |

## Nový soubor

| Soubor | Účel |
|--------|------|
| `scripts/screenshot-pages.ts` | Full-page screenshoty 6 reálných stránek v mobilním viewportu |

---

## Verifikace

1. `npm run scrape:missing -- --all` - zachytí referenční screenshoty (pokud chybí)
2. `npm run compare -- --viewport=375` - automatický report
3. `npx tsx scripts/screenshot-pages.ts` - full-page screenshoty
4. Ručně projít diff obrázky a full-page screenshoty (~10-15 min)
5. Sepsat seznam oprav, implementovat po jednom
