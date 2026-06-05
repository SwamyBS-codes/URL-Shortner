import postgresPool from '../db.js'
import { formatLinkRow } from '../utils/formatLink.js'

export const listLinks = async (req, res) => {
  try {
    const userId = req.user?.id ?? null
    const links = await getAllLinksData(userId)
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
    res.send({ success: true, links: links.map((row) => formatLinkRow(row, baseUrl)) })
  } catch (error) {
    console.error('Error fetching links:', error)
    res.status(500).json({ error: 'Failed to fetch links' })
  }
}

export const getLinkByCode = async (req, res) => {
  try {
    const { code } = req.params
    const linkByCode = await queryUrlByShortCode(code)
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
    res.send({ success: true, link: formatLinkRow(linkByCode, baseUrl) })
  } catch (error) {
    console.error('Error fetching link by code:', error)
    res.status(500).json({ error: 'Failed to fetch link' })
  }
}

export async function addUrl(record) {
  try {
    const {
      original_url,
      short_code,
      custom_alias,
      title,
      password_hash,
      is_password_protected,
      expiration_type,
      expires_at,
      user_id,
      starts_at,
      folder,
      tags,
    } = record

    const result = await postgresPool`
      insert into urls (
        original_url,
        short_code,
        custom_alias,
        title,
        password_hash,
        is_password_protected,
        expiration_type,
        expires_at,
        user_id,
        starts_at,
        folder,
        tags
      ) values (
        ${original_url},
        ${short_code},
        ${custom_alias},
        ${title},
        ${password_hash},
        ${is_password_protected},
        ${expiration_type},
        ${expires_at},
        ${user_id ?? null},
        ${starts_at ?? null},
        ${folder ?? null},
        ${Array.isArray(tags) ? tags : []}
      ) returning *
    `

    return result[0]
  } catch (error) {
    console.error('Error adding url:', error)
    throw error
  }
}

export async function checkCodeExists(code) {
  try {
    const result = await postgresPool`
      select 1 from urls where short_code = ${code} limit 1
    `
    return result.length > 0
  } catch (error) {
    console.error('Error checking code exists:', error)
    throw error
  }
}

export async function queryUrlByShortCode(shortCode) {
  try {
    const result = await postgresPool`
      select * from urls where short_code = ${shortCode} limit 1
    `

    if (result.length === 0) {
      throw new Error(`Short link with code '${shortCode}' not found`)
    }

    return result[0]
  } catch (error) {
    console.error('Error querying url by short code:', error)
    throw error
  }
}

export async function queryUrlByOriginalUrl(originalUrl) {
  try {
    const result = await postgresPool`
      select * from urls where original_url = ${originalUrl} order by created_at desc limit 1
    `
    return result[0] || null
  } catch (error) {
    console.error('Error querying url by original URL:', error)
    throw error
  }
}

export async function incrementClicks(code) {
  try {
    const result = await postgresPool`
      update urls
      set click_count = click_count + 1,
          updated_at = now()
      where short_code = ${code}
      returning click_count
    `
    if (result.length === 0) {
      throw new Error(`Short link with code '${code}' not found`)
    }
    return result[0].click_count
  } catch (error) {
    console.error('Error incrementing clicks:', error)
    throw error
  }
}

export async function recordVisit(urlId, visit) {
  try {
    const { ip_address, country, device, browser, os, referrer } = visit
    await postgresPool`
      insert into url_visits (
        url_id,
        ip_address,
        country,
        device,
        browser,
        os,
        referrer
      ) values (
        ${urlId},
        ${ip_address},
        ${country},
        ${device},
        ${browser},
        ${os},
        ${referrer}
      )
    `
  } catch (error) {
    console.error('Error recording visit:', error)
    throw error
  }
}

export async function getDashboardStats(userId = null) {
  try {
    const stats = userId
      ? await postgresPool`
          select
            count(*)::int as total_links,
            coalesce(sum(click_count), 0)::int as total_clicks,
            coalesce(max(click_count), 0)::int as max_clicks,
            coalesce(avg(click_count), 0)::float as avg_clicks,
            count(*) filter (where is_password_protected) as protected_links
          from urls
          where user_id = ${userId}
        `
      : await postgresPool`
          select
            count(*)::int as total_links,
            coalesce(sum(click_count), 0)::int as total_clicks,
            coalesce(max(click_count), 0)::int as max_clicks,
            coalesce(avg(click_count), 0)::float as avg_clicks,
            count(*) filter (where is_password_protected) as protected_links
          from urls
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
      select * from urls order by created_at desc limit ${limit}
    `
    return result
  } catch (error) {
    console.error('Error getting recent links:', error)
    throw error
  }
}

export async function getAllLinksData(userId = null) {
  try {
    if (userId) {
      return await postgresPool`
        select * from urls where user_id = ${userId} order by created_at desc
      `
    }
    return await postgresPool`select * from urls order by created_at desc`
  } catch (error) {
    console.error('Error fetching all links data:', error)
    throw error
  }
}

