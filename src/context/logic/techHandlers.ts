// src/context/logic/techHandlers.ts
// ------------------------------------------------------
// Central logic for unlocking technologies.
// Handles application of effects, action unlocks,
// and discovery of new resources.
// ------------------------------------------------------

import type { TechID } from '../../data/tech';
import { techTree } from '../../data/tech';
import { applyEffect } from '../effects/applyEffect';
import type { GameStateHook } from '../gameState';

/**
 * unlockTech
 * -----------------
 * Unlocks a technology by ID, applying all its associated
 * effects, actions, and resources.
 */
export const unlockTech = (techId: TechID, state: GameStateHook): void => {
  const tech = techTree[techId];

  if (!tech) return;

  if (!tech || state.unlockedTechs.has(techId)) {
    return;
  }

  // 1. Register the unlocked tech
  state.setUnlockedTechs(prev => {
    const updated = new Set(prev);
    updated.add(techId);
    return updated;
  });

  // 2. Apply effects
  if (tech.unlocks?.effects) {
    for (const effect of tech.unlocks.effects) {
      applyEffect(effect, state);
    }
  }

  // 3. Unlock new actions
  const actionsToUnlock = tech.unlocks?.actions ?? [];

  if (actionsToUnlock.length > 0) {
    state.setUnlockedActions(prev => {
      const newSet = new Set(prev);
      for (const action of actionsToUnlock) {
        newSet.add(action);
      }
      return newSet;
    });
  }

  // 4. Discover new resources
  if (tech.unlocks?.resources) {
    for (const resourceId of tech.unlocks.resources) {
      state.discoverResource(resourceId);
    }
  }
};
