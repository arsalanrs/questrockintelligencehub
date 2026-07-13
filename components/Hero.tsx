import { HubSidebarPanel } from '@/components/HubSidebarPanel';

type HeroProps = {
  projectCount: number;
  liveDeployCount: number;
};

export function Hero({ projectCount, liveDeployCount }: HeroProps) {
  return (
    <section
      id="overview"
      className="mx-auto grid max-w-hub items-end gap-10 px-6 pb-10 pt-16 sm:px-12 lg:grid-cols-2 lg:gap-16 lg:pb-10 lg:pt-20"
    >
      <div>
        <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-green-mid">
          <span className="inline-block h-px w-5 bg-green-mid" aria-hidden />
          Central Command
        </div>
        <h1 className="mb-6 font-display text-4xl font-medium leading-[1.08] text-green sm:text-5xl lg:text-[56px]">
          All your <em className="text-blue">tools,</em>
          <br />
          one destination.
        </h1>
        <p className="mb-10 max-w-[440px] text-base font-light leading-relaxed text-text-muted">
          The Questrock Intelligence Hub brings platforms, dashboards, and automation together in
          one simple place—so anyone can find what they need and move work forward.
        </p>
        <div className="flex flex-wrap gap-8 border-t border-[var(--border)] pt-8 sm:gap-10">
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl font-bold text-green">{projectCount}</span>
            <span className="text-[11px] font-normal uppercase tracking-[0.09em] text-text-muted">
              Active Projects
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl font-bold text-green">{liveDeployCount}</span>
            <span className="text-[11px] font-normal uppercase tracking-[0.09em] text-text-muted">
              Live Deploys
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl font-bold text-green">∞</span>
            <span className="text-[11px] font-normal uppercase tracking-[0.09em] text-text-muted">
              Possibilities
            </span>
          </div>
        </div>
      </div>
      <HubSidebarPanel />
    </section>
  );
}
