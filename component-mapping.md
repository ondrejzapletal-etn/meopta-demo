# Mapovani zdrojovych komponent z Airbank preview

Zdroj: `https://www.airbank.cz/page-preview/?idPage=506&rev=1-fmxfs4qn419axbna1s`

Scrapovano: viz `scripts/reference/catalog.json` a `scripts/reference/component-mapping.json`

## Legenda

- **Poradi** — pozice komponenty na preview strance (0-indexed)
- **Original ID** — HTML `id` atribut zdrojove komponenty
- **Nadpis** — viditelny heading komponenty na preview strance
- **Cilovy slug** — finalni nazev CMS bloku v nasi replice (`apps/cms/src/blocks/`)
- **Etapa** — A = existujici blok (naplnit obsahem), B = novy blok (vytvorit schema + FE), skip = neimplementovat
- **Stav** — `hotovo` = zpracovano, `rozpracovano` = v procesu

## Souhrnne statistiky

| Metrika                             | Pocet |
|-------------------------------------|-------|
| Celkem komponent na preview strance | 68    |
| Etapa A (existujici bloky)          | 45    |
| Etapa B (nove bloky k vytvoreni)    | 19    |
| Neimplementovane (skip)             | 4     |

Pozn.: 45 pozic Etapy A sdili 44 unikatnich slug (1 pozice je duplikatni instance existujiciho bloku: pos 6).

## Kompletni mapovani

