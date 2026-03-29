'use client';

import React, { useState, useMemo } from 'react';
import { LoanCalculatorBlock as LoanCalculatorBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const formatCurrency = (n: number) => n.toLocaleString('cs-CZ') + ' Kč';
const formatPercent = (n: number, decimals = 2) => n.toFixed(decimals).replace('.', ',') + ' %';

function calculateAnnuity(principal: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function calculateRPSN(annualRate: number): number {
  // RPSN for zero-fee loans = effective annual rate with monthly compounding
  // Matches airbank.cz calculation: (1 + r/12)^12 - 1
  const r = annualRate / 100 / 12;
  return (Math.pow(1 + r, 12) - 1) * 100;
}

function calculateMonthsFromPayment(principal: number, annualRate: number, monthlyPayment: number, minM: number, maxM: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.max(minM, Math.min(maxM, Math.round(principal / monthlyPayment)));
  const ratio = 1 - (principal * r) / monthlyPayment;
  if (ratio <= 0) return minM;
  const n = Math.round(-Math.log(ratio) / Math.log(1 + r));
  return Math.max(minM, Math.min(maxM, n));
}

export const LoanCalculatorBlock = ({
  title,
  minAmount: minAmountProp,
  maxAmount: maxAmountProp,
  defaultAmount: defaultAmountProp,
  minMonths: minMonthsProp,
  maxMonths: maxMonthsProp,
  defaultMonths: defaultMonthsProp,
  interestRate: interestRateProp,
  description,
  layoutStyles,
}: LoanCalculatorBlockType) => {
  const minAmount = minAmountProp ?? 20000;
  const maxAmount = maxAmountProp ?? 800000;
  const defaultAmount = defaultAmountProp ?? 200000;
  const minMonths = minMonthsProp ?? 6;
  const maxMonths = maxMonthsProp ?? 96;
  const defaultMonths = defaultMonthsProp ?? 36;
  const annualRate = interestRateProp ?? 4.9;

  const [amount, setAmount] = useState(defaultAmount);
  const [userRate, setUserRate] = useState(annualRate);
  const [payment, setPayment] = useState(() => Math.round(calculateAnnuity(defaultAmount, annualRate, defaultMonths)));
  const { ref, isVisible } = useScrollAnimation();

  // Min/max monthly payment based on current loan amount and rate
  const minPayment = useMemo(() => Math.round(calculateAnnuity(amount, userRate, maxMonths)), [amount, userRate, maxMonths]);
  const maxPayment = useMemo(() => Math.round(calculateAnnuity(amount, userRate, minMonths)), [amount, userRate, minMonths]);
  const effectivePayment = Math.max(minPayment, Math.min(maxPayment, payment));

  // Derive months from selected monthly payment
  const months = useMemo(
    () => calculateMonthsFromPayment(amount, userRate, effectivePayment, minMonths, maxMonths),
    [amount, userRate, effectivePayment, minMonths, maxMonths],
  );

  const results = useMemo(() => {
    const monthlyPayment = calculateAnnuity(amount, userRate, months);
    const totalPaid = monthlyPayment * months;
    const totalInterest = totalPaid - amount;
    const rpsn = calculateRPSN(userRate);
    return { monthlyPayment, totalPaid, totalInterest, rpsn };
  }, [amount, months, userRate]);

  // Editable input state: show raw number while focused, formatted when blurred
  const [amountInputText, setAmountInputText] = useState('');
  const [amountFocused, setAmountFocused] = useState(false);
  const [paymentInputText, setPaymentInputText] = useState('');
  const [paymentFocused, setPaymentFocused] = useState(false);

  const endDate = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);
  const endDateMonth = endDate.toLocaleDateString('cs-CZ', { month: 'long' });
  const endDateYear = endDate.getFullYear();
  const yearsCount = Math.floor(months / 12);
  const monthsRemainder = months % 12;
  const durationText = yearsCount > 0
    ? `${yearsCount} ${yearsCount === 1 ? 'rok' : yearsCount < 5 ? 'roky' : 'let'}${monthsRemainder > 0 ? ` a ${monthsRemainder} ${monthsRemainder === 1 ? 'měsíc' : monthsRemainder < 5 ? 'měsíce' : 'měsíců'}` : ''}`
    : `${monthsRemainder} ${monthsRemainder === 1 ? 'měsíc' : monthsRemainder < 5 ? 'měsíce' : 'měsíců'}`;

  return (
    <div className="w-full bg-meopta-bg-light" id={layoutStyles?.anchorId || undefined}>
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-10 lg:pt-16',
          'pb-0',
        )}
      >
        {title && (
          <h3 className="mb-2 text-center text-24 font-bold text-meopta-text-primary lg:text-28">
            {title}
          </h3>
        )}

        {description && (
          <p className="mb-8 text-center text-14 text-meopta-text-secondary lg:text-16">{description}</p>
        )}

        <div
          ref={ref}
          className={cn(
            `
              mb-8 grid gap-4 opacity-0
              lg:mb-0 lg:grid-cols-[1fr_480px] lg:gap-5
            `,
            isVisible && 'animate-fade-in-up',
          )}
        >
          {/* Left: Sliders in white box */}
          <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm lg:p-8">
            {/* Amount slider */}
            <div className="w-full">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-16 font-medium text-meopta-text-secondary lg:text-18">
                  Kolik potřebujete půjčit?
                </span>
                {/* Mobile: input next to label */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountFocused ? amountInputText : formatCurrency(amount)}
                  onChange={(e) => setAmountInputText(e.target.value.replace(/\D/g, ''))}
                  onFocus={() => {
                    setAmountFocused(true);
                    setAmountInputText(String(amount));
                  }}
                  onBlur={() => {
                    setAmountFocused(false);
                    const val = parseInt(amountInputText.replace(/\D/g, ''), 10);
                    if (!isNaN(val)) setAmount(Math.max(minAmount, Math.min(maxAmount, val)));
                  }}
                  className="ml-auto w-36 rounded border border-meopta-border bg-white px-2 py-2 text-right text-base font-semibold text-meopta-text-primary outline-none focus:border-meopta-blue md:hidden"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <input
                    type="range"
                    min={minAmount}
                    max={maxAmount}
                    step={5000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#c8c8c8] outline-none
                      [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6b8e23] [&::-webkit-slider-thumb]:[box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]
                      [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#6b8e23] [&::-moz-range-thumb]:[box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]"
                    style={{
                      background: `linear-gradient(to right, #6b8e23 0%, #6b8e23 ${((amount - minAmount) / (maxAmount - minAmount)) * 100}%, #c8c8c8 ${((amount - minAmount) / (maxAmount - minAmount)) * 100}%, #c8c8c8 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-14 text-meopta-text-tertiary">
                    <span>{formatCurrency(minAmount)}</span>
                    <span>{formatCurrency(maxAmount)}</span>
                  </div>
                </div>
                {/* Desktop: input next to slider */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountFocused ? amountInputText : formatCurrency(amount)}
                  onChange={(e) => setAmountInputText(e.target.value.replace(/\D/g, ''))}
                  onFocus={() => {
                    setAmountFocused(true);
                    setAmountInputText(String(amount));
                  }}
                  onBlur={() => {
                    setAmountFocused(false);
                    const val = parseInt(amountInputText.replace(/\D/g, ''), 10);
                    if (!isNaN(val)) setAmount(Math.max(minAmount, Math.min(maxAmount, val)));
                  }}
                  className="hidden w-48 rounded-lg border border-meopta-border bg-white px-4 py-2 text-right text-18 font-semibold text-meopta-text-primary outline-none focus:border-meopta-blue md:block lg:text-20"
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="border-t border-meopta-border" />

            {/* Months slider */}
            <div className="w-full">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-16 font-medium text-meopta-text-secondary lg:text-18">
                  Kolik chcete měsíčně splácet?
                </span>
                {/* Mobile: input next to label */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={paymentFocused ? paymentInputText : formatCurrency(Math.round(results.monthlyPayment))}
                  onChange={(e) => setPaymentInputText(e.target.value.replace(/\D/g, ''))}
                  onFocus={() => {
                    setPaymentFocused(true);
                    setPaymentInputText(String(Math.round(results.monthlyPayment)));
                  }}
                  onBlur={() => {
                    setPaymentFocused(false);
                    const val = parseInt(paymentInputText.replace(/\D/g, ''), 10);
                    if (!isNaN(val)) setPayment(Math.max(minPayment, Math.min(maxPayment, val)));
                  }}
                  className="ml-auto w-36 rounded border border-meopta-border bg-white px-2 py-2 text-right text-base font-semibold text-meopta-text-primary outline-none focus:border-meopta-blue md:hidden"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <input
                    type="range"
                    min={minPayment}
                    max={maxPayment}
                    step={1}
                    value={effectivePayment}
                    onChange={(e) => setPayment(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#c8c8c8] outline-none
                      [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6b8e23] [&::-webkit-slider-thumb]:[box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]
                      [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#6b8e23] [&::-moz-range-thumb]:[box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]"
                    style={{
                      background: `linear-gradient(to right, #6b8e23 0%, #6b8e23 ${((effectivePayment - minPayment) / (Math.max(maxPayment - minPayment, 1))) * 100}%, #c8c8c8 ${((effectivePayment - minPayment) / (Math.max(maxPayment - minPayment, 1))) * 100}%, #c8c8c8 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-14 text-meopta-text-tertiary">
                    <span>{formatCurrency(minPayment)}</span>
                    <span>{formatCurrency(maxPayment)}</span>
                  </div>
                </div>
                {/* Desktop: input next to slider */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={paymentFocused ? paymentInputText : formatCurrency(Math.round(results.monthlyPayment))}
                  onChange={(e) => setPaymentInputText(e.target.value.replace(/\D/g, ''))}
                  onFocus={() => {
                    setPaymentFocused(true);
                    setPaymentInputText(String(Math.round(results.monthlyPayment)));
                  }}
                  onBlur={() => {
                    setPaymentFocused(false);
                    const val = parseInt(paymentInputText.replace(/\D/g, ''), 10);
                    if (!isNaN(val)) setPayment(Math.max(minPayment, Math.min(maxPayment, val)));
                  }}
                  className="hidden w-48 rounded-lg border border-meopta-border bg-white px-4 py-2 text-right text-18 font-semibold text-meopta-text-primary outline-none focus:border-meopta-blue md:block lg:text-20"
                />
              </div>
            </div>
          </div>

          {/* Right: Results box (dark grey) */}
          <div className="rounded-xl bg-[#454545] p-6 text-white lg:p-8">
            {/* Monthly payment - bold title */}
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-18 font-bold text-white lg:text-20">Měsíční splátka</span>
              <span className="text-36 font-bold text-meopta-blue lg:text-44">
                {formatCurrency(Math.round(results.monthlyPayment))}
              </span>
            </div>

            {/* Divider under monthly payment */}
            <hr className="mb-6 border-t border-white/20" />

            {/* Interest rate */}
            <div className="mb-3 flex items-center justify-between text-16">
              <span className="text-white/90">Úroková sazba</span>
              <span className="font-semibold text-white">
                od
                {formatPercent(userRate, 1)}
              </span>
            </div>

            {/* Interest rate slider */}
            <div className="mb-2">
              <input
                type="range"
                min={4.4}
                max={17.9}
                step={0.1}
                value={userRate}
                onChange={(e) => setUserRate(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#666] outline-none
                  [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-meopta-blue [&::-webkit-slider-thumb]:[box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]
                  [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-meopta-blue [&::-moz-range-thumb]:[box-shadow:0_0_0_6px_rgba(0,0,0,0.1)]"
                style={{
                  background: `linear-gradient(to right, #6b8e23 0%, #6b8e23 ${((userRate - 4.4) / (17.9 - 4.4)) * 100}%, #666 ${((userRate - 4.4) / (17.9 - 4.4)) * 100}%, #666 100%)`,
                }}
              />
            </div>

            {/* Help text under slider */}
            <p className="mb-6 text-center text-12 text-white/70">
              Vaše sazba může být jiná. Řekneme vám ji při žádosti.
            </p>

            {/* Loan details with divider above */}
            <hr className="mb-4 border-t border-white/20" />
            <div className="mb-2 flex items-start justify-between text-16">
              <span className="text-white/90">Počet splátek</span>
              <span className="font-bold text-white">{months}</span>
            </div>
            <div className="mb-6 text-14 text-white/80">
              Splácet budete
              {' '}
              {durationText}
              , vychází na
              {' '}
              {endDateMonth}
              {' '}
              {endDateYear}
              .
            </div>

            {/* RPSN with divider above and info icon with hover tooltip */}
            <hr className="mb-4 border-t border-white/20" />
            <div className="group relative mb-6 flex items-center justify-between text-16">
              <div className="flex items-center gap-2">
                <span className="text-white/90">RPSN</span>
                <div className="relative">
                  <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-13 font-bold text-meopta-text-primary hover:bg-white">
                    i
                  </div>
                  {/* Tooltip on hover - square shape */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-[420px] -translate-x-1/2 rounded-lg bg-white p-6 text-left text-14 font-normal leading-relaxed text-meopta-text-primary shadow-lg group-hover:block">
                    <strong>RPSN</strong>
                    {' '}
                    (roční procentní sazba nákladů) vyjadřuje skutečnou výši nákladů spojených s úvěrem. Zahrnuje úrokovou sazbu i všechny poplatky. RPSN umožňuje srovnání různých úvěrových nabídek.
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white"></div>
                  </div>
                </div>
              </div>
              <span className="font-bold text-white">{formatPercent(results.rpsn)}</span>
            </div>

            {/* Total with divider */}
            <hr className="mb-4 border-t border-white/20" />
            <div className="mb-6 flex justify-between text-18 font-bold">
              <span className="text-white">Celkem zaplatíte</span>
              <span className="text-white">{formatCurrency(Math.round(results.totalPaid))}</span>
            </div>

            {/* Links on one row */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="#"
                className="text-14 text-white underline hover:no-underline"
              >
                REPREZENTATIVNÍ PŘÍKLAD
              </a>

              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-14 font-semibold text-meopta-text-primary transition-colors hover:bg-gray-100"
              >
                CHCI PŮJČKU
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Legal text below calculator - part of component */}
        <div className="bg-meopta-bg-light px-6 pb-10 pt-6 lg:px-8 lg:pb-12">
          <p className="mx-auto max-w-4xl text-center text-13 leading-relaxed text-meopta-text-tertiary lg:text-14">
            Výše uvedené parametry odpovídají bonusové úrokové sazbě, kterou získáte za včasné splácení. Základní úroková sazba je 5,4 % a RPSN je 5,54 %, splátka
            {' '}
            {formatCurrency(Math.round(calculateAnnuity(defaultAmount, 5.4, defaultMonths)))}
            , doba splácení vychází na
            {' '}
            {Math.floor(defaultMonths / 12)}
            {' '}
            {Math.floor(defaultMonths / 12) === 1 ? 'rok' : Math.floor(defaultMonths / 12) < 5 ? 'roky' : 'let'}
            {' '}
            a
            {' '}
            {defaultMonths % 12}
            {' '}
            {defaultMonths % 12 === 1 ? 'měsíc' : defaultMonths % 12 < 5 ? 'měsíce' : 'měsíců'}
            {' '}
            a celkem zaplatíte
            {' '}
            {formatCurrency(Math.round(calculateAnnuity(defaultAmount, 5.4, defaultMonths) * defaultMonths))}
            . Úrokovou sazbu úvěru nastavujeme každému klientovi individuálně. Její výše ale nikdy nepřekročí 17,9 %. Přesný výpočet a parametry půjčky získáte během online žádosti.
          </p>
        </div>
      </Container>
    </div>
  );
};
