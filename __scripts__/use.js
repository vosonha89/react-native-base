/**
 * use — Scaffold a new project from the react-native-base template.
 *
 * Usage (single command):
 *   npx degit --force vosonha89/react-native-base my-app && cd my-app && node __scripts__/use.js --name=MyApp
 *
 * This script:
 *   - Replaces placeholder project names (react-native-base / ReactNativeBase)
 *     with the user's project name in package.json and app.json.
 *   - Optionally installs npm dependencies.
 *   - Is safe to delete after first use.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/* ──────────────────────── helpers ──────────────────────── */

const ROOT = path.resolve(__dirname, '..');

const HEADER = `
  🏗  use  🏗
  Scaffold a new project from react-native-base
`;

function bail(msg) {
  console.error('  ✖  ' + msg);
  process.exit(1);
}

function log(msg) {
  console.log('  ' + msg);
}

/**
 * PascalCase → kebab-case.
 *   "ReactNativeBase" → "react-native-base"
 *   "MyApp"           → "my-app"
 */
function pascalToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/* ──────────────────── I/O helpers ──────────────────── */

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function promptYesNo(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(`  ${question} (Y/n) `, answer => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      resolve(trimmed === '' || trimmed === 'y' || trimmed === 'yes');
    });
  });
}

/* ──────────────────── argument parsing ──────────────────── */

function parseArgs() {
  const args = process.argv.slice(2);
  let name = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) {
      name = args[i + 1];
      break;
    }
    if (args[i].startsWith('--name=')) {
      name = args[i].slice('--name='.length);
      break;
    }
  }
  return { name };
}

function promptName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question('  Project name (PascalCase, e.g. MyApp): ', answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function validateName(name) {
  if (!name)
    bail('Name is required. Use --name=MyApp or enter it interactively.');
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    bail(
      `Invalid name "${name}". Must be PascalCase, e.g. MyApp, AwesomeProject`,
    );
  }
}

/* ──────────────────────── git clean ──────────────────────── */

/**
 * Removes the template's `.git` folder (carried over by `git clone`) so
 * the scaffolded project starts with no git history. The user is
 * responsible for `git init` / `git remote add` themselves.
 * No-op if no `.git` is present (e.g. the `degit` flow).
 */
function cleanGit() {
  const gitPath = path.join(ROOT, '.git');
  if (!fs.existsSync(gitPath)) {
    log('✓  No .git folder found — skipped');
    return;
  }
  fs.rmSync(gitPath, { recursive: true, force: true });
  log('🧹  Removed template .git folder');
}

/* ──────────────────── patching ──────────────────── */

function patchPackageJson(name) {
  const pkgPath = path.join(ROOT, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    bail('No package.json found. Are you in the template root directory?');
  }

  const pkg = readJson(pkgPath);
  const oldName = pkg.name;
  const newName = pascalToKebab(name);

  if (oldName === newName) {
    log(`✓  package.json name already "${newName}" — skipped`);
    return;
  }

  pkg.name = newName;
  writeJson(pkgPath, pkg);
  log(`✓  Updated  package.json  name: "${oldName}" → "${newName}"`);
}

function patchAppJson(name) {
  const appPath = path.join(ROOT, 'app.json');
  if (!fs.existsSync(appPath)) {
    bail('No app.json found. Are you in the template root directory?');
  }

  const app = readJson(appPath);

  if (app.name === name && app.displayName === name) {
    log(`✓  app.json already "${name}" — skipped`);
    return;
  }

  const oldName = app.name;
  const oldDisplayName = app.displayName;

  app.name = name;
  app.displayName = name;
  writeJson(appPath, app);
  log(
    `✓  Updated  app.json  name: "${oldName}" → "${name}", ` +
      `displayName: "${oldDisplayName}" → "${name}"`,
  );
}

/* ──────────────────────── main ──────────────────────── */

async function main() {
  console.log(HEADER);

  let { name } = parseArgs();
  if (!name) {
    name = await promptName();
  }
  validateName(name);

  console.log('');

  // Patch files
  patchPackageJson(name);
  patchAppJson(name);

  // Clean template .git folder
  cleanGit();

  console.log('');

  // Optionally install dependencies
  const shouldInstall = await promptYesNo('Install npm dependencies now?');
  if (shouldInstall) {
    log('Installing dependencies...');
    const { execSync } = require('child_process');
    execSync('npm install', { cwd: ROOT, stdio: 'inherit' });
    log('✓  npm install completed');
  } else {
    log('Skipped npm install. Run it later with:  npm install');
  }

  console.log('');
  log(`✨  Project "${name}" is ready!`);
  log('');
  log('  Next steps:');
  log('    cd ' + path.basename(ROOT));
  log('    npx react-native eject   # regenerate native platform folders');
  log('    npm run start:android    # or: npm run start:ios');
  log('');
  log('  📁  Source files are at  src/');
  log('  🔤  Language files are at  assets/language/');
  log('  🧹  Delete this script when done:  rm -rf __scripts__/use.js');
  log('');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
