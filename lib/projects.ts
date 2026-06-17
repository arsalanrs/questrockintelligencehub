import type { LucideIcon } from 'lucide-react';
import {
  Calculator,
  Captions,
  CreditCard,
  Headphones,
  LayoutDashboard,
  TableProperties,
  Trophy,
} from 'lucide-react';

export type Project = {
  id: string;
  name: string;
  url: string;
  /** When set, clicking the card uses this URL (SSO launch) instead of url. */
  ssoUrl?: string;
  description: string;
  tag: string;
  color: 'green' | 'blue';
  /** One icon, or two (e.g. transcript → fields). */
  icon: LucideIcon | [LucideIcon, LucideIcon];
  status: 'live' | 'updated' | 'building';
  lastCommit: string;
  lastCommitTime: string;
};

export const projects: Project[] = [
  {
    id: 'call-tracker',
    name: 'Call Tracker',
    url: 'https://questrock-inbound-api.vercel.app/call-tracker/',
    ssoUrl: '/api/launch?appId=call-tracker',
    description:
      'Admin live feed of every inbound and QuestMail call—borrower, LO, channel, Shape link, and AI status.',
    tag: 'Inbound',
    color: 'blue',
    icon: Headphones,
    status: 'live',
    lastCommit: 'Admin call tracker desk',
    lastCommitTime: 'Today',
  },
  {
    id: 'mailer-lo-desk',
    name: 'QuestMail LO Desk',
    url: 'https://questrock-inbound-api.vercel.app/mailer-lo/',
    ssoUrl: '/api/launch?appId=mailer-lo-desk',
    description:
      'QuestMail calling desk—search imported mailer leads by offer code, open Shape prospects, read call scripts, and log outcomes. SSO from Intelligence Hub.',
    tag: 'Inbound',
    color: 'green',
    icon: Headphones,
    status: 'live',
    lastCommit: 'Central Hub SSO via hub-sso',
    lastCommitTime: 'Today',
  },
  {
    id: 'shapephonezap',
    name: 'ShapePhoneZap',
    url: 'https://shapephonezap.vercel.app',
    ssoUrl: '/api/launch?appId=shapephonezap',
    description:
      'Turns call transcripts into structured fields—capture what was said on the phone and map it cleanly into the shapes your workflow needs.',
    tag: 'Outreach',
    color: 'green',
    icon: [Captions, TableProperties],
    status: 'live',
    lastCommit: 'Vercel: build into public/ and set outputDirectory',
    lastCommitTime: '4 minutes ago',
  },
  {
    id: 'qr-income-bot',
    name: 'QR Income Bot',
    url: 'https://qr-income-bot.vercel.app',
    ssoUrl: '/api/launch?appId=qr-income-bot',
    description:
      'Calculates and tracks income tied to QR activity—roll up revenue, spot trends, and keep totals current without spreadsheet gymnastics.',
    tag: 'Automation',
    color: 'blue',
    icon: Calculator,
    status: 'live',
    lastCommit: 'chore: remove token from .env.example; document env vars',
    lastCommitTime: 'Apr 5',
  },
  {
    id: 'creditrepair',
    name: 'Credit Repair',
    url: 'https://creditrepairv4.vercel.app',
    ssoUrl: '/api/launch?appId=creditrepair',
    description:
      'Credit repair workspace—review reports, log disputes and outcomes, and guide people step by step from intake to resolution.',
    tag: 'Finance',
    color: 'green',
    icon: CreditCard,
    status: 'live',
    lastCommit: 'fix: clearer integration errors and user sync',
    lastCommitTime: '3 days ago',
  },
  {
    id: 'qrdashboard',
    name: 'QR Dashboard',
    url: 'https://qrdashboard.vercel.app',
    ssoUrl: '/api/launch?appId=qrdashboard',
    description:
      'The wide-angle view—pulls metrics, pipelines, and connected data into one dashboard so anyone can see what is happening at a glance.',
    tag: 'Analytics',
    color: 'blue',
    icon: LayoutDashboard,
    status: 'live',
    lastCommit: 'Multi-user sync, migrations, and tooltips',
    lastCommitTime: 'Mar 29',
  },
  {
    id: 'qrscoreboard',
    name: 'QR Scoreboard',
    url: 'https://qrscoreboard.vercel.app',
    ssoUrl: '/api/launch?appId=qrscoreboard',
    description:
      'Live rankings and leaderboards—compare results, celebrate wins, and keep teams aligned on who is moving the needle.',
    tag: 'Performance',
    color: 'blue',
    icon: Trophy,
    status: 'live',
    lastCommit: 'Committed team roster for scoreboard roles',
    lastCommitTime: 'Apr 8',
  },
];
