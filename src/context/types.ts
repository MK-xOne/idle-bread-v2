import type { Dispatch, SetStateAction } from 'react';

export type ResourceID = 'wildWheat' | 'primitiveWheat' | 'seeds' | 'flour' | 'bread';

export interface GameState {
  hunger: number;
  setHunger: Dispatch<SetStateAction<number>>;

  resources: Record<ResourceID, number>;
  setResources: Dispatch<SetStateAction<Record<ResourceID, number>>>;

  feastUnlocked: boolean;
  plantingUnlocked: boolean;
  wheelUnlocked: boolean;
  fireDiscovered: boolean;

  primitiveWheatPlanted: boolean;
  setPrimitiveWheatPlanted: Dispatch<SetStateAction<boolean>>;

  actionsSincePlanting: number;
  setActionsSincePlanting: Dispatch<SetStateAction<number>>;

  readyToHarvestPrimitiveWheat: boolean;
  setReadyToHarvestPrimitiveWheat: Dispatch<SetStateAction<boolean>>;

  setFeastUnlocked: Dispatch<SetStateAction<boolean>>;
  setPlantingUnlocked: Dispatch<SetStateAction<boolean>>;
  setWheelUnlocked: Dispatch<SetStateAction<boolean>>;
  setFireDiscovered: Dispatch<SetStateAction<boolean>>;

  grindClicks: number;
  setGrindClicks: Dispatch<SetStateAction<number>>;

  bakeClicks: number;
  setBakeClicks: Dispatch<SetStateAction<number>>;
}

export interface GameContextType extends GameState {
  performAction: (cb: () => void) => void;

  harvestWildWheat: () => void;
  eatWildWheat: () => void;
  eatPrimitiveWheat: () => void;

  feastOnWildWheat: () => void;
  feastOnPrimitiveWheat: () => void;

  discoverFire: () => void;

  grindFlour: () => void;
  bakeBread: () => void;
  eatBread: () => void;

  plantPrimitiveWheat: () => void;
  harvestPrimitiveWheat: () => void;
}
