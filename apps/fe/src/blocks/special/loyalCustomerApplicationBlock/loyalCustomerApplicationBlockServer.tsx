import { LoyalCustomerApplicationBlock as LoyalCustomerApplicationBlockType } from '@repo/shared/payload-types';
import { fetchSettings } from '../../../api/fetch';
import { LoyalCustomerApplicationBlock } from './loyalCustomerApplicationBlock';

export const LoyalCustomerApplicationBlockServer = async (props: LoyalCustomerApplicationBlockType) => {
  let iosUrl: string | undefined;
  let androidUrl: string | undefined;

  try {
    const settings = await fetchSettings();
    iosUrl = settings?.appStore?.iosUrl ?? undefined;
    androidUrl = settings?.appStore?.androidUrl ?? undefined;
  } catch {
    // per-block URLs will be used as-is
  }

  return (
    <LoyalCustomerApplicationBlock
      {...props}
      appStoreUrl={iosUrl}
      googlePlayUrl={androidUrl}
    />
  );
};
