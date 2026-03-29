'use client';

import dynamic from 'next/dynamic';
import type { BranchWithThumb } from './branchMap';

const BranchMap = dynamic(
  () => import('./branchMap').then((m) => m.BranchMap),
  {
    ssr: false,
    loading: () => <div style={{ height: 'calc(100dvh - 130px)', minHeight: 400 }} />,
  },
);

interface BranchMapLoaderProps {
  branches: BranchWithThumb[];
}

export function BranchMapLoader({ branches }: BranchMapLoaderProps) {
  return <BranchMap branches={branches} />;
}
