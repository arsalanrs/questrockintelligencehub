import { NextResponse } from 'next/server';

const DEFAULT_TO = 'concierge@questrock.com';

type SupportBody = {
  name?: string;
  email?: string;
  department?: string;
  priority?: string;
  subject?: string;
  description?: string;
};

export async function POST(request: Request) {
  const endpoint = process.env.FORMSPREE_IT_SUPPORT_ENDPOINT?.trim();
  if (!endpoint) {
    return NextResponse.json(
      {
        error:
          'IT support form is not configured. Set FORMSPREE_IT_SUPPORT_ENDPOINT (Formspree form URL) in Vercel env.',
      },
      { status: 503 }
    );
  }

  let body: SupportBody;
  try {
    body = (await request.json()) as SupportBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const department = String(body.department ?? '').trim();
  const priority = String(body.priority ?? 'normal').trim();
  const subject = String(body.subject ?? '').trim();
  const description = String(body.description ?? '').trim();

  if (!name || !email || !subject || !description) {
    return NextResponse.json(
      { error: 'Name, email, subject, and description are required.' },
      { status: 400 }
    );
  }

  const ticketSubject = `[IT Support · ${priority.toUpperCase()}] ${subject}`;
  const message = [
    `Submitted from QuestRock Intelligence Hub — IT Support`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Department: ${department || '—'}`,
    `Priority: ${priority}`,
    `Subject: ${subject}`,
    ``,
    `Description:`,
    description,
    ``,
    `—`,
    `Route replies to submitter. Formspree notify: ${process.env.IT_SUPPORT_NOTIFY_EMAIL?.trim() || DEFAULT_TO}`,
  ].join('\n');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: ticketSubject,
      _replyto: email,
      name,
      email,
      department,
      priority,
      subject,
      message,
      notify_to: process.env.IT_SUPPORT_NOTIFY_EMAIL?.trim() || DEFAULT_TO,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error('[it-support] Formspree error:', res.status, text);
    return NextResponse.json({ error: `Formspree ${res.status}: ${text}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
