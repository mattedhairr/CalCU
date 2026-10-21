import { useState } from 'react';
import { TCSCalculatorOverlay } from './components/TCSCalculatorOverlay';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { useHashView } from './hooks/useHashView';
import { useOverlayHotkey } from './hooks/useOverlayHotkey';
import { useTheme } from './hooks/useTheme';
import { CalcuPage } from './pages/CalcuPage';
import { YouDOToolsPage } from './pages/YouDOToolsPage';
import type { SourceFile } from './sections/SourceFilesSection';
import { BAT_MIME, downloadTextFile } from './utils/download';
import {
  INITIAL_CALCULATOR_STATE,
  TCSCalculatorState,
} from './utils/tcsCalculatorEngine';
import {
  DEFAULT_WINDOWS_CONFIG,
  README_MARKDOWN,
  UNINSTALL_SCRIPT,
  WindowsOverlayConfig,
  buildCSharpSource,
  buildInstallScript,
  displayHotkey,
} from './utils/windowsOverlay';

export default function App() {
  const view = useHashView();
  const { theme, toggleTheme } = useTheme();
  const [calcState, setCalcState] = useState<TCSCalculatorState>(INITIAL_CALCULATOR_STATE);
  // The calculator replica is 482px wide, so on phones it starts hidden
  // instead of covering the page.
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(
    () => window.matchMedia('(min-width: 768px)').matches
  );
  const [winConfig, setWinConfig] = useState<WindowsOverlayConfig>(DEFAULT_WINDOWS_CONFIG);

  useOverlayHotkey(winConfig, isCalculatorOpen, setIsCalculatorOpen);

  const hotkey = displayHotkey(winConfig);
  const installBat = buildInstallScript(winConfig);

  const sourceFiles: SourceFile[] = [
    { id: 'install', filename: 'Install-CalCU.bat', content: installBat, mime: BAT_MIME },
    { id: 'uninstall', filename: 'Uninstall-CalCU.bat', content: UNINSTALL_SCRIPT, mime: BAT_MIME },
    { id: 'csharp', filename: 'CalCU.cs', content: buildCSharpSource(winConfig), mime: 'text/plain' },
    { id: 'readme', filename: 'README.md', content: README_MARKDOWN, mime: 'text/markdown' },
  ];

  const downloadInstaller = () => downloadTextFile('Install-CalCU.bat', installBat, BAT_MIME);
  const downloadUninstaller = () =>
    downloadTextFile('Uninstall-CalCU.bat', UNINSTALL_SCRIPT, BAT_MIME);
  const showCalculator = () => setIsCalculatorOpen(true);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        view={view}
        theme={theme}
        onToggleTheme={toggleTheme}
        isCalculatorOpen={isCalculatorOpen}
        onToggleCalculator={() => setIsCalculatorOpen((open) => !open)}
        hotkey={hotkey}
      />

      {/* Floating, draggable GATE calculator, same as the Windows app shows */}
      <TCSCalculatorOverlay
        calcState={calcState}
        setCalcState={setCalcState}
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        hotkeyLabel={hotkey}
        activeHighlightKey={null}
        opacity={winConfig.opacityPercent}
        setOpacity={(opacityPercent) => setWinConfig((prev) => ({ ...prev, opacityPercent }))}
      />

      {view === 'youdo-tools' ? (
        <YouDOToolsPage
          hotkey={hotkey}
          onDownloadInstaller={downloadInstaller}
          onShowCalculator={showCalculator}
        />
      ) : (
        <CalcuPage
          config={winConfig}
          onConfigChange={setWinConfig}
          hotkey={hotkey}
          isCalculatorOpen={isCalculatorOpen}
          onShowCalculator={showCalculator}
          onDownloadInstaller={downloadInstaller}
          onDownloadUninstaller={downloadUninstaller}
          sourceFiles={sourceFiles}
        />
      )}

      <SiteFooter />
    </div>
  );
}
