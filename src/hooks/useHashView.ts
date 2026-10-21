import { useEffect, useState } from 'react';

export type View = 'calcu' | 'youdo-tools';

export const YOUDO_TOOLS_HASH = '#youdo-tools';

const viewFromHash = (): View =>
  window.location.hash === YOUDO_TOOLS_HASH ? 'youdo-tools' : 'calcu';

// The YouDO Tools page lives at #youdo-tools so it can be linked to directly
// (for example from YouDO). Any other hash is a section of the CalCU page.
export function useHashView(): View {
  const [view, setView] = useState<View>(viewFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      const next = viewFromHash();
      setView(next);
      if (next === 'youdo-tools') window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Coming back from the tools page to a section: scroll once it has rendered.
  useEffect(() => {
    if (view !== 'calcu') return;
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [view]);

  return view;
}
