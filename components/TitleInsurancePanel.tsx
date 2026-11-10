'use client';

import { useMemo, useState } from 'react';
import {
  TITLE_INSURANCE_LENDERS,
  defaultTitleInsuranceLenderId,
} from '@/lib/title-insurance-lenders';

export function TitleInsurancePanel() {
  const [lenderId, setLenderId] = useState(defaultTitleInsuranceLenderId());
  const lender = useMemo(
    () => TITLE_INSURANCE_LENDERS.find((row) => row.id === lenderId) ?? TITLE_INSURANCE_LENDERS[0],
    [lenderId],
  );

  if (!lender) {
    return null;
  }

  return (
    <div className="space-y-5">
      <label className="block max-w-md">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-green-mid">
          Lender / investor
        </span>
        <select
          value={lender.id}
          onChange={(event) => setLenderId(event.target.value)}
          className="min-h-12 w-full rounded-[14px] border border-[var(--border-card)] bg-white px-3 text-sm text-green"
        >
          {TITLE_INSURANCE_LENDERS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
              {option.isDefault ? ' (default)' : ''}
            </option>
          ))}
        </select>
      </label>

      {(lender.fhaLenderId || lender.vaLenderId) && (
        <div className="rounded-[14px] border border-[var(--border-card)] bg-cream px-4 py-3 text-sm text-green">
          {lender.fhaLenderId ? (
            <p className="m-0">
              <span className="font-semibold">FHA lender ID:</span> {lender.fhaLenderId}
            </p>
          ) : null}
          {lender.vaLenderId ? (
            <p className={`m-0 ${lender.fhaLenderId ? 'mt-1' : ''}`}>
              <span className="font-semibold">VA lender ID:</span> {lender.vaLenderId}
            </p>
          ) : null}
        </div>
      )}

      {lender.clauseNote ? (
        <p className="text-sm text-amber-800">{lender.clauseNote}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <ClauseCard title={lender.lossPayeeLabel} lines={lender.lossPayee} />
        <ClauseCard title={lender.titleLabel} lines={lender.title} />
      </div>
    </div>
  );
}

function ClauseCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <article className="rounded-[20px] bg-[#d7e8f6] px-8 py-12 text-center text-[#5b7fa6]">
      <h3 className="text-lg font-medium leading-snug sm:text-xl">{title}</h3>
      <div className="mt-6 space-y-1 text-base leading-7 sm:text-lg">
        {lines.map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>
    </article>
  );
}
