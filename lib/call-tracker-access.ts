import { getExecutiveAdminEmails } from './executive-access';

/** Executives + Jason Friday (manager). */
const DEFAULT_EXTRA = ['jfriday@questrock.com'];

export function getCallTrackerAllowedEmails(): Set<string> {
  const fromEnv = process.env.CALL_TRACKER_ALLOWED_EMAILS?.trim();
  if (fromEnv) {
    return new Set(
      fromEnv
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    );
  }
  return new Set([...getExecutiveAdminEmails(), ...DEFAULT_EXTRA]);
}

export function canAccessCallTracker(email: string | undefined | null): boolean {
  if (!email) return false;
  return getCallTrackerAllowedEmails().has(email.trim().toLowerCase());
}
