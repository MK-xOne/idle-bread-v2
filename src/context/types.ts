import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';


export interface HarvestBonus {
  successRateBonus?: number;              // e.g. +25% success rate
  extraYieldRange?: [number, number];     // e.g. +[4, 7] extra yield
}

export interface Modifiers {
  harvestBonus: {
    [resourceId: string]: HarvestBonus;
  };
}

export interface GameContextType {
  resources: Record<ResourceID, number>;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceID, number>>>;

  hunger: number;
  setHunger: React.Dispatch<React.SetStateAction<number>>;

  modifiers: {
   modifiers: Modifiers;

  setModifiers: (modifierUpdater: (prev: Modifiers) => Modifiers) => void;

  performNamedAction: (id: string) => void;

  discoveredResources: Set<ResourceID>;
  setDiscoveredResources: React.Dispatch<React.SetStateAction<Set<ResourceID>>>;
  discoverResource: (id: ResourceID) => void;

  unlockedTechs: Set<TechID>;
  unlockTech: (techId: TechID) => void;
  
  unlockedActions: Set<string>;

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

  // Core action methods
  performAction: (cb: () => void) => void;
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
},
}
