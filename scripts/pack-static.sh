#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://api.eldesco.am/api}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://eldesco.am}"

echo "==> Static production build for $NEXT_PUBLIC_SITE_URL"
rm -rf out dist/static-build
mkdir -p dist

restore() {
  [ -f .static-middleware-disabled ] && mv .static-middleware-disabled middleware.ts || true
  [ -d .static-api-disabled ] && mv .static-api-disabled app/api || true
}
trap restore EXIT

[ -f middleware.ts ] && mv middleware.ts .static-middleware-disabled
[ -d app/api ] && mv app/api .static-api-disabled

BUILD_STATIC=1 npx next build

python3 - <<'PY'
import os, zipfile
src='out'
dst='dist/eldesco-frontend-dist.zip'
with zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk(src):
        for name in files:
            p=os.path.join(root,name)
            z.write(p, os.path.relpath(p,src))
print(dst)
PY

echo "==> Ready: dist/eldesco-frontend-dist.zip"
