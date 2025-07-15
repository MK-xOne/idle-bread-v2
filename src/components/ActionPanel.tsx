import { useGame } from '../context/GameProvider';
import { performNamedAction } from '../context/actions/performNamedAction';
import { resources } from '../data/resources';
import { actionLabels } from '../data/actionData';

export const ActionPanel = () => {
  const game = useGame();
  const { unlockedActions, performAction } = game;

  // We'll skip eating actions here
  const ignoredActions = ['eat', 'feast'];

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>⚙️ Actions</h3>

      {Object.values(resources).map(resource => {
        if (!resource.actions) return null;

        return Object.entries(resource.actions).map(([actionName, handler]) => {
          if (!handler || ignoredActions.includes(actionName)) return null;

          const actionId = `${actionName}_${resource.id}`;
          const isUnlocked = unlockedActions.has(actionId);

          if (!isUnlocked) return null;

          const isRockHarvest = actionName === 'harvest' && resource.id === 'rocks';
          const label = isRockHarvest ? '🪨 Gather Rocks' : actionLabels[actionName as keyof typeof actionLabels]?.label ?? actionName;
          const description =
            resources[resource.id]?.description ??
            actionLabels[actionName as keyof typeof actionLabels]?.description ??
            '';

          return (
            <div key={actionId} style={{ marginBottom: '1rem' }}>
              <button
                onClick={() =>
                  performAction(() => performNamedAction(game, resource.id, actionName), game)
                }
              >
                {label} ({resource.name})
              </button>
              {description && (
                <p style={{ fontSize: '0.9rem', color: '#888' }}>{description}</p>
              )}
            </div>
          );
        });
      })}
    </section>
  );
};
