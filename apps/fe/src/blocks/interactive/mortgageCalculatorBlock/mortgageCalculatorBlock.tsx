'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { MortgageCalculatorBlock as MortgageCalculatorBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import { getImageSrcWithFallback } from '../../../utils/images';

/* ─── Formatting helpers ─────────────────────────────────────────────────── */

const NBSP = '\u00a0';

const fmtCurrencyFull = (n: number) => n.toLocaleString('cs-CZ') + `${NBSP}Kč`;
const fmtPct = (n: number) => n.toFixed(2).replace('.', ',') + `${NBSP}%`;
const fmtYears = (n: number) => {
  if (n === 1) return `1${NBSP}rok`;
  if (n < 5) return `${n}${NBSP}roky`;
  return `${n}${NBSP}let`;
};

function calculateAnnuity(principal: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

type FixOpt = { label: string; years: number; rate: number };

function buildFixations(base: number): FixOpt[] {
  return [
    { label: `2${NBSP}roky`, years: 2, rate: base },
    { label: `3${NBSP}roky`, years: 3, rate: base },
    { label: `5${NBSP}let`, years: 5, rate: +(base + 0.1).toFixed(2) },
    { label: `7${NBSP}let`, years: 7, rate: +(base + 0.3).toFixed(2) },
    { label: `10${NBSP}let`, years: 10, rate: +(base + 0.5).toFixed(2) },
  ];
}

/* ─── Info icon (from airbank.cz original, 21×21) ────────────────────────── */

function InfoIcon() {
  return (
    <svg viewBox="0 0 21 21" fill="#898B8E" className="h-5 w-5 shrink-0">
      <path fillRule="evenodd" d="M10.5 0C16.299 0 21 4.701 21 10.5S16.299 21 10.5 21 0 16.299 0 10.5 4.701 0 10.5 0zm-.016 8.906c-.44 0-.797.1-1.072.299-.24.174-.375.423-.405.746L9 10.094v5.695c0 .39.137.688.412.897.274.21.637.314 1.072.314.44 0 .802-.102 1.088-.306.25-.179.39-.432.422-.76L12 15.79v-5.754c0-.355-.143-.632-.429-.831-.285-.2-.648-.3-1.088-.3zM10.516 4c-.403 0-.756.138-1.06.413-.304.276-.456.627-.456 1.053 0 .47.148.834.445 1.091.297.257.654.386 1.071.386.403 0 .751-.13 1.044-.391.294-.261.44-.623.44-1.086 0-.478-.15-.842-.45-1.091C11.249 4.125 10.905 4 10.516 4z" />
    </svg>
  );
}

/* ─── Chevron icon ───────────────────────────────────────────────────────── */

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Umbrella / insurance illustration (from airbank.cz original) ───────── */

function UmbrellaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="#99cc33">
      <path d="M28.28 25h2.14c3.68 0 6.3 1.482 7.58 4.18 1.48-2.58 4.38-4.06 8.26-4.06 3.36 0 5.96.9 7.64 2.58C52.74 17.382 42.46 9 30.42 9h-2.14C16.58 9 7.26 16.94 6.12 27.44c1.54-1.5 3.9-2.278 6.98-2.278 3.74 0 6.5 1.4 7.92 3.9C22.26 26.422 24.74 25 28.28 25zM28 27.003c-3.95.098-5.86 2.28-5.86 6.677 0 .542-.46 1-1 1-.56 0-1-.458-1-1 0-5.68-4.42-6.52-7.04-6.52-4.78 0-7.1 1.982-7.1 6.062 0 .558-.44 1-1 1s-1-.442-1-1V29.62C4 17.027 14.514 7.137 28 7.001V1c0-.56.44-1 1-1s1 .44 1 1v6h.42C44.28 7 56 17.36 56 29.62v3.602c0 .558-.44 1-1 1s-1-.442-1-1c0-5.32-4.84-6.102-7.74-6.102-2.22 0-7.36.64-7.36 6.56 0 .542-.44 1-1 1s-1-.458-1-1c0-4.438-2.18-6.68-6.48-6.68h-1.28.86v25.822c0 2.978-2.2 6.18-5.46 6.18h-.62c-3.1 0-5.92-2.94-5.92-6.18V51c0-.56.44-.998 1-.998s1 .438 1 .998v1.822c0 2.1 1.94 4.178 3.92 4.178h.62c2.04 0 3.46-2.198 3.46-4.178V27.003z" fillRule="evenodd" />
    </svg>
  );
}

