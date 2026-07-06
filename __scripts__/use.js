/**
 * use — Scaffold a new project from the react-native-base template.
 *
 * Usage:
 *   npx degit vosonha89/react-native-base my-app
 *   cd my-app && node __scripts__/use.js --name=MyApp
 *
 * This script:
 *   - Replaces placeholder project names (react-native-base / ReactNativeBase)
 *     with the user's project name in package.json and app.json.
 *   - Optionally installs npm dependencies.
 *   - Is safe to delete after first use.
 */
/* eslint-env node */
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

/* ──────────────────── patching ──────────────────── */

function patchPackageJson(name) {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = readJson(pkgPath);

  const oldName = pkg.name;
  const newName = pascalToKebab(name);

  if (oldName !== 'react-native-base') {
    bail(
      `package.json "name" is "${oldName}", expected "react-native-base". ` +
        'This script should only run at the root of a freshly-cloned react-native-base template.',
    );
  }

  pkg.name = newName;
  writeJson(pkgPath, pkg);
  log(`✓  Updated  package.json  name: "${oldName}" → "${newName}"`);
}

function patchAppJson(name) {
  const appPath = path.join(ROOT, 'app.json');
  const app = readJson(appPath);

  const oldName = app.name;
  const oldDisplayName = app.displayName;

  if (oldName !== 'ReactNativeBase' || oldDisplayName !== 'ReactNativeBase') {
    bail(
      `app.json expected both "name" and "displayName" to be "ReactNativeBase", ` +
        `got "name": "${oldName}", "displayName": "${oldDisplayName}". ` +
        'This script should only run at the root of a freshly-cloned react-native-base template.',
    );
  }

  app.name = name;
  app.displayName = name;
  writeJson(appPath, app);
  log(
    `✓  Updated  app.json  name: "${oldName}" → "${name}", ` +
      `displayName: "${oldDisplayName}" → "${name}"`,
  );
}

/* ──────────────────── safety checks ──────────────────── */

/**
 * Check if we're inside a nested directory of another npm project.
 * This catches the case where someone ran degit inside an existing
 * project folder, causing deeply nested directories.
 */
function detectNestedProject() {
  const parentPkg = path.resolve(ROOT, '..', 'package.json');
  if (fs.existsSync(parentPkg)) {
    const parent = readJson(parentPkg);
    if (parent.name) {
      console.error(
        `  ⚠  Warning: you're inside "${parent.name}" (found ../package.json).\n` +
          '     Did you run degit from inside an existing project folder?\n' +
          '     Run "rm -rf ' +
          path.basename(ROOT) +
          '" and re-run from an empty parent directory.\n',
      );
      return new Promise(resolve => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question('  Continue anyway? (y/N) ', answer => {
          rl.close();
          const trimmed = answer.trim().toLowerCase();
          resolve(trimmed === 'y' || trimmed === 'yes');
        });
      });
    }
  }
  return Promise.resolve(true);
}

/* ───────────────────────── main ───────────────────────── */

async function main() {
  console.log(HEADER);

  // Safety: confirm destination is a fresh template
  const pkgPath = path.join(ROOT, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    bail('No package.json found. Are you in the template root directory?');
  }

  const ok = await detectNestedProject();
  if (!ok) {
    log('Cancelled.');
    process.exit(0);
  }

  let { name } = parseArgs();
  if (!name) {
    name = await promptName();
  }
  validateName(name);

  console.log('');

  // Patch files
  patchPackageJson(name);
  patchAppJson(name);

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
  log('    npm run android          # or: npm run ios');
  log('');
  log('  📁  Source files are at  src/');
  log('  🔤  Language files are at  assets/language/');
  log('  🧹  Delete this script when done:  rm __scripts__/use.js');
  log('');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
