import { Download, ExternalLink } from 'lucide-react';
import { YouDoWordmark } from '../components/brand/Brand';
import { LINKS } from '../data/links';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

// YouDO's own four stages, as its README presents them (YouDO v8).
// Keep this in step with YouDO's README when its features change.
const STAGES = [
  {
    name: 'Build',
    text: 'Map the whole syllabus as one tree, in your own names and as deep as it needs to go.',
  },
  {
    name: 'Schedule',
    text: 'Send a whole task, or only the steps you will finish, to the day they belong.',
  },
  {
    name: 'Focus',
    text: 'Pause-aware sessions count real focus, not clock time, with an ambient clock and focus sounds.',
  },
  {
    name: 'Review',
    text: 'Unfinished work stays in Backlog, and each day ends with net focus, streaks and goal progress.',
  },
];

// CalCU is made by YouDO: YouDO is the main app, CalCU a free tool from it.
export function AboutYouDOSection() {
  return (
    <section id="youdo" className="card scroll-mt-24 p-6 sm:p-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <div className="mb-4">
            <YouDoWordmark size={36} />
          </div>
          <div className="eyebrow mb-2">CalCU is made by YouDO</div>
          <h2 className="mb-3 text-2xl font-bold">
            Your exam plan is a tree. Not a to-do list.
          </h2>
          <p className="mb-6 text-base leading-relaxed text-content-secondary">
            Plan the whole journey, execute only today. YouDO connects every part of your syllabus
            to the work you should finish now, then tracks what moved, what remains, and how much
            focused work you actually did. For UPSC, JEE, NEET, GATE, CAT and every serious
            preparation. Free, open source and ad-free, with or without an account.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={LINKS.youdoReleases} {...external} className="btn btn-primary">
              <Download className="h-4 w-4" />
              Get the Android app
            </a>
            <a href={LINKS.youdoWeb} {...external} className="btn btn-secondary">
              <ExternalLink className="h-4 w-4" />
              Open in browser
            </a>
            <a href={LINKS.youdoRepo} {...external} className="btn btn-secondary">
              GitHub
            </a>
          </div>
        </div>

        <ol className="space-y-4 text-sm md:max-w-sm md:pt-14">
          {STAGES.map((stage, i) => (
            <li key={stage.name} className="flex gap-3">
              <span className="font-mono text-tick">{i + 1}</span>
              <span>
                <span className="font-semibold text-content-primary">{stage.name}.</span>{' '}
                <span className="text-content-secondary">{stage.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
