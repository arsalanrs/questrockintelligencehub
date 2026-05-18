import Image from 'next/image';

type FooterProps = {
  platformCount: number;
};

export function Footer({ platformCount }: FooterProps) {
  return (
    <footer
      id="settings"
      className="flex flex-col gap-4 bg-green px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-12"
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex w-fit shrink-0 items-center justify-center self-start rounded-[8px] bg-white p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] sm:rounded-[10px] sm:p-2">
          <Image
            src="/logo-questrock-112023.webp"
            alt="Questrock"
            width={300}
            height={78}
            className="h-5 w-auto max-w-[120px] object-contain object-center sm:h-6 sm:max-w-[150px]"
          />
        </div>
        <span className="text-[13px] text-white/45 sm:border-l sm:border-white/15 sm:pl-3">
          <strong className="font-medium text-white/70">Questrock Intelligence Hub</strong> — One
          place for every platform
        </span>
      </div>
      <div className="shrink-0 text-xs tracking-[0.04em] text-white/30">
        {platformCount} platforms · All systems operational
      </div>
    </footer>
  );
}
