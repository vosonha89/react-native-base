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
NAMESPACE=""
for arg in "$@"; do
  case "$arg" in
    --name=*) NAME="${arg#--name=}" ;;
    --namespace=*) NAMESPACE="${arg#--namespace=}" ;;
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

  # Interactive prompt if no namespace provided
  # Use /dev/tty because stdin is the pipe (curl | bash), not the terminal
  KEBAB=$(pascal_to_kebab "$NAME")
  DEFAULT_NS="com.$(echo "$KEBAB" | tr -d '-')"
  if [ -z "$NAMESPACE" ]; then
    read -rp "  Android/iOS namespace (press Enter for default: $DEFAULT_NS): " NAMESPACE </dev/tty
    if [ -z "$NAMESPACE" ]; then
      NAMESPACE="$DEFAULT_NS"
    fi
  fi

  # Validate namespace format
  if [ -n "$NAMESPACE" ]; then
    if ! echo "$NAMESPACE" | grep -qE '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$'; then
      err "Invalid namespace \"$NAMESPACE\". Must be reverse-DNS, e.g. com.myapp or com.acme.myapp."
    fi
  fi

  echo ""

  # Clone template
  if [ -d "$KEBAB" ]; then
    err "Directory \"$KEBAB\" already exists. Remove it first or choose a different name."
  fi

  ok "Cloning template → ./$KEBAB/"
  git clone --depth 1 "https://github.com/vosonha89/react-native-base.git" "$KEBAB"

  echo ""

  # Run the inner rename script with --no-install so it never reads from stdin
  ok "Renaming project → $NAME"
  (cd "$KEBAB" && node __scripts__/use.js --name="$NAME" --namespace="$NAMESPACE" --no-install)

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
  echo "      npm run start:android    # or: npm run start:ios"
  echo ""
  echo "    📁  Source files are at  src/"
  echo "    🔤  Language files are at  assets/language/"
  echo ""
}

main "$@"