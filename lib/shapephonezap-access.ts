import { getExecutiveAdminEmails, isExecutiveAdmin } from './executive-access';

/** Executives + Sam (ops). */
const DEFAULT_EXTRA = ['sam@questrock.com'];

export function getShapePhoneZapAllowedEmails(): Set<string> {
  const allowed = new Set<string>([
    ...Array.from(getExecutiveAdminEmails()),
    ...DEFAULT_EXTRA,
  ]);

  const fromEnv = process.env.SHAPEPHONEZAP_ALLOWED_EMAILS?.trim();
  if (fromEnv) {
    for (const entry of fromEnv.split(',')) {
      const email = entry.trim().toLowerCase();
      if (email) allowed.add(email);
    }
  }

  return allowed;
}

export function canAccessShapePhoneZap(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (isExecutiveAdmin(normalized)) return true;
  return getShapePhoneZapAllowedEmails().has(normalized);
}
