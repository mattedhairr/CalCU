import { Scale, ShieldCheck } from 'lucide-react';
import type { Platform } from '../utils/download';

const SAFETY_POINTS: Record<Platform, { lead: string; text: string }[]> = {
  windows: [
    {
      lead: 'No mystery .exe.',
      text: 'You download plain-text files. Right-click Install-CalCU.bat or CalCU.cs and open them in Notepad to read every line first.',
    },
    {
      lead: 'Built by Windows itself.',
      text: 'The installer uses Microsoft’s C# compiler (csc.exe) that already ships in C:\\Windows\\Microsoft.NET to build CalCU.exe on your PC.',
    },
    {
      lead: 'No admin rights.',
      text: 'It runs as a normal user, registers one shortcut with the standard Windows API, and the uninstaller removes everything.',
    },
  ],
  linux: [
    {
      lead: 'Plain text only.',
      text: 'You download a shell script and a Python program, with no compiled binary. Open them in any text editor to read every line first.',
    },
    {
      lead: 'Runs on your system’s Python.',
      text: 'CalCU uses Python, GTK 3 and WebKitGTK from your distribution’s own packages, so nothing is compiled.',
    },
    {
      lead: 'Installs for your user only.',
      text: 'The app itself needs no sudo. If packages are missing, the installer shows the command and asks before using sudo. The uninstaller removes what it added, and leaves those packages in place.',
    },
  ],
};

const UPDATE_POINT = {
  lead: 'Tells you about updates.',
  text: 'Once a day CalCU reads the latest version number from this website, and sends nothing about you. A newer version is shown once, with a link to this page; nothing downloads by itself.',
};

const cards = (platform: Platform) => [
  {
    icon: <ShieldCheck className="h-5 w-5 text-success" />,
    title: 'Safe and transparent',
    points: [...SAFETY_POINTS[platform], UPDATE_POINT],
  },
  {
    icon: <Scale className="h-5 w-5 text-primary" />,
    title: 'Open source and independent',
    points: [
      {
        lead: 'MIT licensed.',
        text: 'All C#, Python, shell, batch and TypeScript code is original and free to read, change and share.',
      },
      {
        lead: 'No third-party files.',
        text: 'CalCU opens the public calculator page in a browser frame, like a bookmark; nothing proprietary is copied into this project.',
      },
      {
        lead: 'Not affiliated.',
        text: 'GATE and TCS iON belong to their owners. CalCU is an independent study tool and is not endorsed by them.',
      },
    ],
  },
];

export function SafetySection({ platform }: { platform: Platform }) {
  return (
    <section id="safety" className="grid scroll-mt-24 grid-cols-1 gap-6 md:grid-cols-2">
      {cards(platform).map((card) => (
        <div key={card.title} className="card p-6">
          <div className="mb-4 flex items-center gap-2.5">
            {card.icon}
            <h2 className="text-lg font-semibold">{card.title}</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-content-secondary">
            {card.points.map((point) => (
              <p key={point.lead}>
                <strong className="font-semibold text-content-primary">{point.lead}</strong>{' '}
                {point.text}
              </p>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
