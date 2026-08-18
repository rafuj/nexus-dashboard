import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './views/styles/index.css'
import App from './views/App.tsx'
import { NuqsAdapter } from "nuqs/adapters/react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>,
)
