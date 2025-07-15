import { useGame } from '../context/GameProvider';
import { resources as resourceMeta } from "../data/resources";


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
    grindClicks,
    bakeClicks,
    actionsSincePlanting,
    unlockedActions,
    unlockedTechs,
  } = useGame();


  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>⚙️ Actions</h3>

      <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={harvestWildWheat}
        disabled={resources.wildWheat >= (resourceMeta.wildWheat?.maxAmount ?? Infinity)}
      >
        Harvest Wild Wheat
      </button>
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
            <button
              onClick={harvestPrimitiveWheat}
              disabled={resources.primitiveWheat >= (resourceMeta.primitiveWheat?.maxAmount ?? Infinity)}
            >
              Harvest Primitive Wheat
            </button>
          ) : (
            <span>🌱 Growing… ({actionsSincePlanting}/20)</span>
          )}
        </div>
      )}

      {unlockedActions.has('grindFlour') && unlockedTechs.has('unlockWheel') && (
        <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={grindFlour}
          disabled={
            (resources.primitiveWheat < 5 && grindClicks === 0) ||
            resources.flour >= (resourceMeta.flour?.maxAmount ?? Infinity)
          }
        >
          Grind Wheat ({grindClicks}/5)
        </button>
        </div>
      )}

      {unlockedTechs.has('discoverFire') && unlockedTechs.has('baking') && (
        <div>
        <button
          onClick={bakeBread}
          disabled={
            (resources.flour < 3 && bakeClicks === 0) ||
            resources.bread >= (resourceMeta.bread?.maxAmount ?? Infinity)
          }
        >
          Bake Bread ({bakeClicks}/3)
        </button>
        </div>
      )}
    </section>
  );
};
