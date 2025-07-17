import type { GameState } from "../context/types";
import type { ResourceID } from "./resources";
import { resources } from '../data/resources';
import { trackInteraction } from './tracking';

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
    description: "The seeds planted are now growing.",
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

    const baseRate = def?.harvestSuccessRate ?? 0.75;
    const successChance = baseRate + successRateBonus;
    const isSuccess = Math.random() <= successChance;
    if (!isSuccess) return false;

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

    trackInteraction(state.setResourceInteractions, resourceId, 'harvest');
    state.discoverResource(resourceId);

    if (resourceId === "primitiveWheat") {
      state.setPrimitiveWheatPlanted(false);
      state.setReadyToHarvestPrimitiveWheat(false);
      state.setActionsSincePlanting(0);
    }
    console.log("Harvesting", resourceId, "Current:", current, "Add:", totalAmount, "New:", newAmount);
    return true;
  },

  eat: (state, resourceId) => {
    if (!resourceId) return false;

    const def = resources[resourceId];
    const cost = def?.eatCost ?? 1;
    const restore = def?.hungerRestore ?? 0;
    if (state.resources[resourceId] < cost || state.hunger >= 100) return false;

    state.setResources(prev => ({
      ...prev,
      [resourceId]: prev[resourceId] - cost,
    }));
    state.setHunger(prev => Math.min(100, prev + restore));
    trackInteraction(state.setResourceInteractions, resourceId, 'eat');
    return true;
  },

  feast: (state, resourceId) => {
    if (!resourceId) return false;

    const def = resources[resourceId];
    const restore = def?.hungerRestore ?? 0;
    const cost = def?.eatCost ?? 1;
    const hungerToRestore = 100 - state.hunger;

    const neededUnits = Math.ceil(hungerToRestore / restore);
    const totalCost = neededUnits * cost;

    if (state.resources[resourceId] < totalCost || state.hunger >= 100) return false;

    state.setResources(prev => ({
      ...prev,
      [resourceId]: prev[resourceId] - totalCost,
    }));
    state.setHunger(100);
    trackInteraction(state.setResourceInteractions, resourceId, 'feast');
    return true;
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
      state.setActionsSincePlanting(0);
      state.setReadyToHarvestPrimitiveWheat(false);
      trackInteraction(state.setResourceInteractions, "seeds", "plant");
      mechanics.grow(state);
      return true;
    }

    return false;
  },

  grow: (state) => {
    if (state.primitiveWheatPlanted && !state.readyToHarvestPrimitiveWheat) {
      state.setActionsSincePlanting(prev => {
        const next = prev + 1;
        if (next >= 20) {
          state.setReadyToHarvestPrimitiveWheat(true);
          state.discoverResource("primitiveWheat");
        }
        trackInteraction(state.setResourceInteractions, "seeds", "grow");
        return next;
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
        trackInteraction(state.setResourceInteractions, "flour", "grind");
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
        trackInteraction(state.setResourceInteractions, "bread", "bake");
      }
      return next;
    });

    return true;
  },
};
