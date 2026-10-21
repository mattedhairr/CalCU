// The files in /windows-overlay are the single source of truth. The website
// only shows them and, for custom downloads, rewrites the settings lines at the
// top of CalCU.cs (and the HOTKEY line of the installer).
import csharpTemplate from '../../windows-overlay/CalCU.cs?raw';
import installTemplate from '../../windows-overlay/Install-CalCU.bat?raw';
import uninstallTemplate from '../../windows-overlay/Uninstall-CalCU.bat?raw';
import readmeMarkdown from '../../README.md?raw';

export interface WindowsOverlayConfig {
  modifier: 'Alt' | 'Ctrl+Alt' | 'Ctrl+Shift' | 'Win';
  key: 'C' | 'Q' | 'Z' | 'F9' | 'Space';
  opacityPercent: number;
  startupPosition: 'TopRight' | 'BottomRight' | 'Center';
  alwaysOnTop: boolean;
  hideOnEscape: boolean;
}

export const DEFAULT_WINDOWS_CONFIG: WindowsOverlayConfig = {
  modifier: 'Alt',
  key: 'C',
  opacityPercent: 98,
  startupPosition: 'TopRight',
  alwaysOnTop: true,
  hideOnEscape: true,
};

const MODIFIER_CODES: Record<
  WindowsOverlayConfig['modifier'],
  { hex: string; desc: string }
> = {
  Alt: { hex: '0x0001', desc: 'MOD_ALT' },
  'Ctrl+Alt': { hex: '0x0003', desc: 'MOD_CONTROL | MOD_ALT' },
  'Ctrl+Shift': { hex: '0x0006', desc: 'MOD_CONTROL | MOD_SHIFT' },
  Win: { hex: '0x0008', desc: 'MOD_WIN' },
};

const KEY_CODES: Record<
  WindowsOverlayConfig['key'],
  { hex: string; desc: string }
> = {
  C: { hex: '0x43', desc: 'VK_C' },
  Q: { hex: '0x51', desc: 'VK_Q' },
  Z: { hex: '0x5A', desc: 'VK_Z' },
  F9: { hex: '0x78', desc: 'VK_F9' },
  Space: { hex: '0x20', desc: 'VK_SPACE' },
};

// The templates are edited as LF here and handed out as CRLF: batch files
// must use CRLF, and .cs files are kept CRLF to match.
const toLf = (text: string) => text.replace(/\r\n/g, '\n');
const toCrlf = (text: string) => text.replace(/\r?\n/g, '\r\n');

// Replaces the value of one `private ... NAME = value;` line in CalCU.cs.
// Throws if the line is missing, so a renamed setting fails loudly instead of
// silently shipping the default.
function setCSharpSetting(
  source: string,
  name: string,
  value: string,
  comment?: string
): string {
  const pattern = new RegExp(`^(\\s*private [\\w ]+ ${name} = ).*$`, 'm');
  if (!pattern.test(source)) {
    throw new Error(`CalCU.cs is missing the ${name} setting`);
  }
  const suffix = comment ? ` // ${comment}` : '';
  return source.replace(pattern, (_, declaration) => `${declaration}${value};${suffix}`);
}

export function hotkeyLabelFor(config: WindowsOverlayConfig): string {
  return `${config.modifier}+${config.key}`;
}

export function buildCSharpSource(config: WindowsOverlayConfig): string {
  const mod = MODIFIER_CODES[config.modifier];
  const key = KEY_CODES[config.key];
  let source = toLf(csharpTemplate);
  source = setCSharpSetting(source, 'HOTKEY_MODIFIER', mod.hex, mod.desc);
  source = setCSharpSetting(source, 'HOTKEY_KEY', key.hex, key.desc);
  source = setCSharpSetting(source, 'HOTKEY_LABEL', `"${hotkeyLabelFor(config)}"`);
  source = setCSharpSetting(
    source,
    'WINDOW_OPACITY',
    (config.opacityPercent / 100).toFixed(2)
  );
  source = setCSharpSetting(source, 'ALWAYS_ON_TOP', String(config.alwaysOnTop));
  source = setCSharpSetting(source, 'HIDE_ON_ESCAPE', String(config.hideOnEscape));
  source = setCSharpSetting(
    source,
    'START_POSITION',
    `"${config.startupPosition}"`,
    'TopRight | BottomRight | Center'
  );
  return toCrlf(source);
}

// Single-file installer: the C# source is appended after the marker line that
// ends Install-CalCU.bat, which the installer locates by searching for it.
export function buildInstallScript(config: WindowsOverlayConfig): string {
  const template = toLf(installTemplate);
  const pattern = /^set "HOTKEY=.*"$/m;
  if (!pattern.test(template)) {
    throw new Error('Install-CalCU.bat is missing the HOTKEY line');
  }
  const header = template
    .replace(pattern, () => `set "HOTKEY=${hotkeyLabelFor(config)}"`)
    .trimEnd();
  return toCrlf(`${header}\n${buildCSharpSource(config)}`);
}

export const UNINSTALL_SCRIPT = toCrlf(uninstallTemplate);

export const README_MARKDOWN = readmeMarkdown;
