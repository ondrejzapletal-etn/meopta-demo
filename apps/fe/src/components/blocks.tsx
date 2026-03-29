import { Page } from '@repo/shared/payload-types';
import { Section } from './section/section';

// Hero blocks
import { HeroPlainBlock } from '../blocks/hero/heroPlainBlock/heroPlainBlock';
import { HeroWithImageBlock } from '../blocks/hero/heroWithImageBlock/heroWithImageBlock';
import { HeroSliderBlock } from '../blocks/hero/heroSliderBlock/heroSliderBlock';
import { HeroSliderBlock2 } from '../blocks/hero/heroSliderBlock2/heroSliderBlock2';
import { HeroWithImageAndSearchBlock } from '../blocks/hero/heroWithImageAndSearchBlock/heroWithImageAndSearchBlock';
import { HeroWithImageCompactBlock } from '../blocks/hero/heroWithImageCompactBlock/heroWithImageCompactBlock';

// Content blocks
import { RichTextBlock } from '../blocks/richTextBlock/richTextBlock';
import { FeatureBlock } from '../blocks/content/featureBlock/featureBlock';
import { InfoDoubleImageBlock } from '../blocks/content/infoDoubleImageBlock/infoDoubleImageBlock';
import { InfoImageBigBlock } from '../blocks/content/infoImageBigBlock/infoImageBigBlock';
import { InfoVideoBlock } from '../blocks/content/infoVideoBlock/infoVideoBlock';
import { ContentCardsBlock } from '../blocks/content/contentCardsBlock/contentCardsBlock';
import { CallbackBlock } from '../blocks/content/callbackBlock/callbackBlock';
import { ContactStripBlock } from '../blocks/content/contactStripBlock/contactStripBlock';
import { FlashMessageBlock } from '../blocks/content/flashMessageBlock/flashMessageBlock';
import { ConversionsBlock } from '../blocks/content/conversionsBlock/conversionsBlock';
import { ImageBlock } from '../blocks/content/imageBlock/imageBlock';
import { JumbotronWithStickerBlock } from '../blocks/content/jumbotronWithStickerBlock/jumbotronWithStickerBlock';
import { InfoDesktopBlock } from '../blocks/content/infoDesktopBlock/infoDesktopBlock';
import { InfoImageBlock } from '../blocks/content/infoImageBlock/infoImageBlock';
import { InfoPlainBlock } from '../blocks/content/infoPlainBlock/infoPlainBlock';
import { JumbotronBlock } from '../blocks/content/jumbotronBlock/jumbotronBlock';

// Benefit blocks
import { BenefitsColumnsBlock } from '../blocks/benefits/benefitsColumnsBlock/benefitsColumnsBlock';
import { BenefitsBlock } from '../blocks/benefits/benefitsBlock/benefitsBlock';
import { BenefitsWithImageBlock } from '../blocks/benefits/benefitsWithImageBlock/benefitsWithImageBlock';
import { ProductCardsVerticalBlock } from '../blocks/benefits/productCardsVerticalBlock/productCardsVerticalBlock';
import { ProductCardHorizontalBlock } from '../blocks/benefits/productCardHorizontalBlock/productCardHorizontalBlock';
import { BenefitsWithListBlock } from '../blocks/benefits/benefitsWithListBlock/benefitsWithListBlock';

// Card blocks
import { CtaCardsBlock } from '../blocks/cards/ctaCardsBlock/ctaCardsBlock';
import { InfoCardNarrowBlock } from '../blocks/cards/infoCardNarrowBlock/infoCardNarrowBlock';
import { LoyalCustomerBenefitsBlock } from '../blocks/cards/loyalCustomerBenefitsBlock/loyalCustomerBenefitsBlock';
import { DiscountsBlock } from '../blocks/cards/discountsBlock/discountsBlock';
import { FaqItemsBlock } from '../blocks/cards/faqItemsBlock/faqItemsBlock';
import { InfoCenterFaqBlock } from '../blocks/cards/infoCenterFaqBlock/infoCenterFaqBlock';
import { InfoCenterCardsBlock } from '../blocks/cards/infoCenterCardsBlock/infoCenterCardsBlock';
import { VideoCardsBlock } from '../blocks/cards/videoCardsBlock/videoCardsBlock';
import { LinkCardsBlock } from '../blocks/cards/linkCardsBlock/linkCardsBlock';
import { HeroReasonsSimplifiedBlock } from '../blocks/cards/heroReasonsSimplifiedBlock/heroReasonsSimplifiedBlock';
import { ProductDetailCardsBlock } from '../blocks/cards/productDetailCardsBlock/productDetailCardsBlock';

