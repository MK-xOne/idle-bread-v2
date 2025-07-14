import type { GameState } from '../types';

export const performAction = (
  callback: () => void,
  state: GameState,
  options?: { allowWhenStarving?: boolean }
) => {
  const {
    hunger,
    setHunger,
    primitiveWheatPlanted,
    readyToHarvestPrimitiveWheat,
    setActionsSincePlanting,
    setReadyToHarvestPrimitiveWheat,
  } = state;

  // Prevent action if starving unless override is allowed
  if (hunger <= 0 && !options?.allowWhenStarving) return;

  // Track growth of primitive wheat
  if (primitiveWheatPlanted && !readyToHarvestPrimitiveWheat) {
    setActionsSincePlanting(prev => {
      const next = prev + 1;
      if (next >= 20) {
        setReadyToHarvestPrimitiveWheat(true);
      }
      return next;
    });
  }

  // Run the action logic
  callback();

  // Only reduce hunger if it's not an "eating while starving" exception
  if (!options?.allowWhenStarving) {
    setHunger(prev => Math.max(0, prev - 1));
  }
};
