import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchLinkMetadata } from '../api/linksApi'
import LinkStatusLayout from '../components/ui/LinkStatusLayout'
import { formatDateOnlyDisplay } from '../utils/linkUtils'

function ScheduledPage() {
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
      icon="📅"
      tone="scheduled"
      title="This link isn’t active yet"
      description="The owner set a start date for this short link. It will begin working on that day and stay active until the end date (if set)."
    >
      {link ? (
        <div className="link-summary status-summary">
          <span>Short URL</span>
          <strong>{link.shortUrl}</strong>
          {link.startsAt ? (
            <>
              <span>Becomes active on</span>
              <strong>{formatDateOnlyDisplay(link.startsAtIso || link.startsAt)}</strong>
            </>
          ) : null}
          {link.expiresAt ? (
            <>
              <span>Active until</span>
              <strong>{formatDateOnlyDisplay(link.expiresAtIso || link.expiresAt)}</strong>
            </>
          ) : null}
        </div>
      ) : null}
    </LinkStatusLayout>
  )
}

export default ScheduledPage
