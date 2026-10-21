import type { ReactNode } from 'react';
import { ArrowLeft, Calculator, Download, ExternalLink } from 'lucide-react';
import { YouDoMark } from '../components/brand/Brand';
import { DEVELOPER_PROJECTS, LINKS, YOUDO_TOOLS, type Project } from '../data/projects';

interface YouDOToolsPageProps {
  hotkey: string;
  onDownloadInstaller: () => void;
  onShowCalculator: () => void;
}

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

function ProjectCard({
  project,
  extraActions,
  compact = false,
}: {
  project: Project;
  extraActions?: ReactNode;
  compact?: boolean;
}) {
  return (
    <article className="card flex flex-col justify-between p-6">
      <div>
        <div className="eyebrow mb-2">{project.stack}</div>
        <h3 className={`mb-1 font-bold ${compact ? 'text-lg' : 'text-2xl'}`}>{project.name}</h3>
        <p className="mb-3 text-sm font-medium text-content-secondary">{project.tagline}</p>
        <p className="mb-4 text-sm leading-relaxed text-content-secondary">{project.summary}</p>
        <ul className="mb-6 space-y-1.5 text-sm">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="text-tick" aria-hidden="true">
                ✓
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-subtle pt-4">
        {extraActions}
        {project.links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            {...external}
            className={`btn ${i === 0 && !extraActions && !compact ? 'btn-primary' : 'btn-secondary'}`}
          >
            <ExternalLink className="h-4 w-4" />
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}

export function YouDOToolsPage({ hotkey, onDownloadInstaller, onShowCalculator }: YouDOToolsPageProps) {
  return (
    <main className="mx-auto w-full max-w-[1100px] flex-1 space-y-14 px-4 py-10 sm:px-6">
      <a
        href="#top"
        className="inline-flex items-center gap-1.5 text-sm text-content-secondary hover:text-content-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to CalCU
      </a>

      <section className="max-w-2xl">
        <div className="mb-4 flex items-center gap-3">
          <YouDoMark size={36} />
          <span className="eyebrow">YouDO Tools</span>
        </div>
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
          Plan the whole journey. Execute only today.
        </h1>
        <p className="text-base leading-relaxed text-content-secondary">
          Free, open-source tools for UPSC, JEE, NEET, GATE and CAT aspirants who want deep,
          pause-aware focus instead of noisy productivity gimmicks. YouDO plans and tracks the
          work; the tools around it keep you inside the session.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a href={LINKS.telegramUpdates} {...external} className="btn btn-secondary">
            Telegram updates
          </a>
          <a href={LINKS.telegramCommunity} {...external} className="btn btn-secondary">
            Join the community
          </a>
        </div>
      </section>

      <section aria-labelledby="youdo-tools-heading" className="space-y-4">
        <h2 id="youdo-tools-heading" className="text-xl font-semibold">
          The tools
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {YOUDO_TOOLS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              extraActions={
                project.id === 'calcu' && (
                  <>
                    <button type="button" onClick={onDownloadInstaller} className="btn btn-primary">
                      <Download className="h-4 w-4" />
                      Download for Windows
                    </button>
                    <button type="button" onClick={onShowCalculator} className="btn btn-secondary">
                      <Calculator className="h-4 w-4" />
                      Try it ({hotkey})
                    </button>
                  </>
                )
              }
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="developer-heading" className="space-y-4 border-t border-subtle pt-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="developer-heading" className="text-xl font-semibold">
              More from the developer
            </h2>
            <p className="text-sm text-content-secondary">
              Jatin Parmar builds YouDO Tools alongside VLSI physical design work. These projects are
              not part of YouDO Tools.
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <a href={LINKS.github} {...external} className="text-primary hover:underline">
              GitHub
            </a>
            <a href={LINKS.linkedin} {...external} className="text-primary hover:underline">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {DEVELOPER_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} compact />
          ))}
        </div>
      </section>
    </main>
  );
}
