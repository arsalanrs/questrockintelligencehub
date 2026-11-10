import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { LoResourcesHome } from '@/components/LoResourcesHome';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'LO Resources — QuestRock Intelligence Hub',
  description: 'Loan officer training and underwriting checklists.',
};

export default async function LoResourcesPage() {
  let userName: string | undefined;
  let userRole: string | undefined;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .maybeSingle();
      userName = profile?.full_name ?? user.email?.split('@')[0];
      userRole = profile?.role ?? undefined;
    }
  } catch {
    /* middleware handles auth */
  }

  return (
    <>
      <Header liveCount={0} userName={userName} userRole={userRole} />
      <main className="mx-auto max-w-hub px-6 py-10 sm:px-12">
        <Link href="/" className="mb-6 inline-flex text-sm font-medium text-green-mid no-underline hover:underline">
          ← Back to Hub
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Tools</p>
        <h1 className="font-display mt-2 text-3xl text-green">LO Resources</h1>
        <p className="mt-2 mb-8 max-w-2xl text-sm leading-relaxed text-text-muted">
          Training downloads and borrower-facing submission checklists.
        </p>
        <LoResourcesHome />
      </main>
      <Footer platformCount={0} />
    </>
  );
}
