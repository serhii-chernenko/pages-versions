export default defineNuxtConfig({
  modules: [
    'nitro-cloudflare-dev',
    '@nuxt/eslint',
    '@nuxt/ui',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    db: {
      binding: 'DB',
    },
    drizzle: {
      debug: process.env.NODE_ENV !== 'production',
    },
    public: {
      repo: process.env.REPO_URL ?? '',
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  nitro: {
    experimental: {
      asyncContext: true,
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'pages-versions',
        placement: {
          mode: 'smart',
        },
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'pages-versions',
            database_id: process.env.DB_ID ?? '__SET__DB_ID__IN_ENV__',
            migrations_dir: '.drizzle/migrations',
          },
        ],
      },
    },
  },
  eslint: {
    checker: true,
  },
})