/* ─── Lightbulb icon (from airbank.cz original, 25×25) ───────────────────── */

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 25 25" fill="currentColor">
      <path fillRule="evenodd" d="M14.88 23.685c.117 0 .145.068.062.15l-.978.976a.598.598 0 01-.363.15h-1.28a.601.601 0 01-.364-.15l-.978-.975c-.083-.083-.054-.15.063-.15zm.639-2.055a.639.639 0 110 1.277h-5.117a.64.64 0 110-1.277zm0-2.038a.639.639 0 110 1.276h-5.117a.639.639 0 110-1.276zM12.961 3.717c3.54 0 6.412 2.863 6.412 6.395 0 1.334-.41 2.572-1.11 3.598-.896 1.495-2.104 3.077-2.104 4.801v.093a.214.214 0 01-.213.213h-5.97a.213.213 0 01-.213-.213v-.093c0-1.63-1.135-3.21-2.029-4.697a6.355 6.355 0 01-1.185-3.702c0-3.532 2.871-6.395 6.412-6.395zm7.08 11.049l1.273.853a9.99 9.99 0 01-1.059 1.313l-1.11-1.052c.328-.346.629-.718.896-1.114zm-14.17-.014c.267.397.567.77.895 1.116l-1.114 1.05a10.213 10.213 0 01-1.056-1.316zm15.531-3.557l1.522.213a9.946 9.946 0 01-.384 1.688l-1.463-.467c.149-.462.258-.941.325-1.434zm-16.88.026c.068.477.173.942.317 1.391l-1.464.466a9.86 9.86 0 01-.374-1.644zM3.375 6.989l1.464.463c-.143.45-.25.917-.317 1.397l-.23-.039L3 8.635c.08-.565.205-1.115.375-1.646zm19.165-.018c.17.53.298 1.079.378 1.643l-1.521.216a8.309 8.309 0 00-.32-1.39zM5.653 3.148L6.766 4.2a8.58 8.58 0 00-.894 1.115l-1.275-.85c.315-.468.67-.908 1.056-1.316zm14.604-.012c.387.408.742.846 1.058 1.314l-1.274.85a8.65 8.65 0 00-.897-1.113zM9.367.664l.55 1.43c-.45.172-.88.38-1.29.621l-.781-1.317c.483-.285.99-.53 1.521-.734zm7.17-.007c.53.202 1.039.447 1.522.732l-.778 1.318c-.41-.24-.84-.448-1.29-.618zM12.96 0c.282 0 .56.015.836.037l-.13 1.528a8.244 8.244 0 00-1.431.001L12.108.04c.281-.024.565-.04.853-.04z" />
    </svg>
  );
}

/* ─── Slider with editable input (standalone — not inside render) ─────────── */

