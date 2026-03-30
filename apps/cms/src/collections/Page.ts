import React from 'react';
import { CollectionConfig } from 'payload';
import { HeroPlainBlock } from '../blocks/hero/HeroPlainBlock';
import { RichTextBlock } from '../blocks/RichTextBlock';
import { HeroWithImageBlock } from '../blocks/hero/HeroWithImageBlock';
import { HeroSliderBlock } from '../blocks/hero/HeroSliderBlock';
import { HeroSliderBlock2 } from '../blocks/hero/HeroSliderBlock2';
import { HeroWithImageAndSearchBlock } from '../blocks/hero/HeroWithImageAndSearchBlock';
import { HeroWithImageCompactBlock } from '../blocks/hero/HeroWithImageCompactBlock';
import { InfoCardNarrowBlock } from '../blocks/cards/InfoCardNarrowBlock';
import { BenefitsBlock } from '../blocks/benefits/BenefitsBlock';
import { BenefitsWithImageBlock } from '../blocks/benefits/BenefitsWithImageBlock';
import { FeatureBlock } from '../blocks/content/FeatureBlock';
import { InfoDoubleImageBlock } from '../blocks/content/InfoDoubleImageBlock';
import { InfoImageBigBlock } from '../blocks/content/InfoImageBigBlock';
import { InfoVideoBlock } from '../blocks/content/InfoVideoBlock';
import { ContentCardsBlock } from '../blocks/content/ContentCardsBlock';
import { CallbackBlock } from '../blocks/content/CallbackBlock';
import { ContactStripBlock } from '../blocks/content/ContactStripBlock';
import { FlashMessageBlock } from '../blocks/content/FlashMessageBlock';
import { ProductCardsVerticalBlock } from '../blocks/benefits/ProductCardsVerticalBlock';
import { ProductCardHorizontalBlock } from '../blocks/benefits/ProductCardHorizontalBlock';
import { BenefitsWithListBlock } from '../blocks/benefits/BenefitsWithListBlock';
import { LoyalCustomerBenefitsBlock } from '../blocks/cards/LoyalCustomerBenefitsBlock';
import { DiscountsBlock } from '../blocks/cards/DiscountsBlock';
import { FaqItemsBlock } from '../blocks/cards/FaqItemsBlock';
import { InfoCenterFaqBlock } from '../blocks/cards/InfoCenterFaqBlock';
import { ExchangeTradedFundsTableBlock } from '../blocks/tables/ExchangeTradedFundsTableBlock';
import { DownloadSectionBlock } from '../blocks/tables/DownloadSectionBlock';
import { ExchangeRatesBlock } from '../blocks/tables/ExchangeRatesBlock';
import { CompareTableBlock } from '../blocks/tables/CompareTableBlock';
import { CompareBondsTableBlock } from '../blocks/tables/CompareBondsTableBlock';
import { LoanCalculatorBlock } from '../blocks/interactive/LoanCalculatorBlock';
import { MortgageCalculatorBlock } from '../blocks/interactive/MortgageCalculatorBlock';
import { InflationCalculatorBlock } from '../blocks/interactive/InflationCalculatorBlock';
import { ZonkyCalculatorBlock } from '../blocks/interactive/ZonkyCalculatorBlock';
import { ZoneInterestBlock } from '../blocks/interactive/ZoneInterestBlock';
import { TimelineBlock } from '../blocks/special/TimelineBlock';
import { TopManagementCardsBlock } from '../blocks/special/TopManagementCardsBlock';
import { PressCenterContactBlock } from '../blocks/special/PressCenterContactBlock';
import { LogoCarouselBlock } from '../blocks/special/LogoCarouselBlock';
import { FeatureApplicationBlock } from '../blocks/special/FeatureApplicationBlock';
import { YoutubeVideoBlock } from '../blocks/special/YoutubeVideoBlock';
import { CallbackSimplifiedBlock } from '../blocks/special/CallbackSimplifiedBlock';
// New content blocks
import { ConversionsBlock } from '../blocks/content/ConversionsBlock';
import { ImageBlock } from '../blocks/content/ImageBlock';
import { JumbotronWithStickerBlock } from '../blocks/content/JumbotronWithStickerBlock';
import { InfoDesktopBlock } from '../blocks/content/InfoDesktopBlock';
import { InfoImageBlock } from '../blocks/content/InfoImageBlock';
import { InfoPlainBlock } from '../blocks/content/InfoPlainBlock';
import { JumbotronBlock } from '../blocks/content/JumbotronBlock';
// New card blocks
import { InfoCenterCardsBlock } from '../blocks/cards/InfoCenterCardsBlock';
import { VideoCardsBlock } from '../blocks/cards/VideoCardsBlock';
import { LinkCardsBlock } from '../blocks/cards/LinkCardsBlock';
import { HeroReasonsSimplifiedBlock } from '../blocks/cards/HeroReasonsSimplifiedBlock';
// New table blocks
import { TableCardCollapsibleBlock } from '../blocks/tables/TableCardCollapsibleBlock';
import { ExchangeCompareTableBlock } from '../blocks/tables/ExchangeCompareTableBlock';
// New interactive blocks
import { PortuCalculatorBlock } from '../blocks/interactive/PortuCalculatorBlock';
import { PortuPensionCalculatorBlock } from '../blocks/interactive/PortuPensionCalculatorBlock';
import { PensionSavingsCalculatorBlock } from '../blocks/interactive/PensionSavingsCalculatorBlock';
// New special blocks
import { LoyalCustomerTimelineBlock } from '../blocks/special/LoyalCustomerTimelineBlock';
import { OmnichannelBannerBlock } from '../blocks/special/OmnichannelBannerBlock';
import { ProductCardsHorizontalBlock } from '../blocks/special/ProductCardsHorizontalBlock';
import { StepsBlock } from '../blocks/special/StepsBlock';
import { StepsVerticalCollapsibleBlock } from '../blocks/special/StepsVerticalCollapsibleBlock';
import { LoyalCustomerApplicationBlock } from '../blocks/special/LoyalCustomerApplicationBlock';
import { ProductBannerBlock } from '../blocks/special/ProductBannerBlock';
import { HomepageBottomBlock } from '../blocks/special/HomepageBottomBlock';
import { BranchListBlock } from '../blocks/special/BranchListBlock';
import { BranchMapBlock } from '../blocks/special/BranchMapBlock';
import { BenefitsColumnsBlock } from '../blocks/benefits/BenefitsColumnsBlock';
import { CtaCardsBlock } from '../blocks/cards/CtaCardsBlock';
import { ProductDetailCardsBlock } from '../blocks/cards/ProductDetailCardsBlock';
import { Slug } from '../fields/Slug';
import { createAuditLogDelete, createAuditLogModify } from '../hooks/auditLogs';
import { generateAISummary } from '../hooks/generateAISummary';
import { versionsConfig } from '../utils/versions';
import { SeoFieldInfo } from '../components/SeoFieldInfo';

