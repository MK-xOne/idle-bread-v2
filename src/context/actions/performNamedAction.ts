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

  if (!resource || !rule || typeof rule.perform !== 'function') {
    console.warn(`[performNamedAction] Missing rule or perform() for ${action}_${resourceId}`);
    return { performed: false };
  }

  const canPerform = rule.canPerform?.(resourceId, state) ?? true;
  if (!canPerform) {
    return { performed: false, amount: 0, affectsHunger: false };
  }

  const blockWhenStarving = rule.blockWhenStarving ?? true;
  const alwaysConsumes = rule.alwaysConsumesHunger ?? false;

  // ❌ Block action completely if hunger is 0 and rule wants to block when starving
  if (blockWhenStarving && state.hunger <= 0) {
    return { performed: false, amount: 0, affectsHunger: true };
  }

  // ✅ Execute the action
  const result = rule.perform(resourceId, state);

  if (!result || typeof result !== 'object' || !result.amount || result.amount <= 0) {
    return { performed: false };
  }

  // 🔁 Execute chained actions (if hunger allows)
  if (rule.chain && Array.isArray(rule.chain)) {
    for (const chain of rule.chain) {
      const allowed =
        !chain.conditions ||
        chain.conditions.every(cond =>
          cond({ resource: resourceId, action, state })
        );

      if (allowed) {
        const chainedRule = actionRules[chain.action];
        const chainedBlock = chainedRule?.blockWhenStarving ?? true;

        if (chainedBlock && state.hunger <= 0) {
          console.log(`[CHAIN BLOCKED] Skipped ${chain.action} on ${chain.target} due to 0 hunger`);
          continue;
        }

        if (chainedRule?.perform) {
          const chainedResult = chainedRule.perform(chain.target, state);
          if (chainedResult?.amount && chainedResult.amount > 0) {
            console.log(`[CHAIN] Performed ${chain.action} on ${chain.target} due to ${action} on ${resourceId}`);
          }
        }
      }
    }
  }

  // ✅ Deduct hunger if needed
  const affectsHunger = result.affectsHunger ?? true;
  if (affectsHunger && (state.hunger > 0 || alwaysConsumes)) {
    state.setHunger(prev => Math.max(0, prev - 4) +1 );
  }

  return {
    performed: true,
    amount: result.amount ?? 0,
    affectsHunger,
  };
};
