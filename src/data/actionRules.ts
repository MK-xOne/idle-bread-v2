import type { ActionType } from './actionData';
import type { ResourceID } from './resources';
import { resources } from './resources';
import type { GameState } from '../context/types';
import { mechanics } from './actionData';


export interface ActionRule {
  chain?: {
    target: ResourceID;
    action: ActionType;
    conditions?: ((ctx: { resource: ResourceID; action: ActionType; state: GameState }) => boolean)[];
  }[];
  onTick?: (state: GameState) => void;
  conditions?: ((ctx: { resource: ResourceID; action: ActionType; state: GameState }) => boolean)[];
  alwaysConsumesHunger?: boolean;
  blockWhenStarving?: boolean;
}

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
    conditions: [
      ({ state }) => state.resources.seeds >= 5,
      ({ state }) => !state.primitiveWheatPlanted,
      ({ state }) => !state.readyToHarvestPrimitiveWheat,
  ]
  },
  grow: {
    onTick: (state) => {
      if (
        state.primitiveWheatPlanted &&
        !state.readyToHarvestPrimitiveWheat
      ) {
        mechanics.grow(state);
      }
    }
  },
  grind: {
    blockWhenStarving: true,
    conditions: [
    ({ state }) => state.resources.primitiveWheat >= 1,
    ],
  },
  bake: {
    blockWhenStarving: true,
    conditions: [
    ({ state }) => state.resources.flour >= 1,
    ],
  },
  eat: {
  conditions: [
    ({ resource, state }) => state.resources[resource] >= (resources[resource]?.eatCost ?? 1),
    ({ state }) => state.hunger < 100,
  ]
  },
  feast: {
  conditions: [
    ({ resource, state }) => {
      const hunger = state.hunger;
      const restore = resources[resource]?.hungerRestore ?? 0;
      const needed = 100 - hunger;
      const requiredAmount = Math.ceil(needed / restore);
      return state.resources[resource] >= requiredAmount;
    },
    ({ state }) => state.hunger < 100,
  ]
  },

};
