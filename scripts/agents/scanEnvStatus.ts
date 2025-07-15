// scripts/scanEnvStatus.ts
import fs from 'fs';
import path from 'path';
import express from 'express';
import { execSync } from 'child_process';

console.log('\n🧠 Neo UMG MCP — Environment Scan\n');

try {
  // 1. Check loaded routes
  const routesPath = path.join(__dirname, '../api/routes');
  const routeFiles = fs.readdirSync(routesPath).filter(file => file.endsWith('.ts'));
  console.log('📁 Routes loaded:');
  routeFiles.forEach(file => console.log(`  - /${file.replace('.ts', '')}`));

  // 2. Check vault blocks
  const vaultPath = path.join(__dirname, '../vault');
  const vaultFiles = fs.readdirSync(vaultPath).filter(file => file.endsWith('.json'));
  console.log('\n📦 Vault blocks found:');
  vaultFiles.forEach(file => console.log(`  - ${file}`));

  // 3. Check CLI tools
  const cliPath = path.join(__dirname, '../scripts');
  const cliFiles = fs.readdirSync(cliPath).filter(file => file.endsWith('CLI.ts'));
  console.log('\n🧰 CLI Tools Available:');
  cliFiles.forEach(file => console.log(`  - ${file.replace('.ts', '')}`));

  // 4. Check MCP manifest
  console.log('\n🌐 Checking /sse endpoint...');
  const sseOutput = execSync('curl -s http://localhost:3000/sse').toString();
  if (sseOutput.includes('"tools"')) {
    console.log('✅ /sse is returning a valid manifest.');
  } else {
    console.log('❌ /sse is not returning a valid manifest.');
    console.log(`→ Response: ${sseOutput.slice(0, 200)}...`);
  }

  // 5. Show render.yaml info
  const renderYaml = path.join(__dirname, '../render.yaml');
  if (fs.existsSync(renderYaml)) {
    const renderData = fs.readFileSync(renderYaml, 'utf8');
    console.log('\n🧩 render.yaml found:\n');
    console.log(renderData.split('\n').slice(0, 10).join('\n') + '\n...');
  } else {
    console.log('\n🧩 render.yaml not found.');
  }

  console.log('\n✅ Scan complete. Environment looks stable.\n');
} catch (err: any) {
  console.error('❌ Environment scan failed:', err?.message || err);
}
