import postgresPool from './db.js'
import { pathToFileURL } from 'node:url'

export async function setupDatabase() {
  await postgresPool`
    create table if not exists url_short_ner (
      id bigserial primary key,
      code text not null unique,
      original_url text not null,
      short_url text not null,
      clicks integer not null default 0,
      created_at timestamptz not null default now()
    )
  `

  // Keep one row per original_url so a unique index can be created safely.
  await postgresPool`
    delete from url_short_ner older
    using url_short_ner newer
    where older.original_url = newer.original_url
      and older.id < newer.id
  `

  await postgresPool`
    create unique index if not exists url_short_ner_original_url_unique
    on url_short_ner (original_url)
  `

  const [{ count }] = await postgresPool`
    select count(*)::int as count
    from url_short_ner
  `

  if (Number(count) === 0) {
    await postgresPool`
      select setval(
        pg_get_serial_sequence('url_short_ner', 'id'),
        1,
        false
      )
    `
  }

  console.log('Table url_short_ner is ready')
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  setupDatabase()
    .then(async () => {
      await postgresPool.end()
    })
    .catch(async (error) => {
      console.error('Failed to create table:', error)
      await postgresPool.end()
      process.exit(1)
    })
}