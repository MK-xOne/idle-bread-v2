import { useGame } from '../context/GameProvider';

export const EatingPanel = () => {
  const {
    hunger,
    resources,
    eatWildWheat,
    eatPrimitiveWheat,
    feastOnWildWheat,
    feastOnPrimitiveWheat,
    unlockedActions,
  } = useGame();

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>🍽 Eat</h3>

      <div>
        <button onClick={eatWildWheat} disabled={resources.wildWheat < 10}>
          Eat 10 Wild Wheat (+5)
        </button>

        {unlockedActions.has('feast') && (
          <button
            onClick={feastOnWildWheat}
            disabled={resources.wildWheat < 10 || hunger === 100}
            style={{ marginLeft: '1rem' }}
          >
            Eat Full (Feast)
          </button>
        )}
      </div>

      {unlockedActions.has('plantPrimitiveWheat') && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={eatPrimitiveWheat}
            disabled={resources.primitiveWheat < 10}
          >
            Eat 10 Primitive Wheat (+15)
          </button>

      {unlockedActions.has('feastOnPrimitiveWheat') && (
        <button
          onClick={feastOnPrimitiveWheat}
          disabled={resources.primitiveWheat < 10 || hunger === 100}
          style={{ marginLeft: '1rem' }}
        >
          Eat Full (Feast)
        </button>
      )}
        </div>
      )}
    </section>
  );
};