function SliderRow({
  label,
  tooltip,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
}: {
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  formatValue: (v: number) => string;
}) {
  const [inputText, setInputText] = useState('');
  const [focused, setFocused] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  const handleFocus = useCallback(() => {
    setFocused(true);
    setInputText(String(value));
  }, [value]);

  const commitValue = useCallback(() => {
    setFocused(false);
    const val = parseInt(inputText.replace(/\D/g, ''), 10);
    if (!isNaN(val)) onChange(Math.max(min, Math.min(max, val)));
  }, [inputText, min, max, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitValue();
  }, [commitValue]);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-16 font-medium text-meopta-text-secondary lg:text-18">{label}</span>
        <div className="group relative">
          <InfoIcon />
          <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-72 -translate-x-1/2 rounded-lg bg-white p-4 text-left text-13 font-normal leading-relaxed text-meopta-text-primary shadow-xl group-hover:block">
            {tooltip}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
          </div>
        </div>
        {/* Mobile: input next to label */}
        <input
          type="text"
          inputMode="numeric"
          value={focused ? inputText : formatValue(value)}
          onChange={(e) => setInputText(e.target.value.replace(/\D/g, ''))}
          onFocus={handleFocus}
          onBlur={commitValue}
          onKeyDown={handleKeyDown}
          className="ml-auto w-36 rounded border border-meopta-border bg-white px-2 py-2 text-right text-base font-semibold text-meopta-text-primary outline-none focus:border-meopta-blue md:hidden"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#c8c8c8] outline-none
              [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6b8e23]
              [&::-webkit-slider-thumb]:[box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]
              [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#6b8e23]
              [&::-moz-range-thumb]:[box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]"
            style={{
              background: `linear-gradient(to right, #6b8e23 0%, #6b8e23 ${pct}%, #c8c8c8 ${pct}%, #c8c8c8 100%)`,
            }}
          />
          <div className="flex justify-between text-14 text-meopta-text-tertiary">
            <span>{formatValue(min)}</span>
            <span>{formatValue(max)}</span>
          </div>
        </div>
        {/* Desktop: input next to slider */}
        <input
          type="text"
          inputMode="numeric"
          value={focused ? inputText : formatValue(value)}
          onChange={(e) => setInputText(e.target.value.replace(/\D/g, ''))}
          onFocus={handleFocus}
          onBlur={commitValue}
          onKeyDown={handleKeyDown}
          className="hidden w-52 rounded border border-meopta-border bg-white px-3 py-2 text-right text-base font-semibold text-meopta-text-primary outline-none focus:border-meopta-blue md:block"
        />
      </div>
    </div>
  );
}

/* ─── Fixation slider (snap-to-dot, draggable via hidden range input) ────── */

