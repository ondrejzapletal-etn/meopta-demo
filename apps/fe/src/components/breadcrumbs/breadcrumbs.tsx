import { Container } from '../container/container';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

const slugLabelMap: Record<string, string> = {
  produkty: 'Produkty',
  hypoteka: 'Hypotéka',
  pujcka: 'Půjčka',
  'investice-a-sporeni': 'Investice a spoření',
  pojisteni: 'Pojištění',
  'pojisteni-hypoteky': 'Pojištění hypotéky',
  'mapa-pobocek-a-bankomatu': 'Pobočky a bankomaty',
  'nase-pobocky': 'Naše pobočky',
};

export const Breadcrumbs = ({ slug }: { slug: string }) => {
  const segments = slug.split('/');
  const items: BreadcrumbItem[] = [{ label: 'Úvodní stránka', url: '/' }];

  let path = '';
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!;
    path += (i === 0 ? '' : '/') + segment;
    const label = slugLabelMap[segment] ?? segment;
    const isLast = i === segments.length - 1;
    items.push({ label, url: isLast ? undefined : `/${path}/` });
  }

  return (
    <div className="relative z-10 h-0 w-full overflow-visible">
      <Container size="ab-content" className="pt-[16px] pb-6 lg:pt-[27px] lg:pb-2">
        <nav className="text-[12px] text-meopta-text-secondary">
          {items.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-2 font-bold">›</span>}
              {item.url
                ? (
                    <a href={item.url} className="no-underline hover:underline">
                      {item.label}
                    </a>
                  )
                : <span>{item.label}</span>}
            </span>
          ))}
        </nav>
      </Container>
    </div>
  );
};
