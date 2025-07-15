// /context/actions/performNamedAction.ts
import type { GameState } from '../types';
import { resources } from '../../data/resources';

/**
 * Executes a named action (like 'harvest', 'eat', 'grind') for a specific resource.
 * This is a generic dispatcher that checks if the resource has the action defined.
 */
export const performNamedAction = (
  state: GameState,
  resourceId: keyof typeof resources,
  action: string
) => {
  const resource = resources[resourceId];

  if (!resource || !resource.actions || typeof resource.actions[action] !== 'function') {
    console.warn(`[performNamedAction] Action '${action}' not found for resource '${resourceId}'`);
    return;
  }

  resource.actions[action](state);
};
