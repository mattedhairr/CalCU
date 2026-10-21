import React, { useState, useEffect } from 'react';
import {
  INITIAL_CALCULATOR_STATE,
  TCSCalculatorState,
} from './utils/tcsCalculatorEngine';
import {
  DEFAULT_WINDOWS_CONFIG,
  WindowsOverlayConfig,
  buildInstallScript,
  buildCSharpSource,
  UNINSTALL_SCRIPT,
  README_MARKDOWN,
} from './utils/windowsOverlay';
import { TCSCalculatorOverlay } from './components/TCSCalculatorOverlay';
import { YouDOToolsPortfolioPage } from './components/YouDOToolsPortfolioPage';
import {
  Download,
  Trash2,
  ShieldCheck,
  Scale,
  FileCode,
  Copy,
  Check,
  Keyboard,
  Calculator,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';

export default function App() {
  const [calcState, setCalcState] = useState<TCSCalculatorState>(
    INITIAL_CALCULATOR_STATE
  );
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'calcu' | 'portfolio'>('calcu');
  const [winConfig, setWinConfig] = useState<WindowsOverlayConfig>(
    DEFAULT_WINDOWS_CONFIG
  );
  const [activeFileTab, setActiveFileTab] = useState<
    'install' | 'uninstall' | 'csharp' | 'readme'
  >('install');
  const [copiedTab, setCopiedTab] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('calcu-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('calcu-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const hotkeyLabel = `${winConfig.modifier} + ${winConfig.key}`;

  // Global keyboard listener for toggling the calculator overlay (e.g. Alt + C)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const targetKey = winConfig.key.toUpperCase();
      const pressedKey =
        e.code === 'Space'
          ? 'SPACE'
          : e.key.length === 1
          ? e.key.toUpperCase()
          : e.key.toUpperCase();

      const modMatch =
        (winConfig.modifier === 'Alt' &&
          e.altKey &&
          !e.ctrlKey &&
          !e.shiftKey) ||
        (winConfig.modifier === 'Ctrl+Alt' &&
          e.ctrlKey &&
          e.altKey &&
          !e.shiftKey) ||
        (winConfig.modifier === 'Ctrl+Shift' &&
          e.ctrlKey &&
          e.shiftKey &&
          !e.altKey) ||
        (winConfig.modifier === 'Win' && e.metaKey);

      if (modMatch && pressedKey === targetKey) {
        e.preventDefault();
        setIsCalculatorOpen((prev) => !prev);
        return;
      }

      if (winConfig.hideOnEscape && e.key === 'Escape' && isCalculatorOpen) {
        setIsCalculatorOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [winConfig, isCalculatorOpen]);

  const installBat = buildInstallScript(winConfig);
  const csharpSource = buildCSharpSource(winConfig);

  const repoFiles = {
    install: {
      filename: 'Install-CalCU.bat',
      label: 'Install-CalCU.bat',
      content: installBat,
      mime: 'application/x-bat',
    },
    uninstall: {
      filename: 'Uninstall-CalCU.bat',
      label: 'Uninstall-CalCU.bat',
      content: UNINSTALL_SCRIPT,
      mime: 'application/x-bat',
    },
    csharp: {
      filename: 'CalCU.cs',
      label: 'CalCU.cs (C# Source)',
      content: csharpSource,
      mime: 'text/plain',
    },
    readme: {
      filename: 'README.md',
      label: 'README.md',
      content: README_MARKDOWN,
      mime: 'text/markdown',
    },
  };

  const activeFile = repoFiles[activeFileTab];

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopiedTab(true);
    setTimeout(() => setCopiedTab(false), 1800);
  };

  const surfaceCardClass = isDark
    ? 'bg-[#0F172A] border-[#1E293B] text-[#F8FAFC]'
    : 'bg-white border-[#E2E8F0] text-[#0F172A]';
  const mutedTextClass = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const dividerClass = isDark ? 'border-[#1E293B]' : 'border-[#E2E8F0]';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-150 ${
        isDark ? 'bg-[#0B1120] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* Top Navigation Bar with Theme Toggle Switch */}
      <header
        className={`sticky top-0 z-40 backdrop-blur border-b px-6 py-3.5 flex items-center justify-between gap-8 transition-colors duration-150 ${
          isDark
            ? 'bg-[#0F172A]/95 border-[#1E293B]'
            : 'bg-white/95 border-[#E2E8F0]'
        }`}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('calcu');
          }}
          className={`text-lg font-bold tracking-tight font-display whitespace-nowrap shrink-0 ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          CalCU
        </a>

        <nav
          className={`hidden md:flex items-center gap-6 text-sm font-medium ${mutedTextClass}`}
        >
          <a
            href="#windows-download"
            onClick={() => setActiveView('calcu')}
            className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'calcu'
                ? isDark
                  ? 'text-white font-semibold'
                  : 'text-[#0F172A] font-semibold'
                : isDark
                ? 'hover:text-white'
                : 'hover:text-[#0F172A]'
            }`}
          >
            Windows Download
          </a>
          <a
            href="#safety-copyright"
            onClick={() => setActiveView('calcu')}
            className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              isDark ? 'hover:text-white' : 'hover:text-[#0F172A]'
            }`}
          >
            Safety & Copyright
          </a>
          <a
            href="#github-files"
            onClick={() => setActiveView('calcu')}
            className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              isDark ? 'hover:text-white' : 'hover:text-[#0F172A]'
            }`}
          >
            GitHub Repo Files
          </a>
          <a
            href="#other-tools"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'portfolio'
                ? 'text-[#38BDF8] font-semibold'
                : isDark
                ? 'hover:text-white'
                : 'hover:text-[#0F172A]'
            }`}
          >
            Other Tools
          </a>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle Switch */}
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isDark
                ? 'bg-[#1E293B] border-[#334155] text-[#E2E8F0] hover:bg-[#334155]'
                : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCalculatorOpen((v) => !v)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isCalculatorOpen
              ? `Hide CalCU (${hotkeyLabel})`
              : `Pop Up CalCU (${hotkeyLabel})`}
          </button>
        </div>
      </header>

      {/* Floating Draggable GATE Calculator Overlay */}
      <TCSCalculatorOverlay
        calcState={calcState}
        setCalcState={setCalcState}
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        hotkeyLabel={hotkeyLabel}
        activeHighlightKey={null}
        opacity={winConfig.opacityPercent}
        setOpacity={(val) =>
          setWinConfig((prev) => ({ ...prev, opacityPercent: val }))
        }
      />

      {activeView === 'portfolio' ? (
        <main className="flex-1">
          <YouDOToolsPortfolioPage
            onBackToCalCU={() => setActiveView('calcu')}
            onSummonCalculator={() => setIsCalculatorOpen(true)}
            onDownloadCalCUInstaller={() =>
              downloadFile(
                'Install-CalCU.bat',
                installBat,
                'application/x-bat'
              )
            }
            hotkeyLabel={hotkeyLabel}
            isDark={isDark}
          />
        </main>
      ) : (
        <main
          id="top"
          className="flex-1 max-w-[1140px] w-full mx-auto px-6 py-10 space-y-12"
        >
          {/* SECTION 1: Simple Windows Download & Hotkey Setup */}
          <section
            id="windows-download"
            className={`border rounded-xl p-6 sm:p-8 ${surfaceCardClass}`}
          >
            <div className="max-w-2xl">
              <div className="text-xs font-medium text-[#64748B] mb-2">
                <span
                  className={
                    isDark ? 'font-semibold text-white' : 'font-semibold text-[#0F172A]'
                  }
                >
                  YouDO Tools
                </span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span>CalCU — GATE Scientific Calculator Overlay</span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span>Windows 10 / 11</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display mb-3">
                Your numerical practice needs focus. Not window resizing.
              </h1>

              <p className={`text-sm sm:text-base leading-relaxed mb-6 ${mutedTextClass}`}>
                Press{' '}
                <code
                  className={`px-1.5 py-0.5 font-mono font-bold border rounded ${
                    isDark
                      ? 'bg-[#1E293B] border-[#334155] text-white'
                      : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]'
                  }`}
                >
                  {hotkeyLabel}
                </code>{' '}
                anywhere on Windows to summon the GATE Virtual Scientific Calculator right over your PDFs or lectures, and press it again to vanish. Try pressing{' '}
                <code className="font-mono font-semibold text-[#0284C7]">
                  {hotkeyLabel}
                </code>{' '}
                on this page right now.
              </p>

              {/* Simple Shortcut Picker */}
              <div
                className={`p-4 rounded-lg border mb-6 ${
                  isDark
                    ? 'bg-[#0B1120] border-[#1E293B]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    className={`flex items-center gap-2 text-xs font-semibold ${
                      isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'
                    }`}
                  >
                    <Keyboard className="w-4 h-4 text-[#0284C7]" />
                    <span>1. Choose Your Global Shortcut Key:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {(
                      [
                        { mod: 'Alt', key: 'C', label: 'Alt + C (Default)' },
                        { mod: 'Alt', key: 'Q', label: 'Alt + Q' },
                        {
                          mod: 'Ctrl+Shift',
                          key: 'C',
                          label: 'Ctrl + Shift + C',
                        },
                        { mod: 'Alt', key: 'F9', label: 'Alt + F9' },
                      ] as const
                    ).map((preset) => {
                      const isSelected =
                        winConfig.modifier === preset.mod &&
                        winConfig.key === preset.key;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            setWinConfig((prev) => ({
                              ...prev,
                              modifier: preset.mod,
                              key: preset.key,
                            }))
                          }
                          className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-[#0284C7] text-white border-[#0284C7]'
                              : isDark
                              ? 'bg-[#0F172A] text-[#CBD5E1] border-[#334155] hover:border-[#475569]'
                              : 'bg-white text-[#334155] border-[#CBD5E1] hover:border-[#94A3B8]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Install & Uninstall Download Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    downloadFile(
                      'Install-CalCU.bat',
                      installBat,
                      'application/x-bat'
                    )
                  }
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Download Installer (Install-CalCU.bat)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadFile(
                      'Uninstall-CalCU.bat',
                      UNINSTALL_SCRIPT,
                      'application/x-bat'
                    )
                  }
                  className={`px-4 py-3 text-xs sm:text-sm font-semibold border rounded-lg flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                    isDark
                      ? 'bg-[#1E293B] border-[#334155] text-[#E2E8F0] hover:bg-[#334155]'
                      : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <Trash2 className="w-4 h-4 text-[#DC2626]" />
                  Download Uninstaller (Uninstall-CalCU.bat)
                </button>

                {!isCalculatorOpen && (
                  <button
                    type="button"
                    onClick={() => setIsCalculatorOpen(true)}
                    className={`px-4 py-3 text-xs sm:text-sm font-semibold border rounded-lg flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                      isDark
                        ? 'bg-[#064E3B]/40 border-[#059669] text-[#34D399] hover:bg-[#064E3B]/60'
                        : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669] hover:bg-[#D1FAE5]'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    Show Floating Calculator
                  </button>
                )}
              </div>

              {/* 3 Simple Steps */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t text-xs ${dividerClass} ${mutedTextClass}`}
              >
                <div>
                  <div
                    className={`font-bold mb-1 ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    01. Run Install-CalCU.bat
                  </div>
                  Double-click <code className="font-mono">Install-CalCU.bat</code>. It builds a 24 KB native <code className="font-mono">CalCU.exe</code> using Windows' built-in .NET compiler.
                </div>
                <div>
                  <div
                    className={`font-bold mb-1 ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    02. Press {hotkeyLabel} Anywhere
                  </div>
                  Open any GATE PDF or video lecture. Press <code className="font-mono">{hotkeyLabel}</code> to pop up the calculator over your work, and <code className="font-mono">{hotkeyLabel}</code> to hide it.
                </div>
                <div>
                  <div
                    className={`font-bold mb-1 ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    03. 1-Click Clean Uninstall
                  </div>
                  Double-click <code className="font-mono">Uninstall-CalCU.bat</code> anytime to stop the background app and remove all files cleanly.
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: YouDO Tools Portfolio Banner + Safety & Copyright */}
          <section id="safety-copyright" className="space-y-6">
            {/* YouDO Tools & Developer Portfolio Card */}
            <div
              className={`border rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${surfaceCardClass}`}
            >
              <div>
                <div className="text-xs font-medium text-[#64748B] mb-1">
                  <span
                    className={
                      isDark
                        ? 'font-semibold text-white'
                        : 'font-semibold text-[#0F172A]'
                    }
                  >
                    YouDO Tools
                  </span>
                  <span className="mx-2" aria-hidden="true">
                    ·
                  </span>
                  <span>By Jatin Parmar (@mattedhairr)</span>
                </div>
                <h2 className="text-base font-bold font-display">
                  Part of YouDO Tools — Explore Other Tools & Developer Portfolio
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${mutedTextClass}`}>
                  <strong>CalCU</strong> is listed under <strong>YouDO Tools</strong> alongside <strong>YouDO</strong> (the goal-tree & pause-aware focus companion for aspirants) and open-source VLSI hardware projects.
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('portfolio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Open YouDO Tools & Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Why It Is 100% Safe */}
              <div className={`border rounded-xl p-6 ${surfaceCardClass}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0" />
                  <h2 className="text-base font-bold font-display">
                    Why CalCU Is 100% Safe & Transparent
                  </h2>
                </div>
                <div
                  className={`space-y-3 text-xs sm:text-sm leading-relaxed ${mutedTextClass}`}
                >
                  <p>
                    <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>
                      Plain-Text Source Code (No Mystery .EXE):
                    </strong>{' '}
                    Instead of downloading an unknown pre-compiled binary, <code className="font-mono">Install-CalCU.bat</code> is a plain-text script. Anyone can right-click and open it in Notepad to read every line before running.
                  </p>
                  <p>
                    <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>
                      Compiled by Microsoft Windows Built-In .NET:
                    </strong>{' '}
                    The script uses Microsoft's official C# compiler (<code className="font-mono">csc.exe</code>) pre-installed inside <code className="font-mono">C:\Windows\Microsoft.NET</code> to compile <code className="font-mono">CalCU.exe</code> locally on your PC.
                  </p>
                  <p>
                    <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>
                      No Admin Rights & 1-Click Uninstaller:
                    </strong>{' '}
                    Requires zero administrator privileges and includes <code className="font-mono">Uninstall-CalCU.bat</code> to remove the binary and registry key in one click.
                  </p>
                </div>
              </div>

              {/* Card 2: Copyright & Making the Project 100% Yours */}
              <div className={`border rounded-xl p-6 ${surfaceCardClass}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <Scale className="w-5 h-5 text-[#0284C7] shrink-0" />
                  <h2 className="text-base font-bold font-display">
                    Copyright Free — Ready for mattedhairr/CalCU
                  </h2>
                </div>
                <div
                  className={`space-y-3 text-xs sm:text-sm leading-relaxed ${mutedTextClass}`}
                >
                  <p>
                    <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>
                      100% Original MIT-Licensed Code:
                    </strong>{' '}
                    All C#, Batch, TypeScript, and React code is written from scratch under the permissive <strong>MIT License</strong>—matching your <code className="font-mono">mattedhairr/YouDO</code> repository.
                  </p>
                  <p>
                    <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>
                      Zero Proprietary Code Redistributed:
                    </strong>{' '}
                    Post-fix mathematical operations (<code className="font-mono">sin</code>, <code className="font-mono">ln</code>, <code className="font-mono">MS/MR</code>) and keypad grids are utilitarian mechanics that cannot be copyrighted. And when the Windows app loads the public calculator URL inside a standard browser frame, no third-party files are hosted in your repo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Ready-to-Commit GitHub Repo Files */}
          <section
            id="github-files"
            className={`border rounded-xl overflow-hidden ${surfaceCardClass}`}
          >
            <div
              className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${dividerClass}`}
            >
              <div>
                <h2 className="text-lg font-bold font-display">
                  GitHub Repository Files for mattedhairr/CalCU
                </h2>
                <p className="text-xs text-[#64748B]">
                  Already saved in your project root (<code className="font-mono">/README.md</code>, <code className="font-mono">/LICENSE</code>, <code className="font-mono">/windows-overlay/Install-CalCU.bat</code>, <code className="font-mono">/windows-overlay/Uninstall-CalCU.bat</code>).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-3 py-1.5 text-xs font-medium border rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]'
                      : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {copiedTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#059669]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy File
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadFile(
                      activeFile.filename,
                      activeFile.content,
                      activeFile.mime
                    )
                  }
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download {activeFile.filename}
                </button>
              </div>
            </div>

            {/* File Selector Tabs */}
            <div
              className={`px-6 py-2.5 border-b flex flex-wrap items-center gap-2 ${
                isDark
                  ? 'bg-[#0B1120] border-[#1E293B]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}
            >
              {(['install', 'uninstall', 'csharp', 'readme'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFileTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      activeFileTab === tab
                        ? 'bg-[#0284C7] text-white'
                        : isDark
                        ? 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                        : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    {repoFiles[tab].label}
                  </button>
                )
              )}
            </div>

            {/* Code Viewer */}
            <div className="p-6 bg-[#090D16] text-[#E2E8F0] font-mono text-xs leading-relaxed max-h-[420px] overflow-auto">
              <pre className="whitespace-pre-wrap break-words">
                {activeFile.content}
              </pre>
            </div>
          </section>
        </main>
      )}

      <footer
        className={`border-t px-6 py-5 text-xs text-[#64748B] transition-colors duration-150 ${
          isDark
            ? 'bg-[#0F172A] border-[#1E293B]'
            : 'bg-white border-[#E2E8F0]'
        }`}
      >
        <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            CalCU · a YouDO Tool by Jatin Parmar (@mattedhairr) · MIT License
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveView(
                  activeView === 'portfolio' ? 'calcu' : 'portfolio'
                );
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`font-medium cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-[#0F172A]'
              }`}
            >
              {activeView === 'portfolio'
                ? 'Back to CalCU Download'
                : 'YouDO Tools & Portfolio'}
            </button>
            <span>Press {hotkeyLabel} anytime to toggle overlay</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