const SeoTitleInfo = () => React.createElement(SeoFieldInfo, { field: 'title' });

type BlockLike = { id?: string; [key: string]: unknown };

const stripIds = (items: BlockLike[]): BlockLike[] =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  items.map(({ id: _id, ...item }) => {
    for (const [key, val] of Object.entries(item)) {
      if (Array.isArray(val) && val[0] && typeof val[0] === 'object')
        (item as Record<string, unknown>)[key] = stripIds(val as BlockLike[]);
    }
    return item;
  });

const pageBlocks = [
  // Hero blocks
  HeroPlainBlock,
  HeroWithImageBlock,
  HeroSliderBlock,
  HeroSliderBlock2,
  HeroWithImageAndSearchBlock,
  HeroWithImageCompactBlock,
  // Content blocks
  RichTextBlock,
  FeatureBlock,
  InfoDoubleImageBlock,
  InfoImageBigBlock,
  InfoVideoBlock,
  ContentCardsBlock,
  CallbackBlock,
  ContactStripBlock,
  FlashMessageBlock,
  ConversionsBlock,
  ImageBlock,
  JumbotronWithStickerBlock,
  InfoDesktopBlock,
  InfoImageBlock,
  InfoPlainBlock,
  JumbotronBlock,
  // Benefit blocks
  BenefitsBlock,
  BenefitsWithImageBlock,
  ProductCardsVerticalBlock,
  ProductCardHorizontalBlock,
  BenefitsWithListBlock,
  // Card blocks
  InfoCardNarrowBlock,
  LoyalCustomerBenefitsBlock,
  DiscountsBlock,
  FaqItemsBlock,
  InfoCenterFaqBlock,
  InfoCenterCardsBlock,
  VideoCardsBlock,
  LinkCardsBlock,
  HeroReasonsSimplifiedBlock,
  // Table blocks
  ExchangeTradedFundsTableBlock,
  DownloadSectionBlock,
  ExchangeRatesBlock,
  CompareTableBlock,
  CompareBondsTableBlock,
  TableCardCollapsibleBlock,
  ExchangeCompareTableBlock,
  // Interactive blocks
  LoanCalculatorBlock,
  MortgageCalculatorBlock,
  InflationCalculatorBlock,
  ZonkyCalculatorBlock,
  ZoneInterestBlock,
  PortuCalculatorBlock,
  PortuPensionCalculatorBlock,
  PensionSavingsCalculatorBlock,
  // Special blocks
  TimelineBlock,
  TopManagementCardsBlock,
  PressCenterContactBlock,
  LogoCarouselBlock,
  FeatureApplicationBlock,
  YoutubeVideoBlock,
  CallbackSimplifiedBlock,
  LoyalCustomerTimelineBlock,
  OmnichannelBannerBlock,
  ProductCardsHorizontalBlock,
  StepsBlock,
  StepsVerticalCollapsibleBlock,
  LoyalCustomerApplicationBlock,
  ProductBannerBlock,
  HomepageBottomBlock,
  BranchListBlock,
  BranchMapBlock,
  BenefitsColumnsBlock,
  CtaCardsBlock,
  ProductDetailCardsBlock,
];

