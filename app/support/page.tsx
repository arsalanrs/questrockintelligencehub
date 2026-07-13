import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SupportForm } from '@/components/SupportForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'IT Support — QuestRock Intelligence Hub',
  description: 'Submit IT support tickets to QuestRock Systems.',
};

export default async function SupportPage() {
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
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-green-mid no-underline hover:underline"
        >
          ← Back to Hub
        </Link>
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
            Internal · IT Support
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold text-green sm:text-3xl">
            Submit an IT ticket
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            Shape, Hub SSO, Call Tracker, dashboards, email, or device issues — describe the problem and
            Systems will triage. Urgent production outages: mark priority <strong>Urgent</strong> and call
            the ops line if you have one.
          </p>
        </div>
        <div className="max-w-2xl rounded-2xl border border-[var(--border-card)] bg-white p-6 shadow-sm sm:p-8">
          <SupportForm />
        </div>
      </main>
      <Footer platformCount={0} />
    </>
  );
}
