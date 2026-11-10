import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ProcessingResourcesHome } from '@/components/ProcessingResourcesHome';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Processing Resources — QuestRock Intelligence Hub',
  description: 'Processing checklists and title & insurance clauses.',
};

export default async function ProcessingResourcesPage() {
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
        <h1 className="font-display mt-2 text-3xl text-green">Processing Resources</h1>
        <p className="mt-2 mb-8 max-w-2xl text-sm leading-relaxed text-text-muted">
          Full submission checklists plus lender title and insurance clauses.
        </p>
        <ProcessingResourcesHome />
      </main>
      <Footer platformCount={0} />
      <style>{`
        @media print {
          header, footer, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; max-width: none !important; }
        }
      `}</style>
    </>
  );
}
