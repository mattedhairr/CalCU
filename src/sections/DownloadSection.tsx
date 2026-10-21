import { Calculator, Download, Trash2 } from 'lucide-react';
import type { WindowsOverlayConfig } from '../utils/windowsOverlay';

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
  hotkey: string;
  isCalculatorOpen: boolean;
  onShowCalculator: () => void;
  onDownloadInstaller: () => void;
  onDownloadUninstaller: () => void;
}

const STEPS = (hotkey: string) => [
  {
    title: 'Run Install-CalCU.bat',
    body: "It builds a small CalCU.exe (about 11 KB) on your PC with the C# compiler that's already part of Windows.",
  },
  {
    title: `Press ${hotkey} anywhere`,
    body: `Over a PDF, a test series or a lecture, ${hotkey} shows the calculator. Press it again to hide it.`,
  },
  {
    title: 'Uninstall in one click',
    body: 'Uninstall-CalCU.bat stops CalCU and removes the app and its one registry value.',
  },
];

export function DownloadSection({
  config,
  onConfigChange,
  hotkey,
  isCalculatorOpen,
  onShowCalculator,
  onDownloadInstaller,
  onDownloadUninstaller,
}: DownloadSectionProps) {
  return (
    <section id="download" className="card scroll-mt-24 p-6 sm:p-8">
      <div className="max-w-2xl">
        <div className="eyebrow mb-3">GATE calculator overlay · Windows 10 / 11</div>

        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
          Your numerical practice needs focus. Not window resizing.
        </h1>

        <p className="mb-6 text-base leading-relaxed text-content-secondary">
          Press <span className="kbd">{hotkey}</span> anywhere on Windows to bring up the GATE
          virtual scientific calculator over your PDFs or lectures, and press it again to hide it.
          Try <span className="kbd">{hotkey}</span> on this page now.
        </p>

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

        <div className="mb-8 flex flex-wrap gap-3">
          <button type="button" onClick={onDownloadInstaller} className="btn btn-primary">
            <Download className="h-4 w-4" />
            Download Install-CalCU.bat
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
      </div>

      <ol className="grid grid-cols-1 gap-5 border-t border-subtle pt-6 text-sm sm:grid-cols-3">
        {STEPS(hotkey).map((step, i) => (
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
