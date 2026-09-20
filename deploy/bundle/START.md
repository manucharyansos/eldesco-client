# ELDESCO website - պատրաստի (build արված) տարբերակ

Սա պատրաստի կայք է. սերվերում **npm install և build պետք չեն**, պետք է միայն Node.js 18.17+ (խորհուրդ՝ 20)։
Կայքը կազմված է `https://eldesco.am` և `https://api.eldesco.am/api` հասցեներով (դրանք ներդրված են build-ի մեջ)։

## Տեղադրում (Ubuntu)

```bash
# 1) Node 20 + pm2 + nginx (մեկ անգամ)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2

# 2) Բացել արխիվը
sudo mkdir -p /var/www && cd /var/www
sudo tar -xzf ~/eldesco-web.tar.gz          # ստեղծում է /var/www/eldesco-web
sudo chown -R $USER: /var/www/eldesco-web
cd eldesco-web

# 3) Գործարկել
pm2 start ecosystem.config.js
pm2 save
pm2 startup                                  # տպված հրամանը կատարեք, որ սերվերի վերագործարկումից հետո կայքը բարձրանա

# 4) nginx + HTTPS
sudo cp nginx-site.conf /etc/nginx/sites-available/eldesco.am
sudo ln -s /etc/nginx/sites-available/eldesco.am /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d eldesco.am -d www.eldesco.am
```

Նախապես DNS-ում պետք են A record-ներ `eldesco.am`, `www.eldesco.am` -> սերվերի IP։

## Կարևոր

- Նախ պետք է աշխատի **API-ն** (`https://api.eldesco.am`)։ Մինչ այդ կայքը ցույց է տալիս կարճ «պահեստային» գլխավոր էջ, իսկ API-ի հայտնվելուց մոտ մեկ րոպե հետո ինքն է լցվում իրական բովանդակությամբ։
- Պորտը՝ 3000 (փոխելու համար `ecosystem.config.js`-ում `PORT` և nginx-ում `upstream`)։ `HOSTNAME`-ը պետք է մնա `localhost` (ոչ `127.0.0.1`)։
- Ադմինը՝ `https://eldesco.am/admin`։
- Թարմացում՝ նոր արխիվը բացել նույն պանակի վրա (նախորդ `eldesco-web`-ը փոխարինելով) և `pm2 reload eldesco-web`։
- Այլ դոմեյնի համար այս build-ը պիտանի չէ. պետք է նորից build անել (`npm run pack`, տես `DEPLOY.md`)։
