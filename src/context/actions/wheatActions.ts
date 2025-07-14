import type { GameState } from '../types';
import { performAction } from './performAction';

export const harvestWildWheat = (state: GameState) => {
  performAction(() => {
    const { stoneToolsUnlocked } = state;
    const baseChance = 0.51;
    const bonusMultiplier = stoneToolsUnlocked ? 0.25 : 0;
    const successChance = baseChance * (1 + bonusMultiplier); // = 63.75% when stone tools unlocked

    const chance = Math.random();

    if (chance <= successChance) {
      const baseAmount = Math.floor(Math.random() * 3) + 1; // 1–3
      const bonusAmount = stoneToolsUnlocked ? 2 : 0;
      const totalAmount = baseAmount + bonusAmount;

      state.setResources(prev => ({
        ...prev,
        wildWheat: prev.wildWheat + totalAmount,
        seeds: prev.seeds + (Math.random() < 0.4 ? 1 : 0),
      }));
    }

  }, state);
};


export const plantPrimitiveWheat = (state: GameState) => {
  const {
    plantingUnlocked,
    resources,
    primitiveWheatPlanted,
    readyToHarvestPrimitiveWheat,
  } = state;

  if (
    plantingUnlocked &&
    resources.seeds >= 5 &&
    !primitiveWheatPlanted &&
    !readyToHarvestPrimitiveWheat
  ) {
    performAction(() => {
      state.setResources(prev => ({
        ...prev,
        seeds: prev.seeds - 5,
      }));
      state.setPrimitiveWheatPlanted(true);
      state.setActionsSincePlanting(0);
      state.setReadyToHarvestPrimitiveWheat(false);
    }, state);
  }
};

export const harvestPrimitiveWheat = (state: GameState) => {
  if (state.readyToHarvestPrimitiveWheat) {
    performAction(() => {
      state.setResources(prev => ({
        ...prev,
        primitiveWheat: prev.primitiveWheat + 10,
      }));
      state.setPrimitiveWheatPlanted(false);
      state.setReadyToHarvestPrimitiveWheat(false);
      state.setActionsSincePlanting(0);
    }, state);
  }
};

export const eatWildWheat = (state: GameState) => {
  const { resources, hunger } = state;
  if (resources.wildWheat >= 10 && hunger < 99) {
    performAction(() => {
      state.setResources(prev => ({
        ...prev,
        wildWheat: prev.wildWheat - 10,
      }));
      state.setHunger(prev => Math.min(100, prev + 8));
    }, state, { allowWhenStarving: true });
  }
};

export const eatPrimitiveWheat = (state: GameState) => {
  const { resources, hunger } = state;
  if (resources.primitiveWheat >= 10 && hunger < 99) {
    performAction(() => {
      state.setResources(prev => ({
        ...prev,
        primitiveWheat: prev.primitiveWheat - 10,
      }));
      state.setHunger(prev => Math.min(100, prev + 20));
    }, state, { allowWhenStarving: true });
  }
};
