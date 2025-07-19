// src/data/actionRules.ts
// ------------------------------------------------------
// Declarative definitions of each action's logic,
// execution conditions, and chaining behavior.
// Used by performNamedAction() to resolve gameplay input.
// ------------------------------------------------------

import type { ResourceID } from '../../data/resources';
import { resources } from '../../data/resources';

import type { GameStateHook } from '../../context/gameState';
import type { ActionType } from '../../data/actionData';

export interface ActionRule {
  canPerform?: (resourceId: ResourceID, state: GameStateHook) => boolean;

  perform: (resourceId: ResourceID, state: GameStateHook) => {
    amount?: number;
    affectsHunger?: boolean;
  };

  chain?: {
    target: ResourceID;
    action: ActionType;
    conditions?: ((ctx: {
      resource: ResourceID;
      action: ActionType;
      state: GameStateHook;
    }) => boolean)[];
  }[];

  onTick?: (state: GameStateHook) => void;
  alwaysConsumesHunger?: boolean;
  blockWhenStarving?: boolean;
}

export const actionRules: Partial<Record<ActionType, ActionRule>> = {
  harvest: {
    canPerform: (resourceId, state) => {
      const res = state.resources[resourceId] ?? 0;
      const max = resources[resourceId].maxAmount ?? 100;
      return res < max;
    },

    perform: (resourceId, state) => {
      const range = resources[resourceId].harvestAmount ?? [1, 1];
      const amount = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

      state.setResources(prev => ({
        ...prev,
        [resourceId]: Math.min(
          (prev[resourceId] ?? 0) + amount,
          resources[resourceId].maxAmount ?? 100
        ),
      }));

      return { amount, affectsHunger: true };
    },

    blockWhenStarving: true,

    chain: [
      {
        target: 'seeds',
        action: 'harvest',
        conditions: [
          ({ resource }) => resource === 'wildWheat',
          () => Math.random() < 0.5,
        ],
      },
    ],
  },

  eat: {
    canPerform: (resourceId, state) => {
      return state.resources[resourceId] > 0 && state.hunger < 100;
    },

    perform: (resourceId, state) => {
      const restore = resources[resourceId].hungerRestore ?? 5;
      const hungerToRestore = Math.min(restore, 100 - state.hunger);

      state.setHunger(prev => Math.min(100, prev + hungerToRestore));
      state.setResources(prev => ({
        ...prev,
        [resourceId]: prev[resourceId] - 1,
      }));

      return { amount: 1, affectsHunger: false };
    },

    alwaysConsumesHunger: false,
    blockWhenStarving: false,
  },

  // Extend other actions like "grind", "bake", etc.
};
