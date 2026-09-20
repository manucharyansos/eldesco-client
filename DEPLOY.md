# ELDESCO website - server deployment (https://eldesco.am)

Layout: Ubuntu 22.04 / 24.04, nginx in front of `next start` (Node 20) managed by pm2.
**Deploy the API first** (`eldesco-api/DEPLOY.md`): the site fetches its content from https://api.eldesco.am
while it builds and while it runs.

## 1. Server packages

```bash
sudo apt update && sudo apt install -y nginx git
# Node 20 (NodeSource) + pm2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2. Code and build

```bash
sudo mkdir -p /var/www && sudo chown $USER: /var/www
cd /var/www
git clone https://github.com/manucharyansos/eldesco-client.git
cd eldesco-client

cp .env.production.example .env.production.local     # already contains the eldesco.am / api.eldesco.am values
npm ci
npm run build
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup           # run the command it prints, so the site restarts after a reboot
```

`NEXT_PUBLIC_*` values are compiled into the build. After changing `.env.production.local`, run `npm run build` again
and `pm2 reload eldesco-web`.

## 3. nginx + HTTPS

```bash
sudo cp deploy/nginx-site.conf /etc/nginx/sites-available/eldesco.am
sudo ln -s /etc/nginx/sites-available/eldesco.am /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# DNS first: A records for  eldesco.am  and  www.eldesco.am  ->  server IP
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d eldesco.am -d www.eldesco.am
```

## 4. Verify

- https://eldesco.am opens in Armenian, https://eldesco.am/en and /ru work
- https://eldesco.am/sitemap.xml lists the pages with `https://eldesco.am/...` addresses
- https://eldesco.am/admin - log in with the API admin account, change a text, save, reload the public page:
  the change is visible immediately (the admin panel purges the site cache on every save)

## 5. Updating later

```bash
cd /var/www/eldesco-client && ./deploy/deploy.sh
```

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Site shows only a short "fallback" home page | The API was unreachable. Check `curl https://api.eldesco.am/api/site?lang=hy`; the site recovers on its own within a minute once the API answers |
| Admin: "Network Error" / CORS | `CORS_ALLOWED_ORIGINS` in the API `.env` must contain `https://eldesco.am` (and `https://www.eldesco.am`), then `php artisan config:cache` |
| Admin login always fails | `NEXT_PUBLIC_API_URL` was wrong at build time - fix `.env.production.local` and rebuild |
| Uploaded images do not show | API side: `php artisan storage:link` and the nginx `/storage/` location (see API DEPLOY.md) |
| Edits in admin appear only after ~1 minute | `/api/revalidate` cannot reach the API: check `pm2 logs eldesco-web` |
| Build fails on `fetch` | The API must be reachable during `npm run build`; otherwise the build still succeeds but pages are generated with fallback content and refresh after a minute |

## Local development

```bash
git clone https://github.com/manucharyansos/eldesco-api.git      # next to this repo
(cd eldesco-api && composer install && composer setup)             # once
git clone https://github.com/manucharyansos/eldesco-client.git
cd eldesco-client
npm install
npm run dev:all       # API on :8000 + website on :3000  (or: npm run dev, if the API runs elsewhere)
```

Open http://localhost:3000 (site) and http://localhost:3000/admin (admin panel).
