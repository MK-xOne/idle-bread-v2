export type ResourceID = 'wildWheat' | 'primitiveWheat' | 'seeds' | 'flour' | 'bread';

export interface Resource {
  id: ResourceID;
  name: string;
  description?: string;
  edible?: boolean;
  hungerRestore?: number;
  eatCost?: number;
  maxAmount?: number;
  discovered?: boolean; // Hidden until triggered
}

export const resources: Record<ResourceID, Resource> = {
  wildWheat: {
    id: 'wildWheat',
    name: 'Wild Wheat',
    description: 'Unpredictable and coarse grains from the wild.',
    edible: true,
    hungerRestore: 5,
    eatCost: 10,
    maxAmount: 100,
    discovered: true,
  },
  primitiveWheat: {
    id: 'primitiveWheat',
    name: 'Primitive Wheat',
    description: 'Grown from planted seeds. Better yield.',
    edible: true,
    hungerRestore: 10,
    eatCost: 10,
    maxAmount: 100,
    discovered: false,
  },
  seeds: {
    id: 'seeds',
    name: 'Seeds',
    description: 'Used to plant primitive wheat.',
    maxAmount: 50,
    discovered: true,
  },
  flour: {
    id: 'flour',
    name: 'Flour',
    description: 'Ground primitive wheat. Used to make bread.',
    maxAmount: 25,
    discovered: false,
  },
  bread: {
    id: 'bread',
    name: 'Bread',
    description: 'Baked with fire. Restores lots of hunger.',
    edible: true,
    hungerRestore: 30,
    eatCost: 1,
    maxAmount: 25,
    discovered: false,
  },
};
