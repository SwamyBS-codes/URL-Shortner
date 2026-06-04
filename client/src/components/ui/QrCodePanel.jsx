import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useToast } from '../../context/ToastContext'

function QrCodePanel({ value, size = 160 }) {
  const canvasRef = useRef(null)
  const { addToast } = useToast()

  async function copyQrImage() {
    try {
      const canvas = canvasRef.current?.querySelector('canvas')
      if (!canvas) throw new Error('QR canvas not ready')
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      addToast('QR code copied to clipboard.', 'success')
    } catch {
      addToast('Could not copy QR code. Try downloading instead.', 'error')
    }
  }

  function downloadQr() {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'shortify-qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
    addToast('QR code downloaded.', 'success')
  }

  if (!value) return null

  return (
    <div className="qr-panel">
      <div className="qr-canvas-wrap" ref={canvasRef}>
        <QRCodeCanvas value={value} size={size} level="H" includeMargin />
      </div>
      <div className="qr-actions">
        <button type="button" onClick={copyQrImage}>
          Copy QR
        </button>
        <button type="button" onClick={downloadQr}>
          Download
        </button>
      </div>
    </div>
  )
}

export default QrCodePanel
