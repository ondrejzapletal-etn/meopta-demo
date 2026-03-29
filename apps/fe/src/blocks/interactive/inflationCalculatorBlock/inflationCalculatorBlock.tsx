'use client';

import React, { useState, useMemo } from 'react';
import { InflationCalculatorBlock as InflationCalculatorBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { Slider } from '../../../components/slider/slider';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const formatCurrency = (n: number) => n.toLocaleString('cs-CZ') + ' Kc';
const formatPercent = (n: number) => n.toFixed(1) + ' %';
const formatYears = (n: number) => n + ' let';

export const InflationCalculatorBlock = ({
  title,
  defaultAmount: defaultAmountProp,
  minYears: minYearsProp,
  maxYears: maxYearsProp,
  defaultYears: defaultYearsProp,
  defaultInflation: defaultInflationProp,
  description,
}: InflationCalculatorBlockType) => {
  const defaultAmount = defaultAmountProp ?? 100000;
  const minYears = minYearsProp ?? 1;
  const maxYears = maxYearsProp ?? 30;
  const defaultYears = defaultYearsProp ?? 10;
  const defaultInflation = defaultInflationProp ?? 3;

  const [amount, setAmount] = useState(defaultAmount);
  const [years, setYears] = useState(defaultYears);
  const [inflation, setInflation] = useState(defaultInflation);
  const { ref, isVisible } = useScrollAnimation();

  const results = useMemo(() => {
    const futureRealValue = amount / Math.pow(1 + inflation / 100, years);
    const valueLost = amount - futureRealValue;
    return { futureRealValue, valueLost };
  }, [amount, years, inflation]);

  const lossPercent = amount > 0 ? (results.valueLost / amount) * 100 : 0;

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
          {/* Sliders */}
          <div className="flex flex-col gap-8">
            <Slider
              label="Castka"
              min={10000}
              max={10000000}
              step={10000}
              value={amount}
              onChange={setAmount}
              formatValue={formatCurrency}
            />

            <Slider
              label="Pocet let"
              min={minYears}
              max={maxYears}
              step={1}
              value={years}
              onChange={setYears}
              formatValue={formatYears}
            />

            <Slider
              label="Rocni inflace"
              min={0.5}
              max={15}
              step={0.1}
              value={inflation}
              onChange={setInflation}
              formatValue={formatPercent}
            />
          </div>

          {/* Results */}
          <div className="rounded-2xl bg-meopta-blue-light p-6 lg:p-8">
            <Typography variant="h4" className="mb-6 text-meopta-blue-dark">
              Kupni sila vasich penez
            </Typography>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-meopta-border pb-3">
                <span className="text-14 text-meopta-text-secondary">Dnesni hodnota</span>
                <span className="text-20 font-bold text-meopta-text-primary">
                  {formatCurrency(amount)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-meopta-border pb-3">
                <span className="text-14 text-meopta-text-secondary">
                  Realna hodnota za
                  {' '}
                  {years}
                  {' '}
                  let
                </span>
                <span className="text-24 font-bold text-meopta-blue-dark">
                  {formatCurrency(Math.round(results.futureRealValue))}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-14 text-meopta-text-secondary">Ztrata kupni sily</span>
                <div className="text-right">
                  <span className="text-16 font-semibold text-red-600">
                    -
                    {formatCurrency(Math.round(results.valueLost))}
                  </span>
                  <span className="ml-2 text-14 text-red-500">
                    (
                    {lossPercent.toFixed(1)}
                    {' '}
                    %)
                  </span>
                </div>
              </div>
            </div>

            {/* Visual bar showing loss */}
            <div className="mt-6">
              <div className="mb-1 text-12 text-meopta-text-secondary">Pomerna ztrata hodnoty</div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-meopta-border">
                <div
                  className="h-full rounded-full bg-red-400 transition-all duration-300"
                  style={{ width: `${Math.min(lossPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
