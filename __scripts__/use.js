/**
 * use — Scaffold a new project from the react-native-base template.
 *
 * Usage (single command):
 *   npx degit --force vosonha89/react-native-base my-app && cd my-app && node __scripts__/use.js --name=masonvn.pricescout --displayName='Price Scout'
 *
 * The `--name` argument accepts:
 *   - PascalCase:  MyApp
 *   - kebab-case:  my-app
 *   - reverse-DNS: masonvn.pricescout  (recommended)
 *
 * The `--displayName` argument is optional. If omitted you will be prompted.
 *
 * This script:
 *   - Replaces placeholder project names (react-native-base / ReactNativeBase)
 *     with the user's project details in package.json, app.json and .env.
 *   - Derives the Android/iOS namespace as `com.<name>` (e.g. com.masonvn.pricescout).
 *   - Prompts for a custom namespace override.
 *   - Prompts for a display name (the user-facing app name shown in the launcher).
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
 *   No-op for lower-case / reverse-DNS input.
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
  let displayName = null;
  let namespace = null;
  let noInstall = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) {
      name = args[i + 1];
      i++;
      continue;
    }
    if (args[i].startsWith('--name=')) {
      name = args[i].slice('--name='.length);
      continue;
    }
    if (args[i] === '--displayName' && args[i + 1]) {
      displayName = args[i + 1];
      i++;
      continue;
    }
    if (args[i].startsWith('--displayName=')) {
      displayName = args[i].slice('--displayName='.length);
      continue;
    }
    if (args[i] === '--namespace' && args[i + 1]) {
      namespace = args[i + 1];
      i++;
      continue;
    }
    if (args[i].startsWith('--namespace=')) {
      namespace = args[i].slice('--namespace='.length);
      continue;
    }
    if (args[i] === '--no-install') {
      noInstall = true;
    }
  }
  return { name, displayName, namespace, noInstall };
}

function promptName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question('  Project name (e.g. masonvn.pricescout or MyApp): ', answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Accepts PascalCase, kebab-case, and reverse-DNS names.
 *   MyApp, my-app, masonvn.pricescout, com.myapp, etc.
 */
const NAME_RE = /^[a-zA-Z][a-zA-Z0-9]*([._-][a-zA-Z0-9]+)*$/;

function validateName(name) {
  if (!name)
    bail('Name is required. Use --name=masonvn.pricescout or enter it interactively.');
  if (!NAME_RE.test(name)) {
    bail(
      `Invalid name "${name}". Must be PascalCase (MyApp), kebab (my-app), or reverse-DNS (masonvn.pricescout).`,
    );
  }
}

/* ──────────────────── namespace ──────────────────── */

/**
 * Returns the default Android/iOS namespace for a given name.
 *   "masonvn.pricescout" → "com.masonvn.pricescout"
 *   "MyApp"              → "com.myapp"
 *   "my-app"             → "com.my-app"
 *   "com.myapp"          → "com.myapp"  (no double-prefix)
 */
function defaultNamespace(name) {
  const lower = name.toLowerCase();
  return lower.startsWith('com.') ? lower : 'com.' + lower;
}

/**
 * Reverse-DNS pattern: at least two segments, each starting with a lowercase
 * letter, followed by lowercase letters / digits / underscores.
 */
const NAMESPACE_RE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

function validateNamespace(ns) {
  if (!ns) return;
  if (!NAMESPACE_RE.test(ns)) {
    bail(
      `Invalid namespace "${ns}". Must be reverse-DNS, e.g. com.myapp or com.acme.myapp`,
    );
  }
}

function promptNamespace() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(
      '  Android/iOS namespace (press Enter for default: com.<name>): ',
      answer => {
        rl.close();
        resolve(answer.trim());
      },
    );
  });
}

/* ──────────────────── display name ──────────────────── */

