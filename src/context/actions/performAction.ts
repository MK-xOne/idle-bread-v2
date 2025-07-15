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

  // Prevent action if starving unless override is allowed
  if (hunger <= 0 && !options?.allowWhenStarving) return;

  // Run the action logic
  callback();

  // Reduce hunger (unless eating/feasting while starving)
  if (!options?.allowWhenStarving) {
    setHunger(prev => Math.max(0, prev - 1));
  }

  // ✅ Trigger grow passively after any action
  mechanics.grow(state);
};
