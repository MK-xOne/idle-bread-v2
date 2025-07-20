import type { GameStateHook } from '../gameState';
import { actionRules } from '../rules/actionRules';
import { resources } from '../../data/resources';
import type { ResourceID } from '../../data/resources';
import type { ActionType } from '../../data/actionData';
import type { ActionResult } from '../types'; 

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
  

  if (!result || typeof result !== 'object' || !result.amount || result.amount <= 0) {
    return { performed: false };
  }
  

    // 🔁 Execute any chained actions after success
  if (rule.chain && Array.isArray(rule.chain)) {
    for (const chain of rule.chain) {
      const allowed =
        !chain.conditions ||
        chain.conditions.every(cond =>
          cond({ resource: resourceId, action, state })
        );

      if (allowed) {
        const chainedRule = actionRules[chain.action];
        if (chainedRule?.perform) {
          const chainedResult = chainedRule.perform(chain.target, state);

          if (chainedResult?.amount && chainedResult.amount > 0) {
            console.log(
              `[CHAIN] Performed ${chain.action} on ${chain.target} due to ${action} on ${resourceId}`
            );
          }
        }
      }
    }
  }


  return {
    performed: true,
    amount: result.amount ?? 0,
    affectsHunger: result.affectsHunger ?? true,
  };
};
