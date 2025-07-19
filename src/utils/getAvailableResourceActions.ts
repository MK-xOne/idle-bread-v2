import { resources } from "../data/resources";
import type { ActionType, ResourceID } from "../data/resources";

/**
 * getAvailableResourceActions.ts
 * --------------------------------
 * Utility for dynamically generating a list of action options for UI panels
 * based on allowed action types and currently unlocked actions.
 * 
 * Key exports:
 * - `generalActionTypes` and `eatingActionTypes`: Categorize action types for different UI contexts
 * - `customActionLabels`: Allows override of default button labels for specific actions
 * - `getAvailableResourceActions(...)`: Returns a filtered and labeled list of resource-action pairs
 *   ready to be rendered in action-related panels (e.g., buttons in ActionPanel or EatingPanel)
 * 
 * This file serves as the bridge between resource metadata and the interface layer,
 * ensuring only valid, visible, and context-appropriate actions are shown to the player.
 */

// Define which action types belong in which panel
export const generalActionTypes: ActionType[] = ['harvest', 'plant', 'grind', 'bake'];
export const eatingActionTypes: ActionType[] = ['eat', 'feast'];

export interface ResourceActionEntry {
  resourceId: ResourceID;
  actionType: ActionType;
  label: string;
}

export const customActionLabels: Record<string, string> = {
  harvest_rock: "⛏️ Gather Rocks"
};

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
