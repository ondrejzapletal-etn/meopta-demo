import { Branch } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { BranchDetailBlock } from './branchDetailBlock';
import { BranchDetailMapLoader } from './branchDetailMapLoader';

interface BranchDetailPageProps {
  branch: Branch;
}

export const BranchDetailPage = ({ branch }: BranchDetailPageProps) => {
  return (
    <main>
      <div className="bg-meopta-bg-light">
        <Container size="ab-content" className="pt-6 pb-12">
          <nav className="mb-6 text-[13px] text-meopta-text-secondary">
            <a href="/" className="no-underline hover:underline">
              Úvodní stránka
            </a>
            <span className="mx-2">&gt;</span>
            <a href="/mapa-pobocek-a-bankomatu/nase-pobocky/" className="no-underline hover:underline">
              Výpis poboček
            </a>
            <span className="mx-2">&gt;</span>
            <span>{branch.name}</span>
          </nav>

          <h1 className="mb-10 text-center text-[32px] font-medium leading-tight text-meopta-text-primary md:text-[40px]">
            Pobočka
            {' '}
            {branch.name}
          </h1>
          <p className="mb-2 text-center text-[20px] text-meopta-text-secondary">
            Přijďte se k nám sami přesvědčit, že i banku můžete mít rádi.
          </p>
        </Container>
      </div>

      <div className="bg-white">
        <Container size="ab-content" className="py-10 lg:py-16">
          <h2 className="-mt-4 mb-8 text-center text-[28px] font-medium text-meopta-text-primary md:text-[32px]">
            Detail pobočky
          </h2>
          <BranchDetailBlock branch={branch} />
        </Container>
      </div>

      {branch.latitude && branch.longitude && (
        <div className="bg-white">
          <Container size="ab-content" className="pb-10 lg:pb-16">
            <div className="overflow-hidden">
              <BranchDetailMapLoader branch={branch} />
            </div>
          </Container>
        </div>
      )}
    </main>
  );
};
