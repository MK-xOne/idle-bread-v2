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
import { useEffect } from "react"; // make sure this is at the top

/**
 * GameProvider
 * ---------------------
 * Wraps the app with game logic and state.
 */
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useGameState();

  const farmSlots = Array.from({ length: 18 }, () => ({
  plantedTick: null,
  state: "empty" as "empty" | "planted" | "growing" | "readyToHarvest",
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTick = gameState.getTick();
      gameState.perform((state) => {
        state.farmSlots.forEach((slot, i) => {
          if (slot.state === "planted" && currentTick - (slot.plantedTick ?? 0) >= 5) {
            slot.state = "growing";
          }
        });
      });
    }, 1000); // 1-second interval, adjust if needed

    return () => clearInterval(interval);
  }, []);


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
        performNamedAction,
        farmSlots,
      
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
