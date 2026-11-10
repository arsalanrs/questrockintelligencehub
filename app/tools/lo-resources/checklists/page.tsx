import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { LoChecklist } from '@/components/LoChecklist';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Checklists — LO Resources',
  description: 'Documents needed to submit a loan to underwriting.',
};

export default async function LoChecklistsPage() {
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
        <Link
          href="/tools/lo-resources"
          className="mb-6 inline-flex text-sm font-medium text-green-mid no-underline hover:underline"
        >
          ← LO Resources
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
          LO Resources · Checklists
        </p>
        <h1 className="font-display mt-2 text-3xl text-green">Underwriting checklists</h1>
        <p className="mt-2 mb-8 max-w-2xl text-sm leading-relaxed text-text-muted">
          Shorter list for loan officers. Processing keeps the full file list under Processing Resources.
        </p>
        <LoChecklist />
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
