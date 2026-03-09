import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import './index.css'

// Polyfills pour @react-pdf/renderer - version avec typage correct
import { Buffer } from 'buffer';

// Déclaration pour étendre l'interface Window
declare global {
  interface Window {
    Buffer: typeof Buffer;
    global: typeof globalThis;
  }
}

// Polyfills
window.Buffer = Buffer;
window.global = window;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
)