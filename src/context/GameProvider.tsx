import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { GameContextType } from './types';
import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';
import { techTree } from '../data/tech';
import { performAction } from './actions/performAction';
import { performNamedAction as doNamedAction } from './actions/performNamedAction';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<Record<ResourceID, number>>({
    wildWheat: 0,
    primitiveWheat: 0,
    seeds: 0,
    flour: 0,
    bread: 0,
    rocks: 0,
  });

  const [hunger, setHunger] = useState(100);

  const [discoveredResources, setDiscoveredResources] = useState<Set<ResourceID>>(
    new Set(["wildWheat","rocks"]) // default: show Wild Wheat at start
  );

  const discoverResource = (id: ResourceID) => {
  setDiscoveredResources(prev => {
    if (prev.has(id)) return prev;
    const newSet = new Set(prev);
    newSet.add(id);
    return newSet;
   });
  };

  const [unlockedActions, setUnlockedActions] = useState<Set<string>>(
    new Set(["harvest_wildWheat", "eat_wildWheat", "harvest_rocks"])
  );

  const [unlockedTechs, setUnlockedTechs] = useState<Set<TechID>>(new Set());
  const unlockTech = (techId: TechID) => {
    const tech = techTree[techId];
    if (!tech) return;

  setUnlockedTechs(prev => {
    const updated = new Set(prev);
    updated.add(techId);
    console.log('unlockTech – new unlockedTechs:', Array.from(updated)); // 👉 Add this
    return updated;
  });
    if (tech.unlocks?.actions) {
      setUnlockedActions(prev => {
        const newSet = new Set(prev);
        tech.unlocks.actions!.forEach(action => newSet.add(action));
        return newSet;
      });
    }
  };


  const [primitiveWheatPlanted, setPrimitiveWheatPlanted] = useState(false);
  const [actionsSincePlanting, setActionsSincePlanting] = useState(0);
  const [readyToHarvestPrimitiveWheat, setReadyToHarvestPrimitiveWheat] = useState(false);

  const [grindClicks, setGrindClicks] = useState(0);
  const [bakeClicks, setBakeClicks] = useState(0);

  const gameState = {
    hunger,
    setHunger,
    resources,
    setResources,
    discoverResource,
    primitiveWheatPlanted,
    setPrimitiveWheatPlanted,
    actionsSincePlanting,
    setActionsSincePlanting,
    readyToHarvestPrimitiveWheat,
    setReadyToHarvestPrimitiveWheat,
    grindClicks,
    setGrindClicks,
    bakeClicks,
    setBakeClicks,
    unlockedTechs,
    unlockTech,
    unlockedActions,

  };

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        unlockedActions,
        discoveredResources,
        setDiscoveredResources,
        discoverResource,
        performAction: (cb) => performAction(cb, gameState),
        performNamedAction: (id: string) => {
          const [actionType, resourceId] = id.split('_');
          performAction(
            () => {
              doNamedAction(gameState, resourceId as ResourceID, actionType);
            },
            gameState,
            { allowWhenStarving: actionType === 'eat' || actionType === 'feast' }
          );
        }
      }}
    >
      {children}
    </GameContext.Provider>

  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

export default GameProvider;
