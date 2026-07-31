import { isExecutiveAdmin } from './executive-access';

const OPS_ROLES = new Set(['executive', 'admin', 'manager', 'loan_officer']);

/** Same leadership set as Investor Hub view-all — can always open Ops. */
const INVESTOR_HUB_OPS_EMAILS = new Set([
  'arashid@questrock.com',
  'nikksmith@questrock.com',
  'jfriday@questrock.com',
  'bastianjohnston@questrock.com',
  'bmedley@questrock.com',
  'rayconway@questrock.com',
  'rconway@questrock.com',
]);

export function canAccessInvestorHubOps(
  role: string | null | undefined,
  email: string | undefined | null,
): boolean {
  if (email && INVESTOR_HUB_OPS_EMAILS.has(email.trim().toLowerCase())) return true;
  if (role && OPS_ROLES.has(role)) return true;
  return isExecutiveAdmin(email);
}

/** Email → LO apply slug for personal referral links on the Hub card. */
const LO_APPLY_SLUG_BY_EMAIL: Record<string, string> = {
  'tchisholm@questrock.com': 'tashawna-chisholm',
  'tjohnson@questrock.com': 'tyler-johnson',
  'bastianjohnston@questrock.com': 'bastian-johnston',
  'nikksmith@questrock.com': 'nikk-smith',
  'rayconway@questrock.com': 'ray-conway',
  'rconway@questrock.com': 'ray-conway',
  'gbethea@questrock.com': 'gregory-bethea-jr',
  'zdavis@questrock.com': 'zachary-davis',
  'jfriday@questrock.com': 'jason-friday',
};

export function investorHubApplyUrlForEmail(email: string | undefined | null): string {
  const base = 'https://qrinvestorhub.vercel.app/investor-hub/apply';
  if (!email) return base;
  const slug = LO_APPLY_SLUG_BY_EMAIL[email.trim().toLowerCase()];
  return slug ? `${base}?lo=${slug}` : base;
}
