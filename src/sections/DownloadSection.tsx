import { Calculator, Download, Trash2 } from 'lucide-react';
import { LINKS } from '../data/links';
import type { Platform } from '../utils/download';
import { CALCU_VERSION, type WindowsOverlayConfig } from '../utils/windowsOverlay';

type HotkeyPreset = Pick<WindowsOverlayConfig, 'modifier' | 'key'> & { label: string };

const HOTKEY_PRESETS: HotkeyPreset[] = [
  { modifier: 'Alt', key: 'C', label: 'Alt + C' },
  { modifier: 'Alt', key: 'Q', label: 'Alt + Q' },
  { modifier: 'Ctrl+Shift', key: 'C', label: 'Ctrl + Shift + C' },
  { modifier: 'Alt', key: 'F9', label: 'Alt + F9' },
];

interface DownloadSectionProps {
  config: WindowsOverlayConfig;
  onConfigChange: (config: WindowsOverlayConfig) => void;
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
  hotkey: string;
  isCalculatorOpen: boolean;
  onShowCalculator: () => void;
  onDownloadInstaller: () => void;
  onDownloadUninstaller: () => void;
}

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
];

const STEPS = (hotkey: string, platform: Platform) => [
  platform === 'linux'
    ? {
        title: 'Run bash install-calcu.sh',
        body: 'It installs CalCU for your user only and starts it when you log in. Nothing is compiled, and every file is plain text.',
      }
    : {
        title: 'Run Install-CalCU.bat',
        body: "It builds a small CalCU.exe (about 11 KB) on your PC with the C# compiler that's already part of Windows, and sets it to start with Windows.",
      },
  {
    title: `Press ${hotkey} anywhere`,
    body: `Over a PDF, a test series or a lecture, ${hotkey} shows the calculator. Press it again to hide it.`,
  },
  platform === 'linux'
    ? {
        title: 'Uninstall in one command',
        body: 'uninstall-calcu.sh stops CalCU and removes the app, its startup entry and its shortcut.',
      }
    : {
        title: 'Uninstall in one click',
        body: 'Uninstall-CalCU.bat stops CalCU and removes the app, its startup entry and its registry values.',
      },
];

export function DownloadSection({
  config,
  onConfigChange,
  platform,
  onPlatformChange,
  hotkey,
  isCalculatorOpen,
  onShowCalculator,
  onDownloadInstaller,
  onDownloadUninstaller,
}: DownloadSectionProps) {
  return (
    <section id="download" className="card scroll-mt-24 p-6 sm:p-8">
      <div className="max-w-2xl">
        <div className="eyebrow mb-3">GATE calculator overlay · Windows 10 / 11 · Linux</div>

        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
          Your numerical practice needs focus. Not window resizing.
        </h1>

        <p className="mb-6 text-base leading-relaxed text-content-secondary">
          Press <span className="kbd">{hotkey}</span> anywhere on{' '}
          {platform === 'linux' ? 'Linux' : 'Windows'} to bring up the GATE
          virtual scientific calculator over your PDFs or lectures, and press it again to hide it.
          Try <span className="kbd">{hotkey}</span> on this page now.
        </p>

        <div className="mb-4 flex max-w-sm rounded-full bg-fill p-[3px]" role="group" aria-label="Your system">
          {PLATFORMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={platform === id}
              onClick={() => onPlatformChange(id)}
              className={`flex-1 cursor-pointer rounded-full py-2 text-sm font-semibold transition-colors ${
                platform === id
                  ? 'bg-primary text-on-primary'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-6 rounded-2xl bg-fill p-4">
          <div className="mb-3 text-sm font-semibold">Choose your shortcut</div>
          <div className="flex flex-wrap gap-2">
            {HOTKEY_PRESETS.map((preset) => {
              const selected =
                config.modifier === preset.modifier && config.key === preset.key;
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    onConfigChange({ ...config, modifier: preset.modifier, key: preset.key })
                  }
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
                    selected
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <label className="mt-4 flex flex-wrap items-center gap-3 border-t border-subtle pt-4 text-sm">
            <span className="font-semibold">Window opacity</span>
            <input
              type="range"
              min={70}
              max={100}
              value={config.opacityPercent}
              onChange={(e) => onConfigChange({ ...config, opacityPercent: Number(e.target.value) })}
              className="w-40 cursor-pointer accent-[var(--primary)]"
            />
            <span className="font-mono text-xs text-content-secondary">{config.opacityPercent}%</span>
          </label>
        </div>

        <div className="mb-3 flex flex-wrap gap-3">
          <button type="button" onClick={onDownloadInstaller} className="btn btn-primary">
            <Download className="h-4 w-4" />
            Download {platform === 'linux' ? 'install-calcu.sh' : 'Install-CalCU.bat'}
          </button>
          <button type="button" onClick={onDownloadUninstaller} className="btn btn-secondary">
            <Trash2 className="h-4 w-4 text-error" />
            Uninstaller
          </button>
          {!isCalculatorOpen && (
            <button type="button" onClick={onShowCalculator} className="btn btn-secondary">
              <Calculator className="h-4 w-4 text-primary" />
              Try it here
            </button>
          )}
        </div>
        <p className={`${platform === 'linux' ? 'mb-3' : 'mb-8'} text-xs text-content-secondary`}>
          Version {CALCU_VERSION} ·{' '}
          <a
            href={LINKS.calcuReleases}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-content-primary"
          >
            What's new
          </a>
          . Already installed? Run the new installer to update; it replaces the old copy.
        </p>
        {platform === 'linux' && (
          <p className="mb-8 text-xs leading-relaxed text-content-secondary">
            <strong className="font-semibold text-content-primary">
              Needs Python, GTK 3 and WebKitGTK.
            </strong>{' '}
            If any are missing, the installer shows the command and asks before using sudo. On GNOME
            it sets the shortcut for you; on other desktops you add it once in keyboard settings.
          </p>
        )}
      </div>

      <ol className="grid grid-cols-1 gap-5 border-t border-subtle pt-6 text-sm sm:grid-cols-3">
        {STEPS(hotkey, platform).map((step, i) => (
          <li key={step.title}>
            <div className="mb-1 font-semibold">
              <span className="mr-2 font-mono text-primary">0{i + 1}</span>
              {step.title}
            </div>
            <p className="leading-relaxed text-content-secondary">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
