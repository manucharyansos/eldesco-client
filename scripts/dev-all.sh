#!/usr/bin/env bash
# Start the API and the website together for local work:  npm run dev:all
# Expects the API repository next to this one (../eldesco-api) or set API_DIR=/path/to/eldesco-api.
set -uo pipefail
cd "$(dirname "$0")/.."

API_DIR="${API_DIR:-../eldesco-api}"

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example"
fi

API_PID=""
if [ -f "$API_DIR/artisan" ]; then
  if [ ! -d "$API_DIR/vendor" ]; then
    echo "The API has no vendor/ folder yet. Run once:  (cd $API_DIR && composer install && composer setup)" >&2
    exit 1
  fi
  if [ ! -f "$API_DIR/.env" ]; then
    echo "The API is not set up yet. Run once:  (cd $API_DIR && composer setup)" >&2
    exit 1
  fi
  (cd "$API_DIR" && php artisan serve --host=127.0.0.1 --port=8000) &
  API_PID=$!
  trap '[ -n "$API_PID" ] && kill "$API_PID" 2>/dev/null' EXIT INT TERM
else
  echo "API folder not found at $API_DIR - starting only the website (it shows built-in fallback content)." >&2
fi

npx next dev -p 3000
