import type { ResourceID } from './resources';

export type TechID = 
  | 'discoverFire'
  | 'stoneTools'
  | 'unlockPlanting'
  | 'unlockFeast'
  | 'primitiveFeast'
  | 'unlockWheel'
  | 'unlockFlour'
  | 'unlockBread'
  | 'baking';

export interface Tech {
  id: TechID;
  name: string;
  description: string;
  icon: string;
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
    icon: '🔥',
    cost: { wildWheat: 20 },
    unlocks: {
      actions: ['bake', 'cook'],
      techs: ['stoneTools', 'unlockPlanting', 'primitiveFeast'],
    },
  },

  stoneTools: {
    id: 'stoneTools',
    name: 'Stone Tools',
    description: 'Increase wild wheat harvest and success rate.',
    icon: '🔨',
    cost: { wildWheat: 25, seeds: 10 },
    unlocks: {
      actions: [],
    },
  },

  unlockPlanting: {
    id: 'unlockPlanting',
    name: 'Unlock Planting',
    description: 'From gatherer to grower.',
    icon: '🌱',
    cost: { seeds: 30 },
    unlocks: {
      resources: ['primitiveWheat'],
      actions: ['plantPrimitiveWheat'],
    },
  },

  unlockFeast: {
    id: 'unlockFeast',
    name: 'Feast',
    description: 'Unlock the ability to eat full meals.',
    icon: '🥙',
    cost: { seeds: 30, primitiveWheat: 50, wildWheat: 100 },
    unlocks: {
      actions: ['feast'],
    },
  },

  primitiveFeast: {
    id: 'primitiveFeast',
    name: 'Primitive Feast',
    description: 'Prepare your first full meal.',
    icon: '🥙',
    cost: { wildWheat: 200, primitiveWheat: 100 },
    unlocks: {
      actions: ['feast'],
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
    cost: {wildWheat: 250, primitiveWheat: 150},
    unlockedByDefault: true,
    unlocks: {
      actions: ['grindFlour'],
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

  baking: {
    id: 'baking',
    name: 'Baking',
    description: 'Lets you bake bread from flour.',
    icon: '🔥',
    cost: { flour: 10, wildWheat: 10 },
    unlocks: { actions: ['bakeBread'] },
  },



};
