import type { GameState } from '../types';
import { performAction } from './performAction';

export const grindFlour = (state: GameState) => {
  const {
    wheelUnlocked,
    resources,
    setResources,
    grindClicks,
    setGrindClicks,
  } = state;

  if (!wheelUnlocked) return;

  performAction(() => {
    const requiredClicks = 5;
    const requiredWheat = 5;

    // If already reached enough clicks and have enough wheat
    if (grindClicks + 1 >= requiredClicks && resources.primitiveWheat >= requiredWheat) {
      setResources(prev => ({
        ...prev,
        primitiveWheat: prev.primitiveWheat - requiredWheat,
        flour: prev.flour + 1,
      }));
      setGrindClicks(0);
    } else {
      setGrindClicks(prev => prev + 1);
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
