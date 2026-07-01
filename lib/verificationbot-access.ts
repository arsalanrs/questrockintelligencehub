import { isExecutiveAdmin } from './executive-access';

/** Verification Bot is restricted to processors, executives, and named admins. */
export function canAccessVerificationBot(
  role: string | undefined | null,
  email?: string | null
): boolean {
  if (role === 'processor' || role === 'executive' || role === 'admin') return true;
  if (email && isExecutiveAdmin(email)) return true;
  return false;
}
