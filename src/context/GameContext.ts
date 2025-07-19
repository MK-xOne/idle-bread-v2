import { createContext, useContext } from 'react';
import type { GameStateHook } from './gameState';
import type { ActionResult } from './actions/performNamedAction';

// ✅ Add this interface
export interface GameContextType extends GameStateHook {
  perform: (fn: (state: GameStateHook) => void) => void;
  performNamedAction: (resourceId: string, action: string) => ActionResult;
}

// ✅ Export GameContext with correct type
export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
