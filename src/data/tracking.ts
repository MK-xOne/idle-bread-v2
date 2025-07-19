import type { InteractionTracker, ResourceInteractionType } from '../context/types';
import type { ResourceID } from "./resources";

/**
 * tracking.ts
 * -------------
 * Manages runtime tracking of player interactions and game ticks.
 * 
 * Includes:
 * - `trackInteraction`: Logs detailed stats (attempted, success, failed, gained)
 *   for specific actions performed on resources. Used to generate analytics,
 *   gameplay insights, or visual feedback in panels like `DataPanel`.
 * 
 * - `advanceTick`: Increments the internal tick counter used for time-based logic,
 *   growth mechanics, and progression pacing.
 * 
 * This system supports lightweight telemetry for balancing and debugging while
 * remaining decoupled from core action execution logic.
 */

const TRACKABLE_ACTIONS: ResourceInteractionType[] = [
  "harvest", "eat", "plant", "grind", "bake", "feast",
];

export function trackInteraction(
  setTracker: React.Dispatch<React.SetStateAction<InteractionTracker>>,
  resourceId: ResourceID,
  type: string,
  update: Partial<{
    attempted: number;
    success: number;
    failed: number;
    gained: number;
  }> = {}
) {
  if (!TRACKABLE_ACTIONS.includes(type as ResourceInteractionType)) {
    return; // silently ignore untrackable types like "grow"
  }

  const interactionType = type as ResourceInteractionType;

  setTracker(prev => {
    const previousStats = prev[resourceId]?.[interactionType] ?? {
      attempted: 0,
      success: 0,
      failed: 0,
      gained: 0
    };

    return {
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [interactionType]: {
          attempted: previousStats.attempted + (update.attempted ?? 0),
          success: previousStats.success + (update.success ?? 0),
          failed: previousStats.failed + (update.failed ?? 0),
          gained: previousStats.gained + (update.gained ?? 0)
        }
      }
    };
  });
}

export function advanceTick(setTracker: React.Dispatch<React.SetStateAction<InteractionTracker>>) {
  setTracker(prev => {
    const newTicks = (prev.__ticks ?? 0) + 1;
    return {
      ...prev,
      __ticks: newTicks, // ensure the value updates
    };
  });
}




