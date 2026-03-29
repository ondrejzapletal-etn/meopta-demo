import { DownloadSectionBlock as DownloadSectionBlockType } from '@repo/shared/payload-types';
import { fetchSettings } from '../../../api/fetch';
import { DownloadSectionBlock } from './downloadSectionBlock';

export const DownloadSectionBlockServer = async (props: DownloadSectionBlockType) => {
  let iosUrl: string | undefined;
  let androidUrl: string | undefined;

  try {
    const settings = await fetchSettings();
    iosUrl = settings?.appStore?.iosUrl ?? undefined;
    androidUrl = settings?.appStore?.androidUrl ?? undefined;
  } catch {
    // fallback URLs are defined in the client component
  }

  return <DownloadSectionBlock {...props} iosUrl={iosUrl} androidUrl={androidUrl} />;
};
