import postgresPool from '../db.js'

export async function createUser({ name, email, passwordHash }) {
  const result = await postgresPool`
    insert into users (name, email, password_hash)
    values (${name}, ${email.toLowerCase().trim()}, ${passwordHash})
    returning id, name, email, created_at
  `
  return result[0]
}

export async function findUserByEmail(email) {
  const result = await postgresPool`
    select id, name, email, password_hash, created_at
    from users
    where email = ${email.toLowerCase().trim()}
    limit 1
  `
  return result[0] || null
}

export async function findUserById(id) {
  const result = await postgresPool`
    select id, name, email, created_at
    from users
    where id = ${id}
    limit 1
  `
  return result[0] || null
}
