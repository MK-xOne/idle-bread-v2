// src/context/logic/actionHandlers.ts

import { actionRules } from '../rules/actionRules';
import type { ActionType } from '../../data/actionData';
import type { ResourceID } from '../../data/resources';
import type { GameStateHook } from '../types';
import type { ActionResult } from '../actions/performNamedAction';

/**
 * Handles a full actionId like "harvest_wildWheat" by:
 * - Splitting it into actionType and resourceId
 * - Finding the corresponding action rule
 * - Running its `perform` method
 * - Returning a standardized ActionResult
 */
export const handleAction = (
  state: GameStateHook,
  actionId: string
): ActionResult => {
  const [action, resource] = actionId.split('_');
  const [actionType, resourceId] = actionId.split('_') as [ActionType, ResourceID];

  const rule = actionRules[actionType];

  if (!rule || typeof rule.perform !== 'function') {
    console.warn(`[handleAction] No valid rule found for ${actionType}`);
    return { performed: false };
  }

  const result = rule.perform(resourceId, state);

  return {
    performed: true,
    amount: typeof result.amount === 'number' ? result.amount : 0,
    affectsHunger: result.affectsHunger ?? true,
  };
};
