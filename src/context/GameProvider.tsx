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
import { actionRules } from '../data/actionRules';
import { actionLabels } from '../data/actionData'; // if not already present
import { advanceTick } from '../data/tracking';

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

  const [plantedAtTick, setPlantedAtTick] = useState<number | null>(null);
  const getTick = () => resourceInteractions.__ticks ?? 0;
  const [unlockedTechs, setUnlockedTechs] = useState<Set<TechID>>(new Set());
  const [maxResourceBonuses, setMaxResourceBonuses] = useState<Partial<Record<ResourceID, number>>>({});
  const [primitiveWheatPlanted, setPrimitiveWheatPlanted] = useState(false);
  const [actionsSincePlanting, setActionsSincePlanting] = useState(0);
  const [readyToHarvestPrimitiveWheat, setReadyToHarvestPrimitiveWheat] = useState(false);
  const [grindClicks, setGrindClicks] = useState(0);
  const [bakeClicks, setBakeClicks] = useState(0);

  const gameState = {
    maxResourceBonuses,
    setMaxResourceBonuses,
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
    plantedAtTick,
    setPlantedAtTick,
    getTick,
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
  const tech = techTree[techId];

    // Check if already unlocked
    if (!tech || unlockedTechs.has(techId)) return;

    // Add to unlockedTechs (Set)
    setUnlockedTechs(prev => {
      const updated = new Set(prev);
      updated.add(techId);
      return updated;
    });

    // Apply effects
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
                  
        performNamedAction: (id: string) => {
          if (!id.includes('_')) return;
          const [actionTypeRaw, resourceId] = id.split('_');
          if (!actionTypeRaw || !resourceId || !(actionTypeRaw in actionLabels)) return;

          const resId = resourceId as ResourceID;
          const actionType = actionTypeRaw as ActionType;
          const rule = actionRules[actionType];
          const result = doNamedAction(gameState, resId, actionType);
          if (result.performed) {
          advanceTick(setResourceInteractions);
          }
          const hungerCost = actionLabels[actionType]?.hungerCost ?? 0;
          const applyHungerCost = (cost: number) => {
            if (cost > 0) {
              setHunger(prev => Math.max(0, prev - cost));
            }
          };

          if (result.performed) applyHungerCost(hungerCost);
          if (result.performed && rule?.chain) {
            rule.chain.forEach(chain => {
              const allowed = (chain.conditions ?? []).every(fn =>
                fn({ resource: resId, action: actionType, state: gameState})
              );
              if (allowed) {
              const chainedRule = actionRules[chain.action];
              const chainedResult = doNamedAction(gameState, chain.target, chain.action);
              const chainedHungerCost = actionLabels[chain.action]?.hungerCost ?? 0;

              if (chainedResult.performed) applyHungerCost(chainedHungerCost);
              }
            });
          }
        },
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
