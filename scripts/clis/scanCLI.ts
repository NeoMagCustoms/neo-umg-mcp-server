import { execSync } from 'child_process';
import path from 'path';

const scannerPath = path.join(__dirname, '..', 'agents', 'repoScanner.ts');

console.log('🧠 Launching repo scanner...');
try {
  execSync(`npx ts-node ${scannerPath}`, { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Scanner failed:', err.message);
}
