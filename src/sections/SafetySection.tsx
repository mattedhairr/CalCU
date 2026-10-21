import { Scale, ShieldCheck } from 'lucide-react';

const CARDS = [
  {
    icon: <ShieldCheck className="h-5 w-5 text-success" />,
    title: 'Safe and transparent',
    points: [
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
  },
  {
    icon: <Scale className="h-5 w-5 text-primary" />,
    title: 'Open source and independent',
    points: [
      {
        lead: 'MIT licensed.',
        text: 'All C#, batch and TypeScript code is original and free to read, change and share.',
      },
      {
        lead: 'No third-party files.',
        text: 'The Windows app opens the public calculator page in a browser frame, like a bookmark; nothing proprietary is copied into this project.',
      },
      {
        lead: 'Not affiliated.',
        text: 'GATE and TCS iON belong to their owners. CalCU is an independent study tool and is not endorsed by them.',
      },
    ],
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="grid scroll-mt-24 grid-cols-1 gap-6 md:grid-cols-2">
      {CARDS.map((card) => (
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
