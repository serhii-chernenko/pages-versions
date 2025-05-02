import { defineConfig } from 'drizzle-kit'

const name = 'b5b99a134793274771f601a623d43ec344ab150b7722ac2bd5f228eac04c1ae4'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/db/schema.ts',
  out: '.drizzle/migrations',
  dbCredentials: {
    url: `file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/${name}.sqlite`,
  },
})