function FixationSlider({
  options,
  selectedIdx,
  onChange,
  tooltip,
}: {
  options: FixOpt[];
  selectedIdx: number;
  onChange: (idx: number) => void;
  tooltip?: string;
}) {
  const count = options.length;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-16 font-medium text-meopta-text-secondary lg:text-18">
          Délka fixace
        </span>
        {tooltip && (
          <div className="group relative">
            <InfoIcon />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-72 -translate-x-1/2 rounded-lg bg-white p-4 text-left text-13 font-normal leading-relaxed text-meopta-text-primary shadow-xl group-hover:block">
              {tooltip}
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
            </div>
          </div>
        )}
      </div>

      {/* Track with dots + hidden range input for drag */}
      <div className="relative mx-3 mb-2 h-8">
        {/* Full green track */}
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#6b8e23]" />

        {/* White snap dots (non-selected) and green dot (selected) */}
        {options.map((_, i) => {
          const left = (i / (count - 1)) * 100;
          const isCurrent = i === selectedIdx;
          return (
            <div
              key={i}
              className={cn(
                `
                  pointer-events-none absolute top-1/2 -translate-x-1/2
                  -translate-y-1/2 rounded-full
                `,
                isCurrent
                  ? `
                    h-6 w-6 bg-[#6b8e23]
                    [box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]
                  `
                  : 'h-6 w-6 border-2 border-[#a0a0a0] bg-white',
              )}
              style={{ left: `${left}%` }}
            />
          );
        })}

        {/* Invisible range input on top for dragging */}
        <input
          type="range"
          min={0}
          max={count - 1}
          step={1}
          value={selectedIdx}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      {/* Labels below */}
      <div className="relative mx-3 flex justify-between">
        {options.map((opt, i) => (
          <div
            key={i}
            className={cn(
              'flex flex-col items-center text-center',
              i === selectedIdx ? 'font-semibold' : '',
            )}
            style={{ width: `${100 / count}%` }}
          >
            <span className={cn(
              'text-13',
              i === selectedIdx
                ? 'text-meopta-text-primary'
                : `text-meopta-text-tertiary`,
            )}
            >
              {opt.label}
            </span>
            <span className={cn(
              'text-13',
              i === selectedIdx
                ? 'font-semibold text-[#6b8e23]'
                : `text-meopta-text-tertiary`,
            )}
            >
              {fmtPct(opt.rate)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Insurance toggle with "zap"/"vyp" text inside ──────────────────────── */

function InsuranceToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        `
          relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center
          rounded-full transition-colors
        `,
        checked ? 'bg-[#497D00]' : 'bg-[#d8d8d8]',
      )}
      role="switch"
      aria-checked={checked}
    >
      {/* "zap" always on the left */}
      <span className={cn(
        'absolute left-2 text-[9px] leading-none font-bold uppercase',
        checked ? 'text-white' : 'text-transparent',
      )}
      >
        zap
      </span>
      {/* "vyp" always on the right */}
      <span className={cn(
        'absolute right-2 text-[9px] leading-none font-bold uppercase',
        checked ? 'text-transparent' : 'text-meopta-text-tertiary',
      )}
      >
        vyp
      </span>
      {/* Thumb */}
      <span
        className={cn(
          `
            inline-block h-6 w-6 rounded-full bg-white shadow-md
            transition-transform
          `,
          checked ? 'translate-x-9' : 'translate-x-1',
        )}
      />
    </button>
  );
}

/* ═══ Main component ═════════════════════════════════════════════════════ */

export const MortgageCalculatorBlock = ({
  minAmount: minAmountProp,
  maxAmount: maxAmountProp,
  defaultAmount: defaultAmountProp,
  minYears: minYearsProp,
  maxYears: maxYearsProp,
  defaultYears: defaultYearsProp,
  interestRate: interestRateProp,
  dosPersonImage,
  layoutStyles,
}: MortgageCalculatorBlockType) => {
  const minAmount = minAmountProp ?? 500000;
  const maxAmount = maxAmountProp ?? 30000000;
  const defaultAmount = defaultAmountProp ?? 3000000;
  const minYears = minYearsProp ?? 1;
  const maxYears = maxYearsProp ?? 30;
  const defaultYears = defaultYearsProp ?? 20;
  const baseRate = interestRateProp ?? 4.39;

  const fixations = useMemo(() => buildFixations(baseRate), [baseRate]);

  /* State — "Nová hypotéka" tab */
  const [activeTab, setActiveTab] = useState<'nova' | 'dosahnu'>('nova');
  const [amount, setAmount] = useState(defaultAmount);
  const [years, setYears] = useState(defaultYears);
  const [fixIdx, setFixIdx] = useState(0);
  const [insurance, setInsurance] = useState(true);

  /* State — "Dosáhnu na hypotéku?" tab inputs */
  const [dosValues, setDosValues] = useState([0, 0, 0, 0]);
  const [dosFocused, setDosFocused] = useState<number | null>(null);
  const [dosInputText, setDosInputText] = useState('');
  const [dosChildren, setDosChildren] = useState(0);

  const { ref, isVisible } = useScrollAnimation();
  const baseFixRate = fixations[fixIdx]?.rate ?? baseRate;

  /* Insurance gives a 0.10% discount on the rate */
  const INSURANCE_DISCOUNT = 0.10;
  const effectiveRate = insurance ? baseFixRate : +(baseFixRate + INSURANCE_DISCOUNT).toFixed(2);

  const novaResults = useMemo(() => {
    const months = years * 12;
    const monthlyPayment = calculateAnnuity(amount, effectiveRate, months);
    const totalPaid = monthlyPayment * months;
    return { monthlyPayment, totalPaid };
  }, [amount, years, effectiveRate]);

  /* Insurance cost: 8.7% of the monthly annuity at the insured rate */
  const insuranceCost = Math.round(calculateAnnuity(amount, baseFixRate, years * 12) * 0.087);

  const tabs = [
    { id: 'nova' as const, label: 'Nová hypotéka' },
    { id: 'dosahnu' as const, label: 'Dosáhnu na hypotéku?' },
  ];

  return (
    <div className="w-full overflow-hidden bg-meopta-blue" id={layoutStyles?.anchorId || undefined}>
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-0',
          'pb-10 lg:pb-16',
        )}
      >
        {/* ─── Animated wrapper for tabs + panels ─── */}
        <div
          ref={ref}
          className={cn('min-w-0 overflow-hidden opacity-0', isVisible && `
            animate-fade-in-up
          `)}
        >
          {/* ─── Tabs ─── */}
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  `
                    flex h-12 max-w-[45%] items-center justify-center
                    rounded-t-lg px-5 text-center text-15 leading-tight
                    font-semibold transition-colors
                    md:h-auto md:max-w-none md:py-3 md:leading-normal
                    lg:px-8
                  `,
                  activeTab === tab.id
                    ? 'bg-white text-meopta-text-secondary'
                    : `
                      bg-[#dadada] text-meopta-text-secondary
                      hover:bg-[#e5e5e5]
                    `,
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Calculator body ─── */}
          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[7fr_5fr] lg:gap-5">
            {/* ═══ Left: Inputs (white box) ═══ */}
            <div className="min-w-0 overflow-hidden rounded-b-xl rounded-tr-xl bg-white p-6 shadow-sm lg:p-8">
              {activeTab === 'nova'
                ? (
                    <div className="space-y-5">
                      {/* Amount slider + input */}
                      <SliderRow
                        key="amount"
                        label="Kolik potřebujete půjčit?"
                        tooltip="Půjčíme vám až 90 % odhadní ceny nemovitosti."
                        min={minAmount}
                        max={maxAmount}
                        step={100000}
                        value={amount}
                        onChange={setAmount}
                        formatValue={fmtCurrencyFull}
                      />

                      <hr className="border-t border-meopta-border" />

                      {/* Years slider + input */}
                      <SliderRow
                        key="years"
                        label="Doba splácení"
                        tooltip="Hypotéku můžete splácet klidně 30 let, nejdéle však do 70 let věku hlavního žadatele."
                        min={minYears}
                        max={maxYears}
                        step={1}
                        value={years}
                        onChange={setYears}
                        formatValue={fmtYears}
                      />

                      <hr className="border-t border-meopta-border" />

                      {/* Fixation slider */}
                      <FixationSlider
                        options={insurance ? fixations : fixations.map((f) => ({ ...f, rate: +(f.rate + INSURANCE_DISCOUNT).toFixed(2) }))}
                        selectedIdx={fixIdx}
                        onChange={setFixIdx}
                        tooltip="Doba, po kterou vám úrokovou sazbu garantujeme."
                      />

                      <hr className="border-t border-meopta-border" />

                      {/* Insurance row */}
                      <div className="flex items-center gap-4">
                        <InsuranceToggle checked={insurance} onChange={setInsurance} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-15 font-semibold text-meopta-text-primary">
                              Pojištění hypotéky
                            </span>
                            <div className="group relative">
                              <InfoIcon />
                              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-96 -translate-x-1/2 rounded-lg bg-white p-4 text-left text-13 font-normal leading-relaxed text-meopta-text-primary shadow-xl group-hover:block">
                                <p className="mb-2 font-semibold">Naše pojištění hypotéky pomáhá při nečekaných životních situacích</p>
                                <p className="mb-1 text-meopta-text-secondary">
                                  Za
                                  {fmtCurrencyFull(insuranceCost)}
                                  {' '}
                                  měsíčně vám vyplatíme:
                                </p>
                                <ul className="list-disc space-y-0.5 pl-4 text-meopta-text-secondary">
                                  <li>
                                    <strong>1 splátku</strong>
                                    , když budete ležet v nemocnici.
                                  </li>
                                  <li>
                                    <strong>Až 12 splátek</strong>
                                    , když budete nemocní nebo přijdete o práci.
                                  </li>
                                  <li>
                                    <strong>Až 36 splátek</strong>
                                    , když budete pečovat o člena rodiny.
                                  </li>
                                  <li>
                                    <strong>Celý úvěr</strong>
                                    , když zemřete nebo se stanete invalidním.
                                  </li>
                                </ul>
                                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
                              </div>
                            </div>
                          </div>
                          <p className="text-13 text-meopta-text-secondary">
                            Chci pojištění hypotéky
                            {' '}
                            <strong>
                              za
                              {fmtCurrencyFull(insuranceCost)}
                              {' '}
                              měsíčně
                            </strong>
                            {' '}
                            se slevou na úrokové sazbě
                            {' '}
                            <strong>
                              0,10
                              {NBSP}
                              %
                            </strong>
                            .
                          </p>
                        </div>
                        <UmbrellaIcon className="hidden h-16 w-16 shrink-0 md:block" />
                      </div>
                    </div>
                  )
                : (
              /* ─── "Dosáhnu na hypotéku?" tab — static form ─── */
                    <div className="space-y-0">
                      {[
                        { num: 1, label: 'Jaký je celkový čistý měsíční příjem vaší domácnosti?', tooltip: 'Uveďte všechny své pravidelné příjmy a pravidelné příjmy vaší partnerky nebo partnera, pokud spolu žijete ve společné domácnosti. Může jít například o příjmy ze zaměstnání, z podnikání, svobodného povolání, kapitálového majetku nebo pronájmu, o rodičovskou, mateřskou, starobní i invalidní důchod nebo výživné.' },
                        { num: 2, label: 'Kolik vaše domácnost zaplatí měsíčně za bydlení?', tooltip: 'Mezi výdaje za bydlení patří náklady na energie, vytápění, stočné, zálohy na služby, fond oprav nebo příspěvky družstvu. Nepočítá se sem nájem, pokud kupujete nemovitost pro vlastní bydlení, a pojištění.' },
                        { num: 3, label: 'Jaké jsou další nezbytné náklady vaší domácnosti?', tooltip: 'Sem započítejte například jídlo, dopravu, léky a výživné.' },
                        { num: 4, label: 'Kolik jako domácnost zaplatíte měsíčně na splátkách?', tooltip: 'Vyplňte součet měsíčních splátek půjček, hypotečních úvěrů, úvěrů ze stavebního spoření a leasingů, včetně měsíčních splátek kreditních karet a kontokorentů.' },
                      ].map((q) => (
                        <div key={q.num} className="border-b border-meopta-border py-7 first:pt-0">
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-14 font-bold text-[#6b8e23]">
                                {q.num}
                                .
                              </span>
                              <span className="text-14 font-bold text-meopta-text-secondary">{q.label}</span>
                              <div className="group relative">
                                <InfoIcon />
                                <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden w-[280px] rounded-lg bg-white p-4 text-left text-13 font-normal leading-relaxed text-meopta-text-primary shadow-xl group-hover:block md:left-0 md:right-auto md:w-96">
                                  <div className="absolute -top-1 right-2 h-2 w-2 rotate-45 bg-white md:left-2 md:right-auto" />
                                  {q.tooltip}
                                </div>
                              </div>
                            </div>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={dosFocused === q.num ? dosInputText : `${dosValues[q.num - 1]?.toLocaleString('cs-CZ') ?? 0}${NBSP}Kč`}
                              onChange={(e) => setDosInputText(e.target.value.replace(/\D/g, ''))}
                              onFocus={() => {
                                setDosFocused(q.num);
                                setDosInputText(String(dosValues[q.num - 1] || ''));
                              }}
                              onBlur={() => {
                                setDosFocused(null);
                                const val = parseInt(dosInputText.replace(/\D/g, ''), 10);
                                setDosValues((prev) => {
                                  const next = [...prev];
                                  next[q.num - 1] = isNaN(val)
                                    ? 0
                                    : val;
                                  return next;
                                });
                              }}
                              className="w-28 self-end rounded border border-meopta-border bg-white px-3 py-2 text-right text-base font-semibold text-meopta-text-primary outline-none focus:border-meopta-blue md:shrink-0 md:self-auto"
                            />
                          </div>
                        </div>
                      ))}
                      {/* Question 5: Children stepper */}
                      <div className="py-7">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-14 font-bold text-[#6b8e23]">5.</span>
                            <span className="text-14 font-bold text-meopta-text-secondary">Kolik živíte dětí?</span>
                            <div className="group relative">
                              <InfoIcon />
                              <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden w-[280px] rounded-lg bg-white p-4 text-left text-13 font-normal leading-relaxed text-meopta-text-primary shadow-xl group-hover:block md:left-0 md:right-auto md:w-96">
                                <div className="absolute -top-1 right-2 h-2 w-2 rotate-45 bg-white md:left-2 md:right-auto" />
                                Patří sem děti, které nemají vlastní příjem.
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-0 self-end md:self-auto">
                            <button
                              onClick={() => setDosChildren((prev) => Math.max(0, prev - 1))}
                              disabled={dosChildren === 0}
                              className="flex h-9 w-9 items-center justify-center rounded-l border border-meopta-border bg-meopta-bg-light text-18 text-meopta-text-tertiary disabled:text-meopta-text-tertiary/40"
                            >
                              −
                            </button>
                            <span className="flex h-9 w-10 items-center justify-center border-y border-meopta-border bg-white text-base font-semibold text-meopta-text-primary">{dosChildren}</span>
                            <button
                              onClick={() => setDosChildren((prev) => prev + 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-r border border-meopta-border bg-meopta-bg-light text-18 text-meopta-text-secondary"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
            </div>

            {/* ═══ Right: Results panel ═══ */}
            <div className={cn(
              'rounded-xl p-5 lg:p-6',
              activeTab === 'nova'
                ? 'bg-[#41454B] text-white'
                : 'bg-meopta-blue',
            )}
            >
              {activeTab === 'nova'
                ? (
                    <>
                      {/* Monthly payment label */}
                      <div className="mb-1">
                        <span className="text-[20px] font-bold text-white">
                          Měsíční splátka
                          {insurance ? ' a pojistné' : ''}
                          :
                        </span>
                      </div>
                      {/* Amount */}
                      <p className="mb-1 text-right text-[36px] font-bold leading-tight text-meopta-blue">
                        {fmtCurrencyFull(Math.round(novaResults.monthlyPayment + (insurance ? insuranceCost : 0)))}
                      </p>
                      {/* Rate */}
                      <div className="mb-4 flex items-baseline justify-between">
                        <span className="text-[20px] text-white">s úrokovou sazbou</span>
                        <span className="text-[20px] font-bold text-white">{fmtPct(effectiveRate)}</span>
                      </div>

                      <hr className="mb-4 border-t border-white/15" />

                      {/* Loyal customer rate */}
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-[20px] text-white">Úroková sazba pro věrné klienty</span>
                        <span className="text-[20px] font-bold text-white">{fmtPct(effectiveRate - 0.1)}</span>
                      </div>
                      <a href="#" className="mb-4 inline-block text-14 text-white hover:underline">
                        Jak získat lepší sazbu za věrnost
                      </a>

                      <hr className="mb-4 border-t border-white/15" />

                      {/* Chytrá rezerva — white box with lightbulb */}
                      <div className="mb-4 rounded-lg bg-white px-4 py-3">
                        <div className="flex items-start gap-2">
                          <LightbulbIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#6b8e23]" />
                          <p className="flex-1 text-14 text-meopta-text-secondary">
                            <span className="font-semibold text-meopta-text-primary">Jde to i výhodněji</span>
                            , s Chytrou rezervou
                          </p>
                          <button className="shrink-0 self-center inline-flex items-center gap-1 text-13 font-semibold uppercase tracking-wide text-[#6b8e23] hover:underline">
                            Zjistit více
                            <ChevronRight />
                          </button>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="flex flex-col gap-2 md:flex-row md:justify-center">
                        <a
                          href="#"
                          className="flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#99cc33] px-8 text-15 font-semibold text-[#41454B] no-underline transition-colors hover:bg-[#8ab82e]"
                        >
                          Chci hypotéku
                          <ChevronRight />
                        </a>
                        <a
                          href="#"
                          className="flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white px-8 text-15 font-semibold text-white no-underline transition-colors hover:bg-white/10"
                        >
                          Chci se zeptat
                          <ChevronRight />
                        </a>
                      </div>

                      {/* Consultation */}
                      <div className="mt-4 text-center">
                        <span className="text-13 text-white/70">Chcete to s námi nejprve probrat? </span>
                        <a href="#" className="text-13 font-semibold text-white hover:underline">
                          Ano, zavolejte mi
                        </a>
                      </div>
                    </>
                  )
                : (
                    <div className="flex h-full flex-col items-center justify-start pt-4 text-center">
                      <p className="mb-6 text-[28px] font-medium leading-snug text-white lg:text-[32px]">
                        Vyplňte tento formulář a
                        {NBSP}
                        hned uvidíte, jestli na
                        {NBSP}
                        hypotéku dosáhnete.
                      </p>
                      {dosPersonImage && (
                        <div className="relative h-[350px] w-[325px] self-end">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImageSrcWithFallback(dosPersonImage)}
                            alt="Hypoteční poradce"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
            </div>
          </div>
        </div>
        {/* end animated wrapper */}

        {/* Representative example */}
        <p className="mt-5 text-center text-14 text-meopta-text-primary">
          Jak hypotéka u
          {NBSP}
          nás vychází, to uvidíte v
          {NBSP}
          <a href="#" className="text-meopta-text-primary underline hover:no-underline">
            reprezentativním příkladu
          </a>
          .
        </p>
      </Container>
    </div>
  );
};
