import type { GameState } from '../types';
import { performAction } from './performAction';
import { resources as resourceData } from '../../data/resources'; // at the top


  export const feastOnWildWheat = (state: GameState) => {
    const { hunger, resources } = state;
    const restoreAmount = resourceData.wildWheat.hungerRestore; // 5
    const wheatPerRestore = resourceData.wildWheat.eatCost;

    if (hunger >= 100) return;

    const hungerToRestore = 100 - hunger;

    // How many full restore chunks are needed?
    const fullChunksNeeded = Math.ceil(hungerToRestore / restoreAmount);

    // Total wheat needed based on cost per chunk
    const wheatNeeded = fullChunksNeeded * wheatPerRestore;

    if (resources.wildWheat < wheatNeeded) return;

    performAction(() => {
      state.setResources(prev => ({
        ...prev,
        wildWheat: prev.wildWheat - wheatNeeded,
      }));
      state.setHunger(100);
    }, state, { allowWhenStarving: true });
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

