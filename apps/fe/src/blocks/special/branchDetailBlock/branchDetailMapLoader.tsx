'use client';

import dynamic from 'next/dynamic';
import type { Branch } from '@repo/shared/payload-types';

const BranchDetailMap = dynamic(
  () => import('./branchDetailMap').then((m) => m.BranchDetailMap),
  {
    ssr: false,
    loading: () => <div className="h-[540px]" />,
  },
);

interface BranchDetailMapLoaderProps {
  branch: Branch;
}

export function BranchDetailMapLoader({ branch }: BranchDetailMapLoaderProps) {
  return <BranchDetailMap branch={branch} />;
}
