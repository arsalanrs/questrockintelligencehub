/** Who can see and launch ShapePhoneZap from Central Hub. */
const DEFAULT_ALLOWED = [
  'arashid@questrock.com',
  'sam@questrock.com',
  'nikksmith@questrock.com',
];

export function getShapePhoneZapAllowedEmails(): Set<string> {
  const fromEnv = process.env.SHAPEPHONEZAP_ALLOWED_EMAILS?.trim();
  const list = fromEnv
    ? fromEnv.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : DEFAULT_ALLOWED;
  return new Set(list.map((e) => e.toLowerCase()));
}

export function canAccessShapePhoneZap(email: string | undefined | null): boolean {
  if (!email) return false;
  return getShapePhoneZapAllowedEmails().has(email.trim().toLowerCase());
}
