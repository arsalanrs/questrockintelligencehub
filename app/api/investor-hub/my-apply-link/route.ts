import { type NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { investorHubApplyUrlForEmail } from '@/lib/investor-hub-access';

/**
 * Redirects the signed-in Hub user to their personal Investor Hub apply link
 * (attributed to their LO roster entry when known).
 */
export async function GET(request: NextRequest) {
  const hubClient = await createSupabaseServerClient();
  const {
    data: { session },
  } = await hubClient.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const url = investorHubApplyUrlForEmail(session.user.email);
  return NextResponse.redirect(url);
}
