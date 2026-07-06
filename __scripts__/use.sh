#!/usr/bin/env bash
#
# use.sh — Scaffold a new project from the react-native-base template
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.sh | bash -s -- --name=MyApp
#
set -euo pipefail

# ──────────────────────── helpers ────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log()   { echo -e "  ${1}${2}${NC}"; }
ok()    { log "${GREEN}✓${NC} " "${1}"; }
err()   { log "${RED}✖${NC} " "${1}"; exit 1; }
header(){ echo -e "\n  ${CYAN}🏗  use  🏗${NC}"; echo "  Scaffold a new project from react-native-base"; echo ""; }

# PascalCase → kebab-case
pascal_to_kebab() {
  echo "$1" \
    | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g; s/([A-Z])([A-Z][a-z])/\1-\2/g' \
    | tr '[:upper:]' '[:lower:]'
}

# ──────────────────── argument parsing ────────────────────

NAME=""
for arg in "$@"; do
  case "$arg" in
    --name=*) NAME="${arg#--name=}" ;;
    *) ;;
  esac
done

# ──────────────────────── main ────────────────────────

main() {
  header

  # Interactive prompt if no name provided
  # Use /dev/tty because stdin is the pipe (curl | bash), not the terminal
  if [ -z "$NAME" ]; then
    read -rp "  Project name (PascalCase, e.g. MyApp): " NAME </dev/tty
  fi

  # Validate
  if [ -z "$NAME" ]; then
    err "Name is required. Use --name=MyApp or enter it interactively."
  fi
  if ! echo "$NAME" | grep -qE '^[A-Z][a-zA-Z0-9]*$'; then
    err "Invalid name \"$NAME\". Must be PascalCase, e.g. MyApp, AwesomeProject."
  fi

  KEBAB=$(pascal_to_kebab "$NAME")

  echo ""

  # Clone template
  if [ -d "$KEBAB" ]; then
    err "Directory \"$KEBAB\" already exists. Remove it first or choose a different name."
  fi

  ok "Cloning template → ./$KEBAB/"
  git clone --depth 1 "https://github.com/vosonha89/react-native-base.git" "$KEBAB"

  echo ""

  # Run the inner rename script — pipe "n" to skip the install prompt
  ok "Renaming project → $NAME"
  (cd "$KEBAB" && node __scripts__/use.js --name="$NAME" <<< "n")

  echo ""

  # Cleanup
  ok "Removing scaffolding scripts"
  rm -rf "$KEBAB/__scripts__/use.js" "$KEBAB/__scripts__/use.sh"

  echo ""
  echo -e "  ${GREEN}✨  Project \"$NAME\" is ready!${NC}"
  echo ""
  echo "    Next steps:"
  echo "      cd $KEBAB"
  echo "      npm install"
  echo "      npx react-native eject"
  echo "      npm run android          # or: npm run ios"
  echo ""
  echo "    📁  Source files are at  src/"
  echo "    🔤  Language files are at  assets/language/"
  echo ""
}

main "$@"