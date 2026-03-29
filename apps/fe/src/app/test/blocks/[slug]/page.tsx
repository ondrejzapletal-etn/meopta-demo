import { Montserrat } from 'next/font/google';
import { notFound } from 'next/navigation';
import * as fs from 'fs';
import * as path from 'path';
import { Section } from '../../../../components/section/section';
import '../../../../app/globals.css';

// Import all block components
import { HeroPlainBlock } from '../../../../blocks/hero/heroPlainBlock/heroPlainBlock';
import { HeroWithImageBlock } from '../../../../blocks/hero/heroWithImageBlock/heroWithImageBlock';
import { HeroSliderBlock } from '../../../../blocks/hero/heroSliderBlock/heroSliderBlock';
import { HeroWithImageAndSearchBlock } from '../../../../blocks/hero/heroWithImageAndSearchBlock/heroWithImageAndSearchBlock';
import { HeroWithImageCompactBlock } from '../../../../blocks/hero/heroWithImageCompactBlock/heroWithImageCompactBlock';
import { RichTextBlock } from '../../../../blocks/richTextBlock/richTextBlock';
import { FeatureBlock } from '../../../../blocks/content/featureBlock/featureBlock';
import { InfoDoubleImageBlock } from '../../../../blocks/content/infoDoubleImageBlock/infoDoubleImageBlock';
import { InfoImageBigBlock } from '../../../../blocks/content/infoImageBigBlock/infoImageBigBlock';
import { InfoVideoBlock } from '../../../../blocks/content/infoVideoBlock/infoVideoBlock';
import { ContentCardsBlock } from '../../../../blocks/content/contentCardsBlock/contentCardsBlock';
import { CallbackBlock } from '../../../../blocks/content/callbackBlock/callbackBlock';
import { ContactStripBlock } from '../../../../blocks/content/contactStripBlock/contactStripBlock';
import { FlashMessageBlock } from '../../../../blocks/content/flashMessageBlock/flashMessageBlock';
import { ConversionsBlock } from '../../../../blocks/content/conversionsBlock/conversionsBlock';
import { ImageBlock } from '../../../../blocks/content/imageBlock/imageBlock';
import { JumbotronWithStickerBlock } from '../../../../blocks/content/jumbotronWithStickerBlock/jumbotronWithStickerBlock';
import { InfoDesktopBlock } from '../../../../blocks/content/infoDesktopBlock/infoDesktopBlock';
import { InfoImageBlock } from '../../../../blocks/content/infoImageBlock/infoImageBlock';
import { InfoPlainBlock } from '../../../../blocks/content/infoPlainBlock/infoPlainBlock';
import { JumbotronBlock } from '../../../../blocks/content/jumbotronBlock/jumbotronBlock';
import { BenefitsBlock } from '../../../../blocks/benefits/benefitsBlock/benefitsBlock';
import { BenefitsWithImageBlock } from '../../../../blocks/benefits/benefitsWithImageBlock/benefitsWithImageBlock';
import { ProductCardsVerticalBlock } from '../../../../blocks/benefits/productCardsVerticalBlock/productCardsVerticalBlock';
import { ProductCardHorizontalBlock } from '../../../../blocks/benefits/productCardHorizontalBlock/productCardHorizontalBlock';
import { BenefitsWithListBlock } from '../../../../blocks/benefits/benefitsWithListBlock/benefitsWithListBlock';
import { InfoCardNarrowBlock } from '../../../../blocks/cards/infoCardNarrowBlock/infoCardNarrowBlock';
import { LoyalCustomerBenefitsBlock } from '../../../../blocks/cards/loyalCustomerBenefitsBlock/loyalCustomerBenefitsBlock';
import { DiscountsBlock } from '../../../../blocks/cards/discountsBlock/discountsBlock';
import { FaqItemsBlock } from '../../../../blocks/cards/faqItemsBlock/faqItemsBlock';
import { InfoCenterFaqBlock } from '../../../../blocks/cards/infoCenterFaqBlock/infoCenterFaqBlock';
import { InfoCenterCardsBlock } from '../../../../blocks/cards/infoCenterCardsBlock/infoCenterCardsBlock';
import { VideoCardsBlock } from '../../../../blocks/cards/videoCardsBlock/videoCardsBlock';
import { LinkCardsBlock } from '../../../../blocks/cards/linkCardsBlock/linkCardsBlock';
import { HeroReasonsSimplifiedBlock } from '../../../../blocks/cards/heroReasonsSimplifiedBlock/heroReasonsSimplifiedBlock';
import { ExchangeTradedFundsTableBlock } from '../../../../blocks/tables/exchangeTradedFundsTableBlock/exchangeTradedFundsTableBlock';
import { DownloadSectionBlock } from '../../../../blocks/tables/downloadSectionBlock/downloadSectionBlock';
import { ExchangeRatesBlock } from '../../../../blocks/tables/exchangeRatesBlock/exchangeRatesBlock';
import { CompareTableBlock } from '../../../../blocks/tables/compareTableBlock/compareTableBlock';
import { CompareBondsTableBlock } from '../../../../blocks/tables/compareBondsTableBlock/compareBondsTableBlock';
import { TableCardCollapsibleBlock } from '../../../../blocks/tables/tableCardCollapsibleBlock/tableCardCollapsibleBlock';
import { ExchangeCompareTableBlock } from '../../../../blocks/tables/exchangeCompareTableBlock/exchangeCompareTableBlock';
import { LoanCalculatorBlock } from '../../../../blocks/interactive/loanCalculatorBlock/loanCalculatorBlock';
import { MortgageCalculatorBlock } from '../../../../blocks/interactive/mortgageCalculatorBlock/mortgageCalculatorBlock';
import { InflationCalculatorBlock } from '../../../../blocks/interactive/inflationCalculatorBlock/inflationCalculatorBlock';
import { ZonkyCalculatorBlock } from '../../../../blocks/interactive/zonkyCalculatorBlock/zonkyCalculatorBlock';
import { ZoneInterestBlock } from '../../../../blocks/interactive/zoneInterestBlock/zoneInterestBlock';
import { PortuCalculatorBlock } from '../../../../blocks/interactive/portuCalculatorBlock/portuCalculatorBlock';
import { PortuPensionCalculatorBlock } from '../../../../blocks/interactive/portuPensionCalculatorBlock/portuPensionCalculatorBlock';
import { PensionSavingsCalculatorBlock } from '../../../../blocks/interactive/pensionSavingsCalculatorBlock/pensionSavingsCalculatorBlock';
import { TimelineBlock } from '../../../../blocks/special/timelineBlock/timelineBlock';
import { TopManagementCardsBlock } from '../../../../blocks/special/topManagementCardsBlock/topManagementCardsBlock';
import { PressCenterContactBlock } from '../../../../blocks/special/pressCenterContactBlock/pressCenterContactBlock';
import { LogoCarouselBlock } from '../../../../blocks/special/logoCarouselBlock/logoCarouselBlock';
import { FeatureApplicationBlock } from '../../../../blocks/special/featureApplicationBlock/featureApplicationBlock';
import { YoutubeVideoBlock } from '../../../../blocks/special/youtubeVideoBlock/youtubeVideoBlock';
import { CallbackSimplifiedBlock } from '../../../../blocks/special/callbackSimplifiedBlock/callbackSimplifiedBlock';
import { LoyalCustomerTimelineBlock } from '../../../../blocks/special/loyalCustomerTimelineBlock/loyalCustomerTimelineBlock';
import { OmnichannelBannerBlock } from '../../../../blocks/special/omnichannelBannerBlock/omnichannelBannerBlock';
import { ProductCardsHorizontalBlock } from '../../../../blocks/special/productCardsHorizontalBlock/productCardsHorizontalBlock';
import { StepsBlock } from '../../../../blocks/special/stepsBlock/stepsBlock';
import { StepsVerticalCollapsibleBlock } from '../../../../blocks/special/stepsVerticalCollapsibleBlock/stepsVerticalCollapsibleBlock';
import { LoyalCustomerApplicationBlock } from '../../../../blocks/special/loyalCustomerApplicationBlock/loyalCustomerApplicationBlock';
import { BranchMapBlock } from '../../../../blocks/special/branchMapBlock/branchMapBlock';
import { BranchListBlock } from '../../../../blocks/special/branchListBlock/branchListBlock';
import { BenefitsColumnsBlock } from '../../../../blocks/benefits/benefitsColumnsBlock/benefitsColumnsBlock';
import { CtaCardsBlock } from '../../../../blocks/cards/ctaCardsBlock/ctaCardsBlock';
import { ProductDetailCardsBlock } from '../../../../blocks/cards/productDetailCardsBlock/productDetailCardsBlock';
import { ProductBannerBlock } from '../../../../blocks/special/productBannerBlock/productBannerBlock';
import { HomepageBottomBlock } from '../../../../blocks/special/homepageBottomBlock/homepageBottomBlock';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