/**
 * Derives a JS-safe module name (PascalCase, no dots/dashes).
 *   "masonvn.pricescout" → "MasonvnPricescout"
 *   "my-app"             → "MyApp"
 *   "MyApp"              → "MyApp"
 */
function deriveModuleName(name) {
  return name
    .split(/[._-]/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/**
 * Humanises a name for use as a default display name.
 *   "MyApp"              → "MyApp"
 *   "masonvn.pricescout" → "Masonvn Pricescout"
 *   "my-app"             → "My App"
 */
function defaultDisplayName(name) {
  if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return name; // already PascalCase — use as-is
  }
  return name
    .split(/[._-]/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function validateDisplayName(displayName) {
  if (!displayName) {
    bail('Display name is required.');
  }
  if (displayName.length > 100) {
    bail('Display name must be 100 characters or fewer.');
  }
}

function promptDisplayName(defaultDn) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(
      `  Display name (press Enter for default: ${defaultDn}): `,
      answer => {
        rl.close();
        resolve(answer.trim() || defaultDn);
      },
    );
  });
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

function patchAppJson(name, displayName, namespace) {
  const appPath = path.join(ROOT, 'app.json');
  if (!fs.existsSync(appPath)) {
    bail('No app.json found. Are you in the template root directory?');
  }

  const app = readJson(appPath);
  const oldName = app.name;
  const moduleName = deriveModuleName(name);

  if (app.name !== moduleName) {
    app.name = moduleName;
  }
  if (app.displayName !== displayName) {
    app.displayName = displayName;
  }
  if (app.androidNamespace !== namespace) {
    app.androidNamespace = namespace;
  }

  writeJson(appPath, app);
  log(`✓  Updated  app.json  name: "${oldName}" → "${moduleName}"`);
  log(`✓  Updated  app.json  displayName: "${displayName}"`);
  log(`✓  Updated  app.json  androidNamespace: "${namespace}"`);
}

/**
 * Patches .env so that APP_TITLE matches the display name.
 * Adds the field if it does not exist yet.
 */
function patchEnv(displayName) {
  const envPath = path.join(ROOT, '.env');
  let content;
  let changed = false;

  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf-8');
  } else {
    content = '';
  }

  const lineRe = /^(APP_TITLE=).*/;
  if (lineRe.test(content)) {
    content = content.replace(lineRe, `$1"${displayName}"`);
    changed = true;
  } else {
    content += `\nAPP_TITLE="${displayName}"\n`;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(envPath, content, 'utf-8');
    log(`✓  Updated  .env  APP_TITLE → "${displayName}"`);
  }
}

/* ──────────────────────── main ──────────────────────── */

async function main() {
  console.log(HEADER);

  let { name, displayName, namespace, noInstall } = parseArgs();

  // ── Name ──
  if (!name) {
    name = await promptName();
  }
  validateName(name);

  // ── Display name ──
  const derivedDn = defaultDisplayName(name);
  if (!displayName) {
    displayName = await promptDisplayName(derivedDn);
  }
  validateDisplayName(displayName);

  // ── Namespace ──
  if (!namespace) {
    const defaultNs = defaultNamespace(name);
    const input = await promptNamespace();
    namespace = input || defaultNs;
  }
  validateNamespace(namespace);

  console.log('');

  // Patch files
  patchPackageJson(name);
  patchAppJson(name, displayName, namespace);
  patchEnv(displayName);

  // Clean template .git folder
  cleanGit();

  console.log('');

  // Optionally install dependencies
  const shouldInstall =
    noInstall === false ? await promptYesNo('Install npm dependencies now?') : false;
  if (shouldInstall) {
    log('Installing dependencies...');
    const { execSync } = require('child_process');
    execSync('npm install', { cwd: ROOT, stdio: 'inherit' });
    log('✓  npm install completed');
  } else {
    log('Skipped npm install. Run it later with:  npm install');
  }

  console.log('');
  log(`✨  Project "${displayName}" is ready!`);
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