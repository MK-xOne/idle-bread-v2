import type { GameState } from "../context/types";

type HarvestBonusEffect = {
  type: 'harvestBonus';
  resource: string;
  successRateBonus?: number;
  extraYieldRange?: [number, number];
};

type Effect = HarvestBonusEffect; // Add more types as needed later

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
    }
  },

  getHarvestModifier: (state: GameState, resourceId: string) => {
    return state.modifiers?.harvestBonus?.[resourceId] ?? {
      successRateBonus: 0,
      extraYieldRange: [0, 0],
    };
  },
};
