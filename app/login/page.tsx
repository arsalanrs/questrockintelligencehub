"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center justify-center rounded-[10px] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06]">
            <Image
              src="/logo-questrock-112023.webp"
              alt="Questrock"
              width={300}
              height={78}
              priority
              className="h-8 w-auto max-w-[160px] object-contain"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-card)] bg-white px-8 py-9 shadow-[0_4px_24px_rgba(26,60,46,0.07)]">
          <h1 className="font-display text-2xl font-medium text-[var(--text-dark)] text-center mb-1">
            Intelligence Hub
          </h1>
          <p className="text-sm text-[var(--text-muted)] text-center mb-8">
            Sign in to access all QuestRock platforms
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[var(--text-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-light)]/40"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[var(--text-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-light)]/40"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-800 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-[var(--green)] text-white font-medium py-3 text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
