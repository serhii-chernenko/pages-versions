import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import {
  sqliteTable,
  text,
  integer,
  AnySQLiteColumn,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const pages = sqliteTable("pages", {
  id: integer().primaryKey(),
  // latest page content and info
  latest: integer().references((): AnySQLiteColumn => pageVersions.id),
  status: text({
    enum: ["draft", "scheduled", "published", "modified", "archived"],
  })
    .notNull()
    .default("draft"),
  deletedAt: text("deleted_at"),
});

export const pageVersions = sqliteTable(
  "page_version",
  {
    id: integer().primaryKey(),
    title: text().notNull(),
    slug: text().notNull(),
    pageId: integer().references(() => pages.id),
    version: integer().notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [
    uniqueIndex("uq_page_version").on(t.pageId, t.version),
  ]
);

async function main() {
  const db = drizzle("file:local.db");
  await db.run(`CREATE TABLE \`page_version\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`title\` text NOT NULL,
	\`slug\` text NOT NULL,
	\`pageId\` integer,
	\`version\` integer NOT NULL,
	\`created_at\` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (\`pageId\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`);
  await db.run(`
CREATE UNIQUE INDEX \`uq_page_version\` ON \`page_version\` (\`pageId\`,\`version\`);--> statement-breakpoint
`);
  await db.run(`
CREATE TABLE \`pages\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`latest\` integer,
	\`status\` text DEFAULT 'draft' NOT NULL,
	\`deleted_at\` text,
	FOREIGN KEY (\`latest\`) REFERENCES \`page_version\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`);
  // add new page
  // inserting first page version and attaching it to page
  const added = await db.batch([
    db
      .insert(pageVersions)
      .values({ version: 1, title: "New", slug: "new-page" }),
    db
      .insert(pages)
      .values({ latest: 1, status: "draft" })
      .returning({ id: pages.id }),
  ]);

  // updating page_version by connecting it with page for future queries
  const newPageId = added[1][0].id;
  await db
    .update(pageVersions)
    .set({ pageId: newPageId })
    .where(eq(pageVersions.id, 1));

  ////////////
  // get all pages
  const allPages = await db
    .select({
      title: pageVersions.title,
      slug: pageVersions.slug,
      createdAt: pageVersions.createdAt,
      status: pages.status,
      version: pageVersions.version,
    })
    .from(pages)
    .leftJoin(pageVersions, eq(pages.latest, pageVersions.id));

  ////////////
  // sort by createdAt, or sort by title or slug, do whatever you want
  const allPagesSorted = await db
    .select({
      title: pageVersions.title,
      slug: pageVersions.slug,
      createdAt: pageVersions.createdAt,
      status: pages.status,
      version: pageVersions.version,
    })
    .from(pages)
    .leftJoin(pageVersions, eq(pages.latest, pageVersions.id))
    .orderBy((t) => [t.createdAt]);

  ////////////
  // get page 1 versions
  const ress = await db
    .select()
    .from(pageVersions)
    .where(eq(pageVersions.pageId, 1));

  ////////////

  // update page, which will make a new page version creation
  // ideally it should be transaction, but you can't do it in D1
  // you can do batch, but you can't do returning then
  // but this should be stable enough even for race conditions
  const [resp] = await db
    .insert(pageVersions)
    .select(
      db
        .select({
          id: sql`${pageVersions.id} + 1`.as('id'),
          title: pageVersions.title,
          slug: pageVersions.slug,
          pageId: pageVersions.pageId,
          version: sql`COALESCE(MAX(version), 0) + 1`.as("version"),
          createdAt: pageVersions.createdAt,
        })
        .from(pageVersions)
        .where(eq(pageVersions.pageId, 1))
    )
    .returning({
      id: pageVersions.id,
    });

  await db.update(pages).set({ status: "modified", latest: resp.id });

  ////////////
  // check
  const allPages1 = await db
    .select({
      title: pageVersions.title,
      slug: pageVersions.slug,
      createdAt: pageVersions.createdAt,
      status: pages.status,
      version: pageVersions.version,
    })
    .from(pages)
    .leftJoin(pageVersions, eq(pages.latest, pageVersions.id));
}

main();
