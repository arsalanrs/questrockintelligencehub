import { ProjectCard } from '@/components/ProjectCard';
import type { Project } from '@/lib/projects';

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div
      id="projects"
      className="mx-auto grid max-w-hub grid-cols-1 gap-5 px-6 pb-24 sm:px-12 md:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
