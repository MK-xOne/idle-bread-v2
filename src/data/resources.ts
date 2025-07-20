import type { GameState } from "../context/types";
import { mechanics } from "./actionData";
import type { GameStateHook } from '../context/gameState';


/**
 * resources.ts
 * --------------
 * Defines the static metadata for all resource types in the game.
 * 
 * Each resource entry includes:
 * - Identity and appearance (id, name, icon, description)
 * - Gameplay properties (edibility, hunger values, inventory caps)
 * - Harvest parameters (amount range, success rate)
 * - Supported actions and their bound logic functions
 * 
 * This file acts as a centralized registry for resource definitions,
 * enabling the UI and systems to reference consistent, structured
 * data across the game loop.
 */

export type ResourceID =
  | "rocks"
  | "wildWheat"
  | "primitiveWheat"
  | "seeds"
  | "flour"
  | "bread";

export interface Resource {
  id: ResourceID;
  name: string;
  icon?: string;
  description?: string;
  edible?: boolean;
  hungerRestore?: number;
  hungerCost?: number
  eatCost?: number;
  maxAmount?: number;
  harvestAmount?: [number, number];
  harvestSuccessRate?: number;
  discovered?: boolean;
  actions?: {
    [action: string]: (state: GameState) => void;
  };
}

export const resources: Record<ResourceID, Resource> = {
  
  rocks: {
  id: 'rocks',
  name: 'Rocks',
  description: 'A hard, unyielding material useful for tools and construction.',
  edible: false,
  icon: '🪨',
  maxAmount: 25,
  harvestAmount: [1, 2],
  harvestSuccessRate : .51,
  discovered: true,
  actions: {
    harvest: (state) => mechanics.harvest(state, 'rocks'),
    }
  },
  
  wildWheat: {
    id: "wildWheat",
    name: "Wild Wheat",
    description: "Unpredictable and coarse grains from the wild.",
    edible: true,
    icon: '🌾',
    hungerRestore: 5,
    eatCost: 5,
    maxAmount: 100,
    harvestAmount : [2, 4],
    harvestSuccessRate : .51,
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
    eatCost: 5,
    maxAmount: 100,
    harvestAmount: [7, 10],
    harvestSuccessRate: .61,
    discovered: false,
    actions: {
      harvest: (state) => mechanics.harvest(state, "primitiveWheat"),
      plant: (state) => mechanics.plant (state,"primitiveWheat"),
      grow: (state) => mechanics.grow(state, "primitiveWheat"), 
      eat: (state) => mechanics.eat(state, "primitiveWheat"),
      feast: (state) => mechanics.feast(state, "primitiveWheat"),
    },
  },

  seeds: {
    id: 'seeds',
    name: '🌰 Seeds',
    description: 'Useful for planting new crops.',
    discovered: true,
    edible: false,
    maxAmount : 50,
    harvestAmount: [1, 2],
    harvestSuccessRate: .31,
    actions: {
      harvest: (state) => mechanics.harvest (state, "seeds"),
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