export const Page: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      admin: {
        description: 'Titulek stránky, zobrazuje se uživateli v tabu prohlížeče. Může být přepsán nastavením v SEO záložce.',
        components: {
          AfterInput: SeoTitleInfo,
        },
      },
      name: 'title',
      type: 'text',
    },
    Slug,
    {
      name: 'abPreviewSegment',
      type: 'radio',
      label: 'Náhled varianty',
      options: [
        { label: 'Varianta A', value: 'A' },
        { label: 'Varianta B', value: 'B' },
      ],
      defaultValue: 'A',
      admin: {
        layout: 'horizontal',
        condition: (data) => Boolean(data?.abEnabled),
        description: 'Vyberte variantu pro živý náhled v CMS.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Obsah (Varianta A)',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: pageBlocks,
              admin: {
                description: 'Obsah stránky, rozdělený do jednotlivých komponent.',
              },
            },
          ],
        },
        {
          label: 'A/B Test (Varianta B)',
          admin: {
            condition: (data) => Boolean(data?.abEnabled),
          },
          fields: [
            {
              name: 'variantB',
              type: 'blocks',
              blocks: pageBlocks,
              admin: {
                condition: (data) => Boolean(data?.abEnabled),
              },
            },
          ],
        },
        // Validace tab už bude přidána pluginem
      ],
    },
    // Hidden AI fields (not shown in the main form, populated by hooks & API)
    // Add Meta Image info to SEO tab via plugin customization if possible
    {
      name: 'aiSummary',
      type: 'textarea',
      admin: { hidden: true },
    },
    {
      name: 'aiValidation',
      type: 'group',
      admin: { hidden: true },
      fields: [
        { name: 'seo', type: 'json' },
        { name: 'geo', type: 'json' },
        { name: 'updatedAt', type: 'date' },
      ],
    },
    // A/B testing fields
    {
      name: 'abEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Aktivovat A/B test',
      admin: {
        description: 'Varianta B se zobrazí s parametrem ?ab=B v URL.',
      },
    },

  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Always strip IDs from variantB so Payload generates fresh unique IDs on save.
        // layout and variantB share the same DB tables (distinguished by _path),
        // so duplicate IDs (e.g. from copy-paste in admin UI) cause a PK violation.
        if (data.variantB?.length)
          data.variantB = stripIds(data.variantB as BlockLike[]);
        return data;
      },
    ],
    afterChange: [createAuditLogModify, generateAISummary],
    afterDelete: [createAuditLogDelete],
  },
  versions: versionsConfig,
};
