// scripts/deploySanityCheck.ts
import fs from 'fs';
import path from 'path';



console.log('🧠 Running Deploy Sanity Check...\n');

let allGood = true;

// Check required plugin files
const pluginFiles = [
  { name: 'ai-plugin.json', path: '.well-known/ai-plugin.json' },
  { name: 'openapi.yaml', path: 'openapi.yaml' },
  { name: 'logo.png', path: 'logo.png' }
];

for (const file of pluginFiles) {
  if (!fs.existsSync(file.path)) {
    console.warn(`❌ Missing: ${file.name}`);
    allGood = false;
  } else {
    console.log(`✅ Found: ${file.name}`);
  }
}

// Check environment keys
const requiredKeys = ['OPENAI_API_KEY'];
for (const key of requiredKeys) {
  if (!process.env[key]) {
    console.warn(`❌ Missing env var: ${key}`);
    allGood = false;
  } else {
    console.log(`✅ Env OK: ${key}`);
  }
}

// Check vault alignment philosophy
try {
  const alignmentPath = path.join('vault', 'AlignmentBlock.v1.json');
  const raw = fs.readFileSync(alignmentPath, 'utf-8');
  const parsed = JSON.parse(raw);
  const philosophy = parsed?.cantocore?.PHILOSOPHY;

  if (!philosophy || !Array.isArray(philosophy) || philosophy.length === 0) {
    console.warn(`❌ Invalid or empty alignment philosophy in ${alignmentPath}`);
    allGood = false;
  } else {
    console.log(`✅ Alignment Philosophy: [${philosophy.join(', ')}]`);
  }
} catch (err: any) {
  console.error(`❌ Failed to read AlignmentBlock: ${err.message}`);
  allGood = false;
}

console.log('\n📦 Deploy Check Result:');
if (allGood) {
  console.log('✅ Safe to deploy!');
  process.exit(0);
} else {
  console.log('❌ Fix issues before deploying.');
  process.exit(1);
}
