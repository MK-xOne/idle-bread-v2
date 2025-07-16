import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';

export interface HarvestBonus {
  successRateBonus?: number;
  extraYieldRange?: [number, number];
}

export interface Modifiers {
  harvestBonus: {
    [resourceId: string]: HarvestBonus;
  };
}

export type ResourceInteractionType = 'harvested' | 'eaten' | 'planted' | 'grown' | 'grinded' | 'baked';

export type InteractionTracker = {
  [resourceId in ResourceID]?: {
    [action in ResourceInteractionType]?: number;
  };
};

export interface GameContextType {
  // 🔄 Resources
  resources: Record<ResourceID, number>;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceID, number>>>;
  
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
  performAction: (cb: () => void) => void;
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

  actionsSincePlanting: number;
  setActionsSincePlanting: React.Dispatch<React.SetStateAction<number>>;

  readyToHarvestPrimitiveWheat: boolean;
  setReadyToHarvestPrimitiveWheat: React.Dispatch<React.SetStateAction<boolean>>;

  // 🔁 Progression mechanics
  grindClicks: number;
  setGrindClicks: React.Dispatch<React.SetStateAction<number>>;

  bakeClicks: number;
  setBakeClicks: React.Dispatch<React.SetStateAction<number>>;

  // 🔧 Stubbed action methods (to be implemented)
  harvestWildWheat: () => void;
  plantPrimitiveWheat: () => void;
  harvestPrimitiveWheat: () => void;
  eatWildWheat: () => void;
  eatPrimitiveWheat: () => void;
  grindFlour: () => void;
  bakeBread: () => void;
  eatBread: () => void;
  feastOnWildWheat: () => void;
  feastOnPrimitiveWheat: () => void;
}
