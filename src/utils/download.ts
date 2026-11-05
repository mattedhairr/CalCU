export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const BAT_MIME = 'application/x-bat';
export const SH_MIME = 'application/x-sh';

export type Platform = 'windows' | 'linux';

// Desktop Linux starts on the Linux download. Android also says "Linux" but
// can't run either app, so it keeps the default.
export function detectPlatform(): Platform {
  const agent = window.navigator.userAgent;
  return /Linux/.test(agent) && !/Android/.test(agent) ? 'linux' : 'windows';
}
