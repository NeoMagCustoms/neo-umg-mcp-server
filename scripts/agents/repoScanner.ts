import fs from 'fs';
import path from 'path';

// Directories that should not be traversed during the scan.  This
// intentionally excludes the vault (which is generated content),
// compiled output, node modules and version control directories.
const IGNORED_DIRS = new Set(['node_modules', '.git', 'vault', 'public']);

/**
 * Recursively scan a repository and produce a flat list of files
 * matching specific extensions.  The list normalises paths to use
 * forward slashes so it can be consumed reliably across platforms.
 *
 * @param baseDir Base directory to scan.  Defaults to two levels
 *        above this file (the repository root).
 */
export async function scanRepo(baseDir: string = path.resolve(__dirname, '../..')) {
  const files: { path: string; type: string; size: number }[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(baseDir, full);
      if (IGNORED_DIRS.has(entry.name)) continue;
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        if (/\.(ts|js|json|md)$/.test(entry.name)) {
          const { size } = fs.statSync(full);
          files.push({
            path: rel.replace(/\\/g, '/'),
            type: path.extname(entry.name).slice(1),
            size
          });
        }
      }
    }
  }
  walk(baseDir);
  const index = {
    generated_at: new Date().toISOString(),
    total: files.length,
    files
  };
  // Write the index into the vault for consumption by agents
  const vaultDir = path.join(baseDir, 'vault');
  const outFile = path.join(vaultDir, 'RepoIndex.v1.json');
  fs.writeFileSync(outFile, JSON.stringify(index, null, 2));
  return index;
}

// Allow execution from the command line directly via ts-node
if (require.main === module) {
  scanRepo().then(index => {
    console.log(`📦 RepoIndex generated with ${index.total} files.`);
  });
}