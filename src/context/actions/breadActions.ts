import type { GameState } from '../types';
import { performAction } from './performAction';

export const grindFlour = (state: GameState) => {
  const { resources, grindClicks } = state;

  if (resources.primitiveWheat < 1 && grindClicks === 0) return;

  performAction(() => {
    if (resources.primitiveWheat >= 1) {
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
        }
        return next;
      });
    }
  }, state);
};


export const bakeBread = (state: GameState) => {
  const {
    fireDiscovered,
    resources,
    setResources,
    bakeClicks,
    setBakeClicks,
  } = state;

  if (!fireDiscovered) return;

  performAction(() => {
    const requiredClicks = 3;
    const requiredFlour = 3;

    if (bakeClicks + 1 >= requiredClicks && resources.flour >= requiredFlour) {
      setResources(prev => ({
        ...prev,
        flour: prev.flour - requiredFlour,
        bread: prev.bread + 1,
      }));
      setBakeClicks(0);
    } else {
      setBakeClicks(prev => prev + 1);
    }
  }, state);
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
