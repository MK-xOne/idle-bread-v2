import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';
import { actionLabels } from '../data/actionData';

/**
 * types.ts
 * ----------
 * Centralized type definitions for the game's context, actions, modifiers,
 * and interaction tracking systems.
 * 
 * Includes:
 * - `ActionType`: Enum of possible action names
 * - `Modifiers`: Structures for gameplay modifiers like harvest bonuses
 * - `InteractionTracker`: Schema for logging and analyzing player interactions
 * - `GameContextType`: Complete contract for the GameContext provider,
 *   specifying all exposed state variables and updater functions
 * 
 * This file ensures strong type safety across the game architecture and
 * enforces consistency between components, data systems, and UI.
 */

export type ActionType = keyof typeof actionLabels;

export interface HarvestBonus {
  successRateBonus?: number;
  extraYieldRange?: [number, number];
}

export interface Modifiers {
  harvestBonus: {
    [resourceId: string]: HarvestBonus;
  };
}

export type ResourceInteractionType = 'harvest' | 'eat' | 'plant' | 'grind' | 'bake' | 'feast';

export type InteractionStats = {
  attempted: number;
  success: number;
  failed: number;
  gained: number;
};

export type InteractionTracker = {
  [resourceId: string]: {
    [actionType in ResourceInteractionType]?: InteractionStats;
  };
} & {
  __ticks?: number;
};

export interface GameContextType {

  // Start of the Game
  hasClickedFirstRock: boolean;
  setHasClickedFirstRock: React.Dispatch<React.SetStateAction<boolean>>;
  
  lastGained: Partial<Record<ResourceID, number>>;
  setLastGained: React.Dispatch<React.SetStateAction<Partial<Record<ResourceID, number>>>>;

  // 🔄 Resources
  resources: Record<ResourceID, number>;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceID, number>>>;
  
  // InventoryBonus
  maxResourceBonuses: Partial<Record<ResourceID, number>>;

  // Data Tracker
  resourceInteractions: InteractionTracker;
  setResourceInteractions: React.Dispatch<React.SetStateAction<InteractionTracker>>;

  // 🔋 Hunger
  hunger: number;
  setHunger: React.Dispatch<React.SetStateAction<number>>;

  // 🎯 Modifiers
  modifiers: Modifiers;
  setModifiers: (modifierUpdater: (prev: Modifiers) => Modifiers) => void;

  // 🧠 Action dispatcher
  performAction?: (cb: () => void) => void;
  performNamedAction: (id: string) => void;

  // 🧭 Discovery
  discoveredResources: Set<ResourceID>;
  setDiscoveredResources: React.Dispatch<React.SetStateAction<Set<ResourceID>>>;
  discoverResource: (id: ResourceID) => void;

  // 🧱 Tech
  unlockedTechs: Set<TechID>;
  unlockTech: (techId: TechID) => void;

  // ⚙ Actions
  unlockedActions: Set<string>;

  // 🌱 Farming state
  primitiveWheatPlanted: boolean;
  setPrimitiveWheatPlanted: React.Dispatch<React.SetStateAction<boolean>>;

  readyToHarvestPrimitiveWheat: boolean;
  setReadyToHarvestPrimitiveWheat: React.Dispatch<React.SetStateAction<boolean>>;

  // 🔁 Progression mechanics
  grindClicks: number;
  setGrindClicks: React.Dispatch<React.SetStateAction<number>>;

  bakeClicks: number;
  setBakeClicks: React.Dispatch<React.SetStateAction<number>>;

  // 🔧 Stubbed action methods (to be implemented)
  harvestWildWheat?: () => void;
  plantPrimitiveWheat?: () => void;
  harvestPrimitiveWheat?: () => void;
  eatWildWheat?: () => void;
  eatPrimitiveWheat?: () => void;
  grindFlour?: () => void;
  bakeBread?: () => void;
  eatBread?: () => void;
  feastOnWildWheat?: () => void;
  feastOnPrimitiveWheat?: () => void;
}
