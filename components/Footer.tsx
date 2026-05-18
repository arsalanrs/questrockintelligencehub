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
      <div className="flex items-center gap-2.5">
        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-[7px] bg-white/10">
          <Image
            src="/logo-clear-web.webp"
            alt=""
            width={28}
            height={28}
            className="object-contain object-center p-px"
          />
        </div>
        <span className="text-[13px] text-white/45">
          <strong className="font-medium text-white/70">Questrock Intelligence Hub</strong> — One
          place for every platform
        </span>
      </div>
      <div className="text-xs tracking-[0.04em] text-white/30">
        {platformCount} platforms · All systems operational
      </div>
    </footer>
  );
}
