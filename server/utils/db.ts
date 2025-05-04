import type { DrizzleD1Database } from 'drizzle-orm/d1'
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

const memo: Record<string, DrizzleD1Database> = {}

export function useDatabaseRepoWithGenericTypes<T>(
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

  // @ts-expect-error
  return memo[binding] as DrizzleD1Database<Record<string, T>>
}
