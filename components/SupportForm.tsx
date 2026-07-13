'use client';

import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function SupportForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setError('');

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      department: String(fd.get('department') ?? ''),
      priority: String(fd.get('priority') ?? 'normal'),
      subject: String(fd.get('subject') ?? ''),
      description: String(fd.get('description') ?? ''),
    };

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setState('success');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Could not submit ticket.');
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-[rgba(82,183,136,0.35)] bg-green-pale px-6 py-8 text-center">
        <p className="font-display text-lg font-semibold text-green">Ticket submitted</p>
        <p className="mt-2 text-sm text-text-muted">
          Concierge will receive your request at{' '}
          <a href="mailto:concierge@questrock.com" className="text-green-mid underline">
            concierge@questrock.com
          </a>
          . You should get a confirmation shortly.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-5 rounded-lg bg-green px-4 py-2 text-sm font-medium text-white hover:bg-green-mid"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
            Your name *
          </span>
          <input
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2.5 text-sm outline-none ring-green-mid/30 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
            Work email *
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@questrock.com"
            className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2.5 text-sm outline-none ring-green-mid/30 focus:ring-2"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
            Department
          </span>
          <select
            name="department"
            className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2.5 text-sm outline-none ring-green-mid/30 focus:ring-2"
          >
            <option value="">Select…</option>
            <option value="Sales / LO">Sales / LO</option>
            <option value="Processing">Processing</option>
            <option value="Operations">Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="Executive">Executive</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
            Priority
          </span>
          <select
            name="priority"
            defaultValue="normal"
            className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2.5 text-sm outline-none ring-green-mid/30 focus:ring-2"
          >
            <option value="low">Low — question / how-to</option>
            <option value="normal">Normal — needs help today</option>
            <option value="high">High — blocking work</option>
            <option value="urgent">Urgent — production down</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
          Subject *
        </span>
        <input
          name="subject"
          required
          placeholder="Brief summary — e.g. Shape login issue, Hub SSO error"
          className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2.5 text-sm outline-none ring-green-mid/30 focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
          Description *
        </span>
        <textarea
          name="description"
          required
          rows={6}
          placeholder="What happened? What did you expect? Steps to reproduce, screenshots, lead ID, or error messages help us resolve faster."
          className="w-full resize-y rounded-lg border border-[var(--border-card)] bg-white px-3 py-2.5 text-sm outline-none ring-green-mid/30 focus:ring-2"
        />
      </label>

      {state === 'error' && error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="rounded-lg bg-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-mid disabled:opacity-60"
      >
        {state === 'submitting' ? 'Sending…' : 'Submit IT ticket'}
      </button>

      <p className="text-xs text-text-muted">
        Tickets route to{' '}
        <a href="mailto:concierge@questrock.com" className="text-green-mid underline">
          concierge@questrock.com
        </a>{' '}
        via Formspree. For password resets on external systems (Shape, LendingPad), include your QuestRock email.
      </p>
    </form>
  );
}
