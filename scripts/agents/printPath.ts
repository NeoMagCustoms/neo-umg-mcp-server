import path from 'path';
import fs from 'fs';

const expectedPath = path.resolve(__dirname, '../loadVault.ts');

console.log('🔎 Checking for:', expectedPath);
console.log('📁 Exists:', fs.existsSync(expectedPath));
