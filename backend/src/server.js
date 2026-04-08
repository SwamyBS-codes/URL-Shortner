import express from 'express'
import cors from 'cors'
import { PORT } from './config.js'
import { initRedisCache } from './cache/redisCache.js'
import { setupDatabase } from './setupDb.js'
import { createShortLink } from './services/linkService.js';
import { getDashboardSummary } from './services/linkService.js';
import { resolveShortLink } from './services/linkService.js';
import { listLinks } from './data/linkStore.js';
import { getLinkByCode } from './data/linkStore.js';
const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Hello World");
})
app.get('/api/listAllLinks', async (req,res)=>{
    try{
    await listLinks(req, res);
    }
    catch(error)
    {
        console.error('Error fetching links:', error);
        res.status(500).json({ error: 'Failed to fetch links' });
    }
})

app.get('/api/getLinkByCode/:code', async (req, res) => {
  try {
    await getLinkByCode(req, res);
  }
  catch (error)
  {
    console.error('Error fetching link by code:', error);
    res.status(500).json({ error: 'Failed to fetch link by code' });
  }
})


app.post('/api/createlink', async (req,res)=>{
  try{
    const result = await createShortLink(req.body);
    res.json(result);
  }
  catch(error)
  {
    console.error('Error creating short link:', error);
    const message = error.message || 'Failed to create short link'

    if (/already taken/i.test(message)) {
      return res.status(409).json({ error: message })
    }

    if (/required|invalid|must be|supported/i.test(message)) {
      return res.status(400).json({ error: message })
    }

    res.status(500).json({ error: message });
  }
})

app.get('/api/dashboard', async (req, res) => {
  try {
    const summary = await getDashboardSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
})


app.get('/api/resolveLink/:code', async (req, res, next) => {
  try {
    console.log('Resolving code:', req.params.code)
    const location = await resolveShortLink(req.params.code)
    res.redirect(302, location)
  } catch (err) {
    if (/not found/i.test(err.message || '')) {
      return res.status(404).json({ error: err.message })
    }
    next(err)
  }
})

app.get('/:code', async (req, res, next) => {
  try {
    console.log('Resolving code:', req.params.code)
    const location = await resolveShortLink(req.params.code)
    res.redirect(302, location)
  } catch (err) {
    if (/not found/i.test(err.message || '')) {
      return res.status(404).json({ error: err.message })
    }
    next(err)
  }
})

async function startServer() {
  await setupDatabase()
  await initRedisCache()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})