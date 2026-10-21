import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import { YOUDO_TOOLS_HASH, type View } from '../hooks/useHashView';
import { CalcuWordmark, YouDoToolBadge } from './brand/Brand';

interface SiteHeaderProps {
  view: View;
  theme: Theme;
  onToggleTheme: () => void;
  isCalculatorOpen: boolean;
  onToggleCalculator: () => void;
  hotkey: string;
}

const NAV_LINKS = [
  { href: '#download', label: 'Download' },
  { href: '#safety', label: 'Safety' },
  { href: '#source', label: 'Source files' },
];

export function SiteHeader({
  view,
  theme,
  onToggleTheme,
  isCalculatorOpen,
  onToggleCalculator,
  hotkey,
}: SiteHeaderProps) {
  const navClass = (active: boolean) =>
    `whitespace-nowrap transition-colors ${
      active ? 'text-content-primary font-semibold' : 'hover:text-content-primary'
    }`;

  return (
    <header
      className="sticky top-0 z-40 border-b border-subtle backdrop-blur-xl"
      style={{ background: 'var(--header-bg)' }}
    >
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <a href="#top" className="shrink-0">
            <CalcuWordmark />
          </a>
          <span className="hidden sm:inline-flex">
            <YouDoToolBadge />
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-content-secondary md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={navClass(false)}>
              {link.label}
            </a>
          ))}
          <a href={YOUDO_TOOLS_HASH} className={navClass(view === 'youdo-tools')}>
            YouDO Tools
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="btn btn-secondary !px-0 w-10 justify-center"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button type="button" onClick={onToggleCalculator} className="btn btn-primary">
            {isCalculatorOpen ? 'Hide' : 'Show'} CalCU
            <span className="hidden font-mono text-xs opacity-75 sm:inline">{hotkey}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
