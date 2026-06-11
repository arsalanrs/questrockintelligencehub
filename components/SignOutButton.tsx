"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  async function handleSignOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      /* still redirect to login */
    }
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:border-white/40 transition-colors"
    >
      Sign out
    </button>
  );
}
