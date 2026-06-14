import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './views/styles/index.css'
import App from './views/App.tsx'
import { NuqsAdapter } from "nuqs/adapters/react"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuqsAdapter>
      <App />
    </NuqsAdapter>
  </StrictMode>,
)
