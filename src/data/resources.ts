import type { GameState } from "../context/types";
import { mechanics } from "./actionData";

export type ResourceID =
  | "wildWheat"
  | "primitiveWheat"
  | "seeds"
  | "flour"
  | "bread";

export interface Resource {
  id: ResourceID;
  name: string;
  description?: string;
  edible?: boolean;
  hungerRestore?: number;
  eatCost?: number;
  maxAmount?: number;
  harvestAmount? : number,
  discovered?: boolean;
  actions?: {
    [action: string]: (state: GameState) => void;
  };
}

export const resources: Record<ResourceID, Resource> = {
  wildWheat: {
    id: "wildWheat",
    name: "Wild Wheat",
    description: "Unpredictable and coarse grains from the wild.",
    edible: true,
    hungerRestore: 5,
    eatCost: 10,
    maxAmount: 100,
    harvestAmount : 3,
    discovered: true,
    actions: {
      harvest: (state) => mechanics.harvest(state, "wildWheat"),
      eat: (state) => mechanics.eat(state, "wildWheat"),
      feast: (state) => mechanics.feast(state, "wildWheat"),
    },
  },
  primitiveWheat: {
    id: "primitiveWheat",
    name: "Primitive Wheat",
    description: "Grown from planted seeds. Better yield.",
    edible: true,
    hungerRestore: 10,
    eatCost: 10,
    maxAmount: 100,
    harvestAmount: 10,
    discovered: false,
    actions: {
      harvest: (state) => mechanics.harvest(state, "primitiveWheat"),
      eat: (state) => mechanics.eat(state, "primitiveWheat"),
      feast: (state) => mechanics.feast(state, "primitiveWheat"),
    },
  },
  seeds: {
    id: 'seeds',
    label: '🌰 Seeds',
    description: 'Useful for planting new crops.',
    actions: {}, // Seeds might not have direct actions
    maxAmount : 50,
    harvestAmount: 2,
    onHarvestFrom: (sourceId, state) => {
      if (sourceId === 'wildWheat' && Math.random() < 0.51) {
        state.setResources(prev => ({
          ...prev,
          seeds: prev.seeds + 1,
        }));
        state.discoverResource('seeds');
      }
    },
  },
  flour: {
    id: "flour",
    name: "Flour",
    description: "Ground primitive wheat. Used to make bread.",
    maxAmount: 25,
    discovered: false,
    actions: {
      grind: (state) => mechanics.grind(state),
    },
  },
  bread: {
    id: "bread",
    name: "Bread",
    description: "Baked with fire. Restores lots of hunger.",
    edible: true,
    hungerRestore: 30,
    eatCost: 1,
    maxAmount: 25,
    discovered: false,
    actions: {
      bake: (state) => mechanics.bake(state),
    },
  },
};
