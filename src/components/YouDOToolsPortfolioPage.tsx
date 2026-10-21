import React, { useState } from 'react';
import {
  ExternalLink,
  Download,
  Calculator,
  Cpu,
  Target,
  Layers,
  X,
  ArrowLeft,
} from 'lucide-react';

interface YouDOToolsPortfolioPageProps {
  onBackToCalCU: () => void;
  onSummonCalculator: () => void;
  onDownloadCalCUInstaller: () => void;
  hotkeyLabel: string;
  isDark: boolean;
}

interface PortfolioProject {
  id: string;
  suite: 'YouDO Tools' | 'VLSI & Hardware Engineering';
  name: string;
  subtitle: string;
  metaLine: string;
  summary: string;
  highlights: string[];
  repoUrl: string;
  liveUrl?: string;
  releaseUrl?: string;
  isCurrentApp?: boolean;
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'youdo',
    suite: 'YouDO Tools',
    name: 'YouDO',
    subtitle: 'Your exam plan is a tree. Not a to-do list.',
    metaLine: 'TypeScript · Android APK (Capacitor) · Web PWA · MIT License',
    summary:
      'A focused execution and goal-planning companion for serious aspirants (UPSC, JEE, NEET, GATE, CAT). Connects every 6-tier syllabus layer to the exact work you should finish today, runs pause-aware focus sessions, and tracks honest progress.',
    highlights: [
      '6-tier flexible syllabus goal tree that updates automatically as daily steps complete',
      'Pause-aware focus sessions that separate elapsed clock time from true net focus',
      'Backlog visibility so unfinished work is carried forward honestly instead of vanishing',
      'Privacy-conscious public focus board, study rooms, and calendar execution streaks',
    ],
    repoUrl: 'https://github.com/mattedhairr/YouDO',
    liveUrl: 'https://youdo-app.vercel.app',
    releaseUrl: 'https://github.com/mattedhairr/YouDO/releases',
  },
  {
    id: 'calcu',
    suite: 'YouDO Tools',
    name: 'CalCU',
    subtitle: 'Your numerical practice needs focus. Not window resizing.',
    metaLine: 'C# Win32 · TypeScript · Windows 10/11 Native Overlay · MIT License',
    summary:
      'A lightweight global-hotkey Windows overlay and web practice tool under YouDO Tools. Press Alt + C from anywhere on Windows to summon the strict GATE Virtual Scientific Calculator right over your PDFs or video lectures.',
    highlights: [
      'Global Win32 RegisterHotKey (Alt + C) toggles the calculator over Adobe Reader, Chrome, or VLC',
      '100% authentic post-fix GATE (TCS iON) 55-button layout with Deg/Rad and Memory registers',
      'Zero-dependency 1-click Windows .bat builder using built-in Microsoft .NET csc.exe',
      'Includes 1-click clean uninstaller with zero background bloat',
    ],
    repoUrl: 'https://github.com/mattedhairr/CalCU',
    isCurrentApp: true,
  },
  {
    id: '8bit-cpu',
    suite: 'VLSI & Hardware Engineering',
    name: '8-bit RISC-V Inspired CPU (RTL to GDSII)',
    subtitle: 'Multi-cycle 8-bit CPU architecture from Verilog RTL to physical layout.',
    metaLine: 'Verilog · Yosys · OpenROAD · SkyWater 130nm PDK',
    summary:
      'An 8-bit RISC-V inspired processor featuring a multi-cycle control unit and datapath, taken through the complete open-source RTL-to-GDSII physical design flow.',
    highlights: [
      'Custom multi-cycle instruction fetch, decode, execute, and writeback microarchitecture in Verilog',
      'Logic synthesis and technology mapping via Yosys',
      'Automated floorplanning, placement, clock tree synthesis (CTS), and routing in OpenROAD',
      'Static timing analysis (OpenSTA) and GDSII physical layout generation',
    ],
    repoUrl: 'https://github.com/mattedhairr/8-bit-CPU-RTL-to-GDSII',
  },
  {
    id: '4bit-alu',
    suite: 'VLSI & Hardware Engineering',
    name: '4-bit ALU (RTL to GDSII Flow)',
    subtitle: 'Complete ASIC physical implementation targeting SkyWater 130nm.',
    metaLine: 'Verilog · OpenROAD · OpenSTA · Physical Design',
    summary:
      'End-to-end digital ASIC implementation of a 4-bit Arithmetic Logic Unit from behavioral/structural Verilog RTL all the way to verified GDSII layout.',
    highlights: [
      'Complete RTL-to-GDSII physical synthesis and layout pipeline',
      'Targets the open-source SkyWater 130nm process design kit (PDK)',
      'Timing verification, DRC/LVS cleanliness checks, and floorplan optimization',
    ],
    repoUrl: 'https://github.com/mattedhairr/4-bit-ALU-RTL-to-GDSII',
  },
];

