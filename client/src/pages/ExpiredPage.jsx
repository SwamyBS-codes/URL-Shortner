import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchLinkMetadata } from '../api/linksApi'
import LinkStatusLayout from '../components/ui/LinkStatusLayout'
import { formatDateOnlyDisplay } from '../utils/linkUtils'

function ExpiredPage() {
  const { code } = useParams()
  const [link, setLink] = useState(null)

  useEffect(() => {
    if (!code) return
    fetchLinkMetadata(code)
      .then(setLink)
      .catch(() => {})
  }, [code])

  return (
    <LinkStatusLayout
      icon="⏱️"
      tone="expired"
      title="This link has expired"
      description="This short link is no longer active. The active period or expiration date has passed, so redirects are turned off."
    >
      {link ? (
        <div className="link-summary status-summary">
          <span>Short URL</span>
          <strong>{link.shortUrl}</strong>
          {link.expiresAt ? (
            <>
              <span>Expired on</span>
              <strong>{formatDateOnlyDisplay(link.expiresAtIso || link.expiresAt)}</strong>
            </>
          ) : null}
        </div>
      ) : null}
    </LinkStatusLayout>
  )
}

export default ExpiredPage
