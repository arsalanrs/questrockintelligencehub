import { getExecutiveAdminEmails, isExecutiveAdmin } from './executive-access';

/** Executives + managers with Call Tracker access. */
const DEFAULT_EXTRA = ['jfriday@questrock.com', 'bastianjohnston@questrock.com'];

export function getCallTrackerAllowedEmails(): Set<string> {
  const allowed = new Set<string>([
    ...Array.from(getExecutiveAdminEmails()),
    ...DEFAULT_EXTRA,
  ]);

  const fromEnv = process.env.CALL_TRACKER_ALLOWED_EMAILS?.trim();
  if (fromEnv) {
    for (const entry of fromEnv.split(',')) {
      const email = entry.trim().toLowerCase();
      if (email) allowed.add(email);
    }
  }

  return allowed;
}

export function canAccessCallTracker(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (isExecutiveAdmin(normalized)) return true;
  return getCallTrackerAllowedEmails().has(normalized);
}
