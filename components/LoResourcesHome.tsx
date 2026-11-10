import Link from 'next/link';
import { ClipboardList, GraduationCap } from 'lucide-react';

const cards = [
  {
    href: '/university/training/sales/loan-officer',
    title: 'Loan Officer Training',
    tag: 'QuestRock University',
    blurb: 'Open the Loan Officer classes — Introduction through Sales Process.',
    icon: GraduationCap,
    cta: 'Open training',
  },
  {
    href: '/tools/lo-resources/checklists',
    title: 'Checklists',
    tag: 'Underwriting',
    blurb: 'Shorter sales list by program and purpose. Processing has the full file list.',
    icon: ClipboardList,
    cta: 'Open checklists',
  },
];

export function LoResourcesHome() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group rounded-[20px] border border-[var(--border-card)] bg-white p-6 no-underline shadow-[0_6px_24px_rgba(26,60,46,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,60,46,0.08)]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-green-pale text-green-mid">
            <card.icon className="h-5 w-5" />
          </span>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-green-mid">
            {card.tag}
          </p>
          <h2 className="font-display mt-2 text-2xl text-green">{card.title}</h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">{card.blurb}</p>
          <p className="mt-5 text-sm font-semibold text-green-mid">{card.cta} →</p>
        </Link>
      ))}
    </div>
  );
}
