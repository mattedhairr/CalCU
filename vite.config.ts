import { readFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// Publishes /version.json, which CalCU checks once a day to tell people about a
// new version. The number comes from its one line in CalCU.cs, like everywhere
// else, so the website and the apps can't disagree.
function versionFile(): Plugin {
  const read = () => {
    const source = readFileSync(new URL('./windows-overlay/CalCU.cs', import.meta.url), 'utf8');
    const match = /public const string Version = "([^"]+)";/.exec(source);
    if (!match) {
      throw new Error('CalCU.cs is missing the Version line');
    }
    return `${JSON.stringify({ version: match[1] })}\n`;
  };
  return {
    name: 'calcu-version-file',
    configureServer(server) {
      server.middlewares.use('/version.json', (_request, response) => {
        response.setHeader('Content-Type', 'application/json');
        response.end(read());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: read() });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), versionFile()],
});
