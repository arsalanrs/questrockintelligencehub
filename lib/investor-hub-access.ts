import { isExecutiveAdmin } from './executive-access';

const OPS_ROLES = new Set(['executive', 'admin', 'manager', 'loan_officer']);

export function canAccessInvestorHubOps(
  role: string | null | undefined,
  email: string | undefined | null,
): boolean {
  if (role && OPS_ROLES.has(role)) return true;
  return isExecutiveAdmin(email);
}
