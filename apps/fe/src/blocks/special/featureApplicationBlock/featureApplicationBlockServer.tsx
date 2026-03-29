import { FeatureApplicationBlock as FeatureApplicationBlockType } from '@repo/shared/payload-types';
import { fetchSettings } from '../../../api/fetch';
import { FeatureApplicationBlock } from './featureApplicationBlock';

export const FeatureApplicationBlockServer = async (props: FeatureApplicationBlockType) => {
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
    <FeatureApplicationBlock
      {...props}
      appStoreUrl={iosUrl}
      googlePlayUrl={androidUrl}
    />
  );
};
