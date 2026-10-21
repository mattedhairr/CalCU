import { ABOUT_YOUDO_HASH } from '../../data/links';

/** The YouDO "Y" mark, same paths and colours as in the YouDO app header. */
export function YouDoMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="3 3 18 18"
      fill="none"
      aria-hidden="true"
      className="block shrink-0 overflow-visible"
    >
      <path
        d="M5 4.5L12 13.25V19.5"
        style={{ stroke: 'var(--primary)' }}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 4.5L12 13.25L8.9 9.6"
        style={{ stroke: 'var(--accent-tick)' }}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** "CalCU" in the same style as YouDO's "ou" / "DO" wordmark. */
export function CalcuWordmark({ className = 'text-[22px]' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label="CalCU">
      <span className="wordmark-light">Cal</span>
      <span className="wordmark-bold">CU</span>
    </span>
  );
}

/**
 * The YouDO wordmark, built like YouDO's own: the mark is the "Y", followed
 * by a lighter "ou" and a bold "DO". Never put the mark next to the full word
 * "YouDO", or it reads "Y YouDO". Sizes keep YouDO's ratios (32px mark, 22px
 * text, -6px overlap).
 */
export function YouDoWordmark({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center" aria-label="YouDO" role="img">
      <YouDoMark size={size} />
      <span
        className="wordmark"
        style={{ fontSize: size * 0.6875, marginLeft: size * -0.1875 }}
        aria-hidden="true"
      >
        <span className="wordmark-light">ou</span>
        <span className="wordmark-bold">DO</span>
      </span>
    </span>
  );
}

/**
 * The header lockup: "CalCU | by YouDO". A hairline divider separates the
 * product from its maker, so both wordmarks keep their full proportions
 * instead of being squeezed into a pill. Below `sm` only CalCU shows.
 */
export function CalcuByYouDoLockup() {
  return (
    <div className="flex items-center gap-3">
      <a href="#top" className="flex shrink-0 items-center">
        <CalcuWordmark />
      </a>
      <span className="hidden h-[22px] w-px bg-[var(--border)] sm:block" aria-hidden="true" />
      <a
        href={ABOUT_YOUDO_HASH}
        className="hidden shrink-0 items-center gap-1.5 text-[13px] text-content-secondary transition-opacity hover:opacity-80 sm:flex"
      >
        <span>by</span>
        <YouDoWordmark size={26} />
      </a>
    </div>
  );
}
