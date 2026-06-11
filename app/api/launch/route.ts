import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * SSO launch route.
 *
 * Each app keeps its OWN Supabase project. Central Hub signs the user into that
 * project server-side (signInWithPassword), then redirects to /auth/callback
 * with sso_at + sso_rt — same pattern as QR Dashboard.
 *
 * No magic links → no localhost:3000 redirect issues.
 */

interface AppConfig {
  supabaseUrl: string;
  anonKey: string;
  callbackUrl: string;
}

function getAppConfig(appId: string): AppConfig | null {
  const map: Record<string, { urlEnv: string; anonEnv: string; callback: string }> = {
    "qr-income-bot": {
      urlEnv: "INCOME_BOT_SUPABASE_URL",
      anonEnv: "INCOME_BOT_SUPABASE_ANON_KEY",
      callback: "https://qr-income-bot.vercel.app/auth/callback",
    },
    qrscoreboard: {
      urlEnv: "PIPELINE_SUPABASE_URL",
      anonEnv: "PIPELINE_SUPABASE_ANON_KEY",
      callback: "https://qrscoreboard.vercel.app/auth/callback",
    },
    creditrepair: {
      urlEnv: "CREDIT_REPAIR_SUPABASE_URL",
      anonEnv: "CREDIT_REPAIR_SUPABASE_ANON_KEY",
      callback: "https://creditrepairv4.vercel.app/auth/callback",
    },
  };

  const cfg = map[appId];
  if (!cfg) return null;

  const supabaseUrl = process.env[cfg.urlEnv]?.trim();
  const anonKey = process.env[cfg.anonEnv]?.trim();
  if (!supabaseUrl || !anonKey) return null;

  return { supabaseUrl, anonKey, callbackUrl: cfg.callback };
}

/** Sign into the target app's Supabase and return session tokens. */
async function mintSessionForApp(
  supabaseUrl: string,
  anonKey: string,
  email: string
): Promise<{ access_token: string; refresh_token: string } | null> {
  const password =
    process.env.SSO_BOOTSTRAP_PASSWORD?.trim() || "WelcomeToQuestRock1!";

  const client = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    console.error("[launch] signInWithPassword error:", error?.message);
    return null;
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId") ?? "";

  const hubClient = await createSupabaseServerClient();
  const {
    data: { session },
  } = await hubClient.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userEmail = session.user.email!;

  // QR Dashboard — same Supabase project as Central Hub
  if (appId === "qrdashboard") {
    const target = new URL("https://qrdashboard.vercel.app/auth/callback");
    target.searchParams.set("sso_at", session.access_token);
    target.searchParams.set("sso_rt", session.refresh_token);
    return NextResponse.redirect(target.toString());
  }

  // ShapePhoneZap — validate Central Hub token, set HMAC cookie (no Supabase on app)
  if (appId === "shapephonezap") {
    const target = new URL("https://shapephonezap.vercel.app/api/auth-callback");
    target.searchParams.set("sso_at", session.access_token);
    return NextResponse.redirect(target.toString());
  }

  const cfg = getAppConfig(appId);
  if (!cfg) {
    return new NextResponse(
      `Unknown or misconfigured appId: ${appId}. Check Central Hub env vars (e.g. ${appId === "qr-income-bot" ? "INCOME_BOT_SUPABASE_URL + INCOME_BOT_SUPABASE_ANON_KEY" : "per-app SUPABASE_URL + ANON_KEY"}).`,
      { status: 400 }
    );
  }

  const tokens = await mintSessionForApp(cfg.supabaseUrl, cfg.anonKey, userEmail);
  if (!tokens) {
    return new NextResponse(
      `Could not sign you into ${appId}. Make sure ${userEmail} exists in that app's Supabase Auth with password WelcomeToQuestRock1! (or set SSO_BOOTSTRAP_PASSWORD on Central Hub).`,
      { status: 500 }
    );
  }

  const target = new URL(cfg.callbackUrl);
  target.searchParams.set("sso_at", tokens.access_token);
  target.searchParams.set("sso_rt", tokens.refresh_token);
  return NextResponse.redirect(target.toString());
}
