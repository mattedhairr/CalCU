import type { WindowsOverlayConfig } from '../utils/windowsOverlay';
import { AboutYouDOSection } from '../sections/AboutYouDOSection';
import { DownloadSection } from '../sections/DownloadSection';
import { SafetySection } from '../sections/SafetySection';
import { SourceFilesSection, type SourceFile } from '../sections/SourceFilesSection';

interface CalcuPageProps {
  config: WindowsOverlayConfig;
  onConfigChange: (config: WindowsOverlayConfig) => void;
  hotkey: string;
  isCalculatorOpen: boolean;
  onShowCalculator: () => void;
  onDownloadInstaller: () => void;
  onDownloadUninstaller: () => void;
  sourceFiles: SourceFile[];
}

export function CalcuPage({ sourceFiles, ...downloadProps }: CalcuPageProps) {
  return (
    <main id="top" className="mx-auto w-full max-w-[1100px] flex-1 space-y-6 px-4 py-10 sm:px-6">
      <DownloadSection {...downloadProps} />
      <SafetySection />
      <SourceFilesSection files={sourceFiles} />
      <AboutYouDOSection />
    </main>
  );
}
