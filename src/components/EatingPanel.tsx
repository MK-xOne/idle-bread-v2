import { useGame } from '../context/GameProvider';
import { eatingActionTypes, getAvailableResourceActions } from '../utils/getAvailableResourceActions';

export const EatingPanel = () => {
  const { unlockedActions, performNamedAction } = useGame();

  const actions = getAvailableResourceActions(eatingActionTypes, unlockedActions);

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>🍽️ Eating</h3>
      {actions.map(({ resourceId, actionType, label }) => (
        <div key={`${actionType}_${resourceId}`} style={{ marginBottom: '1rem' }}>
          <button onClick={() => performNamedAction(`${actionType}_${resourceId}`)}>
            {label}
          </button>
        </div>
      ))}
    </section>
  );
};
