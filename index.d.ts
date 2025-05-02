declare module 'nuxt/schema' {
  interface RuntimeConfig {
    db: {
      binding: string
    }
    drizzle: {
      debug: boolean
    }
  }

  interface PublicRuntimeConfig {
    repo: string
  }
}

export {}
