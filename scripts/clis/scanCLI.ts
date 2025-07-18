import { scanRepo } from '../agents/repoScanner';

/**
 * CLI wrapper for the repository scanner.  Invokes the scanner and
 * reports summary statistics to stdout.  This script can be wired
 * into an npm script (`npm run scan`) to update RepoIndex.v1.json.
 */
(async () => {
  console.log('🔍 Running repository scan...');
  const index = await scanRepo();
  console.log(`✅ Indexed ${index.total} files and updated vault/RepoIndex.v1.json`);
})();