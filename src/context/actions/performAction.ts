import type { GameState } from '../types';
import { mechanics } from '../../data/actionData';

export const performAction = (
  callback: () => void,
  state: GameState,
  options?: { allowWhenStarving?: boolean }
) => {
  const {
    hunger,
    setHunger,
  } = state;

  // ✅ Block actions when starving unless allowed
  if (hunger <= 0 && !options?.allowWhenStarving) return;

  // ✅ Run the action
  callback();

  // ✅ Passive growth trigger
  mechanics.grow(state);

  // ✅ Reduce hunger only if not exempt
  if (!options?.allowWhenStarving) {
    setHunger(prev => Math.max(0, prev - 1));
  }
};
