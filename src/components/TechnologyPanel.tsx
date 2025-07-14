import { useGame } from '../context/GameProvider';

export const TechnologyPanel = () => {
  const {
    resources,
    hunger,
    fireDiscovered,
    setFireDiscovered,
    plantingUnlocked,
    setPlantingUnlocked,
    wheelUnlocked,
    setWheelUnlocked,
    bakingUnlocked,
    setBakingUnlocked,
    feastUnlocked,
    setFeastUnlocked,
  } = useGame();

  // Unlock handlers
  const unlockFire = () => {
    if (resources.wildWheat >= 20) {
      setFireDiscovered(true);
    }
  };

  const unlockPlanting = () => {
    if (resources.seeds >= 25) {
      setPlantingUnlocked(true);
    }
  };

  const unlockWheel = () => {
    if (resources.primitiveWheat >= 30) {
      setWheelUnlocked(true);
    }
  };

  const unlockBaking = () => {
    if (resources.flour >= 10) {
      setBakingUnlocked(true);
    }
  };

  const unlockFeast = () => {
    if (resources.seeds >= 25 && resources.primitiveWheat >= 50) {
      setFeastUnlocked(true);
    }
  };

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>🧠 Technologies</h3>

      {/* Fire */}
      {!fireDiscovered && (
        <button
          onClick={unlockFire}
          disabled={resources.wildWheat < 20}
        >
          🔥 Discover Fire (20 Wild Wheat)
        </button>
      )}

      {/* Planting */}
      {fireDiscovered && !plantingUnlocked && (
        <button
          onClick={unlockPlanting}
          disabled={resources.seeds < 25}
        >
          🌱 Unlock Planting (25 Seeds)
        </button>
      )}

      {/* Wheel */}
      {plantingUnlocked && !wheelUnlocked && (
        <button
          onClick={unlockWheel}
          disabled={resources.primitiveWheat < 30}
        >
          🛞 Unlock Wheel (30 Primitive Wheat)
        </button>
      )}

      {/* Baking */}
      {wheelUnlocked && !bakingUnlocked && (
        <button
          onClick={unlockBaking}
          disabled={resources.flour < 10}
        >
          🔧 Unlock Baking (10 Flour)
        </button>
      )}

      {/* Feast */}
      {plantingUnlocked && !feastUnlocked && (
        <button
          onClick={unlockFeast}
          disabled={resources.seeds < 25 || resources.primitiveWheat < 50}
        >
          🍽 Unlock Feast (25 Seeds + 50 Primitive Wheat)
        </button>
      )}
    </section>
  );
};