| Poradi | Original ID                                     | Nadpis                                        | Cilovy slug                     | Etapa |
|--------|-------------------------------------------------|-----------------------------------------------|---------------------------------|-------|
| 0      | `HeroPlain`                                     | Hero bez obrazku                              | `heroPlainBlock`                | A     |
| 1      | `HeroWithImage`                                 | Hero s obrazkem                               | `heroWithImageBlock`            | A     |
| 2      | `HeroWithImageAndSearch`                        | HERO s obrazkem a vyhledavanim                | `heroWithImageAndSearchBlock`   | A     |
| 3      | `HeroWithImageLow`                              | Hero s obrazkem nizke                         | `heroWithImageCompactBlock`     | A     |
| 4      | `HeroSlider`                                    | HERO s obrazkem ve slideru                    | `heroSliderBlock`               | A     |
| 5      | `Benefits`                                      | Benefity (1-3 bloky)                          | `benefitsBlock`                 | A     |
| 6      | `BenefitsWithFourColumns`                       | Benefity (1-4 bloky)                          | `benefitsBlock`                 | A     |
| 7      | `BenefitsWithImage`                             | Benefity s obrazky                            | `benefitsWithImageBlock`        | A     |
| 8      | `BenefitsWithList`                              | S kartou mensich benefitu                     | `benefitsWithListBlock`         | A     |
| 9      | `Callback`                                      | est cupidatat laborum                         | `callbackBlock`                 | A     |
| 10     | `CallbackSimplified`                            | est cupidatat laborum                         | `callbackSimplifiedBlock`       | A     |
| 11     | `CompareTable`                                  | Tabulka                                       | `compareTableBlock`             | A     |
| 12     | `ExchangeTradedFundsTable`                      | ETF tabulka                                   | `exchangeTradedFundsTableBlock` | A     |
| 13     | `LoyalCustomerBenefits`                         | Muzete ziskat 2 ruzne balicky vyhod           | `loyalCustomerBenefitsBlock`    | A     |
| 14     | `TableCardCollapsible`                          | Tabulka s cenikem                             | `tableCardCollapsibleBlock`     | B     |
| 15     | `Discounts`                                     | *(bez nadpisu)*                               | `discountsBlock`                | A     |
| 16     | `ExchangeRates`                                 | *(bez nadpisu)*                               | `exchangeRatesBlock`            | A     |
| 17     | `InvestmentAssistant`                           | *(bez nadpisu)*                               | —                               | skip  |
| 18     | `InvestmentCards`                               | est cupidatat laborum                         | `contentCardsBlock`             | A     |
| 19     | `ContactStrip`                                  | est cupidatat laborum                         | `contactStripBlock`             | A     |
| 20     | `Conversions`                                   | CTA blok                                      | `conversionsBlock`              | B     |
| 21     | `FaqItems`                                      | est cupidatat laborum                         | `faqItemsBlock`                 | A     |
| 22     | `DownloadSection`                               | *(bez nadpisu)*                               | `downloadSectionBlock`          | A     |
| 23     | `Feature`                                       | est cupidatat laborum                         | `featureBlock`                  | A     |
| 24     | `FeatureApplication`                            | est cupidatat laborum                         | `featureApplicationBlock`       | A     |
| 25     | `FlashMessage`                                  | *(bez nadpisu)*                               | `flashMessageBlock`             | A     |
| 26     | `HomepageIntro`                                 | est cupidatat laborum                         | `richTextBlock`                 | A     |
| 27     | `Image`                                         | est cupidatat laborum                         | `imageBlock`                    | B     |
| 28     | `InfoCardNarrow`                                | est cupidatat laborum                         | `infoCardNarrowBlock`           | A     |
| 29     | `JumbotronWithSticker`                          | Banner jumbotron s nalepkou                   | `jumbotronWithStickerBlock`     | B     |
| 30     | `InfoCenterCards`                               | est cupidatat laborum                         | `infoCenterCardsBlock`          | B     |
| 31     | `InfoCenterFaq`                                 | *(bez nadpisu)*                               | `infoCenterFaqBlock`            | A     |
| 32     | `InfoDesktop`                                   | Obsah s obrazkem                              | `infoDesktopBlock`              | B     |
| 33     | `InfoDoubleImage`                               | Obsah s dvojobrazkem                          | `infoDoubleImageBlock`          | A     |
| 34     | `InfoImage`                                     | Obsah s obrazkem bez odsazeni                 | `infoImageBlock`                | B     |
| 35     | `InfoImageBig`                                  | Obsah s velkym obrazkem                       | `infoImageBigBlock`             | A     |
| 36     | `InfoPlain`                                     | Obsah bez obrazku                             | `infoPlainBlock`                | B     |
| 37     | `InfoVideo`                                     | Obsah s videem                                | `infoVideoBlock`                | A     |
| 38     | `Jumbotron`                                     | est cupidatat laborum                         | `jumbotronBlock`                | B     |
| 39     | `myair-benefity`                                | Jak ucet pro dite uvidite v aplikaci          | —                               | skip  |
| 40     | `LinkCards`                                     | Obsah — karty s odkazem                       | `linkCardsBlock`                | A     |
| 41     | `LoyalCustomerApplication`                      | Blok s tlacitky na aplikaci                   | `loyalCustomerApplicationBlock` | A     |
| 42     | `LoyalCustomerTimeline`                         | Casova osa                                    | `loyalCustomerTimelineBlock`    | B     |
| 43     | `OmnichannelBanner`                             | *(bez nadpisu)*                               | `omnichannelBannerBlock`        | B     |
| 44     | `PressCenterContact`                            | PR sekce                                      | `pressCenterContactBlock`       | A     |
| 45     | `ProductCardHorizontal`                         | Benefity — karta horizontalni                 | `productCardHorizontalBlock`    | A     |
| 46     | `ProductCards`                                  | Benefity — karty                              | `productCardsVerticalBlock`     | A     |
| 47     | `ProductCardsHorizontal`                        | Benefity — karty horizontalni                 | `productCardsHorizontalBlock`   | B     |
| 48     | `SocialMediaIcons`                              | est cupidatat laborum                         | —                               | skip  |
| 49     | `SocialMediaShareIcons`                         | est cupidatat laborum                         | —                               | skip  |
| 50     | `Steps`                                         | Obsah s kroky                                 | `stepsBlock`                    | B     |
| 51     | `Timeline`                                      | Timeline                                      | `timelineBlock`                 | A     |
| 52     | `TopManagementCards`                            | Clenove nasi zakladni sestavy                 | `topManagementCardsBlock`       | A     |
| 53     | `VideoCards`                                    | Obsah — karty s videem                        | `videoCardsBlock`               | B     |
| 54     | `YouTube`                                       | *(bez nadpisu)*                               | `youtubeVideoBlock`             | A     |
| 55     | `ZoneInterest`                                  | Graf sporeni                                  | `zoneInterestBlock`             | A     |
| 56     | `kalkulacka`                                    | Zonky Rentier                                 | `zonkyCalculatorBlock`          | A     |
| 57     | `InflationCalculator`                           | Inflacni kalkulacka                           | `inflationCalculatorBlock`      | A     |
| 58     | `LoanCalculator`                                | Pujckova kalkulacka                           | `loanCalculatorBlock`           | A     |
| 59     | `hypotecni-kalkulacka`                          | Hypotecni kalkulacka                          | `mortgageCalculatorBlock`       | A     |
| 60     | `PortuCalculator`                               | Portu kalkulacka                              | `portuCalculatorBlock`          | B     |
| 61     | `PortuCalculatorPension`                        | Pordu DIP                                     | `portuPensionCalculatorBlock`   | B     |
| 62     | `SupplementaryPensionSavingsCalculatorEnhanced` | DPS kalkulacka                                | `pensionSavingsCalculatorBlock` | B     |
| 63     | `CompareTableBonds`                             | Terminovane vklady, ze kterych muzete vybirat | `compareBondsTableBlock`        | A     |
| 64     | `ExchangeCompareTable`                          | est cupidatat laborum                         | `exchangeCompareTableBlock`     | B     |
| 65     | `HeroReasonsSimplified`                         | est cupidatat laborum                         | `heroReasonsSimplifiedBlock`    | A     |
| 66     | `LogoCarousel`                                  | est cupidatat laborum                         | `logoCarouselBlock`             | A     |
| 67     | `StepsVerticalCollapsible`                      | est cupidatat laborum                         | `stepsVerticalCollapsibleBlock` | B     |

## Neimplementovane komponenty

| Poradi | Original ID             | Duvod vynechani                                                                        |
|--------|-------------------------|----------------------------------------------------------------------------------------|
| 17     | `InvestmentAssistant`   | Komplexni vicekrokovy interaktivni pruvodce investicemi — samostatna aplikace, ne blok |
| 39     | `myair-benefity`        | Webova komponenta (`<myair-benefity>`) — standalone custom element, ne CMS blok        |
| 48     | `SocialMediaIcons`      | Rada odkazu na socialni site — typicky reseno v ramci footer/layout                    |
| 49     | `SocialMediaShareIcons` | Tlacitka pro sdileni na socialni site — typicky reseno v ramci footer/layout           |
