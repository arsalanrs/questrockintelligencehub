import { getExecutiveAdminEmails } from './executive-access';

/** Executives + Sam (ops). */
const DEFAULT_EXTRA = ['sam@questrock.com'];

export function getShapePhoneZapAllowedEmails(): Set<string> {
  const fromEnv = process.env.SHAPEPHONEZAP_ALLOWED_EMAILS?.trim();
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

export function canAccessShapePhoneZap(email: string | undefined | null): boolean {
  if (!email) return false;
  return getShapePhoneZapAllowedEmails().has(email.trim().toLowerCase());
}
