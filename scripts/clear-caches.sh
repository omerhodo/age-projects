set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DRY_RUN=false
FORCE=false
FULL=false

for arg in "$@"; do
  case "$arg" in
    --yes) FORCE=true ;;
    --full) FULL=true ;;
    --dry-run) DRY_RUN=true ;;
    *) ;;
  esac
done

delete_or_echo() {
  local path="$1"
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] rm -rf $path"
  else
    if [ -e "$path" ]; then
      echo "Removing: $path"
      rm -rf "$path"
    else
      echo "Not found: $path"
    fi
  fi
}

PATHS=(
  "$ROOT_DIR/.next"
  "$ROOT_DIR/out"
  "$ROOT_DIR/dist"
  "$ROOT_DIR/build"
  "$ROOT_DIR/.turbo"
  "$ROOT_DIR/android/.gradle"
  "$ROOT_DIR/android/build"
  "$ROOT_DIR/android/app/build"
  "$ROOT_DIR/ios/DerivedData"
  "$ROOT_DIR/ios/Pods"
  "$ROOT_DIR/node_modules/.cache"
  "$ROOT_DIR/.cache"
)

echo "Clearing repo caches (dry-run=$DRY_RUN, full=$FULL)"
for p in "${PATHS[@]}"; do
  delete_or_echo "$p"
done

if [ "$FULL" = true ]; then
  XCODE_DERIVED="$HOME/Library/Developer/Xcode/DerivedData"
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] rm -rf $XCODE_DERIVED"
  else
    if [ "$FORCE" = false ]; then
      read -p "Remove system Xcode DerivedData at $XCODE_DERIVED ? (y/N): " resp || true
      case "$resp" in
        [yY]|[yY][eE][sS]) rm -rf "$XCODE_DERIVED" ;;
        *) echo "Skipping user Xcode DerivedData" ;;
      esac
    else
      echo "Removing user Xcode DerivedData: $XCODE_DERIVED"
      rm -rf "$XCODE_DERIVED"
    fi
  fi
fi

echo "Done."
