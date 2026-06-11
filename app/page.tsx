import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProjectGrid } from '@/components/ProjectGrid';
import { Footer } from '@/components/Footer';
import { projects } from '@/lib/projects';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { canAccessShapePhoneZap } from '@/lib/shapephonezap-access';

export default async function Home() {
  let userEmail: string | undefined;
  let userName: string | undefined;
  let userRole: string | undefined;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userEmail = user.email ?? undefined;
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .maybeSingle();
      userName = profile?.full_name ?? user.email?.split('@')[0];
      userRole = profile?.role ?? undefined;
    }
  } catch {
    /* missing env or unauthenticated — middleware handles redirect */
  }

  const visibleProjects = projects.filter(
    (p) => p.id !== 'shapephonezap' || canAccessShapePhoneZap(userEmail)
  );
  const liveCount = visibleProjects.filter((p) => p.status === 'live').length;

  return (
    <>
      <Header liveCount={liveCount} userName={userName} userRole={userRole} />
      <main>
        <Hero projectCount={visibleProjects.length} liveDeployCount={liveCount} />
        <div className="mx-auto flex max-w-hub items-center gap-5 px-6 pb-6 pt-4 sm:px-12">
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
            All Platforms
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <ProjectGrid projects={visibleProjects} />
      </main>
      <Footer platformCount={visibleProjects.length} />
    </>
  );
}
