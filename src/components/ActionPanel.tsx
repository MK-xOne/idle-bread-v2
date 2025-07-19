import { useGame } from '../context/GameContext';
import { resources } from '../data/resources';
import { actionLabels } from '../data/actionData';

/**
 * ActionPanel Component
 * ---------------------
 * This component dynamically renders action buttons for each resource
 * based on the player's current unlocks. It uses the game context to
 * determine which actions are available, filters out actions like
 * 'eat' and 'feast' (handled elsewhere), and applies conditional logic 
 * (e.g., for primitive wheat growth stages).
 * 
 * Clicking an action triggers its corresponding effect via performNamedAction.
 * 
 * This panel is the main interactive interface for progressing through
 * resource mechanics such as harvesting, planting, grinding, and baking.
 */


export const ActionPanel = () => {
  const game = useGame(); // ✅ Hook inside component
  const {
    unlockedActions,
    performNamedAction,
    primitiveWheatPlanted,
    readyToHarvestPrimitiveWheat,
  } = game;

  const ignoredActions = ['eat', 'feast'];

  return (
    <div className="panel">
      <h3>⚙️ Actions</h3>

      {Object.values(resources).map(resource => {
        if (!resource.actions) return null;

        return Object.entries(resource.actions).map(([actionName, handler]) => {
          if (!handler || ignoredActions.includes(actionName)) return null;

          const actionId = `${actionName}_${resource.id}`;
          const isUnlocked = unlockedActions.has(actionId);

          if (!isUnlocked) return null;

          // 🔥 Conditional skip logic for primitive wheat
          if (resource.id === 'primitiveWheat') {
            if (actionName === 'plant' && primitiveWheatPlanted) return null;
            if (actionName === 'grow' && (!primitiveWheatPlanted || readyToHarvestPrimitiveWheat)) return null;
            if (actionName === 'harvest' && !readyToHarvestPrimitiveWheat) return null;
          }

          const isRockHarvest = actionName === 'harvest' && resource.id === 'rocks';
          const label = isRockHarvest
            ? ''
            : actionLabels[actionName as keyof typeof actionLabels]?.label ?? actionName;

          const description =
            resources[resource.id]?.description ??
            actionLabels[actionName as keyof typeof actionLabels]?.description ??
            '';

          return (
            <div key={actionId} style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => {
                  const id = `${actionName}_${resource.id}`;
                  console.log(`[UI] Button clicked:`, id);
                  performNamedAction(id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={resource.icon}
                  alt={`Gather ${resource.name}`}
                  style={{ width: '64px', height: '64px' }}
                />
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Gather Rock</div>
              </button>
            </div>
          );
        });
      })}
  </div>
  );
};
