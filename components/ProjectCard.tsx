import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import type { Project } from '@/lib/projects';

type ProjectCardProps = {
  project: Project;
};

const accentBar: Record<Project['color'], string> = {
  green: 'bg-gradient-to-r from-green-light to-green-accent',
  blue: 'bg-gradient-to-r from-blue-light to-[#93C5FD]',
};

const iconBg: Record<Project['color'], string> = {
  green: 'bg-green-pale',
  blue: 'bg-blue-pale',
};

const tagClass: Record<Project['color'], string> = {
  green: 'bg-green-pale text-green-mid',
  blue: 'bg-blue-pale text-blue-mid',
};

const statusDot: Record<Project['status'], string> = {
  live: 'bg-green-light',
  updated: 'bg-[#F5A623]',
  building: 'bg-blue-light',
};

const statusLabel: Record<Project['status'], string> = {
  live: 'Live',
  updated: 'Updated',
  building: 'Building',
};

const iconColor: Record<Project['color'], string> = {
  green: 'text-green-mid',
  blue: 'text-blue-mid',
};

function ProjectIcons({ icons, color }: { icons: LucideIcon | [LucideIcon, LucideIcon]; color: Project['color'] }) {
  const list = Array.isArray(icons) ? icons : [icons];
  const cls = iconColor[color];
  return (
    <div className={`flex items-center justify-center gap-1 ${list.length > 1 ? 'px-0.5' : ''}`}>
      {list.map((Icon, i) => (
        <Icon key={i} className={`h-[22px] w-[22px] shrink-0 sm:h-6 sm:w-6 ${cls}`} strokeWidth={2} aria-hidden />
      ))}
    </div>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const host = (() => {
    try {
      return new URL(project.url).hostname;
    } catch {
      return project.url.replace(/^https?:\/\//, '');
    }
  })();

  const href = project.ssoUrl ?? project.url;
  const isExternal = !project.ssoUrl;

  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="hub-card group relative flex flex-col overflow-hidden rounded-[18px] border border-[var(--border-card)] bg-[var(--white)] p-7 text-inherit no-underline transition-[transform,box-shadow,border-color] duration-[220ms] ease-out hover:-translate-y-1 hover:border-[rgba(26,60,46,0.18)] hover:shadow-[0_16px_48px_rgba(26,60,46,0.10)]"
    >
      <span
        className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-[18px] ${accentBar[project.color]}`}
        aria-hidden
      />
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-[14px] ${iconBg[project.color]}`}
          aria-hidden
        >
          <ProjectIcons icons={project.icon} color={project.color} />
        </div>
        <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-text-muted">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[project.status]}`}
            aria-hidden
          />
          {statusLabel[project.status]}
        </div>
      </div>
      <h2 className="mb-1 font-display text-[21px] font-medium leading-tight text-text-dark">
        {project.name}
      </h2>
      <p className="mb-4 text-xs font-light text-text-muted">{host}</p>
      <p className="mb-6 flex-1 text-[13.5px] font-light leading-relaxed text-text-muted">
        {project.description}
      </p>
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.07em] ${tagClass[project.color]}`}
        >
          {project.tag}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-green-mid transition-[gap] duration-200 group-hover:gap-2">
          Launch
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
        </span>
      </div>
    </a>
  );
}
