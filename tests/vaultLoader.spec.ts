import fs from 'fs';
import glob from 'glob';

describe('Vault loader hygiene', () => {
  test('There is only one loadVault implementation', () => {
    const files = glob.sync('**/loadVault.ts', { ignore: ['node_modules/**', 'dist/**', 'patch/**'] });
    // Expect exactly one occurrence of the loader in the repository
    expect(files.length).toBe(1);
  });

  test('No references to vault.json remain', () => {
    const occurrences = glob.sync('**/*.ts', { ignore: ['node_modules/**', 'dist/**', 'patch/**'] })
      .filter(file => fs.readFileSync(file, 'utf8').includes('vault.json'));
    expect(occurrences.length).toBe(0);
  });
});