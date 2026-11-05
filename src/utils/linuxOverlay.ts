// The files in /linux-overlay are the single source of truth. The website only
// shows them and, for custom downloads, rewrites the settings lines at the top
// of calcu.py (and the HOTKEY line of the installer). The version always comes
// from CalCU.cs, so both apps show the same number.
import pythonTemplate from '../../linux-overlay/calcu.py?raw';
import installTemplate from '../../linux-overlay/install-calcu.sh?raw';
import uninstallTemplate from '../../linux-overlay/uninstall-calcu.sh?raw';
import { CALCU_VERSION, hotkeyLabelFor, type WindowsOverlayConfig } from './windowsOverlay';

// Shell scripts and Python break on CRLF, so hand them out as LF always.
const toLf = (text: string) => text.replace(/\r\n/g, '\n');

// Replaces the value of one `NAME = value` line in calcu.py, keeping any comment
// out of it. Throws if the line is missing, so a renamed setting fails loudly
// instead of silently shipping the default.
function setPythonSetting(source: string, name: string, value: string, comment?: string): string {
  const pattern = new RegExp(`^${name} = .*$`, 'm');
  if (!pattern.test(source)) {
    throw new Error(`calcu.py is missing the ${name} setting`);
  }
  const suffix = comment ? `  # ${comment}` : '';
  return source.replace(pattern, () => `${name} = ${value}${suffix}`);
}

const pythonBool = (value: boolean) => (value ? 'True' : 'False');

export function buildPythonSource(config: WindowsOverlayConfig): string {
  let source = toLf(pythonTemplate);
  source = setPythonSetting(source, 'VERSION', `"${CALCU_VERSION}"`);
  source = setPythonSetting(source, 'HOTKEY_LABEL', `"${hotkeyLabelFor(config)}"`);
  source = setPythonSetting(source, 'WINDOW_OPACITY', (config.opacityPercent / 100).toFixed(2));
  source = setPythonSetting(source, 'ALWAYS_ON_TOP', pythonBool(config.alwaysOnTop));
  source = setPythonSetting(source, 'HIDE_ON_ESCAPE', pythonBool(config.hideOnEscape));
  source = setPythonSetting(
    source,
    'START_POSITION',
    `"${config.startupPosition}"`,
    'TopRight | BottomRight | Center'
  );
  return source;
}

// Single-file installer: the Python program is appended after the marker line
// that ends install-calcu.sh, which the installer locates by searching for it.
export function buildLinuxInstallScript(config: WindowsOverlayConfig): string {
  const template = toLf(installTemplate);
  const pattern = /^HOTKEY=".*"$/m;
  if (!pattern.test(template)) {
    throw new Error('install-calcu.sh is missing the HOTKEY line');
  }
  const header = template.replace(pattern, () => `HOTKEY="${hotkeyLabelFor(config)}"`).trimEnd();
  return `${header}\n${buildPythonSource(config)}`;
}

export const LINUX_UNINSTALL_SCRIPT = toLf(uninstallTemplate);