export const YouDOToolsPortfolioPage: React.FC<YouDOToolsPortfolioPageProps> = ({
  onBackToCalCU,
  onSummonCalculator,
  onDownloadCalCUInstaller,
  hotkeyLabel,
  isDark,
}) => {
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);
  const [filterSuite, setFilterSuite] = useState<
    'All' | 'YouDO Tools' | 'VLSI & Hardware Engineering'
  >('All');

  const youdoToolsList = PORTFOLIO_PROJECTS.filter(
    (p) => p.suite === 'YouDO Tools'
  );
  const vlsiList = PORTFOLIO_PROJECTS.filter(
    (p) => p.suite === 'VLSI & Hardware Engineering'
  );

  const surfaceClass = isDark
    ? 'bg-[#0F172A] border-[#1E293B] text-[#F8FAFC]'
    : 'bg-white border-[#E2E8F0] text-[#0F172A]';
  const mutedTextClass = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const subtleTextClass = isDark ? 'text-[#64748B]' : 'text-[#64748B]';
  const dividerClass = isDark ? 'border-[#1E293B]' : 'border-[#E2E8F0]';

  return (
    <div className="max-w-[1140px] w-full mx-auto px-6 py-10 space-y-12">
      {/* Top Back Navigation Strip */}
      <div className={`flex items-center justify-between pb-4 border-b ${dividerClass}`}>
        <button
          type="button"
          onClick={onBackToCalCU}
          className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
            isDark
              ? 'text-[#94A3B8] hover:text-white'
              : 'text-[#475569] hover:text-[#0F172A]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CalCU Windows Overlay
        </button>

        <div className={`flex items-center gap-3 text-xs ${subtleTextClass}`}>
          <span>YouDO Tools & Developer Portfolio</span>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/mattedhairr"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-mono hover:underline ${
              isDark ? 'text-[#E2E8F0]' : 'text-[#0F172A]'
            }`}
          >
            @mattedhairr
          </a>
        </div>
      </div>

      {/* Split-Screen Developer & YouDO Tools Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div
          className={`lg:col-span-7 border rounded-2xl p-6 sm:p-8 flex flex-col justify-between ${surfaceClass}`}
        >
          <div>
            <div className={`text-xs font-medium mb-2 ${subtleTextClass}`}>
              <span className={isDark ? 'font-semibold text-white' : 'font-semibold text-[#0F172A]'}>
                Jatin Parmar
              </span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span>ECE & VLSI Physical Design</span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span>Creator of YouDO Tools</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-display mb-4">
              YouDO Tools & Engineering Portfolio
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed mb-6 ${mutedTextClass}`}>
              Building focused, zero-bloat tools for serious exam aspirants under{' '}
              <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>
                YouDO Tools
              </strong>
              —alongside open-source hardware & RTL-to-GDSII physical design architectures in Verilog and OpenROAD.
            </p>
          </div>

          <div className={`flex flex-wrap items-center gap-3 pt-4 border-t ${dividerClass}`}>
            <a
              href="https://youdo-app.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Launch YouDO Web App
            </a>
            <a
              href="https://github.com/mattedhairr"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2.5 text-xs font-semibold border rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isDark
                  ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]'
                  : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#0284C7]" />
              GitHub (@mattedhairr)
            </a>
            <a
              href="https://www.linkedin.com/in/jatin-parmar-9b1b962ba"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                isDark
                  ? 'text-[#94A3B8] hover:text-white'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              LinkedIn
            </a>
            <a
              href="https://t.me/YouDO_Updates"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                isDark
                  ? 'text-[#94A3B8] hover:text-white'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Telegram Updates
            </a>
          </div>
        </div>

        {/* Right 5 Cols: YouDO Tools Philosophy & Suite Card */}
        <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#1E293B]">
          <div>
            <div className="text-xs font-mono text-[#C4A574] mb-2">
              YouDO Tools · Aspirant Suite
            </div>
            <h2 className="text-xl font-bold tracking-tight font-display mb-3">
              Plan the whole journey. Execute only today.
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
              <strong className="text-white">YouDO Tools</strong> is a curated collection of open-source utilities designed for UPSC, JEE, NEET, GATE, and CAT aspirants who value deep, pause-aware focus over noisy productivity gimmicks.
            </p>

            <div className="space-y-3 text-xs border-t border-[#1E293B] pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">01. YouDO</span>
                <span className="text-[#C4A574] font-mono">
                  Goal Tree & Focus Timer
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">02. CalCU</span>
                <span className="text-[#86A588] font-mono">
                  GATE Calculator Overlay ({hotkeyLabel})
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-6 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#94A3B8]">
            <span>100% Free & MIT Open-Source</span>
            <a
              href="https://t.me/+-manVNAPhThkMzRl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline flex items-center gap-1"
            >
              Join Aspirant Community →
            </a>
          </div>
        </div>
      </section>

      {/* Suite Filter Bar */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${dividerClass}`}
      >
        <div>
          <h2 className="text-xl font-bold font-display">
            Featured Tools & Engineering Projects
          </h2>
          <p className={`text-xs ${subtleTextClass}`}>
            Click any project card to inspect full architecture details or launch it directly
          </p>
        </div>

        <div
          className={`flex items-center gap-1 p-1 rounded-lg ${
            isDark ? 'bg-[#0F172A] border border-[#1E293B]' : 'bg-[#E2E8F0]/70'
          }`}
        >
          {(
            ['All', 'YouDO Tools', 'VLSI & Hardware Engineering'] as const
          ).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterSuite(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filterSuite === tab
                  ? isDark
                    ? 'bg-[#1E293B] text-white'
                    : 'bg-white text-[#0F172A] shadow-2xs'
                  : isDark
                  ? 'text-[#94A3B8] hover:text-white'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: YouDO Tools Suite (YouDO + CalCU) */}
      {(filterSuite === 'All' || filterSuite === 'YouDO Tools') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#0284C7]" />
              01. YouDO Tools — Aspirant Productivity & Exam Utilities
            </h3>
            <span className={`text-xs ${subtleTextClass}`}>2 Active Products</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {youdoToolsList.map((proj) => (
              <div
                key={proj.id}
                className={`border rounded-2xl p-6 flex flex-col justify-between transition-colors ${surfaceClass} ${
                  isDark ? 'hover:border-[#334155]' : 'hover:border-[#94A3B8]'
                }`}
              >
                <div>
                  <div className={`text-xs mb-2 ${subtleTextClass}`}>
                    <span className="font-semibold text-[#0284C7]">
                      {proj.suite}
                    </span>
                    <span className="mx-2" aria-hidden="true">
                      ·
                    </span>
                    <span>{proj.metaLine}</span>
                  </div>

                  <h4 className="text-xl font-bold font-display mb-1">
                    {proj.name}
                  </h4>
                  <p
                    className={`text-xs font-medium mb-3 ${
                      isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'
                    }`}
                  >
                    {proj.subtitle}
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${mutedTextClass}`}>
                    {proj.summary}
                  </p>

                  <ul
                    className={`space-y-1.5 text-xs mb-6 ${
                      isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'
                    }`}
                  >
                    {proj.highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#0284C7] font-bold">·</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`pt-4 border-t flex flex-wrap items-center justify-between gap-2 ${dividerClass}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Web App
                      </a>
                    )}
                    {proj.releaseUrl && (
                      <a
                        href={proj.releaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-2 text-xs font-semibold border rounded-lg flex items-center gap-1.5 whitespace-nowrap ${
                          isDark
                            ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]'
                            : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5 text-[#059669]" />
                        Android APK
                      </a>
                    )}
                    {proj.isCurrentApp && (
                      <>
                        <button
                          type="button"
                          onClick={onDownloadCalCUInstaller}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Windows .BAT
                        </button>
                        <button
                          type="button"
                          onClick={onSummonCalculator}
                          className={`px-3 py-2 text-xs font-semibold border rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                            isDark
                              ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]'
                              : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <Calculator className="w-3.5 h-3.5 text-[#0284C7]" />
                          Test Overlay ({hotkeyLabel})
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: VLSI & Hardware Engineering Projects */}
      {(filterSuite === 'All' ||
        filterSuite === 'VLSI & Hardware Engineering') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#059669]" />
              02. Hardware & VLSI Physical Design (RTL-to-GDSII)
            </h3>
            <span className={`text-xs ${subtleTextClass}`}>
              Verilog · Yosys · OpenROAD · SkyWater 130nm
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vlsiList.map((proj) => (
              <div
                key={proj.id}
                className={`border rounded-2xl p-6 flex flex-col justify-between transition-colors ${surfaceClass} ${
                  isDark ? 'hover:border-[#334155]' : 'hover:border-[#94A3B8]'
                }`}
              >
                <div>
                  <div className={`text-xs mb-2 ${subtleTextClass}`}>
                    <span className="font-semibold text-[#059669]">
                      {proj.suite}
                    </span>
                    <span className="mx-2" aria-hidden="true">
                      ·
                    </span>
                    <span>{proj.metaLine}</span>
                  </div>

                  <h4 className="text-lg font-bold font-display mb-1">
                    {proj.name}
                  </h4>
                  <p
                    className={`text-xs font-medium mb-3 ${
                      isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'
                    }`}
                  >
                    {proj.subtitle}
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${mutedTextClass}`}>
                    {proj.summary}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t flex items-center justify-between gap-2 ${dividerClass}`}
                >
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3.5 py-2 text-xs font-semibold border rounded-lg flex items-center gap-1.5 whitespace-nowrap ${
                      isDark
                        ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#059669]" />
                    View GitHub Repo
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Inspect Architecture →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Project Detail Modal / Lightbox */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 ${surfaceClass}`}
          >
            <div
              className={`flex items-start justify-between gap-4 pb-3 border-b ${dividerClass}`}
            >
              <div>
                <div className={`text-xs mb-1 ${subtleTextClass}`}>
                  <span>{selectedProject.suite}</span>
                  <span className="mx-2" aria-hidden="true">
                    ·
                  </span>
                  <span>{selectedProject.metaLine}</span>
                </div>
                <h3 className="text-xl font-bold font-display">
                  {selectedProject.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${
                  isDark
                    ? 'bg-[#1E293B] hover:bg-[#334155] text-[#CBD5E1]'
                    : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155]'
                }`}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-sm leading-relaxed ${mutedTextClass}`}>
              {selectedProject.summary}
            </p>

            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isDark
                  ? 'bg-[#0B1120] border-[#1E293B]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}
            >
              <div className="text-xs font-bold">
                Key Engineering & Product Highlights:
              </div>
              <ul className={`space-y-1.5 text-xs ${mutedTextClass}`}>
                {selectedProject.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-[#0284C7]">0{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`pt-3 border-t flex flex-wrap items-center justify-between gap-3 ${dividerClass}`}
            >
              <div className="flex items-center gap-2">
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-[#1E293B] text-[#38BDF8] hover:bg-[#334155]'
                        : 'bg-[#F0F9FF] text-[#0284C7] hover:bg-[#E0F2FE]'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live App
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className={`px-4 py-2 text-xs font-medium cursor-pointer ${mutedTextClass}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
