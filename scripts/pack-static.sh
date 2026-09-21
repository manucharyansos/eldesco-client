#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://api.eldesco.am/api}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://eldesco.am}"

echo "==> Static production build for $NEXT_PUBLIC_SITE_URL"
echo "==> Verifying live CMS content"

node <<'NODE'
const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
const checks = [
  ['site?lang=hy', (data) => data && data.settings && Object.keys(data.settings).length > 0],
  ['pages/home?lang=hy', (data) => data && Array.isArray(data.sections) && data.sections.length > 0],
  ['pages/home?lang=en', (data) => data && Array.isArray(data.sections) && data.sections.length > 0],
  ['pages/home?lang=ru', (data) => data && Array.isArray(data.sections) && data.sections.length > 0],
  ['services?lang=hy', (data) => Array.isArray(data) && data.length > 0],
  ['projects?lang=hy', (data) => Array.isArray(data) && data.length > 0],
];

async function verify() {
  if (!base) throw new Error('NEXT_PUBLIC_API_URL is empty');

  for (const [path, isValid] of checks) {
    const url = base + '/' + path;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(url + ' returned HTTP ' + response.status);
    }

    const data = await response.json();
    if (!isValid(data)) {
      throw new Error(url + ' returned empty or invalid CMS data');
    }

    console.log('  OK ' + path);
  }
}

verify().catch((error) => {
  console.error('CMS preflight failed:', error.message);
  process.exit(1);
});
NODE

rm -rf .next out dist/static-build
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
