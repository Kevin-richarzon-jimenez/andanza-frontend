import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './auth/AuthProvider.jsx'
import AuthPromptProvider from './auth/AuthPromptProvider.jsx'
import FavoritesProvider from './favorites/FavoritesProvider.jsx'
import CartProvider from './cart/CartProvider.jsx'
import ConfirmProvider from './confirm/ConfirmProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfirmProvider>
        <AuthProvider>
          <AuthPromptProvider>
            <FavoritesProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </FavoritesProvider>
          </AuthPromptProvider>
        </AuthProvider>
      </ConfirmProvider>
    </BrowserRouter>
  </StrictMode>,
)
