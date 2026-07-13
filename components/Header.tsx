import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton } from '@/components/SignOutButton';

type HeaderProps = {
  liveCount: number;
  userName?: string;
  userRole?: string;
};

const roleLabel: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  loan_officer: 'LO',
};

export function Header({ liveCount, userName, userRole }: HeaderProps) {
  const roleBadge = userRole ? roleLabel[userRole] ?? userRole : null;

  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-white/[0.08] bg-green px-6 sm:px-12">
      <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-4 no-underline">
        <div className="flex shrink-0 items-center justify-center rounded-[10px] bg-white p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] sm:p-2">
          <Image
            src="/logo-questrock-112023.webp"
            alt="Questrock"
            width={300}
            height={78}
            priority
            className="h-6 w-auto max-w-[min(40vw,148px)] object-contain object-center sm:h-8 sm:max-w-[188px]"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center border-l border-white/20 pl-2 sm:h-9 sm:pl-4">
          <span className="font-display text-[14px] font-medium leading-tight tracking-[0.01em] text-white sm:text-[17px]">
            Intelligence Hub
          </span>
        </div>
      </Link>

      <nav className="flex max-w-[55%] flex-wrap items-center justify-end gap-2 sm:max-w-none sm:gap-4 lg:gap-6">
        {userName ? (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-white/80 font-medium">{userName}</span>
              {roleBadge && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-white/70">
                  {roleBadge}
                </span>
              )}
            </div>
            <Link
              href="/support"
              className="whitespace-nowrap text-xs font-normal text-white/55 transition-colors hover:text-white sm:text-sm"
            >
              IT Support
            </Link>
            <SignOutButton />
          </>
        ) : (
          <>
            <a
              href="#overview"
              className="whitespace-nowrap text-xs font-normal text-white/55 transition-colors hover:text-white sm:text-sm"
            >
              Overview
            </a>
            <a
              href="#projects"
              className="whitespace-nowrap text-xs font-normal text-white/55 transition-colors hover:text-white sm:text-sm"
            >
              Projects
            </a>
          </>
        )}
        <div className="flex items-center gap-1.5 rounded-full border border-[rgba(82,183,136,0.3)] bg-[rgba(82,183,136,0.18)] px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] text-green-light sm:px-3 sm:text-xs">
          <span className="nav-pulse inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-light" />
          {liveCount} Live
        </div>
      </nav>
    </header>
  );
}
