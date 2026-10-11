import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'worker', 'site-dist');
const files = ['index.html', 'submit.html', 'styles.css', 'app.js', 'auth.js', 'submit.js', 'config.js'];

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });

for (const file of files) {
  await cp(path.join(root, file), path.join(destination, file));
}

await cp(path.join(root, 'assets'), path.join(destination, 'assets'), { recursive: true });
console.log(`Staged ${files.length} public files and assets into ${path.relative(root, destination)}`);
