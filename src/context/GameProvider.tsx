import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { GameContextType, GameState, ResourceID } from './types';

import {
  harvestWildWheat,
  eatWildWheat,
  eatPrimitiveWheat,
  plantPrimitiveWheat,
  harvestPrimitiveWheat,
} from './actions/wheatActions';

import {
  feastOnWildWheat,
  feastOnPrimitiveWheat,
} from './actions/feastActions';

import {
  grindFlour,
  bakeBread,
  eatBread,
} from './actions/breadActions';

import { discoverFire } from './actions/fireActions';
import { performAction } from './actions/performAction';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Core states
  const [hunger, setHunger] = useState(100);
  const [feastUnlocked, setFeastUnlocked] = useState(false);
  const [fireDiscovered, setFireDiscovered] = useState(false);
  const [plantingUnlocked, setPlantingUnlocked] = useState(false);
  const [wheelUnlocked, setWheelUnlocked] = useState(false);
  const [bakingUnlocked, setBakingUnlocked] = useState(false);

  // Primitive wheat planting/growth states
  const [primitiveWheatPlanted, setPrimitiveWheatPlanted] = useState(false);
  const [actionsSincePlanting, setActionsSincePlanting] = useState(0);
  const [readyToHarvestPrimitiveWheat, setReadyToHarvestPrimitiveWheat] = useState(false);

  // Click counters for grinding and baking
  const [grindClicks, setGrindClicks] = useState(0);
  const [bakeClicks, setBakeClicks] = useState(0);

  // Resources inventory
  const [resources, setResources] = useState<Record<ResourceID, number>>({
    wildWheat: 0,
    primitiveWheat: 0,
    seeds: 0,
    flour: 0,
    bread: 0,
  });

  // Compose game state for actions
  const gameState: GameState = {
    hunger,
    setHunger,
    resources,
    setResources,
    feastUnlocked,
    plantingUnlocked,
    wheelUnlocked,
    bakingUnlocked,
    primitiveWheatPlanted,
    setPrimitiveWheatPlanted,
    actionsSincePlanting,
    setActionsSincePlanting,
    readyToHarvestPrimitiveWheat,
    setReadyToHarvestPrimitiveWheat,
    fireDiscovered,
    setFireDiscovered,
    grindClicks,
    setGrindClicks,
    bakeClicks,
    setBakeClicks,
  };

  return (
    <GameContext.Provider
      value={{
        hunger,
        setHunger,
        resources,
        setResources,
        performAction: (cb) => performAction(cb, gameState),
        harvestWildWheat: () => harvestWildWheat(gameState),
        eatWildWheat: () => eatWildWheat(gameState),
        eatPrimitiveWheat: () => eatPrimitiveWheat(gameState),
        feastUnlocked,
        setFeastUnlocked,
        feastOnWildWheat: () => feastOnWildWheat(gameState),
        feastOnPrimitiveWheat: () => feastOnPrimitiveWheat(gameState),
        fireDiscovered,
        setFireDiscovered,
        discoverFire: () => discoverFire(gameState),
        plantingUnlocked,
        setPlantingUnlocked,
        wheelUnlocked,
        setWheelUnlocked,
        bakingUnlocked,
        setBakingUnlocked,
        grindFlour: () => grindFlour(gameState),
        bakeBread: () => bakeBread(gameState),
        eatBread: () => eatBread(gameState),
        plantPrimitiveWheat: () => plantPrimitiveWheat(gameState),
        harvestPrimitiveWheat: () => harvestPrimitiveWheat(gameState),
        primitiveWheatPlanted,
        actionsSincePlanting,
        readyToHarvestPrimitiveWheat,
        grindClicks,
        setGrindClicks,
        bakeClicks,
        setBakeClicks,
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
