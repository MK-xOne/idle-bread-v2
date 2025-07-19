import { useGame } from '../context/GameProvider';
import { eatingActionTypes, getAvailableResourceActions } from '../utils/getAvailableResourceActions';

/**
 * EatingPanel Component
 * ----------------------
 * Displays buttons for all currently available eating actions.
 * Filters unlocked actions using `eatingActionTypes` and renders
 * interactive buttons tied to those actions (e.g., eat wild wheat, feast).
 * 
 * Uses `performNamedAction` to trigger the consumption of food-related
 * resources when a button is clicked, restoring player hunger.
 * 
 * Separated from the general ActionPanel to provide a focused UI
 * section for food and hunger management.
 */

export const EatingPanel = () => {
  const { unlockedActions, performNamedAction } = useGame();

  const actions = getAvailableResourceActions(eatingActionTypes, unlockedActions);

  return (
      <div className="panel">
      <h3>🍽️ Eating</h3>
      {actions.map(({ resourceId, actionType, label }) => (
        <div key={`${actionType}_${resourceId}`} style={{ marginBottom: '1rem' }}>
          <button onClick={() => performNamedAction(`${actionType}_${resourceId}`)}>
            {label}
          </button>
        </div>
      ))}
    </div>
  );
};
