import { useGame } from '../context/GameProvider';

export const ActionPanel = () => {
  const {
    harvestWildWheat,
    plantPrimitiveWheat,
    harvestPrimitiveWheat,
    grindFlour,
    bakeBread,
    resources,
    primitiveWheatPlanted,
    readyToHarvestPrimitiveWheat,
    unlockedActions,
    grindClicks,
    bakeClicks,
    actionsSincePlanting,
  } = useGame();

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>⚙️ Actions</h3>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={harvestWildWheat}>Harvest Wild Wheat</button>
      </div>

      {unlockedActions.has('plantPrimitiveWheat') && (
        <div style={{ marginBottom: '1rem' }}>
          {!primitiveWheatPlanted && !readyToHarvestPrimitiveWheat ? (
            <button
              onClick={plantPrimitiveWheat}
              disabled={resources.seeds < 5}
            >
              🌾 Plant Primitive Wheat (5 seeds)
            </button>
          ) : readyToHarvestPrimitiveWheat ? (
            <button onClick={harvestPrimitiveWheat}>
              Harvest Primitive Wheat
            </button>
          ) : (
            <span>🌱 Growing… ({actionsSincePlanting}/20)</span>
          )}
        </div>
      )}

      {unlockedActions.has('grindFlour') && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={grindFlour}
            disabled={resources.primitiveWheat < 5 && grindClicks === 0}
          >
            Grind Wheat ({grindClicks}/5)
          </button>
        </div>
      )}

      {unlockedActions.has('bake') && (
        <div>
          <button
            onClick={bakeBread}
            disabled={resources.flour < 3 && bakeClicks === 0}
          >
            Bake Bread ({bakeClicks}/3)
          </button>
        </div>
      )}
    </section>
  );
};
