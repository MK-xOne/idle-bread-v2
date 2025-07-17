import type { InteractionTracker, ResourceInteractionType } from '../context/types';
import type { ResourceID } from "./resources";

export function trackInteraction(
  setTracker: React.Dispatch<React.SetStateAction<InteractionTracker>>,
  resourceId: ResourceID,
  type: ResourceInteractionType
) {
  setTracker(prev => {
    const current = prev[resourceId]?.[type] ?? 0;
    return {
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [type]: current + 1,
      },
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




