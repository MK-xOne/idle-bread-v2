import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';

/**
 * gameState.ts
 * ----------------
 * Defines the shape and update mechanisms of the core game state interface.
 * 
 * The `GameState` interface provides a fully typed contract for:
 * - Resource management
 * - Technology progression
 * - Hunger tracking
 * - Growth and interaction logic (e.g. primitive wheat)
 * - UI-related flags and click counters (e.g. grind, bake)
 * 
 * This type is used by the `GameProvider` to enforce consistent, reactive
 * state updates across the game loop and UI rendering.
 */

export interface GameState {
  hasClickedFirstRock: boolean;
  setHasClickedFirstRock: React.Dispatch<React.SetStateAction<boolean>>;

  resources: Record<ResourceID, number>;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceID, number>>>;

  unlockedTechs: Set<TechID>;
  unlockTech: (techId: TechID) => void;

  hunger: number;
  setHunger: React.Dispatch<React.SetStateAction<number>>;

  primitiveWheatPlanted: boolean;
  setPrimitiveWheatPlanted: React.Dispatch<React.SetStateAction<boolean>>;

  actionsSincePlanting: number;
  setActionsSincePlanting: React.Dispatch<React.SetStateAction<number>>;

  readyToHarvestPrimitiveWheat: boolean;
  setReadyToHarvestPrimitiveWheat: React.Dispatch<React.SetStateAction<boolean>>;

  grindClicks: number;
  setGrindClicks: React.Dispatch<React.SetStateAction<number>>;

  bakeClicks: number;
  setBakeClicks: React.Dispatch<React.SetStateAction<number>>;

  plantedAtTick: number | null;
  setPlantedAtTick: React.Dispatch<React.SetStateAction<number | null>>;

  getTick: () => number;
}

