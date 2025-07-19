// src/context/effects/applyEffect.ts
// ------------------------------------------------------
// Central effect dispatcher. Applies upgrade effects like
// harvest bonuses or max inventory boosts.
// These are typically triggered when techs are unlocked.
// ------------------------------------------------------

import type { GameStateHook } from '../gameState';
import type { ResourceID } from '../../data/resources';

/* ---------- Effect Types ---------- */

type HarvestBonusEffect = {
  type: 'harvestBonus';
  resource: ResourceID;
  successRateBonus?: number;
  extraYieldRange?: [number, number];
};

type MaxInventoryBonusEffect = {
  type: 'MaxInventoryBonus';
  resource: ResourceID | 'all';
  amount: number;
};

export type Effect = HarvestBonusEffect | MaxInventoryBonusEffect;

/* ---------- Effect Dispatcher ---------- */

export const applyEffect = (effect: Effect, state: GameStateHook): void => {
  switch (effect.type) {
    case 'harvestBonus': {
      const prev = state.modifiers.harvestBonus ?? {};
      const current = prev[effect.resource] ?? {
        successRateBonus: 0,
        extraYieldRange: [0, 0],
      };

      const merged = {
        successRateBonus: (current.successRateBonus ?? 0) + (effect.successRateBonus ?? 0),
        extraYieldRange: [
          (current.extraYieldRange?.[0] ?? 0) + (effect.extraYieldRange?.[0] ?? 0),
          (current.extraYieldRange?.[1] ?? 0) + (effect.extraYieldRange?.[1] ?? 0),
        ] as [number, number],
      };

      state.setModifiers(prev => ({
        ...prev,
        harvestBonus: {
          ...prev.harvestBonus,
          [effect.resource]: merged,
        },
      }));
      break;
    }

  case 'MaxInventoryBonus': {
    if (effect.resource === 'all') {
      // TypeScript knows: effect is MaxInventoryBonusEffect_All
      state.setMaxResourceBonuses(prev => {
        const updated = { ...prev };
        for (const key in state.resources) {
          const id = key as ResourceID;
          updated[id] = (updated[id] ?? 0) + effect.amount;
        }
        return updated;
      });
    } else {
       // 💡 Explicitly assign to local `resId: ResourceID`
      const resId: ResourceID = effect.resource;

      // TypeScript knows: effect is MaxInventoryBonusEffect_Single
      state.setMaxResourceBonuses(prev => ({
        ...prev,
       [resId]: (prev[resId] ?? 0) + effect.amount,
      }));
    }
    break;
  }


    default:
      console.warn(`[applyEffect] Unknown effect type: ${effect}`);
  }
};
