'use client';

import React, { useState, useMemo } from 'react';
import { ZonkyCalculatorBlock as ZonkyCalculatorBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { Slider } from '../../../components/slider/slider';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const formatCurrency = (n: number) => n.toLocaleString('cs-CZ') + ' Kc';
const formatPercent = (n: number) => n.toFixed(1) + ' %';
const formatYears = (n: number) => n + ' let';

export const ZonkyCalculatorBlock = ({
  title,
  minAmount: minAmountProp,
  maxAmount: maxAmountProp,
  defaultAmount: defaultAmountProp,
  minYears: minYearsProp,
  maxYears: maxYearsProp,
  defaultYears: defaultYearsProp,
  expectedReturn: expectedReturnProp,
  description,
}: ZonkyCalculatorBlockType) => {
  const minAmount = minAmountProp ?? 10000;
  const maxAmount = maxAmountProp ?? 5000000;
  const defaultAmount = defaultAmountProp ?? 500000;
  const minYears = minYearsProp ?? 1;
  const maxYears = maxYearsProp ?? 30;
  const defaultYears = defaultYearsProp ?? 10;
  const defaultReturn = expectedReturnProp ?? 7;

  const [amount, setAmount] = useState(defaultAmount);
  const [years, setYears] = useState(defaultYears);
  const [returnRate, setReturnRate] = useState(defaultReturn);
  const { ref, isVisible } = useScrollAnimation();

  const results = useMemo(() => {
    const expectedValue = amount * Math.pow(1 + returnRate / 100, years);
    const profit = expectedValue - amount;
    return { expectedValue, profit };
  }, [amount, years, returnRate]);

  // Bar chart dimensions
  const chartWidth = 280;
  const chartHeight = 180;
  const barWidth = 80;
  const gap = 40;
  const maxVal = results.expectedValue;
  const initialBarHeight = maxVal > 0 ? (amount / maxVal) * (chartHeight - 30) : 0;
  const expectedBarHeight = chartHeight - 30;
  const barStartX1 = (chartWidth - 2 * barWidth - gap) / 2;
  const barStartX2 = barStartX1 + barWidth + gap;

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
              label="Pocatecni investice"
              min={minAmount}
              max={maxAmount}
              step={10000}
              value={amount}
              onChange={setAmount}
              formatValue={formatCurrency}
            />

            <Slider
              label="Investicni horizont"
              min={minYears}
              max={maxYears}
              step={1}
              value={years}
              onChange={setYears}
              formatValue={formatYears}
            />

            <Slider
              label="Ocekavany rocni vynos"
              min={1}
              max={15}
              step={0.5}
              value={returnRate}
              onChange={setReturnRate}
              formatValue={formatPercent}
            />
          </div>

          {/* Results */}
          <div className="rounded-2xl bg-meopta-blue-light p-6 lg:p-8">
            <Typography variant="h4" className="mb-6 text-meopta-blue-dark">
              Vysledek investice
            </Typography>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-meopta-border pb-3">
                <span className="text-14 text-meopta-text-secondary">Pocatecni castka</span>
                <span className="text-16 font-semibold text-meopta-text-primary">
                  {formatCurrency(amount)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-meopta-border pb-3">
                <span className="text-14 text-meopta-text-secondary">Ocekavana hodnota</span>
                <span className="text-24 font-bold text-meopta-blue-dark">
                  {formatCurrency(Math.round(results.expectedValue))}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-14 text-meopta-text-secondary">Zisk</span>
                <span className="text-16 font-semibold text-meopta-blue-dark">
                  +
                  {formatCurrency(Math.round(results.profit))}
                </span>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="mt-6 flex justify-center">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full max-w-[280px]"
                aria-label="Porovnani pocatecni investice a ocekavane hodnoty"
              >
                {/* Initial amount bar */}
                <rect
                  x={barStartX1}
                  y={chartHeight - initialBarHeight}
                  width={barWidth}
                  height={initialBarHeight}
                  rx={6}
                  className="fill-meopta-border"
                />
                {/* Expected value bar */}
                <rect
                  x={barStartX2}
                  y={chartHeight - expectedBarHeight}
                  width={barWidth}
                  height={expectedBarHeight}
                  rx={6}
                  className="fill-meopta-blue"
                />
                {/* Labels */}
                <text
                  x={barStartX1 + barWidth / 2}
                  y={chartHeight - initialBarHeight - 8}
                  textAnchor="middle"
                  className="fill-meopta-text-secondary text-[10px]"
                >
                  {formatCurrency(amount)}
                </text>
                <text
                  x={barStartX2 + barWidth / 2}
                  y={chartHeight - expectedBarHeight - 8}
                  textAnchor="middle"
                  className="fill-meopta-blue-dark text-[10px] font-bold"
                >
                  {formatCurrency(Math.round(results.expectedValue))}
                </text>
                {/* Bottom labels */}
                <text
                  x={barStartX1 + barWidth / 2}
                  y={chartHeight + 14}
                  textAnchor="middle"
                  className="fill-meopta-text-secondary text-[10px]"
                >
                  Dnes
                </text>
                <text
                  x={barStartX2 + barWidth / 2}
                  y={chartHeight + 14}
                  textAnchor="middle"
                  className="fill-meopta-text-secondary text-[10px]"
                >
                  Za
                  {' '}
                  {years}
                  {' '}
                  let
                </text>
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
