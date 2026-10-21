import { ArrowRight, ExternalLink } from 'lucide-react';
import { YouDoMark } from '../components/brand/Brand';
import { LINKS } from '../data/projects';
import { YOUDO_TOOLS_HASH } from '../hooks/useHashView';

// Why CalCU is a YouDO Tool: it exists so a focus session never has to be
// interrupted to go find a calculator.
export function YouDoSessionCard() {
  return (
    <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
          <YouDoMark size={26} />
        </div>
        <div>
          <div className="eyebrow mb-1">Made for YouDO focus sessions</div>
          <h2 className="mb-1 text-lg font-semibold">
            Keep the session running. Do the maths on top.
          </h2>
          <p className="text-sm leading-relaxed text-content-secondary">
            CalCU is a YouDO Tool. Start a focus session in YouDO, open your question PDF, and
            bring the calculator up only when a numerical needs it.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <a href={LINKS.youdoWeb} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <ExternalLink className="h-4 w-4" />
          Open YouDO
        </a>
        <a href={YOUDO_TOOLS_HASH} className="btn btn-secondary">
          All YouDO Tools
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