export async function updateUrl(shortCode, updates) {
  try {
    const existing = await queryUrlByShortCode(shortCode)
    const merged = {
      original_url: updates.original_url ?? existing.original_url,
      short_code: updates.short_code ?? existing.short_code,
      custom_alias: updates.custom_alias !== undefined ? updates.custom_alias : existing.custom_alias,
      password_hash: updates.password_hash !== undefined ? updates.password_hash : existing.password_hash,
      is_password_protected: updates.is_password_protected ?? existing.is_password_protected,
      expiration_type: updates.expiration_type !== undefined ? updates.expiration_type : existing.expiration_type,
      expires_at: updates.expires_at !== undefined ? updates.expires_at : existing.expires_at,
      starts_at: updates.starts_at !== undefined ? updates.starts_at : existing.starts_at,
      is_active: updates.is_active ?? existing.is_active,
      folder: updates.folder !== undefined ? updates.folder : existing.folder,
      tags: updates.tags !== undefined ? updates.tags : existing.tags,
    }

    const result = await postgresPool`
      update urls set
        original_url = ${merged.original_url},
        short_code = ${merged.short_code},
        custom_alias = ${merged.custom_alias},
        password_hash = ${merged.password_hash},
        is_password_protected = ${merged.is_password_protected},
        expiration_type = ${merged.expiration_type},
        expires_at = ${merged.expires_at},
        starts_at = ${merged.starts_at},
        is_active = ${merged.is_active},
        folder = ${merged.folder},
        tags = ${Array.isArray(merged.tags) ? merged.tags : []},
        updated_at = now()
      where short_code = ${shortCode}
      returning *
    `

    return result[0]
  } catch (error) {
    console.error('Error updating url:', error)
    throw error
  }
}

export async function deleteUrl(shortCode, userId = null) {
  try {
    const result = userId
      ? await postgresPool`
          delete from urls where short_code = ${shortCode} and user_id = ${userId} returning id
        `
      : await postgresPool`
          delete from urls where short_code = ${shortCode} returning id
        `

    if (result.length === 0) {
      throw new Error(`Short link with code '${shortCode}' not found`)
    }

    return true
  } catch (error) {
    console.error('Error deleting url:', error)
    throw error
  }
}

export async function getUniqueVisitorCount(urlId) {
  try {
    const result = await postgresPool`
      select count(distinct ip_address)::int as unique_visitors
      from url_visits
      where url_id = ${urlId} and ip_address is not null
    `
    return result[0]?.unique_visitors || 0
  } catch (error) {
    console.error('Error counting unique visitors:', error)
    throw error
  }
}

export async function getVisitBreakdown(urlId) {
  try {
    const [devices, browsers, osList, countries, referrers] = await Promise.all([
      postgresPool`
        select device as label, count(*)::int as count
        from url_visits where url_id = ${urlId} and device is not null
        group by device order by count desc limit 10
      `,
      postgresPool`
        select browser as label, count(*)::int as count
        from url_visits where url_id = ${urlId} and browser is not null
        group by browser order by count desc limit 10
      `,
      postgresPool`
        select os as label, count(*)::int as count
        from url_visits where url_id = ${urlId} and os is not null
        group by os order by count desc limit 10
      `,
      postgresPool`
        select coalesce(country, 'Unknown') as label, count(*)::int as count
        from url_visits where url_id = ${urlId}
        group by country order by count desc limit 10
      `,
      postgresPool`
        select coalesce(referrer, 'Direct') as label, count(*)::int as count
        from url_visits where url_id = ${urlId}
        group by referrer order by count desc limit 10
      `,
    ])

    return { devices, browsers, os: osList, countries, referrers }
  } catch (error) {
    console.error('Error fetching visit breakdown:', error)
    throw error
  }
}

export async function getClicksOverTime(urlId, days = 30) {
  try {
    return await postgresPool`
      select date_trunc('day', visited_at) as day, count(*)::int as clicks
      from url_visits
      where url_id = ${urlId}
        and visited_at >= now() - (${days} || ' days')::interval
      group by day
      order by day asc
    `
  } catch (error) {
    console.error('Error fetching clicks over time:', error)
    throw error
  }
}

export async function getLinkAnalytics(shortCode) {
  try {
    const [url] = await postgresPool`
      select *
      from urls
      where short_code = ${shortCode}
      limit 1
    `

    if (!url) {
      throw new Error(`Short link with code '${shortCode}' not found`)
    }

    const [visits, uniqueVisitors, breakdown, clicksOverTime] = await Promise.all([
      postgresPool`
        select ip_address, country, device, browser, os, referrer, visited_at
        from url_visits
        where url_id = ${url.id}
        order by visited_at desc
        limit 50
      `,
      getUniqueVisitorCount(url.id),
      getVisitBreakdown(url.id),
      getClicksOverTime(url.id),
    ])

    const lastAccessed = visits[0]?.visited_at || null

    return {
      url,
      visits,
      summary: {
        total_clicks: url.click_count,
        unique_visitors: uniqueVisitors,
        last_accessed: lastAccessed,
        created_at: url.created_at,
        expires_at: url.expires_at,
      },
      breakdown,
      clicks_over_time: clicksOverTime,
    }
  } catch (error) {
    console.error('Error fetching link analytics:', error)
    throw error
  }
}
