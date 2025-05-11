import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, ScrollRestoration } from 'react-router-dom'
import App from './App.jsx'
import './styles/tailwind.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)