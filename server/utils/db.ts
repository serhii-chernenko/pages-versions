import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'

export { schema as schemaPages }

export function useDb() {
  const {
    db: { binding },
    drizzle: { debug: logger },
  } = useRuntimeConfig()

  if (!binding) {
    throw new Error('DB binding is not defined in runtime config')
  }

  const db = (globalThis as any).__env__[binding]

  if (!db) {
    throw createError(`Database not found in ENV: ${binding}`)
  }

  return drizzle(db, {
    schema,
    logger,
  })
}
