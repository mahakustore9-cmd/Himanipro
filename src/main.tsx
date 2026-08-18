import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupClientApiFallback } from './lib/apiFallback.js';

// Setup universal client-side fallback for static platforms like Vercel & GitHub Pages
setupClientApiFallback();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

