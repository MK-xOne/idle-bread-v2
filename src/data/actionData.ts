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

export const actionLabels: Record<ActionType, { label: string; hungerCost?: number; description?: string }> = {
  harvest: {
    label: "🌾 Harvest",
    hungerCost: 1,
    description: "Gather natural resources with a chance of success.",
  },
  eat: {
    label: "🍽️ Eat",
    hungerCost: 0,
    description: "Consume a small amount of food to restore some hunger.",
  },
  feast: {
    label: "🥣 Feast",
    hungerCost: 0,
    description: "Use more food to completely restore hunger.",
  },
  plant: {
    label: "🌱 Plant",
    hungerCost: 1,
    description: "Use seeds to grow primitive wheat over time.",
  },
  grow: {
    label: "🌱 Growing",
    hungerCost: 0,
    description: "The seeds planted are now growing.",
  },
  grind: {
    label: "🌀 Grind",
    hungerCost: 1,
    description: "Manually grind wheat into flour by clicking.",
  },
  bake: {
    label: "🔥 Bake",
    hungerCost: 1,
    description: "Bake flour into nourishing bread using fire.",
  },
} as const;

// ---- Mechanics ----

export const mechanics: Record<ActionType, MechanicFunction> = {

  harvest: (state, resourceId) => {
    if (resourceId === "primitiveWheat" && !state.readyToHarvestPrimitiveWheat) {
      return false;
    }
    if (!resourceId) return false;

    const def = resources[resourceId];
    const baseRange = def?.harvestAmount ?? [0, 0];

    const bonus = state.modifiers?.harvestBonus?.[resourceId] ?? {};
    const successRateBonus = bonus.successRateBonus ?? 0;
    const extraRange = bonus.extraYieldRange ?? [0, 0];

    const baseRate = def?.harvestSuccessRate ?? 0.75;
    const successChance = baseRate + successRateBonus;
    const isSuccess = Math.random() <= successChance;
    if (!isSuccess) {
      trackInteraction(state.setResourceInteractions, resourceId, 'harvest');
      return true; // harvest was attempted even if nothing was gained
    }

    const baseAmount = Math.floor(Math.random() * (baseRange[1] - baseRange[0] + 1)) + baseRange[0];
    const extraAmount = Math.floor(Math.random() * (extraRange[1] - extraRange[0] + 1)) + extraRange[0];
    const totalAmount = baseAmount + extraAmount;
    if (totalAmount <= 0) return false;

    const current = state.resources[resourceId];
    const maxBonus = state.maxResourceBonuses?.[resourceId] ?? 0;
    const max = (def?.maxAmount ?? Infinity) + maxBonus;
    if (current >= max) {
      console.log(`[Harvest] ${resourceId} is already at max capacity (${max}). Skipping.`);
      return false;
    }
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

    state.setResources(prev => ({
      ...prev,
      [resourceId]: prev[resourceId] - totalCost,
    }));
    state.setHunger(100);
    trackInteraction(state.setResourceInteractions, resourceId, 'feast');
    return true;
  },

  plant: (state) => {
    state.setResources(prev => ({
      ...prev,
      seeds: prev.seeds - 5,
    }));
    state.setPrimitiveWheatPlanted(true);
    state.setPlantedAtTick(state.getTick());
    state.setReadyToHarvestPrimitiveWheat(false);
    trackInteraction(state.setResourceInteractions, "seeds", "plant");
    return true;
  },

  grow: (state) => {
    const currentTick = state.getTick?.() ?? 0;

    // If no tick was stored yet, initialize it
    if (state.plantedAtTick === null) {
      state.setPlantedAtTick(currentTick);
      return true;
    }

    const elapsed = currentTick - state.plantedAtTick;

    if (
      state.primitiveWheatPlanted &&
      !state.readyToHarvestPrimitiveWheat &&
      elapsed >= 20
    ) {
      state.setReadyToHarvestPrimitiveWheat(true);
      state.setPlantedAtTick(null); // clear to avoid re-trigger
      state.discoverResource("primitiveWheat");
      trackInteraction(state.setResourceInteractions, "primitiveWheat", "grown");
    }

    return false;
  },

  grind: (state) => {
      state.setResources(prev => ({
        ...prev,
        primitiveWheat: prev.primitiveWheat - 1,
      }));

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
      state.setResources(prev => ({
        ...prev,
        flour: prev.flour - 1,
      }));

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
