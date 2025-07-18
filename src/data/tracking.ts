import type { InteractionTracker, ResourceInteractionType } from '../context/types';
import type { ResourceID } from "./resources";


export function trackInteraction(
  setTracker: React.Dispatch<React.SetStateAction<InteractionTracker>>,
  resourceId: ResourceID,
  type: ResourceInteractionType,
  update: Partial<{
    attempted: number;
    success: number;
    failed: number;
    gained: number;
  }> = {}
) {
  setTracker(prev => {
    const previousStats = prev[resourceId]?.[type] ?? {
      attempted: 0,
      success: 0,
      failed: 0,
      gained: 0
    };

    return {
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [type]: {
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




