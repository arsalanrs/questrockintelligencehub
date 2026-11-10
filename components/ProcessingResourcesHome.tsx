'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ClipboardList, Landmark } from 'lucide-react';
import { LoanSubmissionChecklist } from '@/components/LoanSubmissionChecklist';
import { TitleInsurancePanel } from '@/components/TitleInsurancePanel';

const tabs = [
  { id: 'checklists', label: 'Checklists', icon: ClipboardList },
  { id: 'title', label: 'Title & Insurance', icon: Landmark },
] as const;

type TabId = (typeof tabs)[number]['id'];

export function ProcessingResourcesHome() {
  const [tab, setTab] = useState<TabId>('checklists');

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ${
                active
                  ? 'bg-green text-white'
                  : 'border border-[var(--border-card)] bg-white text-green hover:bg-green-pale'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'checklists' ? (
        <>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-text-muted">
            Full processing list. Loan officers see a shorter version under LO Resources.
          </p>
          <LoanSubmissionChecklist audience="processing" />
        </>
      ) : (
        <>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-text-muted">
            QuestRock is the default mortgagee. Pick an investor for wholesaler-specific CPL / title
            clauses and agency IDs where we have them on file.
          </p>
          <TitleInsurancePanel />
        </>
      )}

      <p className="mt-8 text-sm text-text-muted">
        LO view:{' '}
        <Link href="/tools/lo-resources/checklists" className="font-medium text-green-mid no-underline hover:underline">
          LO Resources checklists
        </Link>
      </p>
    </div>
  );
}
