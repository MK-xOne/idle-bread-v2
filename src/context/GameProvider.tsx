import { useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { GameContext } from './GameContext';
import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';
import { techTree } from '../data/tech';
import { performAction } from './actions/performAction';
import { performNamedAction as doNamedAction, performNamedAction } from './actions/performNamedAction';
import { effectModifiers } from '../data/effectModifiers';
import type { Modifiers } from './types';
import type { InteractionTracker } from './types';
import type { ActionType } from '../data/actionData';

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<Record<ResourceID, number>>({
    wildWheat: 0,
    primitiveWheat: 0,
    seeds: 0,
    flour: 0,
    bread: 0,
    rocks: 0,
  });

  const [resourceInteractions, setResourceInteractions] = useState<InteractionTracker>({} as InteractionTracker);
  const [hunger, setHunger] = useState(100);

  const [modifiersState, _setModifiers] = useState<Modifiers>({
    harvestBonus: {},
  });

  const setModifiers = (modifierUpdater: (prev: Modifiers) => Modifiers) => {
    _setModifiers(prev => modifierUpdater(prev));
  };

  const [discoveredResources, setDiscoveredResources] = useState<Set<ResourceID>>(
    new Set(["wildWheat", "rocks"])
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
  const [maxResourceBonuses, setMaxResourceBonuses] = useState<Partial<Record<ResourceID, number>>>({});
  const [primitiveWheatPlanted, setPrimitiveWheatPlanted] = useState(false);
  const [actionsSincePlanting, setActionsSincePlanting] = useState(0);
  const [readyToHarvestPrimitiveWheat, setReadyToHarvestPrimitiveWheat] = useState(false);
  const [grindClicks, setGrindClicks] = useState(0);
  const [bakeClicks, setBakeClicks] = useState(0);

  const gameState = {
    resourceInteractions,
    setResourceInteractions,
    hunger,
    setHunger,
    resources,
    setResources,
    modifiers: modifiersState,
    setModifiers,
    discoveredResources,
    setDiscoveredResources,
    discoverResource,
    unlockedTechs,
    unlockedActions,
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
  };

  const unlockTech = (techId: TechID) => {
    setUnlockedTechs(prev => new Set(prev).add(techId));
    const tech = techTree[techId];

    // Apply effects if any
    if (tech.unlocks?.effects) {
      for (const effect of tech.unlocks.effects) {
        effectModifiers.applyEffect(effect, {
          ...gameState,
          setModifiers,
          setMaxResourceBonuses,
        });
      }
    }

    // Unlock actions
    if (tech.unlocks?.actions) {
      setUnlockedActions(prev => {
        const newSet = new Set(prev);
        tech.unlocks.actions!.forEach(action => newSet.add(action));
        return newSet;
      });
    }

    // Unlock resources
    if (tech.unlocks?.resources) {
      tech.unlocks.resources.forEach(res => discoverResource(res));
    }
  };


  return (
    <GameContext.Provider
      value={{
        ...gameState,
        unlockTech,
        performAction: (cb) => {
          performAction(cb, gameState);                 // your existing logic
        },        
          
        performNamedAction: (id: string) => {
          const [actionType, resourceId] = id.split('_');
          const resId = resourceId as ResourceID;

          performAction(
            () => {
              console.log(`[performNamedAction] Triggering action`, { actionType, resId });

              const success = doNamedAction(gameState, resId, actionType);

              // ✅ Specific hardcoded chain: harvesting wildWheat triggers harvesting seeds
              if (success && actionType === "harvest" && resId === "wildWheat") {
                console.log(`[performNamedAction] Chaining: wildWheat → seeds`);
                doNamedAction(gameState, "seeds", "harvest");
              }
            },
            gameState,
            { allowWhenStarving: actionType === 'eat' || actionType === 'feast' }
          );
        },

        // Stubbed action methods — implement as needed
        harvestWildWheat: () => {},
        plantPrimitiveWheat: () => {},
        harvestPrimitiveWheat: () => {},
        eatWildWheat: () => {},
        eatPrimitiveWheat: () => {},
        grindFlour: () => {},
        bakeBread: () => {},
        eatBread: () => {},
        feastOnWildWheat: () => {},
        feastOnPrimitiveWheat: () => {},
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
