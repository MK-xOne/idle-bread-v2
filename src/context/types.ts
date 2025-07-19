// src/context/types.ts
// ------------------------------------------------------
// Central type definitions for:
// - Action names and effects
// - Modifiers
// - Resource interaction tracking
// - Game context structure
//
// This file ensures type safety and consistency across
// game logic, UI, and global state management.
// ------------------------------------------------------

import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';
import type { GameStateHook } from './gameState';
import { actionLabels } from '../data/actionData';

/* ---------- ACTION TYPES ---------- */

export type ActionType = keyof typeof actionLabels;

/** These are actions that can be logged/tracked */
export type ResourceInteractionType =
  | 'harvest'
  | 'eat'
  | 'plant'
  | 'grind'
  | 'bake'
  | 'feast';

/* ---------- MODIFIER STRUCTURES ---------- */

export interface HarvestBonus {
  successRateBonus?: number;
  extraYieldRange?: [number, number];
}

export interface Modifiers {
  harvestBonus: {
    [resourceId: string]: HarvestBonus;
  };
}

/* ---------- TRACKING ---------- */

export type InteractionStats = {
  attempted: number;
  success: number;
  failed: number;
  gained: number;
};

export type ActionMap = {
  [actionType in ResourceInteractionType]?: InteractionStats;
};

export interface InteractionTracker {
  [resourceId: string]: ActionMap;
}

// Separate metadata type
export interface TrackerState {
  tracker: InteractionTracker;
  __ticks: number;
}


/* ---------- CONTEXT TYPE ---------- */

/**
 * Full type used by the React GameContext.
 * This combines the raw game state from `useGameState`
 * with the logic bindings injected by GameProvider.
 */
export type GameContextType = GameStateHook & {
  performAction: (fn: (state: GameStateHook) => void) => void;
  performNamedAction: (resourceId: ResourceID, action: ActionType) => ActionResult;
};