// Block component registry (same as blocks.tsx)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, { testId: string; component: React.FC<any> }> = {
  heroPlainBlock: { testId: 'hero-plain-block', component: HeroPlainBlock },
  heroWithImageBlock: { testId: 'hero-with-image-block', component: HeroWithImageBlock },
  heroSliderBlock: { testId: 'hero-slider-block', component: HeroSliderBlock },
  heroWithImageAndSearchBlock: { testId: 'hero-with-image-and-search-block', component: HeroWithImageAndSearchBlock },
  heroWithImageCompactBlock: { testId: 'hero-with-image-compact-block', component: HeroWithImageCompactBlock },
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
  benefitsBlock: { testId: 'benefits-block', component: BenefitsBlock },
  benefitsWithImageBlock: { testId: 'benefits-with-image-block', component: BenefitsWithImageBlock },
  productCardsVerticalBlock: { testId: 'product-cards-vertical-block', component: ProductCardsVerticalBlock },
  productCardHorizontalBlock: { testId: 'product-card-horizontal-block', component: ProductCardHorizontalBlock },
  benefitsWithListBlock: { testId: 'benefits-with-list-block', component: BenefitsWithListBlock },
  infoCardNarrowBlock: { testId: 'info-card-narrow-block', component: InfoCardNarrowBlock },
  loyalCustomerBenefitsBlock: { testId: 'loyal-customer-benefits-block', component: LoyalCustomerBenefitsBlock },
  discountsBlock: { testId: 'discounts-block', component: DiscountsBlock },
  faqItemsBlock: { testId: 'faq-items-block', component: FaqItemsBlock },
  infoCenterFaqBlock: { testId: 'info-center-faq-block', component: InfoCenterFaqBlock },
  infoCenterCardsBlock: { testId: 'info-center-cards-block', component: InfoCenterCardsBlock },
  videoCardsBlock: { testId: 'video-cards-block', component: VideoCardsBlock },
  linkCardsBlock: { testId: 'link-cards-block', component: LinkCardsBlock },
  heroReasonsSimplifiedBlock: { testId: 'hero-reasons-simplified-block', component: HeroReasonsSimplifiedBlock },
  exchangeTradedFundsTableBlock: { testId: 'exchange-traded-funds-table-block', component: ExchangeTradedFundsTableBlock },
  downloadSectionBlock: { testId: 'download-section-block', component: DownloadSectionBlock },
  exchangeRatesBlock: { testId: 'exchange-rates-block', component: ExchangeRatesBlock },
  compareTableBlock: { testId: 'compare-table-block', component: CompareTableBlock },
  compareBondsTableBlock: { testId: 'compare-bonds-table-block', component: CompareBondsTableBlock },
  tableCardCollapsibleBlock: { testId: 'table-card-collapsible-block', component: TableCardCollapsibleBlock },
  exchangeCompareTableBlock: { testId: 'exchange-compare-table-block', component: ExchangeCompareTableBlock },
  loanCalculatorBlock: { testId: 'loan-calculator-block', component: LoanCalculatorBlock },
  mortgageCalculatorBlock: { testId: 'mortgage-calculator-block', component: MortgageCalculatorBlock },
  inflationCalculatorBlock: { testId: 'inflation-calculator-block', component: InflationCalculatorBlock },
  zonkyCalculatorBlock: { testId: 'zonky-calculator-block', component: ZonkyCalculatorBlock },
  zoneInterestBlock: { testId: 'zone-interest-block', component: ZoneInterestBlock },
  portuCalculatorBlock: { testId: 'portu-calculator-block', component: PortuCalculatorBlock },
  portuPensionCalculatorBlock: { testId: 'portu-pension-calculator-block', component: PortuPensionCalculatorBlock },
  pensionSavingsCalculatorBlock: { testId: 'pension-savings-calculator-block', component: PensionSavingsCalculatorBlock },
  timelineBlock: { testId: 'timeline-block', component: TimelineBlock },
  topManagementCardsBlock: { testId: 'top-management-cards-block', component: TopManagementCardsBlock },
  pressCenterContactBlock: { testId: 'press-center-contact-block', component: PressCenterContactBlock },
  logoCarouselBlock: { testId: 'logo-carousel-block', component: LogoCarouselBlock },
  featureApplicationBlock: { testId: 'feature-application-block', component: FeatureApplicationBlock },
  youtubeVideoBlock: { testId: 'youtube-video-block', component: YoutubeVideoBlock },
  callbackSimplifiedBlock: { testId: 'callback-simplified-block', component: CallbackSimplifiedBlock },
  loyalCustomerTimelineBlock: { testId: 'loyal-customer-timeline-block', component: LoyalCustomerTimelineBlock },
  omnichannelBannerBlock: { testId: 'omnichannel-banner-block', component: OmnichannelBannerBlock },
  productCardsHorizontalBlock: { testId: 'product-cards-horizontal-block', component: ProductCardsHorizontalBlock },
  stepsBlock: { testId: 'steps-block', component: StepsBlock },
  stepsVerticalCollapsibleBlock: { testId: 'steps-vertical-collapsible-block', component: StepsVerticalCollapsibleBlock },
  loyalCustomerApplicationBlock: { testId: 'loyal-customer-application-block', component: LoyalCustomerApplicationBlock },
  branchMapBlock: { testId: 'branch-map-block', component: BranchMapBlock },
  branchListBlock: { testId: 'branch-list-block', component: BranchListBlock },
  benefitsColumnsBlock: { testId: 'benefits-columns-block', component: BenefitsColumnsBlock },
  ctaCardsBlock: { testId: 'cta-cards-block', component: CtaCardsBlock },
  productDetailCardsBlock: { testId: 'product-detail-cards-block', component: ProductDetailCardsBlock },
  productBannerBlock: { testId: 'product-banner-block', component: ProductBannerBlock },
  homepageBottomBlock: { testId: 'homepage-bottom-block', component: HomepageBottomBlock },
};

