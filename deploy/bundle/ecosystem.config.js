// pm2:  pm2 start ecosystem.config.js && pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: 'eldesco-web',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Must be "localhost": with 127.0.0.1 the standalone server fails to reach itself and answers 500.
        HOSTNAME: 'localhost',
      },
      max_memory_restart: '700M',
      autorestart: true,
    },
  ],
};
