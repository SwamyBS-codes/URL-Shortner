import postgresPool from '../db.js'

export const listLinks=async(req,res)=> {
  try{
      const links = await postgresPool`select * from url_short_ner order by id desc`
      res.send({success:true,links})
  }
  catch(error)
  {
      console.error('Error fetching links:', error);
      res.status(500).json({ error: 'Failed to fetch links' });
  }
}

export const getLinkByCode=async (req,res)=>
  {
  try{
       const { code } = req.params;
       const linkByCode=await postgresPool`select * from url_short_ner where code=${code}`;
       res.send({success:true,linkByCode});
  }
  catch(error)
  {
      console.error('Error fetching link by code:', error);
      res.status(500).json({ error: 'Failed to fetch link' });
  }
}


export async function addLink(record) {
  try {
    const { code, original_url, short_url } = record
    const result = await postgresPool`
      insert into url_short_ner (code, original_url, short_url)
      values (${code}, ${original_url}, ${short_url})
      on conflict (original_url)
      do update set original_url = excluded.original_url
      returning id, code, original_url, short_url, clicks, created_at
    `
    return result[0]
  } catch (error) {
    console.error('Error adding link:', error)
    throw error
  }
}

export async function checkCodeExists(code) {
  try {
    const result = await postgresPool`select * from url_short_ner where code=${code}`
    return result.length > 0
  } catch (error) {
    console.error('Error checking code exists:', error)
    throw error
  }
}

export async function queryLinkByCode(code) {
  try {
    const result = await postgresPool`select * from url_short_ner where code=${code}`
    if (result.length === 0) {
      throw new Error(`Short link with code '${code}' not found`)
    }
    return result[0]
  } catch (error) {
    console.error('Error querying link by code:', error)
    throw error
  }
}

export async function queryLinkByOriginalUrl(originalUrl) {
  try {
    const result = await postgresPool`
      select id, code, original_url, short_url, clicks, created_at
      from url_short_ner
      where original_url = ${originalUrl}
      order by id desc
      limit 1
    `

    return result[0] || null
  } catch (error) {
    console.error('Error querying link by original URL:', error)
    throw error
  }
}

export async function incrementClicks(code) {
  try {
    const result = await postgresPool`
      update url_short_ner
      set clicks = clicks + 1
      where code = ${code}
      returning clicks
    `
    if (result.length === 0) {
      throw new Error(`Short link with code '${code}' not found`)
    }
    return result[0].clicks
  } catch (error) {
    console.error('Error incrementing clicks:', error)
    throw error
  }
}

export async function getDashboardStats() {
  try {
    const stats = await postgresPool`
      select 
        count(*) as total_links,
        coalesce(sum(clicks), 0) as total_clicks,
        coalesce(max(clicks), 0) as max_clicks,
        coalesce(avg(clicks), 0) as avg_clicks
      from url_short_ner
    `
    return stats[0]
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    throw error
  }
}

export async function getRecentLinks(limit = 10) {
  try {
    const result = await postgresPool`
      select id, code, original_url, short_url, clicks, created_at
      from url_short_ner
      order by created_at desc
      limit ${limit}
    `
    return result
  } catch (error) {
    console.error('Error getting recent links:', error)
    throw error
  }
}

export async function getAllLinksData() {
  try {
    return await postgresPool`select * from url_short_ner order by id desc`
  } catch (error) {
    console.error('Error fetching all links data:', error)
    throw error
  }
}