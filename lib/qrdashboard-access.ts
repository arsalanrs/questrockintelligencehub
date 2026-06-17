/** Who can see and launch QR Dashboard from Central Hub. */
const DEFAULT_ALLOWED = ['arashid@questrock.com'];

export function getQRDashboardAllowedEmails(): Set<string> {
  const fromEnv = process.env.QR_DASHBOARD_ALLOWED_EMAILS?.trim();
  const list = fromEnv
    ? fromEnv.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : DEFAULT_ALLOWED;
  return new Set(list.map((e) => e.toLowerCase()));
}

export function canAccessQRDashboard(email: string | undefined | null): boolean {
  if (!email) return false;
  return getQRDashboardAllowedEmails().has(email.trim().toLowerCase());
}
