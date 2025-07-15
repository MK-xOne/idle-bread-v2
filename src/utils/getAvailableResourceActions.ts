import { resources } from "../data/resources";
import type { ActionType, ResourceID } from "../data/resources";
import { useGame } from "../context/GameProvider";

// Define which action types belong in which panel
export const generalActionTypes: ActionType[] = ['harvest', 'plant', 'grind', 'bake'];
export const eatingActionTypes: ActionType[] = ['eat', 'feast'];

export interface ResourceActionEntry {
  resourceId: ResourceID;
  actionType: ActionType;
  label: string;
}

export const getAvailableResourceActions = (
  allowedTypes: ActionType[],
  unlockedActions: Set<string>
): ResourceActionEntry[] => {
  const result: ResourceActionEntry[] = [];

  Object.entries(resources).forEach(([resourceId, res]) => {
    if (!res.actions) return;

    allowedTypes.forEach(actionType => {
      if (res.actions?.[actionType]) {
        const actionId = `${actionType}_${resourceId}`;
        if (unlockedActions.has(actionId)) {
          result.push({
            resourceId: resourceId as ResourceID,
            actionType,
            label: `${capitalize(actionType)} ${res.name}`,
          });
        }
      }
    });
  });

  return result;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
