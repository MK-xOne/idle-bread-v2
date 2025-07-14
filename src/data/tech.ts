import type { ResourceID } from './resources';

export type TechID = 
  | 'discoverFire'
  | 'unlockPlanting'
  | 'unlockFeast'
  | 'primitiveFeast'
  | 'unlockWheel'
  | 'unlockFlour'
  | 'unlockBread';

export interface Tech {
  id: TechID;
  name: string;
  description: string;
  cost: Partial<Record<ResourceID, number>>;
  unlockedByDefault?: boolean;
  unlocks: {
    resources?: ResourceID[];
    actions?: string[];
    techs?: TechID[];
  };
}

export const techTree: Record<TechID, Tech> = {
  discoverFire: {
    id: 'discoverFire',
    name: 'Discover Fire',
    description: 'Control the flame to change everything.',
    cost: { wildWheat: 20 },
    unlocks: {
      actions: ['bake', 'cook'],
      techs: ['unlockPlanting', 'primitiveFeast'],
    },
  },
  unlockPlanting: {
    id: 'unlockPlanting',
    name: 'Unlock Planting',
    description: 'From gatherer to grower.',
    cost: { seeds: 25 },
    unlocks: {
      resources: ['primitiveWheat'],
    },
  },
  unlockFeast: {
    id: 'unlockFeast',
    name: 'Feast',
    description: 'Unlock the ability to eat full meals.',
    cost: { seeds: 50, primitiveWheat: 10 },
    unlocks: {
      actions: ['feast'],
    },
  },
  primitiveFeast: {
    id: 'primitiveFeast',
    name: 'Primitive Feast',
    description: 'Prepare your first full meal.',
    cost: { wildWheat: 30, primitiveWheat: 15 },
    unlocks: {
      actions: ['feast'],
    },
  },
  unlockWheel: {
    id: 'unlockWheel',
    name: 'Unlock the Wheel',
    description: 'Start processing grain efficiently.',
    cost: { primitiveWheat: 30 },
    unlocks: {
      resources: ['flour'],
      techs: ['unlockFlour'],
    },
  },
  unlockFlour: {
    id: 'unlockFlour',
    name: 'Grind Flour',
    description: 'Turn wheat into flour.',
    cost: {},
    unlockedByDefault: true,
    unlocks: {
      actions: ['grindFlour'],
    },
  },
  unlockBread: {
    id: 'unlockBread',
    name: 'Bake Bread',
    description: 'Bake bread using flour.',
    cost: { flour: 3 },
    unlocks: {
      resources: ['bread'],
      actions: ['bake'],
    },
  },
};
