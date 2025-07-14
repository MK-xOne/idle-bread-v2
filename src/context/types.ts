import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';

export interface GameContextType {
  resources: Record<ResourceID, number>;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceID, number>>>;

  hunger: number;
  setHunger: React.Dispatch<React.SetStateAction<number>>;

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
}
