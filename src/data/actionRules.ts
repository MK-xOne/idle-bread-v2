import type { ActionType } from './actionData';
import type { ResourceID } from './resources';

export interface ActionRule {
  chain?: {
    target: ResourceID;
    action: ActionType;
    conditions?: ((ctx: { resource: ResourceID; action: ActionType }) => boolean)[];
  }[];
}

export const actionRules: Partial<Record<ActionType, ActionRule>> = {
  harvest: {
    chain: [
      {
        action: "harvest",
        target: "seeds",
        conditions: [
          ({ resource }) => resource === "wildWheat",
        ],
      },
    ],
  },
};
