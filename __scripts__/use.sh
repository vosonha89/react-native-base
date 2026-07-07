#!/usr/bin/env bash
#
# use.sh — Scaffold a new project from the react-native-base template
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.sh | bash -s -- --name=masonvn.pricescout --displayName='Price Scout'
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
DISPLAY_NAME=""
NAMESPACE=""
for arg in "$@"; do
  case "$arg" in
    --name=*) NAME="${arg#--name=}" ;;
    --displayName=*) DISPLAY_NAME="${arg#--displayName=}" ;;
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
    read -rp "  Project name (e.g. masonvn.pricescout or MyApp): " NAME </dev/tty
  fi

  # Validate
  if [ -z "$NAME" ]; then
    err "Name is required. Use --name=masonvn.pricescout or enter it interactively."
  fi
  if ! echo "$NAME" | grep -qE '^[a-zA-Z][a-zA-Z0-9]*([._-][a-zA-Z0-9]+)*$'; then
    err "Invalid name \"$NAME\". Must be PascalCase (MyApp), kebab (my-app), or reverse-DNS (masonvn.pricescout)."
  fi

  # Derive default display name from the project name
  KEBAB=$(pascal_to_kebab "$NAME")
  DEFAULT_DISPLAY=$(echo "$NAME" | sed -E 's/[._-]/ /g; s/\b(\w)/\u\1/g')

  # Interactive prompt for display name
  if [ -z "$DISPLAY_NAME" ]; then
    read -rp "  Display name (press Enter for default: $DEFAULT_DISPLAY): " DISPLAY_NAME </dev/tty
    if [ -z "$DISPLAY_NAME" ]; then
      DISPLAY_NAME="$DEFAULT_DISPLAY"
    fi
  fi

  # Interactive prompt if no namespace provided
  DEFAULT_NS="com.$(echo "$NAME" | tr '[:upper:]' '[:lower:]')"
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
  PROJECT_DIR="$(echo "$KEBAB" | tr '.' '-')"
  if [ -d "$PROJECT_DIR" ]; then
    err "Directory \"$PROJECT_DIR\" already exists. Remove it first or choose a different name."
  fi

  ok "Cloning template → ./$PROJECT_DIR/"
  git clone --depth 1 "https://github.com/vosonha89/react-native-base.git" "$PROJECT_DIR"

  echo ""

  # Run the inner rename script with --no-install so it never reads from stdin
  ok "Renaming project → $DISPLAY_NAME"
  (cd "$PROJECT_DIR" && node __scripts__/use.js --name="$NAME" --displayName="$DISPLAY_NAME" --namespace="$NAMESPACE" --no-install)

  echo ""

  # Cleanup
  ok "Removing scaffolding scripts"
  rm -rf "$PROJECT_DIR/__scripts__/use.js" "$PROJECT_DIR/__scripts__/use.sh"

  echo ""
  echo -e "  ${GREEN}✨  Project \"$DISPLAY_NAME\" is ready!${NC}"
  echo ""
  echo "    Next steps:"
  echo "      cd $PROJECT_DIR"
  echo "      npm install"
  echo "      npx react-native eject"
  echo "      npm run start:android    # or: npm run start:ios"
  echo ""
  echo "    📁  Source files are at  src/"
  echo "    🔤  Language files are at  assets/language/"
  echo ""
}

main "$@"