'use client';

import React, { useState, useMemo } from 'react';
import { PortuCalculatorBlock as PortuCalculatorBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { Slider } from '../../../components/slider/slider';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const formatCurrency = (n: number) => n.toLocaleString('cs-CZ') + ' Kc';
const formatPercent = (n: number) => n.toFixed(1) + ' %';
const formatYears = (n: number) => n + ' let';

export const PortuCalculatorBlock = ({
  title,
  minAmount: minAmountProp,
  maxAmount: maxAmountProp,
  defaultAmount: defaultAmountProp,
  minYears: minYearsProp,
  maxYears: maxYearsProp,
  defaultYears: defaultYearsProp,
  expectedReturn: expectedReturnProp,
  description,
}: PortuCalculatorBlockType) => {
  const minAmount = minAmountProp ?? 10000;
  const maxAmount = maxAmountProp ?? 5000000;
  const defaultAmount = defaultAmountProp ?? 500000;
  const minYears = minYearsProp ?? 1;
  const maxYears = maxYearsProp ?? 30;
  const defaultYears = defaultYearsProp ?? 10;
  const defaultReturn = expectedReturnProp ?? 6;

  const [amount, setAmount] = useState(defaultAmount);
  const [years, setYears] = useState(defaultYears);
  const [returnRate, setReturnRate] = useState(defaultReturn);
  const { ref, isVisible } = useScrollAnimation();

  const results = useMemo(() => {
    const expectedValue = amount * Math.pow(1 + returnRate / 100, years);
    const profit = expectedValue - amount;
    return { expectedValue, profit };
  }, [amount, years, returnRate]);

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
            <Slider label="Pocatecni investice" min={minAmount} max={maxAmount} step={10000} value={amount} onChange={setAmount} formatValue={formatCurrency} />
            <Slider label="Investicni horizont" min={minYears} max={maxYears} step={1} value={years} onChange={setYears} formatValue={formatYears} />
            <Slider label="Ocekavany rocni vynos" min={1} max={15} step={0.5} value={returnRate} onChange={setReturnRate} formatValue={formatPercent} />
          </div>

          <div className="rounded-2xl bg-meopta-blue-light p-6 lg:p-8">
            <Typography variant="h4" className="mb-6 text-meopta-blue-dark">
              Vysledek investice
            </Typography>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-meopta-border pb-3">
                <span className="text-14 text-meopta-text-secondary">Pocatecni castka</span>
                <span className="text-16 font-semibold text-meopta-text-primary">{formatCurrency(amount)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-meopta-border pb-3">
                <span className="text-14 text-meopta-text-secondary">Ocekavana hodnota</span>
                <span className="text-24 font-bold text-meopta-blue-dark">{formatCurrency(Math.round(results.expectedValue))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-14 text-meopta-text-secondary">Zisk</span>
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
