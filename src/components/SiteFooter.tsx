import { LINKS } from '../data/projects';
import { YOUDO_TOOLS_HASH } from '../hooks/useHashView';
import { YouDoMark } from './brand/Brand';

const FOOTER_LINKS = [
  { label: 'YouDO', href: LINKS.youdoWeb },
  { label: 'GitHub', href: LINKS.calcuRepo },
  { label: 'Telegram', href: LINKS.telegramUpdates },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-subtle">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-4 py-6 text-xs text-content-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a href={YOUDO_TOOLS_HASH} className="flex items-center gap-2 hover:text-content-primary">
          <YouDoMark size={14} />
          <span>
            CalCU · a YouDO Tool by Jatin Parmar (@mattedhairr) · MIT License
          </span>
        </a>
        <div className="flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-content-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
