'use client';

import { NavGroup } from '@payloadcms/ui';
import Image from 'next/image.js';
import Link from 'next/link.js';
import { usePathname } from 'next/navigation.js';
import React from 'react';

import icoChart from '../../img/ico-chart.webp';
import icoGenerate from '../../img/ico-generate.webp';
import icoUser from '../../img/ico-user.webp';

const navLinks = [
  { href: '/admin/ai/generate-content', icon: icoGenerate, label: 'Generovat obsah' },
  { href: '/admin/ai/increase-conversions', icon: icoUser, label: 'Zvýšit konverze' },
  { href: '/admin/ai/get-more-visits', icon: icoChart, label: 'Získat více návštěv' },
];

export const AiNavSection: React.FC = () => {
  const pathname = usePathname();

  return (
    <NavGroup label="AI pomocníci">
      {navLinks.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        const content = (
          <>
            {isActive && <div className="nav__link-indicator" />}
            <Image alt="" height={16} src={icon} style={{ flexShrink: 0, marginRight: 6 }} width={16} />
            <span className="nav__link-label">{label}</span>
          </>
        );
        if (isActive) {
          return (
            <div className="nav__link" key={href}>
              {content}
            </div>
          );
        }
        return (
          <Link className="nav__link" href={href} key={href} prefetch={false}>
            {content}
          </Link>
        );
      })}
    </NavGroup>
  );
};
