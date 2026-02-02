import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react';
import { SocketProvider } from './contexts/SocketContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadingSpinner from './components/LoadingSpinner.jsx';

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
      <GoogleOAuthProvider clientId="990128340658-ldli8m2948al9pu0rmhos95tlo6v0v99.apps.googleusercontent.com">
        <SocketProvider>
          <App />
        </SocketProvider>
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>

    <Toaster />
  </StrictMode>,
)
