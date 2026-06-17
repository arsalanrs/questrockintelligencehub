import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAccessShapePhoneZap } from "@/lib/shapephonezap-access";
import { canAccessCallTracker } from "@/lib/call-tracker-access";

/**
 * SSO launch route.
 *
 * Each app keeps its OWN Supabase project. Central Hub mints a session
 * server-side, then redirects to /auth/callback with sso_at + sso_rt.
 *
 * Accepts either ANON_KEY (signInWithPassword) or SERVICE_ROLE_KEY
 * (generateLink + verifyOtp) — whichever you have in Vercel.
 */

interface AppConfig {
  supabaseUrl: string;
  anonKey?: string;
  serviceRoleKey?: string;
  callbackUrl: string;
}

function getAppConfig(appId: string): AppConfig | null {
  const map: Record<
    string,
    { urlEnv: string; anonEnv: string; serviceEnv: string; callback: string }
  > = {
    "qr-income-bot": {
      urlEnv: "INCOME_BOT_SUPABASE_URL",
      anonEnv: "INCOME_BOT_SUPABASE_ANON_KEY",
      serviceEnv: "INCOME_BOT_SERVICE_ROLE_KEY",
      callback: "https://qr-income-bot.vercel.app/auth/callback",
    },
    qrscoreboard: {
      urlEnv: "PIPELINE_SUPABASE_URL",
      anonEnv: "PIPELINE_SUPABASE_ANON_KEY",
      serviceEnv: "PIPELINE_SERVICE_ROLE_KEY",
      callback: "https://qrscoreboard.vercel.app/auth/callback",
    },
    creditrepair: {
      urlEnv: "CREDIT_REPAIR_SUPABASE_URL",
      anonEnv: "CREDIT_REPAIR_SUPABASE_ANON_KEY",
      serviceEnv: "CREDIT_REPAIR_SERVICE_ROLE_KEY",
      callback: "https://creditrepairv4.vercel.app/auth/callback",
    },
  };

  const cfg = map[appId];
  if (!cfg) return null;

  const supabaseUrl = process.env[cfg.urlEnv]?.trim();
  const anonKey = process.env[cfg.anonEnv]?.trim();
  const serviceRoleKey = process.env[cfg.serviceEnv]?.trim();

  if (!supabaseUrl || (!anonKey && !serviceRoleKey)) return null;

  return { supabaseUrl, anonKey, serviceRoleKey, callbackUrl: cfg.callback };
}

type SessionTokens = { access_token: string; refresh_token: string };

/** signInWithPassword via anon key — simplest path. */
async function mintViaPassword(
  supabaseUrl: string,
  anonKey: string,
  email: string
): Promise<SessionTokens | null> {
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

/** generateLink + verifyOtp via service role — works when only SERVICE_ROLE_KEY is set. */
async function mintViaServiceRole(
  supabaseUrl: string,
  serviceRoleKey: string,
  email: string
): Promise<SessionTokens | null> {
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkErr || !linkData?.properties) {
    console.error("[launch] generateLink error:", linkErr?.message);
    return null;
  }

  const { hashed_token, email_otp } = linkData.properties;

  if (hashed_token) {
    const { data: verified, error: verifyErr } = await admin.auth.verifyOtp({
      type: "magiclink",
      token_hash: hashed_token,
    });
    if (!verifyErr && verified.session) {
      return {
        access_token: verified.session.access_token,
        refresh_token: verified.session.refresh_token,
      };
    }
    console.error("[launch] verifyOtp (magiclink) error:", verifyErr?.message);
  }

  if (email_otp) {
    const { data: verified, error: verifyErr } = await admin.auth.verifyOtp({
      type: "email",
      email,
      token: email_otp,
    });
    if (!verifyErr && verified.session) {
      return {
        access_token: verified.session.access_token,
        refresh_token: verified.session.refresh_token,
      };
    }
    console.error("[launch] verifyOtp (email) error:", verifyErr?.message);
  }

  return null;
}

async function mintSessionForApp(
  cfg: AppConfig,
  email: string
): Promise<SessionTokens | null> {
  if (cfg.anonKey) {
    const tokens = await mintViaPassword(cfg.supabaseUrl, cfg.anonKey, email);
    if (tokens) return tokens;
  }

  if (cfg.serviceRoleKey) {
    return mintViaServiceRole(cfg.supabaseUrl, cfg.serviceRoleKey, email);
  }

  return null;
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

  if (appId === "qrdashboard") {
    const target = new URL("https://qrdashboard.vercel.app/auth/callback");
    target.searchParams.set("sso_at", session.access_token);
    target.searchParams.set("sso_rt", session.refresh_token);
    return NextResponse.redirect(target.toString());
  }

  if (appId === "mailer-lo-desk") {
    const target = new URL(
      "https://questrock-inbound-api.vercel.app/api/auth-callback"
    );
    target.searchParams.set("sso_at", session.access_token);
    target.searchParams.set("next", "/mailer-lo/");
    return NextResponse.redirect(target.toString());
  }

  if (appId === "call-tracker") {
    if (!canAccessCallTracker(userEmail)) {
      return new NextResponse(
        "Call Tracker is limited to Arsalan and Nikk.",
        { status: 403 }
      );
    }
    const target = new URL(
      "https://questrock-inbound-api.vercel.app/api/auth-callback"
    );
    target.searchParams.set("sso_at", session.access_token);
    target.searchParams.set("next", "/call-tracker/");
    return NextResponse.redirect(target.toString());
  }

  if (appId === "shapephonezap") {
    if (!canAccessShapePhoneZap(userEmail)) {
      return new NextResponse(
        "ShapePhoneZap is limited to authorized users (Sam, Nikk, and admins).",
        { status: 403 }
      );
    }
    const target = new URL("https://shapephonezap.vercel.app/api/auth-callback");
    target.searchParams.set("sso_at", session.access_token);
    return NextResponse.redirect(target.toString());
  }

  const cfg = getAppConfig(appId);
  if (!cfg) {
    return new NextResponse(
      `Unknown or misconfigured appId: ${appId}. Set *_SUPABASE_URL plus either *_SUPABASE_ANON_KEY or *_SERVICE_ROLE_KEY on Central Hub.`,
      { status: 400 }
    );
  }

  const tokens = await mintSessionForApp(cfg, userEmail);
  if (!tokens) {
    return new NextResponse(
      `Could not sign you into ${appId}. Make sure ${userEmail} exists in that app's Supabase Auth (Authentication → Users) with password WelcomeToQuestRock1!.`,
      { status: 500 }
    );
  }

  const target = new URL(cfg.callbackUrl);
  target.searchParams.set("sso_at", tokens.access_token);
  target.searchParams.set("sso_rt", tokens.refresh_token);
  return NextResponse.redirect(target.toString());
}
