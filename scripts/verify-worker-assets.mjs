import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'worker', 'site-dist');
const allowedRootFiles = new Set(['index.html', 'submit.html', 'styles.css', 'app.js', 'auth.js', 'submit.js', 'config.js']);
const forbiddenText = /GITHUB_CLIENT_SECRET|SESSION_ENCRYPTION_KEY|OAUTH_STATE_ENCRYPTION_KEY|CLOUDFLARE_API_TOKEN|(?:gh[pousr]_\w+|github_pat_\w+)/i;
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt']);

const files = [];
const walk = async (current, relative = '') => {
  for (const entry of await readdir(current, { withFileTypes: true })) {
    const entryPath = path.join(current, entry.name);
    const entryRelative = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) await walk(entryPath, entryRelative);
    else files.push({ absolute: entryPath, relative: entryRelative });
  }
};

await walk(directory);
if (!files.length) throw new Error('worker/site-dist is empty; run npm run stage first');

for (const file of files) {
  const topLevel = file.relative.split('/')[0];
  if (topLevel !== 'assets' && !allowedRootFiles.has(file.relative)) {
    throw new Error(`unexpected static asset: ${file.relative}`);
  }
  if (textExtensions.has(path.extname(file.relative).toLowerCase())) {
    const text = await readFile(file.absolute, 'utf8');
    if (forbiddenText.test(text)) throw new Error(`sensitive pattern in static asset: ${file.relative}`);
  }
}

console.log(`Verified ${files.length} allowlisted static assets`);