// Load fixture data from reference directory
function loadFixture(slug: string): Record<string, unknown> | null {
  const fixturePath = path.join(
    process.cwd(),
    '../../scripts/reference',
    slug,
    'fixture.json',
  );
  try {
    if (fs.existsSync(fixturePath)) {
      return JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
    }
  } catch {
    // Fall through to null
  }

  // Try alternative path (running from monorepo root)
  const altPath = path.join(process.cwd(), 'scripts/reference', slug, 'fixture.json');
  try {
    if (fs.existsSync(altPath)) {
      return JSON.parse(fs.readFileSync(altPath, 'utf-8'));
    }
  } catch {
    // Fall through to null
  }

  return null;
}

interface TestBlockPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TestBlockPage({ params }: TestBlockPageProps) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { slug } = await params;

  const entry = blockComponents[slug];
  if (!entry) {
    notFound();
  }

  const { testId, component: Block } = entry;

  // Load fixture data
  const fixture = loadFixture(slug) || {
    id: `test-${slug}`,
    blockType: slug,
  };

  return (
    <html lang="cs">
      <body className={montserrat.variable}>
        <main>
          <Section
            as="section"
            testId={testId}
          >
            <Block {...fixture} />
          </Section>
        </main>
      </body>
    </html>
  );
}

// Generate static params for all known blocks
export function generateStaticParams() {
  return Object.keys(blockComponents).map((slug) => ({ slug }));
}
