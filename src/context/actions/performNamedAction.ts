// /context/actions/performNamedAction.ts
import type { GameState } from '../types';
import { resources } from '../../data/resources';
import { actionLabels } from '../../data/actionData';
import type { ActionType } from '../types'; // make sure this exists
import { actionRules } from '../../data/actionRules';
import type { ResourceID } from '../../data/resources';

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
  action: ActionType,
  sourceContext?: { source: ResourceID; sourceAction: ActionType }
): ActionResult => {
  const resource = resources[resourceId];
  const rule = actionRules[action]; // ✅ define once

  console.log(`[performNamedAction] called with:`, { resourceId, action });

  // ❌ Block if starving and rule says to prevent
  if (rule?.blockWhenStarving && state.hunger <= 0) {
    console.warn(`[performNamedAction] Blocked '${action}' due to 0 hunger`);
    return { performed: false, affectsHunger: false };
  }

  // ❌ Block if conditions aren't met
  const isAllowed = rule?.conditions?.every(cond =>
    cond({ resource: resourceId, action, state })
  ) ?? true;

  if (!isAllowed) {
    console.warn(`[performNamedAction] Blocked '${action}' due to failing conditions`);
    return { performed: false, affectsHunger: false };
  }

  // ❌ No action function found
  if (!resource?.actions || typeof resource.actions[action] !== 'function') {
    console.warn(`[performNamedAction] Action '${action}' not found for resource '${resourceId}'`);
    return { performed: false };
  }

  // ✅ Perform action
  const wasPerformed = (resource.actions[action] as (state: GameState) => boolean)(state);

  const hungerCost = actionLabels[action]?.hungerCost ?? 0;
  const affectsHunger = (rule?.alwaysConsumesHunger || wasPerformed) && hungerCost > 0;

  return { performed: wasPerformed, affectsHunger };
};



