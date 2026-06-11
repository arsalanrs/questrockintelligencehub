import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * SSO launch route.
 *
 * Each app keeps its OWN Supabase project — data never moves.
 * Central Hub holds only the service-role key for each app so it can call
 * admin.generateLink() and produce a one-time magic link for the current user.
 *
 * Special cases:
 *  - qrdashboard: Central Hub already uses QR Dashboard's Supabase, so we just
 *    pass the existing session tokens directly (same project, no magic link needed).
 *  - shapephonezap: No Supabase at all — we pass the Central Hub session token
 *    and the ShapePhoneZap callback validates it against Central Hub's Supabase.
 */

interface AppConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
  /** Where Supabase should redirect after magic-link verification */
  ssoEntryUrl: string;
}

function getAppConfig(appId: string): AppConfig | null {
  const map: Record<string, { urlEnv: string; keyEnv: string; entry: string }> = {
    "qr-income-bot": {
      urlEnv: "INCOME_BOT_SUPABASE_URL",
      keyEnv: "INCOME_BOT_SERVICE_ROLE_KEY",
      entry: "https://qr-income-bot.vercel.app/auth/sso-entry",
    },
    qrscoreboard: {
      urlEnv: "PIPELINE_SUPABASE_URL",
      keyEnv: "PIPELINE_SERVICE_ROLE_KEY",
      entry: "https://qrscoreboard.vercel.app/auth/sso-entry",
    },
    creditrepair: {
      urlEnv: "CREDIT_REPAIR_SUPABASE_URL",
      keyEnv: "CREDIT_REPAIR_SERVICE_ROLE_KEY",
      // Credit Repair uses browser Supabase — magic link hash is handled automatically
      entry: "https://creditrepairv4.vercel.app/",
    },
  };

  const cfg = map[appId];
  if (!cfg) return null;

  const supabaseUrl = process.env[cfg.urlEnv]?.trim();
  const serviceRoleKey = process.env[cfg.keyEnv]?.trim();
  if (!supabaseUrl || !serviceRoleKey) return null;

  return { supabaseUrl, serviceRoleKey, ssoEntryUrl: cfg.entry };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId") ?? "";

  // Get current Central Hub user
  const hubClient = await createSupabaseServerClient();
  const {
    data: { session },
  } = await hubClient.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userEmail = session.user.email!;

  // ── QR Dashboard — same Supabase project as Central Hub ─────────────────
  if (appId === "qrdashboard") {
    const target = new URL("https://qrdashboard.vercel.app/auth/callback");
    target.searchParams.set("sso_at", session.access_token);
    target.searchParams.set("sso_rt", session.refresh_token);
    return NextResponse.redirect(target.toString());
  }

  // ── ShapePhoneZap — no Supabase, HMAC session via token validation ───────
  if (appId === "shapephonezap") {
    const target = new URL("https://shapephonezap.vercel.app/api/auth-callback");
    target.searchParams.set("sso_at", session.access_token);
    return NextResponse.redirect(target.toString());
  }

  // ── All other apps — generate a magic link against their own Supabase ────
  const cfg = getAppConfig(appId);
  if (!cfg) {
    return new NextResponse(`Unknown or misconfigured appId: ${appId}`, { status: 400 });
  }

  const adminClient = createClient(cfg.supabaseUrl, cfg.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await adminClient.auth.admin.generateLink({
    type: "magiclink",
    email: userEmail,
    options: { redirectTo: cfg.ssoEntryUrl },
  });

  if (error || !data?.properties?.action_link) {
    console.error("[launch] generateLink error:", error?.message);
    return new NextResponse(
      `Could not generate sign-in link for ${appId}. Make sure the user exists in that app's Supabase and the service role key is set correctly.`,
      { status: 500 }
    );
  }

  return NextResponse.redirect(data.properties.action_link);
}
