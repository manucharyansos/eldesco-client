// pm2 process definition:  pm2 start deploy/ecosystem.config.js
const path = require('path');

module.exports = {
  apps: [
    {
      name: 'eldesco-web',
      cwd: path.join(__dirname, '..'),
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: { NODE_ENV: 'production' },
      max_memory_restart: '700M',
      autorestart: true,
    },
  ],
};
