import fs from 'fs';
import path from 'path';
import readline from 'readline';

const vaultPath = path.join(__dirname, '..', 'vault', 'vault.json');

function loadVault() {
  const raw = fs.readFileSync(vaultPath, 'utf-8');
  return JSON.parse(raw);
}

function saveVault(data: any) {
  fs.writeFileSync(vaultPath, JSON.stringify(data, null, 2));
  console.log('✅ Vault updated.');
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
            vault[section] = JSON.parse(newData);
            saveVault(vault);
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
