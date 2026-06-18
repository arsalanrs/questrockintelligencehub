/** QuestRock executives — full access to restricted Intelligence Hub tools. */
export const EXECUTIVE_ADMIN_EMAILS = [
  'arashid@questrock.com',
  'nikksmith@questrock.com',
  'bmedley@questrock.com',
  'rayconway@questrock.com',
] as const;

export function getExecutiveAdminEmails(): Set<string> {
  const fromEnv = process.env.EXECUTIVE_ADMIN_EMAILS?.trim();
  const list = fromEnv
    ? fromEnv.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [...EXECUTIVE_ADMIN_EMAILS];
  return new Set(list.map((e) => e.toLowerCase()));
}

export function isExecutiveAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return getExecutiveAdminEmails().has(email.trim().toLowerCase());
}
