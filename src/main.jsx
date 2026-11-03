import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/outfit'
import '@fontsource/dela-gothic-one'
import './index.css'
import App from './App.jsx'
import { shouldRetry } from './api/http.js'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60_000,
      gcTime: 30 * 60_000,
      refetchOnWindowFocus: false,
      retry: shouldRetry,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </QueryClientProvider>
  </StrictMode>,
)
