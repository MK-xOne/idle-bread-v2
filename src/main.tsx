import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GameProvider } from './context/GameProvider';

/**
 * main.tsx
 * -----------
 * Entry point of the React application.
 * 
 * Responsibilities:
 * - Loads global styles (`index.css`)
 * - Wraps the root `<App />` component with `GameProvider` to supply game state context
 * - Uses React 18’s `createRoot` API to mount the app on the DOM element with ID `root`
 * - Wraps the render in `<React.StrictMode>` to catch potential issues during development
 * 
 * This file initializes the game and sets up the core rendering and context hierarchy.
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
);
