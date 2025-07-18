import fs from 'fs';
import path from 'path';

// Extract the keyword argument from argv.  The third element of
// process.argv is the first non‑node parameter when using ts-node.
const [, , keyword] = process.argv;

if (!keyword) {
  console.error('Usage: ts-node scripts/clis/describeCLI.ts <keyword>');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..', '..');
const indexPath = path.join(repoRoot, 'vault', 'RepoIndex.v1.json');

if (!fs.existsSync(indexPath)) {
  console.error('❌ RepoIndex.v1.json not found. Run npm run scan first.');
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
const match = index.files.find((f: any) => f.path.includes(keyword));

if (!match) {
  console.error(`❌ No file matching "${keyword}" found in RepoIndex.`);
  process.exit(1);
}

console.log(`\n🔍 File: ${match.path}`);
console.log(`📦 Type: ${match.type}`);
console.log(`📏 Size: ${match.size} bytes`);

const fullPath = path.join(repoRoot, match.path);
if (fs.existsSync(fullPath)) {
  const contents = fs.readFileSync(fullPath, 'utf-8');
  console.log('\n🧠 Contents:\n');
  console.log(contents);
} else {
  console.error('⚠️ File no longer exists on disk.');
}