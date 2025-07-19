import type { ActionType } from '../../data/actionData';
import type { ResourceID } from '../../data/resources';
import type { TrackerState, InteractionStats } from '../types';

/**
 * Initializes a new interaction tracker entry for a specific resource + action.
 */
const initStats = (): InteractionStats => ({
  attempted: 0,
  succeeded: 0,
  failed: 0,
  gained: 0,
});

/**
 * Ensures that a specific [resourceId][actionType] path exists in the tracker.
 */
function ensurePath(state: TrackerState, resourceId: ResourceID, actionType: ActionType) {
  if (!state.tracker[resourceId]) {
    state.tracker[resourceId] = {};
  }
  if (!state.tracker[resourceId]![actionType]) {
    state.tracker[resourceId]![actionType] = initStats();
  }
}

/**
 * Increments the interaction statistics for a given action attempt.
 */
export function trackInteraction(
  state: TrackerState,
  resourceId: ResourceID,
  actionType: ActionType,
  result: {
    attempted?: boolean;
    succeeded?: boolean;
    failed?: boolean;
    gained?: number;
  }
) {
  ensurePath(state, resourceId, actionType);

  const stats = state.tracker[resourceId]![actionType]!;

  if (result.attempted) stats.attempted += 1;
  if (result.succeeded) stats.succeeded += 1;
  if (result.failed) stats.failed += 1;
  if (typeof result.gained === 'number') stats.gained += result.gained;
}

/**
 * Advances the global tick count.
 */
export function advanceTick(state: TrackerState) {
  state.__ticks += 1;
}

