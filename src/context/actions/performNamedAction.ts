// /context/actions/performNamedAction.ts
import type { GameState } from '../types';
import { resources } from '../../data/resources';
import { actionLabels } from '../../data/actionData';
import type { ActionType } from '../types'; // make sure this exists
import { actionRules } from '../../data/actionRules';

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
  const rule = actionRules[action]; // ✅ define once here

  console.log(`[performNamedAction] called with:`, { resourceId, action });

  if (rule?.blockWhenStarving && state.hunger <= 0) {
    console.warn(`[performNamedAction] Blocked '${action}' due to 0 hunger`);
    return { performed: false, affectsHunger: false };
  }

  if (!resource?.actions || typeof resource.actions[action] !== 'function') {
    console.warn(`[performNamedAction] Action '${action}' not found for resource '${resourceId}'`);
    return { performed: false };
  }

  const wasAttempted = true;
  const wasPerformed = (resource.actions[action] as (state: GameState) => boolean)(state);

  const hungerCost = actionLabels[action]?.hungerCost ?? 0;
  const affectsHunger = (rule?.alwaysConsumesHunger || wasPerformed) && hungerCost > 0;

  return { performed: wasPerformed || wasAttempted, affectsHunger };
};


