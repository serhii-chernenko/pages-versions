import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  css: [resolve('./assets/css/docs.css')],
  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    build: {
      markdown: {
        highlight: {
          langs: [
            'sql',
            'dotenv',
          ],
        },
      },
    },
  },
})
