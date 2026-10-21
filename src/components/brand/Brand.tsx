import { YOUDO_TOOLS_HASH } from '../../hooks/useHashView';

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

/** The "a YouDO Tool" pill that sits next to the CalCU wordmark. */
export function YouDoToolBadge() {
  return (
    <a
      href={YOUDO_TOOLS_HASH}
      className="inline-flex items-center gap-1.5 rounded-full bg-fill px-2.5 py-1 text-xs font-medium text-content-secondary transition-colors hover:text-content-primary"
    >
      <span>a</span>
      <YouDoMark size={13} />
      <span>
        <span className="font-semibold text-content-primary">YouDO</span> Tool
      </span>
    </a>
  );
}
