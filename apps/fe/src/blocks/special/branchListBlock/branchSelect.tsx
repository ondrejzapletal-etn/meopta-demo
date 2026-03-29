'use client';

interface BranchOption {
  slug: string;
  name: string;
}

interface BranchSelectProps {
  branches: BranchOption[];
}

export function BranchSelect({ branches }: BranchSelectProps) {
  return (
    <div className="relative w-full max-w-[600px]">
      <select
        className="w-full appearance-none border border-meopta-border bg-white px-4 py-4 pr-10 text-16 text-meopta-text-secondary outline-none"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            window.location.href = `/${e.target.value}/`;
          }
        }}
      >
        <option value="" disabled>
          Vyberte si pobočku
        </option>
        {branches.map((branch) => (
          <option key={branch.slug} value={branch.slug}>
            {branch.name}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        width="20"
        height="20"
        viewBox="0 0 25 25"
        fill="#61666B"
      >
        <path
          d="M18.64 9.247a.842.842 0 0 0-1.19 0l-4.507 4.506-4.505-4.506a.842.842 0 1 0-1.192 1.19l5.1 5.1a.838.838 0 0 0 1.191.002l5.103-5.102a.838.838 0 0 0 0-1.19"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}
