import type { GameState } from "../context/types";
import type { ResourceID } from "./resources";
import { resources } from '../data/resources';
import { effectModifiers } from './effectModifiers';

// ---- Action Types ----

export type ActionType =
  | "harvest"
  | "eat"
  | "feast"
  | "plant"
  | "grind"
  | "bake"
  | "grow";

export type MechanicFunction = (state: GameState, resourceId?: ResourceID) => boolean;

// ---- UI Labels ----

export const actionLabels: Record<ActionType, { label: string; description?: string }> = {
  harvest: {
    label: "🌾 Harvest",
    description: "Gather natural resources with a chance of success.",
  },
  eat: {
    label: "🍽️ Eat",
    description: "Consume a small amount of food to restore some hunger.",
  },
  feast: {
    label: "🥣 Feast",
    description: "Use more food to completely restore hunger.",
  },
  plant: {
    label: "🌱 Plant",
    description: "Use seeds to grow primitive wheat over time.",
  },
  grow: {
    label: "🌱 Growing",
    description: "The seeds planted are now growing."  
  },
  grind: {
    label: "🌀 Grind",
    description: "Manually grind wheat into flour by clicking.",
  },
  bake: {
    label: "🔥 Bake",
    description: "Bake flour into nourishing bread using fire.",
  },
};

// ---- Mechanics ----

export const mechanics: Record<ActionType, MechanicFunction> = {
  harvest: (state, resourceId) => {
    if (!resourceId) return false;

    const def = resources[resourceId];
    const baseRange = def?.harvestAmount ?? [0, 0];

    const bonus = state.modifiers?.harvestBonus?.[resourceId] ?? {};
    const successRateBonus = bonus.successRateBonus ?? 0;
    const extraRange = bonus.extraYieldRange ?? [0, 0];

    // 🌱 Determine if harvest is successful (75% base + bonus)
    const successChance = 0.75 + successRateBonus;
    if (Math.random() > successChance) return false;

    // 🌾 Calculate base + bonus yield
    const baseAmount = Math.floor(Math.random() * (baseRange[1] - baseRange[0] + 1)) + baseRange[0];
    const extraAmount = Math.floor(Math.random() * (extraRange[1] - extraRange[0] + 1)) + extraRange[0];
    const totalAmount = baseAmount + extraAmount;

    if (totalAmount <= 0) return false;

    const current = state.resources[resourceId];
    const max = def?.maxAmount ?? Infinity;
    const newAmount = Math.min(current + totalAmount, max);

    state.setResources(prev => ({
      ...prev,
      [resourceId]: newAmount,
    }));

    state.discoverResource(resourceId);

    // 🔁 Passive effects
    Object.values(resources).forEach(res => {
      res.onHarvestFrom?.(resourceId, state);
    });

    // 🔄 Primitive wheat special case
    if (resourceId === "primitiveWheat") {
      state.setPrimitiveWheatPlanted(false);
      state.setReadyToHarvestPrimitiveWheat(false);
      state.setActionsSincePlanting(0);
      console.log('[HARVEST] primitive wheat reset after harvest');
    }

    return true;
  },

  eat: (state, resourceId) => {
    if (!resourceId) return false;

    const amount = state.resources[resourceId];
    const def = resources[resourceId];
    const cost = def?.eatCost ?? 1;
    const restore = def?.hungerRestore ?? 0;

    if (amount >= cost && state.hunger < 100) {
      state.setResources(prev => ({
        ...prev,
        [resourceId]: prev[resourceId] - cost,
      }));
      state.setHunger(prev => Math.min(100, prev + restore));
      return true;
    }

    return false;
  },

  feast: (state, resourceId) => {
    if (!resourceId) return false;

    const amount = state.resources[resourceId];
    const def = resources[resourceId];
    const restore = def?.hungerRestore ?? 0;
    const cost = def?.eatCost ?? 1;

    const hungerToRestore = 100 - state.hunger;
    const neededUnits = Math.ceil(hungerToRestore / restore);
    const totalCost = neededUnits * cost;

    if (amount >= totalCost && state.hunger < 100) {
      state.setResources(prev => ({
        ...prev,
        [resourceId]: prev[resourceId] - totalCost,
      }));
      state.setHunger(100);
      return true;
    }

    return false;
  },

  plant: (state) => {
    if (
      state.resources.seeds >= 5 &&
      !state.primitiveWheatPlanted &&
      !state.readyToHarvestPrimitiveWheat
    ) {
      state.setResources(prev => ({
        ...prev,
        seeds: prev.seeds - 5,
      }));
      state.setPrimitiveWheatPlanted(true);
      console.log('[PLANT] primitive wheat planted!');
      state.setActionsSincePlanting(0);
      state.setReadyToHarvestPrimitiveWheat(false);
      mechanics.grow(state);
      return true;
    }

    return false;
  },

  grow: (state) => {
    const {
      primitiveWheatPlanted,
      readyToHarvestPrimitiveWheat,
      setActionsSincePlanting,
      setReadyToHarvestPrimitiveWheat,
    } = state;

    if (primitiveWheatPlanted && !readyToHarvestPrimitiveWheat) {
      setActionsSincePlanting(prev => {
        const next = prev + 1;
        if (next >= 20) {
          setReadyToHarvestPrimitiveWheat(true);
          state.discoverResource('primitiveWheat'); 

        }
        return next;
        console.log('[GROW] growing tick triggered');
      });
    }

    return true;
  },


  grind: (state) => {
    if (state.resources.primitiveWheat >= 1) {
      state.setResources(prev => ({
        ...prev,
        primitiveWheat: prev.primitiveWheat - 1,
      }));
    }

    state.setGrindClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        state.setGrindClicks(0);
        state.setResources(prev => ({
          ...prev,
          flour: prev.flour + 1,
        }));
        state.discoverResource("flour");
      }
      return next;
    });

    return true;
  },

  bake: (state) => {
    if (state.resources.flour >= 1) {
      state.setResources(prev => ({
        ...prev,
        flour: prev.flour - 1,
      }));
    }

    state.setBakeClicks(prev => {
      const next = prev + 1;
      if (next >= 3) {
        state.setBakeClicks(0);
        state.setResources(prev => ({
          ...prev,
          bread: prev.bread + 1,
        }));
        state.discoverResource("bread");
      }
      return next;
    });

    return true;
  },
};
