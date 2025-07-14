import type { GameState } from '../types';
import { performAction } from './performAction';

export const feastOnWildWheat = (state: GameState) => {
  const { feastUnlocked, resources, hunger } = state;

  if (feastUnlocked && resources.wildWheat >= 10 && hunger < 100) {
    performAction(() => {
      state.setResources(prev => ({
        ...prev,
        wildWheat: prev.wildWheat - 10,
      }));
      state.setHunger(100);
    }, state, { allowWhenStarving: true });
  }
};

export const feastOnPrimitiveWheat = (state: GameState) => {
  const { feastUnlocked, resources, hunger } = state;

  if (feastUnlocked && resources.primitiveWheat >= 10 && hunger < 100) {
    performAction(() => {
      state.setResources(prev => ({
        ...prev,
        primitiveWheat: prev.primitiveWheat - 10,
      }));
      state.setHunger(100);
    }, state, { allowWhenStarving: true });
  }
};
