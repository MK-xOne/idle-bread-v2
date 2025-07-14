import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';

export interface GameState {
  resources: Record<ResourceID, number>;
  unlockedTechs: Set<TechID>;
  unlockedActions: Set<string>;
  hunger: number; // 0–100
}

export const createInitialGameState = (): GameState => ({
  resources: {
    wildWheat: 0,
    primitiveWheat: 0,
    seeds: 0,
    flour: 0,
    bread: 0,
  },
  unlockedTechs: new Set<TechID>(),
  unlockedActions: new Set<string>(),
  hunger: 100,
});

// Mutators
export const gainResource = (state: GameState, id: ResourceID, amount: number) => {
  state.resources[id] += amount;
};

export const spendResource = (state: GameState, id: ResourceID, amount: number): boolean => {
  if (state.resources[id] >= amount) {
    state.resources[id] -= amount;
    return true;
  }
  return false;
};

export const unlockTech = (state: GameState, techId: TechID) => {
  state.unlockedTechs.add(techId);
};

export const unlockAction = (state: GameState, action: string) => {
  state.unlockedActions.add(action);
};

export const modifyHunger = (state: GameState, delta: number) => {
  state.hunger = Math.min(100, Math.max(0, state.hunger + delta));
};
