import { z } from 'zod'

const rules = z.object({
  limit: z.string().min(1).default('5'),
  sort: z.string().nonempty().default('date'),
  direction: z.enum(['asc', 'desc']).default('desc'),
  page: z.string().optional().default('1'),
  search: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, rules.safeParse)

  if (query.error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      data: query.error,
    })
  }

  const db = usePagesDatabase()

  return await db.query.pages.findMany({
    where: (schema, { isNull }) => {
      if (!query.data.search) {
        return isNull(schema.deletedAt)
      }

      // TODO: Implement nested search to get it from versions and content
      return isNull(schema.deletedAt)
    },
    // TODO: Implement nested sorting to get it from versions and content
    // orderBy: (schema, { asc, desc }) => {
    //   const { sort, direction } = query.data
    //   if (sort !== 'createdAt') {
    //     // @ts-expect-error Some columns could be undefined
    //     return direction === 'asc' ? asc(schema[sort]) : desc(schema[sort])
    //   }
    //   return direction === 'desc'
    //     ? desc(schema.createdAt)
    //     : asc(schema.createdAt)
    // },
    limit: parseInt(query.data.limit),
    offset: (parseInt(query.data.page) - 1) * parseInt(query.data.limit),
    columns: {
      id: true,
    },
    with: {
      versions: {
        limit: 1,
        orderBy: (schema, { desc }) => desc(schema.createdAt),
        columns: {
          id: true,
          status: true,
          createdAt: true,
        },
        with: {
          content: {
            columns: {
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  })
})
