import type { GameStateHook } from '../gameState';
import { actionRules } from '../rules/actionRules';
import { resources } from '../../data/resources';
import type { ResourceID } from '../../data/resources';
import type { ActionType } from '../../data/actionData';
import type { ActionResult } from '../types'; // ✅ correct

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

  // ✅ Proper call to optional canPerform function inside the rule object
  const canPerform = rule?.canPerform?.(resourceId, state) ?? true; // ✅
  if (!rule.perform || typeof rule.perform !== "function") {
    return { performed: false };
  }


  // ✅ Call the rule's perform method correctly
  if (typeof rule.perform !== "function") {
    console.warn(`[performNamedAction] No perform function defined for ${action}_${resourceId}`);
    return { performed: false };
  }

  const result = rule.perform(resourceId, state);

  if (!result || typeof result !== 'object') {
    return { performed: true };
  }

  return {
    performed: true,
    amount: result.amount ?? 0,
    affectsHunger: result.affectsHunger ?? true,
  };
};
