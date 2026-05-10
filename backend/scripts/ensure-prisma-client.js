import fs from 'node:fs';
import path from 'node:path';
import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');
const prismaClientDir = path.join(backendRoot, 'src', 'generated', 'prisma');
const prismaClientEntry = path.join(prismaClientDir, 'index.js');

function hasEngineForCurrentPlatform() {
  if(process.platform === 'win32') {
    return fs.readdirSync(prismaClientDir).some((name) => name.endsWith('.dll.node'));
  }
  if(process.platform === 'darwin') {
    return fs.readdirSync(prismaClientDir).some((name) => name.endsWith('.dylib.node'));
  }
  return fs.readdirSync(prismaClientDir).some((name) => name.endsWith('.so.node'));
}

if(fs.existsSync(prismaClientEntry) && hasEngineForCurrentPlatform()) {
  console.log('Prisma client already exists, skip generate.');
  process.exit(0);
}

console.log('Prisma client or platform engine not found, generating...');
execSync('prisma generate', {
  cwd: backendRoot,
  stdio: 'inherit'
});
