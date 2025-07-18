import fs from 'fs';
import path from 'path';
import readline from 'readline';
// import { loadVault } from '../../../utils/loadVault'; // ✅ Correct path from scripts/clis
// FIX: Update the path below if the actual location is different, or create the file if missing.
import { loadVault } from '../utils/loadVault';

const VAULT_DIR = path.join(__dirname, '..', '..', '..', 'vault');

function saveVaultBlock(name: string, data: any) {
  const filename = `${name}.v1.json`;
  const fullPath = path.join(VAULT_DIR, filename);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  console.log(`✅ ${filename} updated.`);
}

async function runCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const vault = loadVault();
  console.log('\n🧠 UMG Vault CLI — Editing Mode');
  console.log('Sections: AlignmentBlock, MythosBlock, InstructionLayer, OverlayModules\n');

  rl.question('Which section would you like to view/edit? ', section => {
    const block = vault[section];
    if (!block) {
      console.log('❌ Block not found.');
      rl.close();
      return;
    }

    console.log(`\n🔍 Current data for ${section}:`);
    console.dir(block, { depth: null });

    rl.question('\nDo you want to overwrite this block? (yes/no): ', async answer => {
      if (answer.toLowerCase() === 'yes') {
        rl.question('Paste new JSON block: ', newData => {
          try {
            const parsed = JSON.parse(newData);
            saveVaultBlock(section, parsed);
          } catch (err) {
            console.error('❌ Invalid JSON.');
          }
          rl.close();
        });
      } else {
        console.log('🛑 Edit cancelled.');
        rl.close();
      }
    });
  });
}

runCLI();

