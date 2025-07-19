// src/context/tracking/tracking.ts
// ------------------------------------------------------
// Provides tracking utilities to manage resource interaction
// statistics and a global tick counter.
// ------------------------------------------------------

import type { GameStateHook } from '../context/gameState';
import type { ResourceID } from '../data/resources';
import type {
  InteractionTracker,
  TrackerState,
  ResourceInteractionType,
  InteractionStats,
} from '../context/types';

/**
 * advanceTick
 * -------------------
 * Increments the global tick counter stored in the tracker state.
 */
export const advanceTick = (state: GameStateHook): void => {
  state.setTracker(prev => ({
    ...prev,
    __ticks: (prev.__ticks ?? 0) + 1,
  }));
};

/**
 * resetTracker
 * -------------------
 * Clears all interaction data and resets tick counter.
 */
export const resetTracker = (state: GameStateHook): void => {
  state.setTracker({
    tracker: {} as InteractionTracker,
    __ticks: 0,
  });
};

/**
 * getInteractionStats
 * -------------------
 * Returns stats for a specific (resource, action) pair.
 */
export const getInteractionStats = (
  state: GameStateHook,
  resource: ResourceID,
  action: ResourceInteractionType
): InteractionStats | undefined => {
  return state.tracker.tracker[resource]?.[action];
};

/**
 * getTotalTicks
 * -------------------
 * Returns the number of total game ticks from tracker state.
 */
export const getTotalTicks = (state: GameStateHook): number => {
  return state.tracker.__ticks ?? 0;
};
