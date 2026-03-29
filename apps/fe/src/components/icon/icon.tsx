import React from 'react';
import { cn } from '../../utils/styles';

type IconName
  = | 'creditCard' | 'wallet' | 'phone' | 'shield' | 'chart' | 'piggyBank'
    | 'home' | 'transfer' | 'globe' | 'calculator' | 'clock' | 'star'
    | 'check' | 'arrowRight' | 'info' | 'lightbulb';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const iconPaths: Record<IconName, string> = {
  creditCard: 'M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm0 4h18M5 13h4',
  wallet: 'M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 12h.01M2 7l2-4h16l2 4',
  phone: 'M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm7 15h.01',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  piggyBank: 'M19 6.5a4 4 0 00-4-4 6 6 0 00-6 0 4 4 0 00-4 4c0 3 2 5.5 5 7v2h4v-2c3-1.5 5-4 5-7zM15 12h.01',
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  transfer: 'M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z',
  calculator: 'M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm2 4h12M6 10h4M6 14h4M6 18h4M14 10h4M14 14h4M14 18h4',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  check: 'M20 6L9 17l-5-5',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  info: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01',
  lightbulb: 'M9 21h6M12 2a7 7 0 00-4 12.73V17h8v-2.27A7 7 0 0012 2z',
};

export const ABIcon = ({ name, size = 24, className }: IconProps) => {
  const path = iconPaths[name];
  if (!path) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block', className)}
    >
      <path d={path} />
    </svg>
  );
};
