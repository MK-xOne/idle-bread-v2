import type { GameState } from '../types';

export const performAction = (callback: () => void, state: GameState) => {
  const {
    hunger,
    setHunger,
    primitiveWheatPlanted,
    readyToHarvestPrimitiveWheat,
    setActionsSincePlanting,
    setReadyToHarvestPrimitiveWheat,
  } = state;

  if (hunger <= 0) return;

  if (primitiveWheatPlanted && !readyToHarvestPrimitiveWheat) {
    setActionsSincePlanting(prev => {
      const next = prev + 1;
      if (next >= 20) {
        setReadyToHarvestPrimitiveWheat(true);
      }
      return next;
    });
  }

  callback();
  setHunger(prev => Math.max(0, prev - 1));
};
