// /context/actions/performNamedAction.ts
import type { GameState } from '../types';
import { resources } from '../../data/resources';

/**
 * Executes a named action (like 'harvest', 'eat', 'grind') for a specific resource.
 * Returns true if the action function exists and ran, false otherwise.
 */
export const performNamedAction = (
  state: GameState,
  resourceId: keyof typeof resources,
  action: string
): boolean => {
  const resource = resources[resourceId];

  if (!resource?.actions || typeof resource.actions[action] !== 'function') {
    console.warn(`[performNamedAction] Action '${action}' not found for resource '${resourceId}'`);
    return false;
  }

  const result = (resource.actions[action] as (state: GameState) => boolean)(state);

  if (resourceId === 'wildWheat' && action === 'harvest') {
    performNamedAction(state, 'seeds', 'harvest');
  }

  return result;
};