// Table blocks
import { ExchangeTradedFundsTableBlock } from '../blocks/tables/exchangeTradedFundsTableBlock/exchangeTradedFundsTableBlock';
import { DownloadSectionBlockServer } from '../blocks/tables/downloadSectionBlock/downloadSectionBlockServer';
import { ExchangeRatesBlock } from '../blocks/tables/exchangeRatesBlock/exchangeRatesBlock';
import { CompareTableBlock } from '../blocks/tables/compareTableBlock/compareTableBlock';
import { CompareBondsTableBlock } from '../blocks/tables/compareBondsTableBlock/compareBondsTableBlock';
import { TableCardCollapsibleBlock } from '../blocks/tables/tableCardCollapsibleBlock/tableCardCollapsibleBlock';
import { ExchangeCompareTableBlock } from '../blocks/tables/exchangeCompareTableBlock/exchangeCompareTableBlock';

// Interactive blocks
import { LoanCalculatorBlock } from '../blocks/interactive/loanCalculatorBlock/loanCalculatorBlock';
import { MortgageCalculatorBlock } from '../blocks/interactive/mortgageCalculatorBlock/mortgageCalculatorBlock';
import { InflationCalculatorBlock } from '../blocks/interactive/inflationCalculatorBlock/inflationCalculatorBlock';
import { ZonkyCalculatorBlock } from '../blocks/interactive/zonkyCalculatorBlock/zonkyCalculatorBlock';
import { ZoneInterestBlock } from '../blocks/interactive/zoneInterestBlock/zoneInterestBlock';
import { PortuCalculatorBlock } from '../blocks/interactive/portuCalculatorBlock/portuCalculatorBlock';
import { PortuPensionCalculatorBlock } from '../blocks/interactive/portuPensionCalculatorBlock/portuPensionCalculatorBlock';
import { PensionSavingsCalculatorBlock } from '../blocks/interactive/pensionSavingsCalculatorBlock/pensionSavingsCalculatorBlock';

