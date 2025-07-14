import fs from 'fs';
import path from 'path';

function walk(dir: string, filelist: string[] = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    try {
      if (fs.statSync(fullPath).isDirectory()) {
        filelist = walk(fullPath, filelist);
      } else {
        filelist.push(fullPath);
      }
    } catch (err) {
      console.warn(`⚠️ Skipped unreadable path: ${fullPath}`);
    }
  });
  return filelist;
}

export async function analyzeRepo(repoPath: string) {
  console.log(`🔍 Scanning repo at: ${repoPath}`);

  if (!fs.existsSync(repoPath)) {
    return { error: "Repo path not found." };
  }

  const allFiles = walk(repoPath);
  const summary = {
    totalFiles: allFiles.length,
    fileTypes: {} as Record<string, number>,
    umgBlocks: [] as string[],
    errors: [] as string[],
    files: allFiles.map(f => path.relative(repoPath, f))
  };

  allFiles.forEach(file => {
    const ext = path.extname(file) || 'no-ext';
    summary.fileTypes[ext] = (summary.fileTypes[ext] || 0) + 1;

    if (ext === '.json' && file.includes('vault')) {
      summary.umgBlocks.push(file);
    }

    try {
      fs.accessSync(file, fs.constants.R_OK);
    } catch {
      summary.errors.push(`Permission denied: ${file}`);
    }
  });

  return summary;
}
