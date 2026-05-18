import Link from 'next/link';
import Image from 'next/image';

type HeaderProps = {
  liveCount: number;
};

export function Header({ liveCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-white/[0.08] bg-green px-6 sm:px-12">
      <Link href="/" className="flex items-center gap-3.5 no-underline sm:gap-3.5">
        <div className="relative h-[38px] w-[38px] shrink-0 overflow-hidden rounded-[10px] bg-white/10">
          <Image
            src="/logo-clear-web.webp"
            alt=""
            width={38}
            height={38}
            className="object-contain object-center p-0.5"
            priority
          />
        </div>
        <div className="flex flex-col gap-px">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
            Questrock
          </span>
          <span className="font-display text-[17px] font-medium tracking-[0.01em] text-white">
            Intelligence Hub
          </span>
        </div>
      </Link>
      <nav className="flex max-w-[55%] flex-wrap items-center justify-end gap-2 sm:max-w-none sm:gap-6 lg:gap-8">
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
        <a
          href="#settings"
          className="whitespace-nowrap text-xs font-normal text-white/55 transition-colors hover:text-white sm:text-sm"
        >
          Settings
        </a>
        <div className="flex items-center gap-1.5 rounded-full border border-[rgba(82,183,136,0.3)] bg-[rgba(82,183,136,0.18)] px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] text-green-light sm:px-3 sm:text-xs">
          <span className="nav-pulse inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-light" />
          {liveCount} Live
        </div>
      </nav>
    </header>
  );
}
