// src/context/logic/resourceHandlers.ts
// ------------------------------------------------------
// Resource-specific logic extensions that don't belong
// in global rules or modifiers. Includes conditional
// systems like growth or secondary yield logic.
// ------------------------------------------------------

import type { ResourceID } from '../../data/resources';
import type { GameStateHook } from '../gameState';

/**
 * Called after a successful harvest of a resource.
 * Can trigger secondary effects (like getting seeds).
 */
export const onHarvestFrom = (sourceId: ResourceID, state: GameStateHook): void => {
  // Example: harvesting wildWheat might yield seeds
  if (sourceId === 'wildWheat' && Math.random() < 0.5) {
    const current = state.resources.seeds;
    const max = 50;

    state.setResources(prev => ({
      ...prev,
      seeds: Math.min(current + 1, max),
    }));
  }
};

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
