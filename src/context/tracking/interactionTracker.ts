// src/context/tracking/interactionTracker.ts
// ------------------------------------------------------
// Tracks player interactions with resources across actions.
// Logs number of attempts, successes, failures, and gains.
// Also tracks a global tick counter (__ticks).
// ------------------------------------------------------

import type { GameStateHook } from '../gameState';
import type { ResourceID } from '../../data/resources';
import type { ActionType } from '../../data/actionData';
import type { ActionResult } from '../actions/performNamedAction';
import type {
  ResourceInteractionType,
  InteractionStats,
} from '../types';

interface InteractionContext {
  resource: ResourceID;
  actionType: ActionType;
  result: ActionResult;
  state: GameStateHook;
}

/**
 * trackInteraction
 * -----------------
 * Records the result of an interaction (harvest, eat, etc.)
 * against a resource and updates statistics and ticks.
 */
export const trackInteraction = ({
  resource,
  actionType,
  result,
  state,
}: InteractionContext): void => {
  const type = actionType as ResourceInteractionType;

  state.setResourceInteractions(prev => {
    const current = { ...prev };

    const resourceStats = { ...(current[resource] ?? {}) };
    const existingStats = resourceStats[type] as InteractionStats | undefined;

    const updatedStats: InteractionStats = {
      attempted: (existingStats?.attempted ?? 0) + 1,
      success: (existingStats?.success ?? 0) + (result.performed ? 1 : 0),
      failed: (existingStats?.failed ?? 0) + (result.performed ? 0 : 1),
      gained: (existingStats?.gained ?? 0) + (result.amount ?? 0),
    };

    current[resource] = {
      ...resourceStats,
      [type]: updatedStats,
    };

    // ✅ Safe tick increment even if __ticks is misinferred
    const currentTicks = typeof current.__ticks === 'number' ? current.__ticks : 0;
    current.__ticks = currentTicks + 1;

    return current;
  });
};
