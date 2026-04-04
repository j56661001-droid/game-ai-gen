const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envProductionPath = path.resolve(__dirname, '../.env.production');
const envAppPath = path.resolve(__dirname, '../.env.app');
const envProductionBackupPath = path.resolve(__dirname, '../.env.production.bak');

// Parse arguments
const args = process.argv.slice(2);
const allowedAppSources = ['APKPURE', 'APP']; // Define allowed app sources

let appSource = null;
for (const arg of args) {
  if (arg.startsWith('--source=')) {
    appSource = arg.split('=')[1];
    break;
  }
}

if (appSource && !allowedAppSources.includes(appSource)) {
  console.error(`Error: Invalid app source '${appSource}'. Allowed sources are: ${allowedAppSources.join(', ')}`);
  process.exit(1);
}

function runCommand(command) {
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyLotteryProject() {
  console.log('Copying lottery project...');
  const lotterySource = path.resolve(__dirname, '../lottery_build');
  const lotteryDest = path.resolve(__dirname, '../unpackage/dist/build/web/lottery');

  if (!fs.existsSync(lotterySource)) {
    console.warn('Warning: lottery_build directory not found, skipping copy.');
    return;
  }

  if (fs.existsSync(lotteryDest)) {
    fs.rmSync(lotteryDest, { recursive: true, force: true });
  }

  try {
    copyDir(lotterySource, lotteryDest);
    console.log('Successfully copied lottery project.');
  } catch (error) {
    console.error('Failed to copy lottery project:', error);
    throw error;
  }
}

async function buildApp() {
  let originalEnvProductionContent = null;

  try {
    // 1. Back up original .env.production if it exists
    if (fs.existsSync(envProductionPath)) {
      originalEnvProductionContent = fs.readFileSync(envProductionPath, 'utf8');
      fs.writeFileSync(envProductionBackupPath, originalEnvProductionContent);
      console.log('Backed up .env.production');
    }

    // 2. Copy .env.app to .env.production
    fs.copyFileSync(envAppPath, envProductionPath);
    console.log('Copied .env.app to .env.production');

    // 3. Append VITE_APP_SOURCE if provided
    if (appSource) {
      fs.appendFileSync(envProductionPath, `\nVITE_APP_SOURCE=${appSource}`);
      console.log(`Appended VITE_APP_SOURCE=${appSource} to .env.production`);
    }

    // 4. Run npm run build
    runCommand('npm run build');
    
    // 4.1. Copy lottery project
    // copyLotteryProject();

    // 5. Run post-build commands
    runCommand('node script/replace_app_info.js');
    runCommand('npx cap sync android');
    // runCommand('npx cap sync ios');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  } finally {
    // 6. Restore original .env.production or remove the backup
    if (originalEnvProductionContent !== null) {
      fs.writeFileSync(envProductionPath, originalEnvProductionContent);
      console.log('Restored .env.production from backup');
      fs.unlinkSync(envProductionBackupPath); // Clean up backup
    } else {
      // If there was no original .env.production, remove the temporary one
      if (fs.existsSync(envProductionPath)) {
        fs.unlinkSync(envProductionPath);
        console.log('Removed temporary .env.production');
      }
    }
  }
}

buildApp();
