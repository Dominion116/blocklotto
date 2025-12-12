import { Buffer } from 'buffer'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Polyfill Buffer globally for @stacks packages
globalThis.Buffer = Buffer

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
