// src/context/logic/resourceHandlers.ts
// ------------------------------------------------------
// Resource-specific logic extensions that don't belong
// in global rules or modifiers. Includes conditional
// systems like growth or secondary yield logic.
// ------------------------------------------------------

import type { GameStateHook } from '../gameState';

/**
 * Returns true if primitive wheat is fully grown
 */
export const isPrimitiveWheatReady = (state: GameStateHook): boolean => {
  return state.readyToHarvestPrimitiveWheat;
};

/**
 * Marks primitive wheat as ready to harvest
 */
export const markPrimitiveWheatReady = (state: GameStateHook): void => {
  state.setReadyToHarvestPrimitiveWheat(true);
};
