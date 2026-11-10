'use client';

import { useEffect, useMemo, useState } from 'react';
import { Printer } from 'lucide-react';
import {
  AGENCY_INCOME_TYPES,
  BANK_STATEMENT_MONTHS,
  LOAN_PROGRAMS,
  LOAN_PURPOSES,
  checklistItems,
  showBankStatementMonthsFilter,
  showIncomeTypeFilter,
  type AgencyIncomeType,
  type BankStatementMonths,
  type ChecklistAudience,
  type LoanProgram,
  type LoanPurpose,
} from '@/lib/lo-checklists';

export function LoanSubmissionChecklist({ audience }: { audience: ChecklistAudience }) {
  const [program, setProgram] = useState<LoanProgram>('Conventional');
  const [purpose, setPurpose] = useState<LoanPurpose>('Purchase');
  const [incomeType, setIncomeType] = useState<AgencyIncomeType>('W-2 / Salary / Hourly');
  const [bankMonths, setBankMonths] = useState<BankStatementMonths>('12 months');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const incomeVisible = showIncomeTypeFilter(program);
  const bankVisible = showBankStatementMonthsFilter(program);

  useEffect(() => {
    if (!incomeVisible && incomeType) {
      setIncomeType('W-2 / Salary / Hourly');
    }
  }, [incomeVisible, incomeType]);

  const items = useMemo(
    () =>
      checklistItems(program, purpose, audience, {
        incomeType: incomeVisible ? incomeType : undefined,
        bankStatementMonths: bankVisible ? bankMonths : undefined,
      }),
    [program, purpose, audience, incomeType, bankMonths, incomeVisible, bankVisible],
  );

  const filterKey = incomeVisible ? incomeType : bankVisible ? bankMonths : '';
  const key = `${audience}:${program}:${purpose}:${filterKey}`;
  const forLo = audience === 'lo';

  function toggle(item: string) {
    const id = `${key}:${item}`;
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  }

  function printList() {
    window.print();
  }

  return (
    <div className="space-y-5">
      <p className="print:hidden text-sm text-text-muted">
        Your checklist changes automatically as you make selections.
      </p>

      <div className="print:hidden grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-green-mid">
            Loan program
          </span>
          <select
            value={program}
            onChange={(event) => setProgram(event.target.value as LoanProgram)}
            className="min-h-12 w-full rounded-[14px] border border-[var(--border-card)] bg-white px-3 text-sm text-green"
          >
            {LOAN_PROGRAMS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-green-mid">
            Loan purpose
          </span>
          <select
            value={purpose}
            onChange={(event) => setPurpose(event.target.value as LoanPurpose)}
            className="min-h-12 w-full rounded-[14px] border border-[var(--border-card)] bg-white px-3 text-sm text-green"
          >
            {LOAN_PURPOSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        {incomeVisible ? (
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-green-mid">
              Income / qualification type
            </span>
            <select
              value={incomeType}
              onChange={(event) => setIncomeType(event.target.value as AgencyIncomeType)}
              className="min-h-12 w-full rounded-[14px] border border-[var(--border-card)] bg-white px-3 text-sm text-green"
            >
              {AGENCY_INCOME_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {bankVisible ? (
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-green-mid">
              Bank statement lookback
            </span>
            <select
              value={bankMonths}
              onChange={(event) => setBankMonths(event.target.value as BankStatementMonths)}
              className="min-h-12 w-full rounded-[14px] border border-[var(--border-card)] bg-white px-3 text-sm text-green"
            >
              {BANK_STATEMENT_MONTHS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="print:hidden flex flex-wrap gap-3">
        <button
          type="button"
          onClick={printList}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green px-4 text-sm font-semibold text-white hover:bg-green-mid"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
        <button
          type="button"
          onClick={printList}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border-card)] bg-white px-4 text-sm font-semibold text-green hover:bg-green-pale"
        >
          Save as PDF
        </button>
        <p className="self-center text-xs text-text-muted">
          Save as PDF uses the print dialog — choose “Save as PDF” as the destination.
        </p>
      </div>

      <section className="rounded-[20px] border border-[var(--border-card)] bg-white p-5 sm:p-7">
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-mid">
            {forLo ? 'LO submission checklist' : 'Processing submission checklist'}
          </p>
          <h2 className="font-display mt-2 text-2xl text-green">
            {program} · {purpose}
            {incomeVisible ? ` · ${incomeType}` : null}
            {bankVisible ? ` · ${bankMonths}` : null}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {forLo
              ? 'Documents the loan officer collects from the borrower. Title, appraisal, and credit stay on the processing list.'
              : 'Full document set for the file, including title, appraisal, and credit.'}
          </p>
        </div>
        <ul className="m-0 list-none space-y-2 p-0">
          {items.map((item) => {
            const id = `${key}:${item}`;
            return (
              <li key={id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-[12px] px-2 py-2 hover:bg-cream">
                  <input
                    type="checkbox"
                    checked={Boolean(checked[id])}
                    onChange={() => toggle(item)}
                    className="mt-1 h-4 w-4 accent-[var(--green)]"
                  />
                  <span className={`text-sm leading-6 ${checked[id] ? 'text-text-muted line-through' : 'text-green'}`}>
                    {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
