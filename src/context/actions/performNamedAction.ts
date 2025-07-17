// /context/actions/performNamedAction.ts
import type { GameState } from '../types';
import { resources } from '../../data/resources';
import { actionLabels } from '../../data/actionData';
import type { ActionType } from '../types'; // make sure this exists

/**
 * Executes a named action (like 'harvest', 'eat', 'grind') for a specific resource.
 * Returns true if the action function exists and ran, false otherwise.
 */

export type ActionResult = {
  performed: boolean;
  affectsHunger?: boolean;
};

export const performNamedAction = (
  state: GameState,
  resourceId: keyof typeof resources,
  action: ActionType
): ActionResult => {
  const resource = resources[resourceId];

  console.log(`[performNamedAction] called with:`, { resourceId, action });

  if (!resource?.actions || typeof resource.actions[action] !== 'function') {
    console.warn(`[performNamedAction] Action '${action}' not found for resource '${resourceId}'`);
    return { performed: false };
  }

  const performed = (resource.actions[action] as (state: GameState) => boolean)(state);
  const affectsHunger = performed && actionLabels[action]?.hungerImpact;

  return { performed, affectsHunger };
};

