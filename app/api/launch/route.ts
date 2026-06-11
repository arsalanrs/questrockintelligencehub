import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * SSO launch route.
 *
 * Each app keeps its OWN Supabase project — data never moves.
 * Central Hub uses each app's service-role key to mint a session server-side,
 * then redirects to that app's /auth/callback with sso_at + sso_rt.
 *
 * This avoids Supabase magic-link redirects (which depend on Site URL /
 * Redirect URL config and often land on localhost:3000).
 */

interface AppConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
  callbackUrl: string;
}

function getAppConfig(appId: string): AppConfig | null {
  const map: Record<string, { urlEnv: string; keyEnv: string; callback: string }> = {
    "qr-income-bot": {
      urlEnv: "INCOME_BOT_SUPABASE_URL",
      keyEnv: "INCOME_BOT_SERVICE_ROLE_KEY",
      callback: "https://qr-income-bot.vercel.app/auth/callback",
    },
    qrscoreboard: {
      urlEnv: "PIPELINE_SUPABASE_URL",
      keyEnv: "PIPELINE_SERVICE_ROLE_KEY",
      callback: "https://qrscoreboard.vercel.app/auth/callback",
    },
    creditrepair: {
      urlEnv: "CREDIT_REPAIR_SUPABASE_URL",
      keyEnv: "CREDIT_REPAIR_SERVICE_ROLE_KEY",
      callback: "https://creditrepairv4.vercel.app/auth/callback",
    },
  };

  const cfg = map[appId];
  if (!cfg) return null;

  const supabaseUrl = process.env[cfg.urlEnv]?.trim();
  const serviceRoleKey = process.env[cfg.keyEnv]?.trim();
  if (!supabaseUrl || !serviceRoleKey) return null;

  return { supabaseUrl, serviceRoleKey, callbackUrl: cfg.callback };
}

/** Mint a Supabase session for email using that app's service-role client. */
async function mintSessionForApp(
  supabaseUrl: string,
  serviceRoleKey: string,
  email: string
): Promise<{ access_token: string; refresh_token: string } | null> {
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

  // Prefer token_hash verification (magic link path)
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

  // Fallback: email OTP from generateLink response
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

  // ShapePhoneZap — validates Central Hub token, no Supabase on that app
  if (appId === "shapephonezap") {
    const target = new URL("https://shapephonezap.vercel.app/api/auth-callback");
    target.searchParams.set("sso_at", session.access_token);
    return NextResponse.redirect(target.toString());
  }

  const cfg = getAppConfig(appId);
  if (!cfg) {
    return new NextResponse(`Unknown or misconfigured appId: ${appId}`, { status: 400 });
  }

  const tokens = await mintSessionForApp(cfg.supabaseUrl, cfg.serviceRoleKey, userEmail);
  if (!tokens) {
    return new NextResponse(
      `Could not sign you into ${appId}. Make sure ${userEmail} exists in that app's Supabase Auth (Authentication → Users).`,
      { status: 500 }
    );
  }

  const target = new URL(cfg.callbackUrl);
  target.searchParams.set("sso_at", tokens.access_token);
  target.searchParams.set("sso_rt", tokens.refresh_token);
  return NextResponse.redirect(target.toString());
}
