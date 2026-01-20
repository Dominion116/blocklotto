import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './reown-config'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}
