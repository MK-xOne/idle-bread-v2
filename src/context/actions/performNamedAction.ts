// src/context/actions/performNamedAction.ts
// ------------------------------------------------------
// Executes a named action (e.g. 'harvest', 'eat') on a resource.
// Pulls the rule from actionRules and applies its logic.
// ------------------------------------------------------

import type { GameStateHook } from '../gameState';
import type { ResourceID } from '../../data/resources';
import type { ActionType } from '../../data/actionData';
import { resources } from '../../data/resources';
import { actionRules } from '../rules/actionRules';

export type ActionResult = {
  performed: boolean;
  amount?: number;          // amount gained or consumed
  affectsHunger?: boolean;  // whether hunger should decrease
};

/**
 * performNamedAction
 * ------------------
 * Dispatches the correct rule logic for a given (resource, action).
 */
export const performNamedAction = (
  state: GameStateHook,
  resourceId: ResourceID,
  action: ActionType
): ActionResult => {
  const resource = resources[resourceId];
  const rule = actionRules[action];

  if (!resource || !rule) {
    console.warn(`[performNamedAction] Missing rule or resource for ${action}_${resourceId}`);
    return { performed: false };
  }

  const canPerform = rule.canPerform?.(resourceId, state) ?? true;
  if (!canPerform) {
    return { performed: false };
  }

  // Execute the core mechanic (e.g., harvest, eat)
  const result = rule.perform(resourceId, state);

  // Ensure it returns something meaningful
  if (!result || typeof result !== 'object') {
    return { performed: true };
  }

  return {
    performed: true,
    amount: result.amount ?? 0,
    affectsHunger: result.affectsHunger ?? true,
  };
};
