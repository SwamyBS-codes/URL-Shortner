import dotenv from 'dotenv'
import postgres from 'postgres'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const port = Number(process.env.DB_PORT || 5432)
const database = process.env.DB_NAME

if (!user || !password || !host || !database) {
  throw new Error('Database config is missing. Set DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME in .env')
}

const postgresPool = postgres({
  username: user,
  password,
  host,
  port,
  database,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
})

export default postgresPool
export { postgresPool }