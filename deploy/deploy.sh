#!/usr/bin/env bash
# Update a running server:  ./deploy/deploy.sh
# Requires: Node 18.17+ (20 recommended), pm2, and .env.production.local (see .env.production.example).
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.production.local ]; then
  echo "Missing .env.production.local - copy .env.production.example first." >&2
  exit 1
fi

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Installing dependencies"
npm ci

echo "==> Building (needs the API to be reachable)"
npm run build

echo "==> (Re)starting"
pm2 startOrReload deploy/ecosystem.config.js --update-env
pm2 save

echo "Done."
