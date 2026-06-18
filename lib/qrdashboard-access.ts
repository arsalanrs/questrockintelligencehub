import { isExecutiveAdmin } from './executive-access';

export function canAccessQRDashboard(email: string | undefined | null): boolean {
  return isExecutiveAdmin(email);
}
