#!/usr/bin/env bash
# Build a ready-to-run bundle (no npm install / build needed on the server):
#   npm run pack        ->  dist/eldesco-web.tar.gz
# Domains are compiled in; override for another environment:
#   NEXT_PUBLIC_API_URL=https://api.example.com/api NEXT_PUBLIC_SITE_URL=https://example.com npm run pack
set -euo pipefail
cd "$(dirname "$0")/.."

export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://api.eldesco.am/api}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://eldesco.am}"

echo "==> Building for $NEXT_PUBLIC_SITE_URL (API: $NEXT_PUBLIC_API_URL)"
rm -rf .next dist
BUILD_STANDALONE=1 npx next build

OUT=dist/eldesco-web
mkdir -p "$OUT/.next"
cp -r .next/standalone/. "$OUT/"
cp -r .next/static "$OUT/.next/static"
cp -r public "$OUT/public"
cp deploy/bundle/* "$OUT/"

tar -czf dist/eldesco-web.tar.gz -C dist eldesco-web
echo "==> VPS bundle:   dist/eldesco-web.tar.gz ($(du -h dist/eldesco-web.tar.gz | cut -f1))"

# cPanel / shared hosting: site folder + tiny Node.js Selector entry point, as one zip
CP=dist/cpanel
mkdir -p "$CP/eldesco-app"
cp -r "$OUT" "$CP/eldesco-web"
cp deploy/cpanel/app.js "$CP/eldesco-app/app.js"
cp deploy/cpanel/README-CPANEL.md "$CP/README-CPANEL.md"
( cd "$CP" && python3 -m zipfile -c ../eldesco-cpanel.zip eldesco-web eldesco-app README-CPANEL.md )
echo "==> cPanel bundle: dist/eldesco-cpanel.zip ($(du -h dist/eldesco-cpanel.zip | cut -f1))"
