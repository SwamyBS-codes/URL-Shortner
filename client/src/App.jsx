import './App.css'
import { LinkWorkspaceProvider } from './context/LinkWorkspaceContext'
import { ToastProvider } from './context/ToastContext'
import DashboardPage from './pages/DashboardPage'
import { useLinkWorkspace } from './context/LinkWorkspaceContext'
import ToastViewport from './components/ToastViewport'
import { useEffect, useState } from 'react'
import ShortifyLogo from './components/ShortifyLogo'

function LoadingScreen() {
  return (
    <main className="loading-screen" aria-label="Loading Shortify">
      <span className="loading-orb loading-orb-one" aria-hidden="true" />
      <span className="loading-orb loading-orb-two" aria-hidden="true" />
      <div className="loading-card">
        <ShortifyLogo />
        <div className="loading-copy">
          <h1>Preparing your link dashboard</h1>
          <p>Fetching recent links, metrics, and workspace state before you jump in.</p>
        </div>
        <div className="loading-progress" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="loading-status-grid" aria-hidden="true">
          <div>
            <strong>Syncing</strong>
            <span>Link activity</span>
          </div>
          <div>
            <strong>Loading</strong>
            <span>Dashboard stats</span>
          </div>
          <div>
            <strong>Ready soon</strong>
            <span>Workspace shell</span>
          </div>
        </div>
      </div>
    </main>
  )
}

function AppContent() {
  const { isLoading } = useLinkWorkspace()
  const [minimumLoadingComplete, setMinimumLoadingComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingComplete(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading || !minimumLoadingComplete) {
    return <LoadingScreen />
  }

  return <DashboardPage />
}

function App() {
  return (
    <ToastProvider>
      <LinkWorkspaceProvider>
        <AppContent />
        <ToastViewport />
      </LinkWorkspaceProvider>
    </ToastProvider>
  )
}

export default App
