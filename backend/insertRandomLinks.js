import postgresPool from './src/db.js'
import crypto from 'node:crypto'

// Generate random alphanumeric string for short code
function generateCode(length = 6) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length)
}
const randomUrls = [
  'https://github.com/microsoft/vscode',
  'https://stackoverflow.com/questions/tagged/javascript',
  'https://docs.nodejs.org/en/docs/',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://twitter.com/home',
  'https://reddit.com/r/programming',
  'https://medium.com/@user/article',
  'https://dev.to/latest',
  'https://hashnode.com/@author',
  'https://www.wikipedia.org/wiki/Main_Page',
  'https://news.ycombinator.com',
  'https://producthunt.com',
  'https://dribbble.com/search?q=design',
  'https://behance.net/galleries/graphic-design',
  'https://figma.com/files'
]

async function insertRandomLinks() {
  try {
    console.log('🔗 Starting to insert random links...')
    
    for (let i = 0; i < 10; i++) {
      const randomUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)]
      const code = generateCode()
      const shortUrl = `http://short.url/${code}`
      
      try {
        await postgresPool`
          INSERT INTO url_short_ner (code, original_url, short_url, clicks)
          VALUES (${code}, ${randomUrl}, ${shortUrl}, ${Math.floor(Math.random() * 100)})
        `
        console.log(`✅ Inserted: ${code} -> ${randomUrl}`)
      } catch (error) {
        if (error.message.includes('unique constraint')) {
          console.log(`⚠️  Code ${code} already exists, retrying...`)
          i--
        } else {
          throw error
        }
      }
    }
    
    console.log('\n📊 All links inserted successfully!')
    const result = await postgresPool`SELECT COUNT(*) as total FROM url_short_ner`
    console.log(`Total links in database: ${result[0].total}`)
    
  } catch (error) {
    console.error('❌ Error inserting links:', error)
  } finally {
    await postgresPool.end()
  }
}

insertRandomLinks()
