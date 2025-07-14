import type { GameState } from '../types';
import { performAction } from './performAction';

export const discoverFire = (state: GameState) => {
  const { fireDiscovered, resources, setResources, setFireDiscovered } = state;

  if (!fireDiscovered && resources.wildWheat >= 20) {
    performAction(() => {
      setResources(prev => ({
        ...prev,
        wildWheat: prev.wildWheat - 20,
      }));
      setFireDiscovered(true);
    }, state);
  }
};
