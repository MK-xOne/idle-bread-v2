import { useGame } from '../context/GameContext';
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
      <div className="panel" style={{ }}>
      <h3></h3>
      {actions.map(({ resourceId, actionType, label }) => (
        <div key={`${actionType}_${resourceId}`} style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => performNamedAction(resourceId, actionType)}
            className="eat-button"
            style={{
              position: 'absolute',
              top: 50,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: "1.2rem",
              borderRadius: "0.5rem",
              width: '25%',
              maxWidth:'600px',
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        </div>
      ))}
    </div>
  );
};
