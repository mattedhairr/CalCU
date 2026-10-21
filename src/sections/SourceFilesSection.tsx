import { useState } from 'react';
import { Check, Copy, Download, FileCode } from 'lucide-react';
import { LINKS } from '../data/links';
import { downloadTextFile } from '../utils/download';

export interface SourceFile {
  id: string;
  filename: string;
  content: string;
  mime: string;
}

export function SourceFilesSection({ files }: { files: SourceFile[] }) {
  const [activeId, setActiveId] = useState(files[0].id);
  const [copied, setCopied] = useState(false);
  const active = files.find((file) => file.id === activeId) ?? files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="source" className="card scroll-mt-24 overflow-hidden">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Read every line before you run it</h2>
          <p className="text-sm text-content-secondary">
            These are the exact files you download, with your shortcut filled in. Also on{' '}
            <a
              href={LINKS.calcuRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={handleCopy} className="btn btn-secondary">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() => downloadTextFile(active.filename, active.content, active.mime)}
            className="btn btn-primary"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-y border-subtle px-6 py-3" role="tablist">
        {files.map((file) => (
          <button
            key={file.id}
            type="button"
            role="tab"
            aria-selected={file.id === active.id}
            onClick={() => setActiveId(file.id)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
              file.id === active.id
                ? 'bg-primary text-on-primary'
                : 'text-content-secondary hover:bg-fill hover:text-content-primary'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            {file.filename}
          </button>
        ))}
      </div>

      <pre className="max-h-[420px] overflow-auto bg-black p-6 text-xs leading-relaxed text-[#e5e5ea]">
        {active.content}
      </pre>
    </section>
  );
}
