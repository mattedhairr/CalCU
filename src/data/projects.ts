export const LINKS = {
  youdoWeb: 'https://youdo-app.vercel.app',
  youdoRepo: 'https://github.com/mattedhairr/YouDO',
  youdoReleases: 'https://github.com/mattedhairr/YouDO/releases',
  calcuRepo: 'https://github.com/mattedhairr/CalCU',
  github: 'https://github.com/mattedhairr',
  linkedin: 'https://www.linkedin.com/in/jatin-parmar-9b1b962ba',
  telegramUpdates: 'https://t.me/YouDO_Updates',
  telegramCommunity: 'https://t.me/+-manVNAPhThkMzRl',
} as const;

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  stack: string;
  summary: string;
  highlights: string[];
  links: ProjectLink[];
}

/** Tools for aspirants that carry the YouDO name. */
export const YOUDO_TOOLS: Project[] = [
  {
    id: 'youdo',
    name: 'YouDO',
    tagline: 'Your exam plan is a tree. Not a to-do list.',
    stack: 'Web app · Android',
    summary:
      'The focus and goal-planning companion for serious aspirants (UPSC, JEE, NEET, GATE, CAT). It connects every layer of your syllabus to the work you should finish today, runs pause-aware focus sessions, and tracks honest progress.',
    highlights: [
      '6-tier syllabus goal tree that updates as daily steps get done',
      'Pause-aware focus sessions that separate clock time from real focus time',
      'Backlog that carries unfinished work forward instead of hiding it',
    ],
    links: [
      { label: 'Open YouDO', href: LINKS.youdoWeb },
      { label: 'Android APK', href: LINKS.youdoReleases },
      { label: 'GitHub', href: LINKS.youdoRepo },
    ],
  },
  {
    id: 'calcu',
    name: 'CalCU',
    tagline: 'Your numerical practice needs focus. Not window resizing.',
    stack: 'Windows 10 / 11',
    summary:
      'Made for YouDO focus sessions: press one shortcut to bring the GATE virtual calculator up over your PDF or lecture, and press it again to hide it, without leaving your session.',
    highlights: [
      'One global shortcut (Alt + C by default) over any app',
      'Same post-fix layout as the GATE exam calculator, with Deg/Rad and memory',
      'Built on your own PC from readable source, with a one-click uninstaller',
    ],
    links: [{ label: 'GitHub', href: LINKS.calcuRepo }],
  },
];

/** Other work by the same developer, kept apart from YouDO Tools. */
export const DEVELOPER_PROJECTS: Project[] = [
  {
    id: '8bit-cpu',
    name: '8-bit RISC-V Inspired CPU',
    tagline: 'Multi-cycle CPU taken from Verilog RTL to GDSII layout.',
    stack: 'Verilog · Yosys · OpenROAD · SkyWater 130nm',
    summary:
      'An 8-bit RISC-V inspired processor with a multi-cycle control unit and datapath, taken through the full open-source RTL-to-GDSII physical design flow.',
    highlights: [
      'Fetch, decode, execute and writeback microarchitecture in Verilog',
      'Synthesis with Yosys; floorplan, placement, CTS and routing in OpenROAD',
      'Static timing analysis with OpenSTA and final GDSII layout',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/mattedhairr/8-bit-CPU-RTL-to-GDSII' }],
  },
  {
    id: '4bit-alu',
    name: '4-bit ALU',
    tagline: 'Complete ASIC flow targeting SkyWater 130nm.',
    stack: 'Verilog · OpenROAD · OpenSTA',
    summary:
      'End-to-end digital ASIC implementation of a 4-bit ALU, from Verilog RTL to a verified GDSII layout.',
    highlights: [
      'Complete RTL-to-GDSII synthesis and layout pipeline',
      'Targets the open-source SkyWater 130nm PDK',
      'Timing verification and DRC / LVS checks',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/mattedhairr/4-bit-ALU-RTL-to-GDSII' }],
  },
];
