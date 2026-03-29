import { Branch, BranchListBlock as BranchListBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { cachingRestClient } from '../../../api/client';
import { PayloadPage } from '../../../api/types';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';
import { cn } from '../../../utils/styles';
import { BranchSelect } from './branchSelect';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path
      d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
      fillRule="evenodd"
    />
  </svg>
);

const DAY_FULL_NAMES: Record<string, string> = {
  Po: 'Pondělí',
  Út: 'Úterý',
  St: 'Středa',
  Čt: 'Čtvrtek',
  Pá: 'Pátek',
  So: 'Sobota',
  Ne: 'Neděle',
};

function expandSingleDay(days: string): string {
  // If it's a range like "Po–Pá" or "So–Ne", keep as-is
  if (days.includes('–')) return days;
  // Single abbreviation → full name
  return DAY_FULL_NAMES[days] ?? days;
}

async function fetchBranchesForListing(): Promise<Branch[]> {
  const response = (await cachingRestClient('/branches', {
    query: { limit: 100, sort: 'createdAt', depth: 1 },
  })) as PayloadPage<Branch>;
  return response.docs;
}

export const BranchListBlock = async ({ title }: BranchListBlockType) => {
  const branches = await fetchBranchesForListing();

  return (
    <div className="w-full bg-meopta-bg-light">
      <Container
        size="ab-content"
        className={cn(
          'pt-10 lg:pt-16',
          'pb-10 lg:pb-16',
        )}
      >
        <div className="mb-10 flex flex-col items-center">
          {title && (
            <h2 className="mb-6 text-center text-[28px] font-medium leading-tight text-meopta-text-primary md:text-[32px]">
              {title}
            </h2>
          )}

          <BranchSelect
            branches={branches.map((b) => ({ slug: b.slug, name: b.name }))}
          />
        </div>

        <div className="flex flex-col gap-8">
          {branches.map((branch) => {
            const imgSrc = getImageSrcWithFallback(branch.listingImage);
            return (
              <div
                key={branch.id}
                className="flex overflow-hidden bg-white shadow-sm"
              >
                {imgSrc && (
                  <div className="relative hidden w-[240px] flex-shrink-0 md:block">
                    <Image
                      src={imgSrc}
                      alt={branch.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-center gap-4 px-6 py-10">
                  <h3 className="text-[20px] font-medium leading-tight text-meopta-text-primary md:text-[22px]">
                    {branch.name}
                  </h3>

                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="md:w-5/12">
                      <p className="text-14 leading-relaxed text-meopta-text-secondary lg:text-16">
                        {branch.street}
                        <br />
                        {branch.zip}
&nbsp;&nbsp;
                        {branch.city}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:w-4/12">
                      {branch.openingHours?.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-14 lg:text-16">
                          <span className="inline-block w-[72px] rounded-sm border border-gray-300 px-2 py-0.5 text-center text-[13px] font-medium text-meopta-blue-dark">
                            {expandSingleDay(h.days)}
                          </span>
                          <span className="text-meopta-text-secondary">{h.hours}</span>
                        </div>
                      ))}
                    </div>

                    <div className="md:w-3/12 md:text-right">
                      <a
                        href={`/${branch.slug}/`}
                        className="inline-flex h-14 items-center rounded-full border border-meopta-blue-dark px-6 text-[0.875rem] font-medium text-meopta-text-primary no-underline transition-colors hover:border-[#497D00] hover:bg-[#E8F5CC]"
                      >
                        Detail pobočky
                        <ArrowRight />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
