import { analyzeRepo } from '../analyzeRepo';

import path from 'path';

const targetRepo = path.resolve('C:/dev/neo-blocks');  // Or replace with current working repo

(async () => {
  console.log(`\n🔍 Scanning repo: ${targetRepo}`);

  const result = await analyzeRepo(targetRepo);

  if ('error' in result) {
    console.error('❌ Error:', result.error);
    return;
  }

  console.log(`\n📁 Total files: ${result.totalFiles}`);
  console.log(`\n📂 File types:`);

  Object.entries(result.fileTypes)
    .sort(([, a], [, b]) => b - a)
    .forEach(([ext, count]) => {
      console.log(`  - ${ext}: ${count}`);
    });

  console.log(`\n🧱 First 10 files:\n`);
  result.files.slice(0, 10).forEach(file => {
    console.log(`  • ${file}`);
  });

  console.log(`\n✅ Repo scan complete.\n`);
})();
