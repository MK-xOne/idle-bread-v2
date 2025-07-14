import type { GameState } from '../types';
import { performAction } from './performAction';

  export const harvestWildWheat = (state: GameState) => {
    performAction(() => {
      const hasStoneTools = state.unlockedTechs.has('stoneTools');

      const baseChance = 0.51;
      const bonusChance = hasStoneTools ? 0.25 : 0;
      const successChance = baseChance + bonusChance;

      const roll = Math.random();

      if (roll <= successChance) {
        const baseAmount = Math.floor(Math.random() * 3) + 1; // 1–3
        const bonusAmount = hasStoneTools ? 2 : 0;
        const total = baseAmount + bonusAmount;

        state.setResources(prev => ({
          ...prev,
          wildWheat: prev.wildWheat + total,
          seeds: prev.seeds + (Math.random() < 0.4 ? 1 : 0),
        }));
      }
    }, state);
  };



export const plantPrimitiveWheat = (state: GameState) => {
  const {
    unlockedActions,
    resources,
    primitiveWheatPlanted,
    readyToHarvestPrimitiveWheat,
  } = state;

  if (
    unlockedActions.has('plantPrimitiveWheat') &&
    resources.seeds >= 5 &&
    !primitiveWheatPlanted &&
    !readyToHarvestPrimitiveWheat
  ) {
    console.log("🌾 Plant action triggered");

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
