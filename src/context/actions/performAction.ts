import type { GameState } from '../types';
import { mechanics } from '../../data/actionData';

/**
 * performAction Utility
 * ----------------------
 * A centralized executor for game actions that:
 * 1. Prevents execution if the player is starving (unless explicitly allowed)
 * 2. Runs the provided action logic via callback
 * 3. Triggers passive game mechanics (e.g., plant growth)
 * 4. Deducts 1 hunger point by default
 * 
 * This wrapper ensures consistent application of core gameplay rules
 * and allows options (e.g., allowWhenStarving) to override constraints
 * in controlled scenarios like feasting.
 */


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
