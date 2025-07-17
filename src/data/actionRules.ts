import type { ActionType } from './actionData';
import type { ResourceID } from './resources';
import { resources } from './resources';
import type { GameState } from '../context/types';

export interface ActionRule {
  chain?: {
    target: ResourceID;
    action: ActionType;
    conditions?: ((ctx: { resource: ResourceID; action: ActionType; state: GameState }) => boolean)[];
  }[];
  
  conditions?: ((ctx: { resource: ResourceID; action: ActionType; state: GameState }) => boolean)[];
  alwaysConsumesHunger?: boolean;
  blockWhenStarving?: boolean;
}

// ✅ Internal helper to avoid copy-pasting
const hasRoomFor = (resource: ResourceID, state: GameState): boolean => {
  const current = state.resources[resource];
  const baseMax = resources[resource]?.maxAmount ?? 100;
  const bonus = state.maxResourceBonuses?.[resource] ?? 0;
  return current < (baseMax + bonus);
};

const hasAnyOf = (resource: ResourceID, state: GameState): boolean => {
  return state.resources[resource] > 0;
};

export const actionRules: Partial<Record<ActionType, ActionRule>> = {
  harvest: {
    blockWhenStarving: true,
  chain: [
    {
      action: "harvest",
      target: "seeds",
      conditions: [
        ({ resource }) => resource === "wildWheat",
      ],
    },
  ],
  conditions: [
    ({ resource, state }) => {
      const current = state.resources[resource];
      const baseMax = resources[resource]?.maxAmount ?? 100;
      const bonus = state.maxResourceBonuses?.[resource] ?? 0;
      const totalMax = baseMax + bonus;

      if (resources[resource]?.maxAmount === undefined) return true;
      if (current < totalMax) return true;

      const bonusChance = state.modifiers?.harvestBonus?.[resource]?.successRateBonus ?? 0;
      return bonusChance > 0;
      }
    ],
    alwaysConsumesHunger: true,  // <-- 👈 Important line
  },
  plant: {
    blockWhenStarving: true,
  },
  grind: {
    blockWhenStarving: true,
  },
  bake: {
    blockWhenStarving: true,
  },
};
