import { ABOUT_YOUDO_HASH, LINKS } from '../data/links';
import { YouDoWordmark } from './brand/Brand';

const FOOTER_LINKS = [
  { label: 'YouDO', href: LINKS.youdoWeb },
  { label: 'CalCU on GitHub', href: LINKS.calcuRepo },
  { label: 'Telegram', href: LINKS.telegramUpdates },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-subtle">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-4 py-6 text-xs text-content-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <a href={ABOUT_YOUDO_HASH} className="flex items-center gap-1.5 hover:text-content-primary">
            <span>CalCU by</span>
            <YouDoWordmark size={18} />
          </a>
          <span aria-hidden="true">·</span>
          <span>MIT License</span>
          <span aria-hidden="true">·</span>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-content-primary"
          >
            More by Jatin Parmar (@mattedhairr)
          </a>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap hover:text-content-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
