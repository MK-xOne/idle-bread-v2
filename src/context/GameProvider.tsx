// src/context/GameProvider.tsx
// --------------------------------------------------
// Main state provider that wraps the app and exposes
// game logic via GameContext.
// --------------------------------------------------

import { GameContext } from "./GameContext";
import type { ReactNode } from "react";
import { useGameState } from "./gameState";
import { performAction } from "./actions/performAction";
import { performNamedAction as doNamedAction } from "./actions/performNamedAction";
import { actionLabels } from "../data/actionData";

/**
 * GameProvider
 * ---------------------
 * Wraps the app with game logic and state.
 */
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useGameState();

  // Performs a generic action
  const perform = (fn: (state: typeof gameState) => void) => {
    performAction(fn, gameState);
  };

  // Wrapper for performing a named action (e.g., 'harvest' wildWheat)
  const performNamedAction = (resourceId: string, action: string) => {
    const resId = resourceId as keyof typeof gameState.resources;
    const act = action as keyof typeof actionLabels;
    return doNamedAction(gameState, resId, act);
  };

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        perform,
        performNamedAction: (resourceId, actionType) =>
        performNamedAction(gameState, resourceId, actionType),
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
