/** Who can see and launch Call Tracker from Central Hub. */
const DEFAULT_ALLOWED = [
  'arashid@questrock.com',
  'nikksmith@questrock.com',
];

export function getCallTrackerAllowedEmails(): Set<string> {
  const fromEnv = process.env.CALL_TRACKER_ALLOWED_EMAILS?.trim();
  const list = fromEnv
    ? fromEnv.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : DEFAULT_ALLOWED;
  return new Set(list.map((e) => e.toLowerCase()));
}

export function canAccessCallTracker(email: string | undefined | null): boolean {
  if (!email) return false;
  return getCallTrackerAllowedEmails().has(email.trim().toLowerCase());
}
