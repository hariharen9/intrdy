import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'
import './app/styles/global.css'

// Native zero-dependency Service Worker registration for PWA offline support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // ignore in environments without SW support
    })
  })
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
