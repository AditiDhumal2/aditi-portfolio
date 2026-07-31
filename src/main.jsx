import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Hide loading screen when React mounts
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
  loadingScreen.style.transition = 'opacity 0.5s';
  loadingScreen.style.opacity = '0';
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 500);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);