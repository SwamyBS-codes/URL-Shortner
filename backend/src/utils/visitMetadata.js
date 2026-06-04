import UAParser from 'ua-parser-js'

export function extractVisitMetadata(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.ip ||
    req.socket?.remoteAddress ||
    null

  const userAgent = req.headers['user-agent'] || ''
  const parser = new UAParser(userAgent)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const device = parser.getDevice()

  const deviceType = device.type || (userAgent.includes('Mobile') ? 'mobile' : 'desktop')
  const referrer = req.headers.referer || req.headers.referrer || null

  return {
    ip_address: ip,
    country: req.headers['cf-ipcountry'] || null,
    device: deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
    browser: [browser.name, browser.version].filter(Boolean).join(' ') || 'Unknown',
    os: [os.name, os.version].filter(Boolean).join(' ') || 'Unknown',
    referrer,
  }
}
