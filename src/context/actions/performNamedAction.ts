// /context/actions/performNamedAction.ts
import type { GameState } from '../types';
import { resources } from '../../data/resources';
import { actionLabels } from '../../data/actionData';
import type { ActionType } from '../types'; // make sure this exists
import { actionRules } from '../../data/actionRules';
import type { ResourceID } from '../../data/resources';
import { trackInteraction } from '../../data/tracking';

/**
 * performNamedAction.ts
 * -----------------------
 * Executes a specific action (e.g. 'harvest', 'eat', 'grind') tied to a resource.
 * 
 * This function:
 * - Looks up the action rule from `actionRules`
 * - Validates and runs the rule’s logic for the given resource
 * - Tracks interactions for analytics/stats
 * - Returns whether the action was performed and if it should affect hunger
 * 
 * Serves as the core dispatcher for dynamic, resource-specific actions
 * based on player input or automated game flow.
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
  const rule = actionRules[action];

  const beforeAmount = state.resources[resourceId] ?? 0;

  // ✅ Track attempt
  trackInteraction(state.setTracker, resourceId, action, { attempted: 1 });

  if (rule?.blockWhenStarving && state.hunger <= 0) {
    console.warn(`[performNamedAction] Blocked '${action}' due to 0 hunger`);
    return { performed: false, affectsHunger: false };
  }

  const isAllowed = rule?.conditions?.every(cond =>
    cond({ resource: resourceId, action, state })
  ) ?? true;

  if (!isAllowed) {
    console.warn(`[performNamedAction] Blocked '${action}' due to failing conditions`);
    trackInteraction(state.setTracker, resourceId, action, { failed: 1 });
    return { performed: false, affectsHunger: false };
  }

  if (!resource?.actions || typeof resource.actions[action] !== 'function') {
    console.warn(`[performNamedAction] Action '${action}' not found for resource '${resourceId}'`);
    trackInteraction(state.setTracker, resourceId, action, { failed: 1 });
    return { performed: false };
  }

  const wasPerformed = (resource.actions[action] as (state: GameState) => boolean)(state);
  const afterAmount = state.resources[resourceId] ?? 0;

  const gained = Math.max(0, afterAmount - beforeAmount);

  if (wasPerformed) {
    trackInteraction(state.setTracker, resourceId, action, {
      success: 1,
      gained,
    });
  } else {
    trackInteraction(state.setTracker, resourceId, action, { failed: 1 });
  }

  const hungerCost = actionLabels[action]?.hungerCost ?? 0;
  const affectsHunger = (rule?.alwaysConsumesHunger || wasPerformed) && hungerCost > 0;

  return { performed: wasPerformed, affectsHunger };
};


