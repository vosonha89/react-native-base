# 🚀 Use this template

Scaffold a new React Native project from this template. No manual renaming needed.

The `--name` flag accepts **three formats**:
- **PascalCase** — `MyApp` (legacy)
- **kebab-case** — `my-app`
- **reverse-DNS** — `reactnative.myapp` (recommended)

The `--displayName` flag (optional) sets the user-facing app name shown in the launcher.

---

## macOS / Linux (bash)

```bash
curl -fsSL https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.sh | bash
```

The script will interactively ask for:
1. **Project name** — e.g. `reactnative.myapp` or `MyApp`
2. **Display name** — the user-facing app name (press Enter to accept the derived default)
3. **Android/iOS namespace** — press Enter for the auto-derived default (`com.<name>`)

Or pass everything on one line:

```bash
# Minimal (display name and namespace prompted)
curl -fsSL https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.sh | bash -s -- --name=reactnative.myapp

# Full non-interactive
curl -fsSL https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.sh | bash -s -- --name=reactnative.myapp --displayName='My App' --namespace=com.reactnative.myapp
```

## Windows (PowerShell)

```powershell
# Interactive (prompts for name)
irm https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.ps1 | iex

# Non-interactive
irm https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.ps1 -OutFile install.ps1; .\install.ps1 -Name "reactnative.myapp" -DisplayName "My App" -Namespace "com.reactnative.myapp"
```

---

## Alternative — manual with `degit`

> Use this if you prefer to clone the template yourself and run the rename step separately.

```bash
# Latest template (with display name and namespace)
npx degit --force vosonha89/react-native-base my-app && cd my-app && node __scripts__/use.js --name=reactnative.myapp --displayName='My App' --namespace=com.reactnative.myapp

# Pinned to a specific version (interactive prompts fill in the rest)
npx degit --force vosonha89/react-native-base#v0.0.1 my-app && cd my-app && node __scripts__/use.js --name=reactnative.myapp
```

> **Notes:**
>
> - The `#v0.0.1` form requires a [tagged release](https://github.com/vosonha89/react-native-base/tags) on the repository. Omit it to always pull the latest from the default branch.
> - The `--force` flag prevents deeply nested folders if you re-run the command.
> - Always run from an **empty parent directory** (e.g. `~/Projects/`), not from inside an existing project folder.
> - If `--namespace` is omitted, the script will prompt you interactively; pressing Enter accepts the default (`com.<name>`).
> - If `--displayName` is omitted, you'll be prompted with a humanised default derived from `--name`.

---

## What happens

1. The template is cloned via `git clone --depth 1` (carries the template `.git` folder)
2. The `use.js` script prompts for your **project name**, **display name**, and optionally an **Android/iOS namespace**
3. Placeholders are replaced in `package.json`, `app.json`, and `.env`
4. The **display name** is the user-facing label shown in the launcher (set only in `app.json` and `.env` `APP_TITLE`)
5. The **name** is used for `package.json` (npm package name) and as the JS module name in `app.json`
6. The namespace (e.g. `com.reactnative.myapp`) is written to `app.json` as `androidNamespace`
7. The template `.git` folder is removed so the new project starts with a clean history
8. Scaffolding scripts are automatically cleaned up

---

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fvosonha89%2Freact-native-base.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fvosonha89%2Freact-native-base?ref=badge_shield)

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm install
npm run regenerate-platform
npm start

# OR using Yarn
yarn install
yarn run regenerate-platform
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fvosonha89%2Freact-native-base.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fvosonha89%2Freact-native-base?ref=badge_large)
