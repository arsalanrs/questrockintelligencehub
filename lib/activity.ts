export type ActivityDot = 'green' | 'blue' | 'amber';

export type ActivityEntry = {
  id: string;
  dot: ActivityDot;
  title: string;
  commit: string;
  time: string;
};

/** Five most recent activity lines (QR Disposition excluded). */
export const recentActivity: ActivityEntry[] = [
  {
    id: 'shapephonezap',
    dot: 'green',
    title: 'ShapePhoneZap',
    commit: ' — build into public/ and set outputDirectory',
    time: '4 minutes ago · main',
  },
  {
    id: 'creditrepair',
    dot: 'blue',
    title: 'Credit Repair',
    commit: ' — clearer integration errors and user sync',
    time: '3 days ago · main',
  },
  {
    id: 'qrscoreboard',
    dot: 'blue',
    title: 'QR Scoreboard',
    commit: ' — team roster updates for scoreboard',
    time: 'Apr 8 · main',
  },
  {
    id: 'qr-income-bot',
    dot: 'green',
    title: 'QR Income Bot',
    commit: ' — remove token from .env.example',
    time: 'Apr 5 · main',
  },
  {
    id: 'qrdashboard',
    dot: 'blue',
    title: 'QR Dashboard',
    commit: ' — multi-user sync, migrations, and tooltips',
    time: 'Mar 29 · main',
  },
];
