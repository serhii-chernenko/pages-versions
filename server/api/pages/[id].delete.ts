import { z } from 'zod'
import { eq } from 'drizzle-orm'

const rules = z.object({
  id: z.string().nonempty().max(255),
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, rules.safeParse)

  if (params.error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL parameters',
      data: params.error,
    })
  }

  const db = usePagesDatabase()

  return await db
    .delete(schemaPages.pages)
    .where(eq(schemaPages.pages.id, Number(params.data.id)))
    .returning({
      id: schemaPages.pages.id,
    })
    .get()
})
