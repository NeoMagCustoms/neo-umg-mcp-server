import fs from 'fs';
import path from 'path';
import { loadVault } from '../../../utils/loadVault';

const args = process.argv.slice(2);
const target = args[0];

if (!target) {
  console.log('❌ Usage: npm run describe <file>');
  process.exit(1);
}

const vault = loadVault();
const repoIndex = vault?.RepoIndex;

if (!repoIndex?.files) {
  console.log('❌ RepoIndex not found. Run `npm run scan` first.');
  process.exit(1);
}

const match = repoIndex.files.find(f => f.path.includes(target));

if (!match) {
  console.log(`❌ No match found for "${target}"`);
  process.exit(1);
}

console.log(`\n🔍 File: ${match.path}`);
console.log(`📦 Type: ${match.type}`);
console.log(`📏 Size: ${match.size} bytes`);

const fullPath = path.join(__dirname, '..', '..', '..', match.path);
if (fs.existsSync(fullPath)) {
  const contents = fs.readFileSync(fullPath, 'utf-8');
  console.log(`\n🧠 Contents:\n\n${contents}`);
} else {
  console.log('⚠️ File no longer exists on disk.');
}
