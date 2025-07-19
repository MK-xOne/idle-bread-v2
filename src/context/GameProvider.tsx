// src/context/GameProvider.tsx

import type { ReactNode } from 'react';
import { GameContext } from './GameContext';

import { useGameState } from './gameState';
import { performAction } from './actions/performAction';
import { performNamedAction as doNamedAction } from './actions/performNamedAction';

import type { ResourceID } from '../data/resources';
import type { ActionType } from '../data/actionData';
import type { ActionResult } from './actions/performNamedAction';

/**
 * GameProvider.tsx
 * ------------------
 * Provides the global game context with state and logic bindings.
 * All state lives in `gameState.ts`.
 * All logic lives in `actions/`, `effects/`, and `rules/`.
 */

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useGameState();

  return (
    <GameContext.Provider
      value={{
        ...gameState,

        // ✅ precise signature: passes gameState to the logic function
        performAction: (fn: (state: typeof gameState) => void): void => {
          performAction(fn, gameState);
        },

        // ✅ returns ActionResult instead of forcing boolean
        performNamedAction: (
          resourceId: ResourceID,
          actionType: ActionType
        ): ActionResult => {
          return doNamedAction(gameState, resourceId, actionType);
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
