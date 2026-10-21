import { Download, ExternalLink } from 'lucide-react';
import { YouDoMark } from '../components/brand/Brand';
import { LINKS } from '../data/links';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

const HIGHLIGHTS = [
  'A 6-tier syllabus goal tree that updates as daily steps get done',
  'Pause-aware focus sessions that separate clock time from real focus time',
  'A backlog that carries unfinished work forward instead of hiding it',
];

// CalCU is made by YouDO: YouDO is the main app, CalCU a free tool from it.
export function AboutYouDOSection() {
  return (
    <section id="youdo" className="card scroll-mt-24 p-6 sm:p-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <div className="mb-4 flex items-center gap-3">
            <YouDoMark size={32} />
            <span className="eyebrow">About YouDO</span>
          </div>
          <h2 className="mb-3 text-2xl font-bold">
            CalCU is made by YouDO. Your exam plan is a tree, not a to-do list.
          </h2>
          <p className="mb-6 text-base leading-relaxed text-content-secondary">
            YouDO is the focus and goal-planning app for serious aspirants preparing for UPSC, JEE,
            NEET, GATE and CAT. It connects every layer of your syllabus to the work you should
            finish today, and tracks honest progress.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={LINKS.youdoWeb} {...external} className="btn btn-primary">
              <ExternalLink className="h-4 w-4" />
              Open YouDO
            </a>
            <a href={LINKS.youdoReleases} {...external} className="btn btn-secondary">
              <Download className="h-4 w-4" />
              Android APK
            </a>
            <a href={LINKS.youdoRepo} {...external} className="btn btn-secondary">
              GitHub
            </a>
          </div>
        </div>

        <ul className="space-y-3 text-sm md:max-w-sm md:pt-12">
          {HIGHLIGHTS.map((highlight) => (
            <li key={highlight} className="flex gap-2.5">
              <span className="text-tick" aria-hidden="true">
                ✓
              </span>
              <span className="text-content-secondary">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
