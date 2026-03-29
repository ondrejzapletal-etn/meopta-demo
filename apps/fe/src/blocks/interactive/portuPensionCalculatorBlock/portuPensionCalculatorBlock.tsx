'use client';

import React, { useState, useMemo } from 'react';
import { PortuPensionCalculatorBlock as PortuPensionCalculatorBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { Slider } from '../../../components/slider/slider';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const formatCurrency = (n: number) => n.toLocaleString('cs-CZ') + ' Kc';
const formatPercent = (n: number) => n.toFixed(1) + ' %';
const formatYears = (n: number) => n + ' let';

export const PortuPensionCalculatorBlock = ({
  title,
  minMonthly: minMonthlyProp,
  maxMonthly: maxMonthlyProp,
  defaultMonthly: defaultMonthlyProp,
  minYears: minYearsProp,
  maxYears: maxYearsProp,
  defaultYears: defaultYearsProp,
  expectedReturn: expectedReturnProp,
  description,
}: PortuPensionCalculatorBlockType) => {
  const minMonthly = minMonthlyProp ?? 500;
  const maxMonthly = maxMonthlyProp ?? 10000;
  const defaultMonthly = defaultMonthlyProp ?? 3000;
  const minYears = minYearsProp ?? 5;
  const maxYears = maxYearsProp ?? 40;
  const defaultYears = defaultYearsProp ?? 20;
  const defaultReturn = expectedReturnProp ?? 5;

  const [monthly, setMonthly] = useState(defaultMonthly);
  const [years, setYears] = useState(defaultYears);
  const [returnRate, setReturnRate] = useState(defaultReturn);
  const { ref, isVisible } = useScrollAnimation();

  const results = useMemo(() => {
    const r = returnRate / 100 / 12;
    const n = years * 12;
    const futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r);
    const totalDeposited = monthly * n;
    const profit = futureValue - totalDeposited;
    return { futureValue, totalDeposited, profit };
  }, [monthly, years, returnRate]);

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        {title && (
          <Typography variant="h2" className="mb-2 text-meopta-text-primary">
            {title}
          </Typography>
        )}

        {description && (
          <p className="mb-8 text-16 text-meopta-text-secondary">{description}</p>
        )}

        <div
          ref={ref}
          className={cn(
            'grid gap-8 opacity-0 lg:grid-cols-2 lg:gap-12',
            isVisible && 'animate-fade-in-up',
          )}
        >
          <div className="flex flex-col gap-8">
            <Slider label="Mesicni ukladka" min={minMonthly} max={maxMonthly} step={100} value={monthly} onChange={setMonthly} formatValue={formatCurrency} />
            <Slider label="Delka sporeni" min={minYears} max={maxYears} step={1} value={years} onChange={setYears} formatValue={formatYears} />
            <Slider label="Ocekavany rocni vynos" min={1} max={12} step={0.5} value={returnRate} onChange={setReturnRate} formatValue={formatPercent} />
          </div>

          <div className="rounded-2xl bg-meopta-blue-light p-6 lg:p-8">
            <Typography variant="h4" className="mb-6 text-meopta-blue-dark">
              Vysledek sporeni
            </Typography>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-meopta-border pb-3">
                <span className="text-14 text-meopta-text-secondary">Celkem vlozeno</span>
                <span className="text-16 font-semibold text-meopta-text-primary">{formatCurrency(Math.round(results.totalDeposited))}</span>
              </div>
              <div className="flex items-center justify-between border-b border-meopta-border pb-3">
                <span className="text-14 text-meopta-text-secondary">Ocekavana hodnota</span>
                <span className="text-24 font-bold text-meopta-blue-dark">{formatCurrency(Math.round(results.futureValue))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-14 text-meopta-text-secondary">Zhodnoceni</span>
                <span className="text-16 font-semibold text-meopta-blue-dark">
                  +
                  {formatCurrency(Math.round(results.profit))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
