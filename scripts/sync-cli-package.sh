#!/bin/bash
# Sync shared source files to cli-package for npm publishing
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Syncing shared files to cli-package..."

# Copy shared source
mkdir -p "$ROOT_DIR/cli-package/src/shared/data"
cp "$ROOT_DIR/src/shared/types.ts" "$ROOT_DIR/cli-package/src/shared/"
cp "$ROOT_DIR/src/shared/decoder.ts" "$ROOT_DIR/cli-package/src/shared/"
cp "$ROOT_DIR/src/shared/encoder.ts" "$ROOT_DIR/cli-package/src/shared/"
cp "$ROOT_DIR/src/shared/truncate.ts" "$ROOT_DIR/cli-package/src/shared/"
cp "$ROOT_DIR/src/shared/data/acronyms.json" "$ROOT_DIR/cli-package/src/shared/data/"

# Copy license and README
cp "$ROOT_DIR/LICENSE" "$ROOT_DIR/cli-package/"
cp "$ROOT_DIR/README.md" "$ROOT_DIR/cli-package/"

echo "Sync complete. Run 'cd cli-package && npx tsc' to build."
