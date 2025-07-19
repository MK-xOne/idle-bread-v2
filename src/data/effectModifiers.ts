import type { GameState } from "../context/types";
import type { ResourceID } from "./resources";

/**
 * effectModifiers.ts
 * --------------------
 * Defines and applies gameplay effects that modify player state or mechanics.
 * 
 * Supported effect types:
 * - `harvestBonus`: Improves success rate and yield range for harvesting specific resources
 * - `MaxInventoryBonus`: Increases inventory cap for one or all resource types
 * 
 * Core method:
 * - `applyEffect`: Mutates the current game state by applying the effect logic,
 *   merging additive bonuses into the `modifiers` field of GameState.
 * 
 * This system provides a flexible way to apply upgrades, tech unlocks,
 * or item effects without hardcoding logic into core systems.
 */

type HarvestBonusEffect = {
  type: 'harvestBonus';
  resource: string;
  successRateBonus?: number;
  extraYieldRange?: [number, number];
};

type MaxInventoryBonus = {
  type: 'MaxInventoryBonus';
  resource : ResourceID | 'all';
  amount: number
};

type Effect = HarvestBonusEffect | MaxInventoryBonus;


export const effectModifiers = {
  applyEffect: (effect: Effect, state: GameState) => {

    switch (effect.type) {
     
      case 'harvestBonus': {
        const prev = state.modifiers?.harvestBonus ?? {};
        const current = prev[effect.resource] ?? {
          successRateBonus: 0,
          extraYieldRange: [0, 0],
        };

        const merged = {
          successRateBonus:
            (current.successRateBonus ?? 0) +
            (effect.successRateBonus ?? 0),
          extraYieldRange: [
            (effect.extraYieldRange?.[0] ?? 0),
            (effect.extraYieldRange?.[1] ?? 0),
          ],
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
        const targetResources = effect.resource === 'all'
          ? Object.keys(state.resources) as ResourceID[]
          : [effect.resource];

        state.setMaxResourceBonuses(prev => {
          const updated = { ...prev };
          for (const res of targetResources) {
            updated[res] = (updated[res] ?? 0) + effect.amount;
          }
          return updated;
        });
        break;
      }
    }
  },

  getHarvestModifier: (state: GameState, resourceId: string) => {
    return state.modifiers?.harvestBonus?.[resourceId] ?? {
      successRateBonus: 0,
      extraYieldRange: [0, 0],
    };
  },
};
