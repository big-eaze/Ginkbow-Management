import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { MenuProvider } from './Utils/MenuProvider.jsx'

createRoot(document.getElementById('root')).render(

  //<StrictMode>
    <MenuProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MenuProvider>
  //</StrictMode>
)
