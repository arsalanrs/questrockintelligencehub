import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProjectGrid } from '@/components/ProjectGrid';
import { Footer } from '@/components/Footer';
import { projects } from '@/lib/projects';

export default function Home() {
  const liveCount = projects.filter((p) => p.status === 'live').length;

  return (
    <>
      <Header liveCount={liveCount} />
      <main>
        <Hero projectCount={projects.length} liveDeployCount={liveCount} />
        <div className="mx-auto flex max-w-hub items-center gap-5 px-6 pb-6 pt-4 sm:px-12">
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
            All Platforms
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <ProjectGrid projects={projects} />
      </main>
      <Footer platformCount={projects.length} />
    </>
  );
}
