// src/context/logic/actionHandlers.ts
// ------------------------------------------------------
// Handles a full execution of a named action:
// 1. Performs the action
// 2. Tracks outcome
// 3. Applies chaining rules (if any)
// 4. Updates visual feedback
// ------------------------------------------------------

import type { GameStateHook } from '../gameState';
import type { ResourceID } from '../../data/resources';
import type { ActionType } from '../../data/actionData';

import { performNamedAction } from '../actions/performNamedAction';
import { actionRules } from '../rules/actionRules';
import { trackInteraction } from '../tracking/interactionTracker';

/**
 * performGameAction
 * -----------------
 * Central wrapper for executing and resolving an action.
 */
export function performGameAction(
  state: GameStateHook,
  resourceId: ResourceID,
  actionType: ActionType
): void {
  const result = performNamedAction(state, resourceId, actionType);

  // 1. Track the action result
  trackInteraction({
    resource: resourceId,
    actionType,
    result,
    state,
  });

  // 2. Update lastGained (for UI feedback)
  if (result.performed && result.amount > 0) {
    state.setLastGained(prev => ({
      ...prev,
      [resourceId]: result.amount,
    }));
  }

  // 3. Apply chained actions (if defined)
  const rule = actionRules[`${actionType}_${resourceId}`];

  if (result.performed && rule?.chain) {
    for (const chain of rule.chain) {
      const chainedResult = performNamedAction(state, chain.target, chain.action);

      // Optionally track chained interactions too
      trackInteraction({
        resource: chain.target,
        actionType: chain.action,
        result: chainedResult,
        state,
      });

      if (chainedResult.performed && chainedResult.amount > 0) {
        state.setLastGained(prev => ({
          ...prev,
          [chain.target]: chainedResult.amount,
        }));
      }
    }
  }
}