// Special blocks
import { TimelineBlock } from '../blocks/special/timelineBlock/timelineBlock';
import { TopManagementCardsBlock } from '../blocks/special/topManagementCardsBlock/topManagementCardsBlock';
import { PressCenterContactBlock } from '../blocks/special/pressCenterContactBlock/pressCenterContactBlock';
import { LogoCarouselBlock } from '../blocks/special/logoCarouselBlock/logoCarouselBlock';
import { FeatureApplicationBlockServer } from '../blocks/special/featureApplicationBlock/featureApplicationBlockServer';
import { YoutubeVideoBlock } from '../blocks/special/youtubeVideoBlock/youtubeVideoBlock';
import { CallbackSimplifiedBlock } from '../blocks/special/callbackSimplifiedBlock/callbackSimplifiedBlock';
import { LoyalCustomerTimelineBlock } from '../blocks/special/loyalCustomerTimelineBlock/loyalCustomerTimelineBlock';
import { OmnichannelBannerBlock } from '../blocks/special/omnichannelBannerBlock/omnichannelBannerBlock';
import { ProductCardsHorizontalBlock } from '../blocks/special/productCardsHorizontalBlock/productCardsHorizontalBlock';
import { StepsBlock } from '../blocks/special/stepsBlock/stepsBlock';
import { StepsVerticalCollapsibleBlock } from '../blocks/special/stepsVerticalCollapsibleBlock/stepsVerticalCollapsibleBlock';
import { LoyalCustomerApplicationBlockServer } from '../blocks/special/loyalCustomerApplicationBlock/loyalCustomerApplicationBlockServer';
import { ProductBannerBlock } from '../blocks/special/productBannerBlock/productBannerBlock';
import { HomepageBottomBlock } from '../blocks/special/homepageBottomBlock/homepageBottomBlock';
import { BranchListBlock } from '../blocks/special/branchListBlock/branchListBlock';
import { BranchMapBlock } from '../blocks/special/branchMapBlock/branchMapBlock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, { testId: string; component: React.FC<any> }> = {
  // Hero
  heroPlainBlock: { testId: 'hero-plain-block', component: HeroPlainBlock },
  heroWithImageBlock: { testId: 'hero-with-image-block', component: HeroWithImageBlock },
  heroSliderBlock: { testId: 'hero-slider-block', component: HeroSliderBlock },
  heroSliderBlock2: { testId: 'hero-slider-block-2', component: HeroSliderBlock2 },
  heroWithImageAndSearchBlock: { testId: 'hero-with-image-and-search-block', component: HeroWithImageAndSearchBlock },
  heroWithImageCompactBlock: { testId: 'hero-with-image-compact-block', component: HeroWithImageCompactBlock },
  // Content
  richTextBlock: { testId: 'rich-text-block', component: RichTextBlock },
  featureBlock: { testId: 'feature-block', component: FeatureBlock },
  infoDoubleImageBlock: { testId: 'info-double-image-block', component: InfoDoubleImageBlock },
  infoImageBigBlock: { testId: 'info-image-big-block', component: InfoImageBigBlock },
  infoVideoBlock: { testId: 'info-video-block', component: InfoVideoBlock },
  contentCardsBlock: { testId: 'content-cards-block', component: ContentCardsBlock },
  callbackBlock: { testId: 'callback-block', component: CallbackBlock },
  contactStripBlock: { testId: 'contact-strip-block', component: ContactStripBlock },
  flashMessageBlock: { testId: 'flash-message-block', component: FlashMessageBlock },
  conversionsBlock: { testId: 'conversions-block', component: ConversionsBlock },
  imageBlock: { testId: 'image-block', component: ImageBlock },
  jumbotronWithStickerBlock: { testId: 'jumbotron-with-sticker-block', component: JumbotronWithStickerBlock },
  infoDesktopBlock: { testId: 'info-desktop-block', component: InfoDesktopBlock },
  infoImageBlock: { testId: 'info-image-block', component: InfoImageBlock },
  infoPlainBlock: { testId: 'info-plain-block', component: InfoPlainBlock },
  jumbotronBlock: { testId: 'jumbotron-block', component: JumbotronBlock },
  // Benefits
  benefitsBlock: { testId: 'benefits-block', component: BenefitsBlock },
  benefitsWithImageBlock: { testId: 'benefits-with-image-block', component: BenefitsWithImageBlock },
  productCardsVerticalBlock: { testId: 'product-cards-vertical-block', component: ProductCardsVerticalBlock },
  productCardHorizontalBlock: { testId: 'product-card-horizontal-block', component: ProductCardHorizontalBlock },
  benefitsWithListBlock: { testId: 'benefits-with-list-block', component: BenefitsWithListBlock },
  benefitsColumnsBlock: { testId: 'benefits-columns-block', component: BenefitsColumnsBlock },
  // Cards
  infoCardNarrowBlock: { testId: 'info-card-narrow-block', component: InfoCardNarrowBlock },
  loyalCustomerBenefitsBlock: { testId: 'loyal-customer-benefits-block', component: LoyalCustomerBenefitsBlock },
  discountsBlock: { testId: 'discounts-block', component: DiscountsBlock },
  faqItemsBlock: { testId: 'faq-items-block', component: FaqItemsBlock },
  infoCenterFaqBlock: { testId: 'info-center-faq-block', component: InfoCenterFaqBlock },
  infoCenterCardsBlock: { testId: 'info-center-cards-block', component: InfoCenterCardsBlock },
  videoCardsBlock: { testId: 'video-cards-block', component: VideoCardsBlock },
  linkCardsBlock: { testId: 'link-cards-block', component: LinkCardsBlock },
  heroReasonsSimplifiedBlock: { testId: 'hero-reasons-simplified-block', component: HeroReasonsSimplifiedBlock },
  ctaCardsBlock: { testId: 'cta-cards-block', component: CtaCardsBlock },
  productDetailCardsBlock: { testId: 'product-detail-cards-block', component: ProductDetailCardsBlock },
  // Tables
  exchangeTradedFundsTableBlock: { testId: 'exchange-traded-funds-table-block', component: ExchangeTradedFundsTableBlock },
  downloadSectionBlock: { testId: 'download-section-block', component: DownloadSectionBlockServer },
  exchangeRatesBlock: { testId: 'exchange-rates-block', component: ExchangeRatesBlock },
  compareTableBlock: { testId: 'compare-table-block', component: CompareTableBlock },
  compareBondsTableBlock: { testId: 'compare-bonds-table-block', component: CompareBondsTableBlock },
  tableCardCollapsibleBlock: { testId: 'table-card-collapsible-block', component: TableCardCollapsibleBlock },
  exchangeCompareTableBlock: { testId: 'exchange-compare-table-block', component: ExchangeCompareTableBlock },
  // Interactive
  loanCalculatorBlock: { testId: 'loan-calculator-block', component: LoanCalculatorBlock },
  mortgageCalculatorBlock: { testId: 'mortgage-calculator-block', component: MortgageCalculatorBlock },
  inflationCalculatorBlock: { testId: 'inflation-calculator-block', component: InflationCalculatorBlock },
  zonkyCalculatorBlock: { testId: 'zonky-calculator-block', component: ZonkyCalculatorBlock },
  zoneInterestBlock: { testId: 'zone-interest-block', component: ZoneInterestBlock },
  portuCalculatorBlock: { testId: 'portu-calculator-block', component: PortuCalculatorBlock },
  portuPensionCalculatorBlock: { testId: 'portu-pension-calculator-block', component: PortuPensionCalculatorBlock },
  pensionSavingsCalculatorBlock: { testId: 'pension-savings-calculator-block', component: PensionSavingsCalculatorBlock },
  // Special
  timelineBlock: { testId: 'timeline-block', component: TimelineBlock },
  topManagementCardsBlock: { testId: 'top-management-cards-block', component: TopManagementCardsBlock },
  pressCenterContactBlock: { testId: 'press-center-contact-block', component: PressCenterContactBlock },
  logoCarouselBlock: { testId: 'logo-carousel-block', component: LogoCarouselBlock },
  featureApplicationBlock: { testId: 'feature-application-block', component: FeatureApplicationBlockServer },
  youtubeVideoBlock: { testId: 'youtube-video-block', component: YoutubeVideoBlock },
  callbackSimplifiedBlock: { testId: 'callback-simplified-block', component: CallbackSimplifiedBlock },
  loyalCustomerTimelineBlock: { testId: 'loyal-customer-timeline-block', component: LoyalCustomerTimelineBlock },
  omnichannelBannerBlock: { testId: 'omnichannel-banner-block', component: OmnichannelBannerBlock },
  productCardsHorizontalBlock: { testId: 'product-cards-horizontal-block', component: ProductCardsHorizontalBlock },
  stepsBlock: { testId: 'steps-block', component: StepsBlock },
  stepsVerticalCollapsibleBlock: { testId: 'steps-vertical-collapsible-block', component: StepsVerticalCollapsibleBlock },
  loyalCustomerApplicationBlock: { testId: 'loyal-customer-application-block', component: LoyalCustomerApplicationBlockServer },
  productBannerBlock: { testId: 'product-banner-block', component: ProductBannerBlock },
  homepageBottomBlock: { testId: 'homepage-bottom-block', component: HomepageBottomBlock },
  branchListBlock: { testId: 'branch-list-block', component: BranchListBlock },
  branchMapBlock: { testId: 'branch-map-block', component: BranchMapBlock },
};

interface BlocksProps {
  blocks: Page['layout'];
}

export const Blocks = ({ blocks }: BlocksProps) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <>
        {blocks.map((block) => {
          if (block?.blockType && block.blockType in blockComponents) {
            const entry = blockComponents[block.blockType];
            if (!entry) return null;
            const { testId, component: Block } = entry;

            return (
              <Section
                as="section"
                key={block.id}
                id={block?.layoutStyles?.anchorId || undefined}
                testId={testId}
              >
                <Block {...block} />
              </Section>
            );
          }
        })}
      </>
    );
  }
};
