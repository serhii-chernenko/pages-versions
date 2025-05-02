import { sql, relations } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const pages = sqliteTable('pages', {
  id: integer().primaryKey(),
  deletedAt: text('deleted_at'),
})

export const pageVersions = sqliteTable('page_versions', {
  id: integer().primaryKey(),
  pageId: integer('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  status: text({
    enum: ['draft', 'scheduled', 'published', 'modified', 'archived'],
  }).notNull().default('draft'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export const pageVersionContents = sqliteTable('page_content', {
  id: integer().primaryKey(),
  pageId: integer('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  versionId: integer('version_id').notNull().references(() => pageVersions.id, { onDelete: 'cascade' }),
  title: text().notNull(),
  slug: text().notNull().unique(),
})

export const pagesRelations = relations(pages, ({ many }) => ({
  versions: many(pageVersions),
}))

export const pageVersionsRelations = relations(pageVersions, ({ one }) => ({
  page: one(pages, {
    fields: [pageVersions.pageId],
    references: [pages.id],
  }),
  content: one(pageVersionContents, {
    fields: [pageVersions.id],
    references: [pageVersionContents.versionId],
  }),
}))

export const pageVersionContentsRelations = relations(
  pageVersionContents,
  ({ one }) => ({
    page: one(pages, {
      fields: [pageVersionContents.pageId],
      references: [pages.id],
    }),
    version: one(pageVersions, {
      fields: [pageVersionContents.versionId],
      references: [pageVersions.id],
    }),
  }),
)
