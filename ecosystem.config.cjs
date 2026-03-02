module.exports = {
  apps: [
    {
      name: 'annas-blooms',
      script: '.output/server/index.mjs',
      cwd: '/home/annasblooms/htdocs/nuxt-app',
      env: {
        PORT: 3000,
        HOST: '127.0.0.1',
        NODE_ENV: 'production',
        NITRO_PORT: 3000,
        NITRO_HOST: '127.0.0.1',
        GQL_HOST: 'https://annas.46.225.21.49.nip.io/graphql',
        APP_HOST: 'https://nuxt.46.225.21.49.nip.io',
        POSTCODE_HOST: 'api.postcodes.io',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/home/annasblooms/htdocs/nuxt-app/logs/error.log',
      out_file: '/home/annasblooms/htdocs/nuxt-app/logs/out.log',
    },
  ],
};
