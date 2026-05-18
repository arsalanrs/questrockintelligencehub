import { recentActivity } from '@/lib/activity';

const dotClass: Record<(typeof recentActivity)[number]['dot'], string> = {
  green: 'bg-green-light',
  blue: 'bg-blue-light',
  amber: 'bg-[#F5A623]',
};

export function ActivityFeed() {
  return (
    <div className="rounded-[20px] border border-[var(--border-card)] bg-[var(--white)] p-7">
      <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
        Recent Activity
      </div>
      <ul className="m-0 list-none p-0">
        {recentActivity.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 border-b border-[var(--border)] py-2.5 last:border-b-0 last:pb-0"
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass[item.dot]}`}
              aria-hidden
            />
            <div>
              <p className="m-0 text-[13px] font-normal leading-snug text-text-dark">
                <span className="font-medium">{item.title}</span>
                {item.commit}
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
