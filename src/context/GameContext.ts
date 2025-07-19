import { createContext } from 'react';
import type { GameContextType } from './types';

/**
 * GameContext.ts
 * ----------------
 * Defines the React context container for the game's global state.
 * 
 * Provides a typed interface (`GameContextType`) for state values and actions
 * shared across components. This file simply sets up the context shell.
 * 
 * Actual state logic and provider implementation are located in `GameProvider.tsx`.
 */

export const GameContext = createContext<GameContextType | undefined>(undefined);
