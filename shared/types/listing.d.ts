import * as schema from '../../server/db/schema'

export type Page = typeof schema.pages.$inferSelect

export type PageVersion = typeof schema.pageVersions.$inferSelect

export type PageVersionContent = typeof schema.pageVersionContents.$inferSelect

export interface PagesListing extends Page {
  status: PageVersion['status']
  createdAt: PageVersion['createdAt']
  title: PageVersionContent['title']
  slug: PageVersionContent['slug']
}
