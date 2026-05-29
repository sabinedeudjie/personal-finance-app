import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './index.css'
import App from './App.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <QueryClientProvider client={QueryClient}>
          <App />
      </QueryClientProvider>

  </StrictMode>,
)
