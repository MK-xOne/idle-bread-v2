import type { ResourceID } from './resources';
import { effectModifiers } from "./effectModifiers";

export type TechID = 
  | 'discoverFire'
  | 'stoneTools'
  | 'unlockPlanting'
  | 'unlockFeast'
  | 'primitiveFeast'
  | 'unlockWheel'
  | 'unlockFlour'
  | 'unlockBread'
  |  'pottery';

export interface Tech {
  id: TechID;
  name: string;
  description: string;
  icon: string;
  cost: Partial<Record<ResourceID, number>>;
  unlockedByDefault?: boolean;
  requires?: TechID[];
  unlocks: {
    resources?: ResourceID[];
    actions?: string[];
    techs?: TechID[];
    effects?:any[];
  };
}

export const techTree: Record<TechID, Tech> = {
  discoverFire: {
    id: 'discoverFire',
    name: 'Discover Fire',
    description: 'Control the flame to change everything.',
    icon: '🔥',
    cost: { wildWheat: 12, rocks: 12 },
    requires: [],
    unlocks: {
      techs: ['stoneTools', 'unlockPlanting', 'primitiveFeast'],  
    },
  },

  stoneTools: {
    id: 'stoneTools',
    name: 'Stone Tools',
    description: 'Increase wild wheat harvest and success rate.',
    icon: '🔨',
    cost: { wildWheat: 25, seeds: 10, rocks: 20 },
    requires: ["discoverFire"],
    unlocks: {
      effects: [
        {
          type: 'harvestBonus',
          resource: 'wildWheat',
          successRateBonus: 0.25,
          extraYieldRange: [4, 7],
        }
      ],
    },
  },

  pottery: {
  id: 'pottery',
  name: 'Pottery',
  description: 'Craft durable containers to store more.',
  icon: '🏺',
  cost: { rocks: 25 },
  requires: ['discoverFire', 'stoneTools'], // ✅ Fire + Stone Tools
  unlocks: {
    effects: [
      {
        type: 'MaxInventoryBonus',
        resource: 'all',
        amount: 100,
      },
    ],
  },
},


  unlockPlanting: {
    id: 'unlockPlanting',
    name: 'Unlock Planting',
    description: 'From gatherer to grower.',
    icon: '🌱',
    cost: { seeds: 30 },
    requires: ["stoneTools"],
    unlocks: {
      resources: ['primitiveWheat'],
      actions: ['plant_primitiveWheat', 'grow_primitiveWheat', 'harvest_primitiveWheat'],
    },
  },

  unlockFeast: {
    id: 'unlockFeast',
    name: 'Feast',
    description: 'Unlock the ability to eat full meals.',
    icon: '🥙',
    cost: { seeds: 30, primitiveWheat: 50, wildWheat: 100 },
    unlocks: {
      actions: ['feast_wildWheat'],
    },
  },

  primitiveFeast: {
    id: 'primitiveFeast',
    name: 'Primitive Feast',
    description: 'Prepare your first full meal.',
    icon: '🥙',
    cost: { wildWheat: 200, primitiveWheat: 100 },
    unlocks: {
      actions: ['feast_primitiveWheat'],
    },
  },

  unlockWheel: {
    id: 'unlockWheel',
    name: 'Unlock the Wheel',
    description: 'Start processing grain efficiently.',
    icon: '🛞',
    cost: { primitiveWheat: 100 },
    unlocks: {
      resources: ['flour'],
      techs: ['unlockFlour'],
    },
  },

  unlockFlour: {
    id: 'unlockFlour',
    name: 'Grind Flour',
    description: 'Turn wheat into flour.',
    icon: '🪨',
    cost: { wildWheat: 250, primitiveWheat: 150 },
    unlockedByDefault: true,
    unlocks: {
      actions: ['grind'],
    },
  },

  unlockBread: {
    id: 'unlockBread',
    name: 'Bake Bread',
    description: 'Bake bread using flour.',
    icon: '🍞',
    cost: { flour: 50 },
    unlocks: {
      resources: ['bread'],
      actions: ['bake'],
    },
  },
};

export function isTechDiscoverable(tech: Tech, unlockedTechs: Set<TechID>): boolean {
  if (unlockedTechs.has(tech.id)) return false; // already unlocked
  if (!tech.requires || tech.requires.length === 0) return true; // no requirements
  return tech.requires.every(req => unlockedTechs.has(req)); // check all prerequisites
}
