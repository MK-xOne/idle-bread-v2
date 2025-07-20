// src/context/gameState.ts
// ------------------------------------------------------
// Centralised hook that owns every piece of reactive game
// state.  GameProvider simply calls this hook and pipes
// the result into <GameContext.Provider>.
//
//  • NO GAMEPLAY LOGIC here (harvest, unlockTech, etc.).
//  • Purely state, setters, and a few tiny helpers that
//    other logic layers may need (discoverResource, getTick).
// ------------------------------------------------------

import { useState } from 'react';
import type { ResourceID } from '../data/resources';
import type { TechID } from '../data/tech';
import type { InteractionTracker, Modifiers, TrackerState } from './types';

/* ---------- initial values ---------- */

const initialResources: Record<ResourceID, number> = {
  wildWheat:       0,
  primitiveWheat:  0,
  seeds:           0,
  flour:           0,
  bread:           0,
  rocks:           0,
};

const initialUnlockedActions = new Set<string>([
  'harvest_rocks',
]);

/* ---------- exported hook ---------- */

export const useGameState = () => {
  /* core resources & player stats */
  const [resources,            setResources           ] = useState(initialResources);
  const [hunger,               setHunger              ] = useState(100);
  const [modifiers,            _setModifiers          ] = useState<Modifiers>({ harvestBonus: {} });
  const [tracker,              setResourceInteractions] = useState<InteractionTracker>({});
  const [trackerState,         setTracker             ] = useState<TrackerState> ({tracker: {}, __ticks:0,});

  /* progression / discovery */
  const [discoverySet,         _setDiscovered         ] = useState<Set<ResourceID>>(new Set(['rocks']));
  const [unlockedActions,      setUnlockedActions     ] = useState<Set<string>>(initialUnlockedActions);
  const [unlockedTechs,        setUnlockedTechs       ] = useState<Set<TechID>>(new Set());
  const [maxResourceBonuses,   setMaxResourceBonuses  ] = useState<Partial<Record<ResourceID, number>>>({});

  /* UI-feedback & misc */
  const [lastGained,                   setLastGained                  ] = useState<Partial<Record<ResourceID, number>>>({});
  const [plantedAtTick,                setPlantedAtTick               ] = useState<number | null>(null);
  const [primitiveWheatPlanted,        setPrimitiveWheatPlanted       ] = useState(false);
  const [readyToHarvestPrimitiveWheat, setReadyToHarvestPrimitiveWheat] = useState(false);
  const [grindClicks,                  setGrindClicks                 ] = useState(0);
  const [bakeClicks,                   setBakeClicks                  ] = useState(0);

  /* ---------- tiny helpers (logic-free) ---------- */

  /** safely updates modifiers */
  const setModifiers = (fn: (prev: Modifiers) => Modifiers) =>
    _setModifiers(prev => fn(prev));

  /** add a resource to the discovery set */
  const discoverResource = (id: ResourceID) =>
    _setDiscovered(prev => (prev.has(id) ? prev : new Set(prev).add(id)));

  /** current global tick counter; stored in InteractionTracker */
  const getTick = () => trackerState.__ticks;

  /* ---------- bundle all exports ---------- */

  return {
    /* state & setters */
    resources,               setResources,
    hunger,                  setHunger,
    modifiers,               setModifiers,
    tracker,                 setResourceInteractions,
    trackerState,            setTracker,

    discoveredResources:     discoverySet, discoverResource,
    unlockedActions,         setUnlockedActions,
    unlockedTechs,           setUnlockedTechs,
    maxResourceBonuses,      setMaxResourceBonuses,

    lastGained,              setLastGained,
    plantedAtTick,           setPlantedAtTick,
    primitiveWheatPlanted,   setPrimitiveWheatPlanted,
    readyToHarvestPrimitiveWheat, setReadyToHarvestPrimitiveWheat,

    grindClicks,             setGrindClicks,
    bakeClicks,              setBakeClicks,

    /* helpers */
    getTick,
  };
};

export type GameStateHook = ReturnType<typeof useGameState>;
