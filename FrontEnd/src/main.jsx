import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';;
import HandTracker from './HandTracker.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HandTracker />
  </StrictMode>
)
