# ELDESCO website - cPanel տեղադրում (Node.js հավելված)

Արխիվը պարունակում է երկու պանակ՝
- `eldesco-web`  - պատրաստի (build արված) կայքը
- `eldesco-app`  - մեկ փոքր `app.js` ֆայլ, որով cPanel-ը գործարկում է կայքը

## Քայլեր

1. **Բեռնել և բացել.** File Manager-ում բացեք **տնային պանակը** (`/home/<օգտանուն>`, ոչ թե `public_html`),
   «Загрузить» -> `eldesco-cpanel.zip`, հետո «Извлечь» (Extract)։ Կստեղծվեն `eldesco-web` և `eldesco-app`։
2. **Մաքրել `public_html`-ը.** Ջնջեք այնտեղից նախկինում դրված `.next`, `node_modules`, `public`, `server.js`,
   `package.json`, `eldesco-web` և այլն (դրանք այնտեղ պետք չեն, և դրանց պատճառով է 404-ը)։
3. **cPanel -> «Setup Node.js App» (Настройка приложения Node.js) -> Create Application.**
   - Node.js version: **20** (նվազագույնը 18.17)
   - Application mode: **Production**
   - Application root: **eldesco-app**
   - Application URL: **eldesco.am**
   - Application startup file: **app.js**
   - Create (**«Run NPM Install» պետք չէ**)
4. Բացեք https://eldesco.am - պետք է անցնի `/hy`-ին։

## Կարևոր

- Կայքի բովանդակությունը գալիս է `https://api.eldesco.am`-ից։ Մինչ API-ն չի աշխատում, կայքը ցույց է տալիս կարճ
  «պահեստային» գլխավոր էջ. API-ն բարձրանալուց մոտ մեկ րոպե հետո ինքն է լցվում։
- Թարմացնելիս՝ նոր zip-ի `eldesco-web` պանակով փոխարինեք հինը և Node.js App էջում սեղմեք **Restart**։
- Եթե cPanel-ում «Setup Node.js App» չկա, հոսթինգը Node.js չի աջակցում. դիմեք հոսթինգ-տրամադրողին կամ օգտագործեք VPS։
- Եթե կայքը 503/508 է տալիս, հոսթինգի ռեսուրսների (RAM) սահմանաչափն է քիչ. գրեք տրամադրողին։
