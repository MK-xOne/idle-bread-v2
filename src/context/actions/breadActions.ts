import type { GameState } from '../types';
import { performAction } from './performAction';
import { resources } from "../../data/resources";


export const grindFlour = (state: GameState) => {
  const { resources: res, grindClicks } = state;

  if (res.primitiveWheat < 1 && grindClicks === 0) return;

  performAction(() => {
    if (res.primitiveWheat >= 1) {
      state.setResources(prev => ({
        ...prev,
        primitiveWheat: prev.primitiveWheat - 1,
      }));
    }

    state.setGrindClicks(prev => {
      const next = prev + 1;

      if (next >= 5) {
        const currentFlour = state.resources.flour;
        const max = resources.flour?.maxAmount ?? Infinity;
        const newAmount = Math.min(currentFlour + 1, max);

        state.discoverResource("flour");

        state.setResources(prev => ({
          ...prev,
          flour: newAmount,
        }));

        return 0;
      }

      return next;
    });
  }, state);
};


export const bakeBread = (state: GameState) => {
  performAction(() => {
    const breadReady = state.bakeClicks + 1 >= 3;
    const enoughFlour = state.resources.flour >= 3;

    if (!enoughFlour && !breadReady) return;

    if (breadReady) {
      const current = state.resources.bread;
      const max = resources.bread?.maxAmount ?? Infinity;
      const newAmount = Math.min(current + 1, max);

      state.discoverResource("bread");

      state.setResources(prev => ({
        ...prev,
        bread: newAmount,
        flour: prev.flour - 3,
      }));
      state.setBakeClicks(0);
    } else {
      state.setBakeClicks(prev => prev + 1);
    }
  }, state); // ✅ This closes performAction correctly
};

export const eatBread = (state: GameState) => {
  const { resources, hunger, setResources, setHunger } = state;

  if (resources.bread > 0 && hunger < 100) {
    performAction(() => {
      setResources(prev => ({
        ...prev,
        bread: prev.bread - 1,
      }));
      setHunger(prev => Math.min(100, prev + 30));
    }, state);
  }
};
