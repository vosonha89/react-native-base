const fs = require('fs');
const path = require('path');
const readline = require('readline');

/* ──────────────────────── helpers ──────────────────────── */

const ROOT = path.resolve(__dirname, '..');
const VIEWS_DIR = path.join(ROOT, 'src', 'views');
const ROUTERS_PATH = path.join(ROOT, 'AppRouters.tsx');
const NAV_PATH = path.join(
  ROOT,
  'src',
  'common',
  'components',
  'NavigationContainerComponents.tsx',
);

const HEADER = `
  📐  view:gen  📐
`;

function pascalToLower(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function bail(msg) {
  console.error('  ✖  ' + msg);
  process.exit(1);
}

function log(msg) {
  console.log('  ' + msg);
}

/* ──────────────────── template builders ──────────────────── */

function tplView(name) {
  return `import React, { Fragment } from 'react';
import { ScrollView, Text } from 'react-native';
import ${name}Hook from './${name}.hook';
import ${name}Style from './${name}.style';

function ${name}(): React.JSX.Element {
    const elHook = ${name}Hook();
    if (elHook.componentState.isReady) {
        return (
            <Fragment>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={${name}Style.default}>${name}</Text>
                </ScrollView>
            </Fragment>
        );
    } else {
        return <Fragment></Fragment>;
    }
}

export default ${name};
`;
}

function tplHook(name) {
  const stateName = `${name}State`;
  return `import { useEffect, useState } from 'react';
import { ${stateName} } from './${name}.state';

function ${name}Hook() {
    const [componentState, setComponentState] = useState(new ${stateName}());

    async function loadPage(): Promise<void> {
        const pageState: ${stateName} = componentState.copy();
        await pageState.init();
        setComponentState(pageState);
    }

    useEffect(() => {
        loadPage();
    }, []);

    return {
        componentState
    };
}

export default ${name}Hook;
`;
}

function tplState(name) {
  const modelName = `${name}Model`;
  const stateName = `${name}State`;
  return `import 'reflect-metadata';
import { ComponentState } from '../../common/types/componentState';

export class ${modelName} {
    public isValid(): boolean {
        return true;
    }
}

export class ${stateName} extends ComponentState {
    public model = new ${modelName}();
    public modelPropName = 'model';

    public async init(): Promise<void> {
        const me = this;
        me.model = new ${modelName}();
        me.isReady = true;
    }
}
`;
}

function tplStyle(name) {
  return `import { StyleSheet } from 'react-native';
import { ThemeStyle } from '../../common/constants/ThemeStyle';

const themeStyle = ThemeStyle();
const extendStyle = StyleSheet.create({
    default: {
        // extend here, e.g. padding, margin, alignment
    },
});

const ${name}Style = {
    default: StyleSheet.compose(themeStyle.defaultSystem, extendStyle.default)
};

export default ${name}Style;
`;
}

/* ────────────────────── file actions ────────────────────── */

function createViewFiles(name) {
  const lower = pascalToLower(name);
  const dir = path.join(VIEWS_DIR, lower);

  if (fs.existsSync(dir)) {
    bail(`Folder already exists: src/views/${lower}/`);
  }

  fs.mkdirSync(dir, { recursive: true });

  const files = {
    [`${name}.tsx`]: tplView(name),
    [`${name}.hook.tsx`]: tplHook(name),
    [`${name}.state.ts`]: tplState(name),
    [`${name}.style.tsx`]: tplStyle(name),
  };

  for (const [filename, content] of Object.entries(files)) {
    const fp = path.join(dir, filename);
    fs.writeFileSync(fp, content, 'utf-8');
    log('✓  Created  ' + path.relative(ROOT, fp));
  }
}

/* ─────────────────────── patch routers ─────────────────────── */

function patchRouters(name) {
  let routers = fs.readFileSync(ROUTERS_PATH, 'utf-8');

  if (routers.includes(`'${name}';`)) {
    bail(`${name} already exists in AppRouters.tsx`);
  }

  // 1. Add to AppSreenStackParamList
  routers = routers.replace(
    /(export type AppSreenStackParamList = \{)([\s\S]*?)(\};)/,
    (match, open, body, close) => {
      const lines = body.trimEnd().split('\n');
      lines.push(`    ${name}: AppScreenProps;`);
      return open + '\n' + lines.join('\n') + '\n' + close;
    },
  );

  // 2. Add to AppRouteParamList
  routers = routers.replace(
    /(export type AppRouteParamList = \{)([\s\S]*?)(\};)/,
    (match, open, body, close) => {
      const lines = body.trimEnd().split('\n');
      lines.push(`    ${name}: '${name}';`);
      return open + '\n' + lines.join('\n') + '\n' + close;
    },
  );

  fs.writeFileSync(ROUTERS_PATH, routers, 'utf-8');
  log('✓  Patched  AppRouters.tsx');
}

function patchNavigation(name) {
  let nav = fs.readFileSync(NAV_PATH, 'utf-8');

  if (nav.includes(`name="${name}"`)) {
    bail(`${name} already exists in NavigationContainerComponents.tsx`);
  }

  // 1. Add import (after the last import line)
  const importLine = `import ${name} from '../../views/${pascalToLower(name)}/${name}';`;
  const importMatches = nav.matchAll(/^(import .+? from ['"].+?['"];)\s*$/gm);
  let lastImportMatch = null;
  for (const m of importMatches) {
    lastImportMatch = m;
  }
  if (lastImportMatch) {
    const idx = lastImportMatch.index + lastImportMatch[0].length;
    nav = nav.slice(0, idx) + '\n' + importLine + nav.slice(idx);
  }

  // 2. Add <AppRouterStack.Screen> before </AppRouterStack.Navigator>
  nav = nav.replace(
    /(<AppRouterStack\.Navigator[\s\S]*?>)([\s\S]*?)(<\/AppRouterStack\.Navigator>)/,
    (match, open, body, close) => {
      const trimmed = body.trimEnd();
      return (
        open +
        '\n' +
        trimmed +
        `\n                <AppRouterStack.Screen name="${name}" component={${name}} initialParams={{ needLogin: false }} />` +
        '\n            ' +
        close
      );
    },
  );

  fs.writeFileSync(NAV_PATH, nav, 'utf-8');
  log('✓  Patched  NavigationContainerComponents.tsx');
}

/* ──────────────────────── CLI / prompt ──────────────────────── */

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
    rl.question('  View name (PascalCase, e.g. Profile): ', answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function validateName(name) {
  if (!name)
    bail('Name is required. Use --name=Profile or enter it interactively.');
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    bail(
      `Invalid name "${name}". Must be PascalCase, e.g. Profile, UserSettings`,
    );
  }
}

/* ───────────────────────── main ───────────────────────── */

async function main() {
  console.log(HEADER);

  let { name } = parseArgs();
  if (!name) {
    name = await promptName();
  }
  validateName(name);

  console.log('');

  // Create view files (fails if folder exists)
  createViewFiles(name);

  console.log('');

  // Patch routers
  patchRouters(name);
  patchNavigation(name);

  console.log('');
  log(`✨  View "${name}" ready at src/views/${pascalToLower(name)}/`);
  log('🔥  Remember to update the generated files with your actual logic.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
