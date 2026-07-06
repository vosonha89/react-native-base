# Agent Coding Rules — react-native-base

Rules for any AI coding agent (Cline, Cursor, Claude Code, Aider, etc.) working in this repo. Follow them strictly. When in doubt, mirror the existing `src/views/home/Home.*` files — they are the canonical style reference.

## Core principles

- Strict OOP TypeScript
- Explicit access modifiers on every class member
- Concise JSDoc on all non-private members
- No `any` — use `AnyType` from `one-frontend-framework`

---

## 1. Access modifiers (required)

Every class member (property, method) in a `.ts` / `.tsx` file MUST declare an explicit access modifier.

| Element                     | Rule                                  |
| --------------------------- | ------------------------------------- |
| Class property / method     | `public` / `protected` / `private`    |
| Standalone function         | `export function`                     |
| Standalone type / interface | `export` always                       |
| Config object literal       | `export const Foo = { ... } as const` |

❌ **Bad**

```ts
function Home() { ... }
const styles = { color: 'red' };
class Foo { bar = 1; }
```

✅ **Good**

```ts
export function Home(): React.JSX.Element { ... }
export const ThemeConfig = { dark: '#000' } as const;

export class Foo {
    public bar: number = 1;
    protected doSomething(): void { ... }
}
```

---

## 2. Imports — no short aliases

Always use the full, exact exported name. No `as`, no renaming for brevity.

❌ **Bad**

```ts
import Home from './Home';
import { ComponentState as CS } from '../../common/types/componentState';
import * as Nav from '@react-navigation/native';
```

✅ **Good**

```ts
import Home from './Home';
import { ComponentState } from '../../common/types/componentState';
import * as Navigation from '@react-navigation/native';
```

**Exceptions:**

- `React` stays as `React` (universal convention)
- Namespace imports keep the source's namespace name as-is

---

## 3. JSDoc (concise, but required)

- **`public` / `protected`** members → JSDoc **required**
- **`private`** members → JSDoc **strongly encouraged**
- **Summary**: always one line
- **`@param` / `@returns`**: include when the parameter name + TypeScript type does not already convey the semantics
- **Never use inline `@type {string}`** — TypeScript handles types
- **No restating the obvious** — JSDoc is for _intent_, not signatures

✅ **Good**

```ts
/**
 * Authenticates user and caches the token.
 * @param credentials — user-provided email/password
 * @returns the issued token, or null on failure
 */
public async login(credentials: LoginPayload): Promise<string | null> { ... }

/** Clears in-memory cache. */
private clearCache(): void { ... }
```

❌ **Bad**

```ts
/**
 * This method is responsible for logging in the user. It takes a
 * credentials object as a parameter and returns a Promise...
 * @param credentials {LoginPayload} the credentials
 * @returns {Promise<string | null>} the token
 */
```

---

## 4. Other project conventions (locked-in)

| Convention              | Standard                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| View folder structure   | `src/views/{name}/` → `{Name}.tsx`, `{Name}.hook.tsx`, `{Name}.state.ts`, `{Name}.style.tsx` |
| Scaffolding             | Use `npm run view:gen -- --name=Profile` (or `npm run view:gen` for interactive prompt)      |
| State lifecycle         | `ComponentState.copy()` + `init()`                                                           |
| Styling                 | `ThemeStyle.compose(themeStyle.defaultSystem, customStyle)`                                  |
| File / component names  | PascalCase (`ProfileScreen`)                                                                 |
| Variables / functions   | camelCase (`loadData`)                                                                       |
| Formatting              | Run `npm run format:write` after generating or editing files                                 |
| Primary style reference | `src/views/home/Home.*`                                                                      |

---

## 5. Forbidden

| ❌                                                      | Reason                             | ✅ Alternative                                                                                                                                     |
| ------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `any`                                                   | Loses all type safety              | `AnyType` from `one-frontend-framework` — `import { AnyType } from 'one-frontend-framework';`. Usage: `public handle(data: AnyType): void { ... }` |
| `function`-keyword functions with implicit-`any` params | Types must be explicit             | Always type parameters explicitly                                                                                                                  |
| Default exports for utilities                           | Hurts tree-shaking and consistency | Use named exports; React components are the **only** allowed default-export                                                                        |
| Inline styles                                           | Breaks theming consistency         | Always go through `ThemeStyle`                                                                                                                     |
| Modifying files outside the scope of the requested task | Unpredictable side effects         | If a related file needs changes, ask first                                                                                                         |

---

## 6. When unsure

1. Read `src/views/home/Home.*` — they are the canonical style reference
2. Read `src/common/types/componentState.ts` — the state pattern
3. Check if a script already exists in `__scripts__/` before writing a custom one
4. Ask before refactoring existing files not in scope
