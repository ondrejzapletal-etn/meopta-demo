import { Branch, Media } from '@repo/shared/payload-types';
import { cachingRestClient } from '../../../api/client';
import { PayloadPage } from '../../../api/types';
import { getImageSrcWithFallback } from '../../../utils/images';
import { BranchMapLoader } from './branchMapLoader';
import type { BranchWithThumb } from './branchMap';

async function fetchBranchesWithCoords(): Promise<BranchWithThumb[]> {
  const response = (await cachingRestClient('/branches', {
    query: { limit: 100, sort: 'createdAt', depth: 1 },
  })) as PayloadPage<Branch>;
  return response.docs
    .filter((b) => b.latitude && b.longitude)
    .map((b) => {
      const firstGallery = b.gallery?.[0]?.image as Media | undefined;
      const listing = typeof b.listingImage === 'object' ? b.listingImage : undefined;
      const thumbUrl = getImageSrcWithFallback(firstGallery ?? listing) || null;
      return { ...b, thumbUrl };
    });
}

export const BranchMapBlock = async () => {
  const branches = await fetchBranchesWithCoords();

  return (
    <div className="w-full">
      <BranchMapLoader branches={branches} />
    </div>
  );
};
