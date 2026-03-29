'use client';

import React, { useCallback, useMemo } from 'react';
import { ZoneInterestBlock as ZoneInterestBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const formatCurrency = (n: number) => n.toLocaleString('cs-CZ') + ' Kc';

interface DataPoint {
  month: number;
  deposits: number;
  total: number;
}

export const ZoneInterestBlock = ({
  title,
  monthlyDeposit: monthlyDepositProp,
  interestRate: interestRateProp,
  years: yearsProp,
  description,
}: ZoneInterestBlockType) => {
  const monthlyDeposit = monthlyDepositProp ?? 5000;
  const annualRate = interestRateProp ?? 3;
  const years = yearsProp ?? 10;
  const { ref, isVisible } = useScrollAnimation();

  const { dataPoints, totalDeposits, totalWithInterest, totalInterestEarned } = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    const points: DataPoint[] = [];
    let balance = 0;

    // Sample points to keep SVG manageable (one per quarter or per year)
    const sampleInterval = totalMonths <= 60 ? 3 : 12;

    for (let m = 0; m <= totalMonths; m++) {
      if (m > 0) {
        balance = (balance + monthlyDeposit) * (1 + monthlyRate);
      }

      if (m % sampleInterval === 0 || m === totalMonths) {
        points.push({
          month: m,
          deposits: monthlyDeposit * m,
          total: balance,
        });
      }
    }

    const deposits = monthlyDeposit * totalMonths;
    return {
      dataPoints: points,
      totalDeposits: deposits,
      totalWithInterest: balance,
      totalInterestEarned: balance - deposits,
    };
  }, [monthlyDeposit, annualRate, years]);

  // SVG chart dimensions
  const svgWidth = 600;
  const svgHeight = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 70 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const maxTotal = dataPoints.length > 0 ? Math.max(...dataPoints.map((d) => d.total), 1) : 1;
  const maxMonths = years * 12;

  const scaleX = useCallback(
    (month: number) => padding.left + (month / maxMonths) * chartW,
    [maxMonths, chartW, padding.left],
  );
  const scaleY = useCallback(
    (value: number) => padding.top + chartH - (value / maxTotal) * chartH,
    [maxTotal, chartH, padding.top],
  );

  // Build area paths for total (with interest) and deposits
  const totalAreaPath = useMemo(() => {
    if (dataPoints.length === 0) return '';
    const points = dataPoints.map((d) => `${scaleX(d.month)},${scaleY(d.total)}`).join(' L');
    const baseline = `${scaleX(dataPoints[dataPoints.length - 1]!.month)},${scaleY(0)} L${scaleX(0)},${scaleY(0)}`;
    return `M${points} L${baseline} Z`;
  }, [dataPoints, scaleX, scaleY]);

  const depositsAreaPath = useMemo(() => {
    if (dataPoints.length === 0) return '';
    const points = dataPoints.map((d) => `${scaleX(d.month)},${scaleY(d.deposits)}`).join(' L');
    const baseline = `${scaleX(dataPoints[dataPoints.length - 1]!.month)},${scaleY(0)} L${scaleX(0)},${scaleY(0)}`;
    return `M${points} L${baseline} Z`;
  }, [dataPoints, scaleX, scaleY]);

  const totalLinePath = useMemo(() => {
    if (dataPoints.length === 0) return '';
    return 'M' + dataPoints.map((d) => `${scaleX(d.month)},${scaleY(d.total)}`).join(' L');
  }, [dataPoints, scaleX, scaleY]);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const ticks: number[] = [];
    for (let i = 0; i <= tickCount; i++) {
      ticks.push(Math.round((maxTotal / tickCount) * i));
    }
    return ticks;
  }, [maxTotal]);

  // X-axis ticks (years)
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const interval = years <= 10 ? 1 : years <= 20 ? 2 : 5;
    for (let y = 0; y <= years; y += interval) {
      ticks.push(y);
    }
    if (ticks[ticks.length - 1] !== years) {
      ticks.push(years);
    }
    return ticks;
  }, [years]);

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

        {/* SVG Area Chart */}
        <div
          ref={ref}
          className={cn(
            `
              mb-8 overflow-hidden rounded-2xl border border-meopta-border
              bg-meopta-bg-light p-4 opacity-0
              lg:p-6
            `,
            isVisible && 'animate-fade-in-up',
          )}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full"
            aria-label="Graf rustu usporek v case"
          >
            {/* Grid lines */}
            {yTicks.map((tick) => (
              <line
                key={tick}
                x1={padding.left}
                y1={scaleY(tick)}
                x2={svgWidth - padding.right}
                y2={scaleY(tick)}
                stroke="#dadde1"
                strokeWidth={0.5}
                strokeDasharray="4 2"
              />
            ))}

            {/* Deposits area (lighter) */}
            <path d={depositsAreaPath} fill="#dadde1" fillOpacity={0.6} />

            {/* Total with interest area (green) */}
            <path d={totalAreaPath} fill="#99cc33" fillOpacity={0.3} />

            {/* Total line (green, on top) */}
            <path d={totalLinePath} fill="none" stroke="#99cc33" strokeWidth={2.5} />

            {/* Y-axis labels */}
            {yTicks.map((tick) => (
              <text
                key={tick}
                x={padding.left - 8}
                y={scaleY(tick) + 4}
                textAnchor="end"
                className="fill-meopta-text-secondary text-[10px]"
              >
                {tick >= 1000000
                  ? (tick / 1000000).toFixed(1) + 'M'
                  : tick >= 1000
                    ? Math.round(tick / 1000) + 'k'
                    : tick}
              </text>
            ))}

            {/* X-axis labels */}
            {xTicks.map((year) => (
              <text
                key={year}
                x={scaleX(year * 12)}
                y={svgHeight - 8}
                textAnchor="middle"
                className="fill-meopta-text-secondary text-[10px]"
              >
                {year === 0 ? 'Start' : year + ' r.'}
              </text>
            ))}

            {/* Axes */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + chartH}
              stroke="#41454b"
              strokeWidth={1}
            />
            <line
              x1={padding.left}
              y1={padding.top + chartH}
              x2={svgWidth - padding.right}
              y2={padding.top + chartH}
              stroke="#41454b"
              strokeWidth={1}
            />
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-6 text-14">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-6 rounded bg-meopta-border" />
              <span className="text-meopta-text-secondary">Vklady</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-6 rounded bg-meopta-blue opacity-50" />
              <span className="text-meopta-text-secondary">Vklady + uroky</span>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-meopta-bg-light p-5">
            <div className="mb-1 text-14 text-meopta-text-secondary">Celkove vklady</div>
            <div className="text-20 font-bold text-meopta-text-primary">
              {formatCurrency(Math.round(totalDeposits))}
            </div>
          </div>
          <div className="rounded-xl bg-meopta-blue-light p-5">
            <div className="mb-1 text-14 text-meopta-text-secondary">Celkem s uroky</div>
            <div className="text-20 font-bold text-meopta-blue-dark">
              {formatCurrency(Math.round(totalWithInterest))}
            </div>
          </div>
          <div className="rounded-xl bg-meopta-blue-light p-5">
            <div className="mb-1 text-14 text-meopta-text-secondary">Ziskane uroky</div>
            <div className="text-20 font-bold text-meopta-blue-dark">
              +
              {formatCurrency(Math.round(totalInterestEarned))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
