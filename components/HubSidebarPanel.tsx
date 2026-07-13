import Link from 'next/link';
import { ArrowUpRight, LifeBuoy, PlayCircle } from 'lucide-react';

const trainingClasses = [
  {
    id: 'lo-system',
    title: 'The Loan Officer System That Converts',
    url: 'https://youtu.be/eptgSP3tpWQ',
    platform: 'YouTube',
  },
  {
    id: 'first-call',
    title: '8-Step First Call Training',
    url: 'https://youtu.be/kdd_qdJe9Yw',
    platform: 'YouTube',
  },
  {
    id: 'lead-to-app',
    title: 'New Lead to Application — Intelligence Hub & Shape CRM Overview',
    url: 'https://www.loom.com/share/ae0783a0cfd941ccbfdb92651f98e112',
    platform: 'Loom',
  },
  {
    id: 'credit-to-close',
    title: 'Credit to Close — LendingPad Overview',
    url: 'https://www.loom.com/share/61fd0dd375b3458da2126772f6e178ae',
    platform: 'Loom',
  },
] as const;

export function HubSidebarPanel() {
  return (
    <div className="rounded-[20px] border border-[var(--border-card)] bg-[var(--white)] p-7">
      <Link
        href="/support"
        className="mb-6 flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-green px-5 py-3.5 text-[15px] font-medium text-white no-underline transition-[background,transform] duration-200 hover:-translate-y-px hover:bg-green-mid"
      >
        <LifeBuoy className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden />
        IT Help Request
      </Link>

      <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
        Training Classes
      </div>
      <ul className="m-0 list-none p-0">
        {trainingClasses.map((item) => (
          <li key={item.id} className="border-b border-[var(--border)] last:border-b-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 py-3 text-inherit no-underline transition-colors hover:text-green-mid"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-green-pale text-green-mid">
                <PlayCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium leading-snug text-text-dark group-hover:text-green-mid">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-text-muted">{item.platform}</span>
              </span>
              <ArrowUpRight
                className="mt-1 h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100"
                strokeWidth={2}
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
