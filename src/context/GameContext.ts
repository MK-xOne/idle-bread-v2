// src/context/GameContext.ts
// ------------------------------------------------------
// Exports the GameContext and `useGame()` hook.
// This is the primary access point for game state
// and logic across all components.
// ------------------------------------------------------

import { createContext, useContext } from 'react';
import type { GameContextType } from './types';

/**
 * GameContext
 * -------------
 * Provides global access to the game state and logic handlers.
 * Populated by <GameProvider> and consumed via `useGame()`.
 */
export const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * useGame
 * ----------
 * Hook to access global game state and methods.
 * Throws if used outside <GameProvider>.
 */
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a <GameProvider>');
  }
  return context;
};
