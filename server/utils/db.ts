import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'

export { schema as schemaPages }

const memo: Record<string, DrizzleD1Database<any>> = {}

export function useDatabase<T extends Record<string, unknown>>(
  binding: string,
  schema: any,
) {
  if (!binding) {
    throw new Error('DB binding is not defined in runtime config')
  }

  const db = (globalThis as any).__env__[binding]

  if (!db) {
    throw createError(`Database not found in ENV: ${binding}`)
  }

  const {
    drizzle: { debug: logger },
  } = useRuntimeConfig()

  if (!memo[binding]) {
    memo[binding] = drizzle(db, {
      schema,
      logger,
    })
  }

  return memo[binding] as DrizzleD1Database<T>
}

export function usePagesDatabase() {
  const {
    db: { binding },
  } = useRuntimeConfig()

  return useDatabase<typeof schema>(binding, schema)
}
