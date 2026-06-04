import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchLinkMetadata } from '../api/linksApi'
import LinkStatusLayout from '../components/ui/LinkStatusLayout'

function DisabledPage() {
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
      icon="🚫"
      tone="disabled"
      title="This link has been disabled"
      description="The owner turned off this short URL. It won’t redirect until they enable it again from their dashboard."
    >
      {link ? (
        <div className="link-summary status-summary">
          <span>Short URL</span>
          <strong>{link.shortUrl}</strong>
        </div>
      ) : null}
    </LinkStatusLayout>
  )
}

export default DisabledPage
