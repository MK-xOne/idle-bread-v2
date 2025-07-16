import type { InteractionTracker, ResourceID, ResourceInteractionType } from '../context/types';

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
