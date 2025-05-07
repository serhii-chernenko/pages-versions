import { z } from 'zod'

const rules = z.object({
  title: z.string().min(4).max(60),
  slug: z.string().min(4).max(60),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, rules.safeParse)

  if (body.error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid body parameters',
      data: body.error,
    })
  }

  const db = usePagesDatabase()
  const amount = await db.query.pages.findMany()

  if (amount.length >= 5) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Maximum number of pages reached',
    })
  }

  const { title, slug } = body.data

  const createdPage = await db
    .insert(schemaPages.pages)
    .values({})
    .returning()
    .get()

  const createdPageVersion = await db
    .insert(schemaPages.pageVersions)
    .values({ pageId: createdPage.id })
    .returning()
    .get()

  const createdPageVersionContent = await db
    .insert(schemaPages.pageVersionContents)
    .values({
      pageId: createdPage.id,
      versionId: createdPageVersion.id,
      title,
      slug,
    })
    .returning()
    .get()

  return {
    page: createdPage,
    version: createdPageVersion,
    content: createdPageVersionContent,
  }
})
