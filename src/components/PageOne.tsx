import "../App.css";
import "../utils/animations.css";
import { useGame } from "../context/GameContext";
import { useEffect, useRef, useState } from "react";
import { resources as resourceData } from "../data/resources"; // ✅ This is the metadata!
import { InventoryDisplay } from './InventoryDisplay';
import { techTree } from "../data/tech";
import { TechnologyPanel } from "./TechnologyPanel";
import { HungerBar } from './HungerBar';
import { EatingPanel } from './EatingPanel';
import PlantingPanel from "./PlantingPanel";

export default function PageOne() {
  const { resources, performNamedAction, unlockedActions, unlockedTechs, setUnlockedTechs } = useGame();
  const rocks = resources.rocks ?? 0;
  const [feedback, setFeedback] = useState<string | null>(null);
  const rocksRef = useRef(rocks);
  const { hunger } = useGame();
  const [hungerBarVisible, setHungerBarVisible] = useState(false);

  const canShowWildWheatUnlock =
  !unlockedTechs.has("unlockWildWheat") &&
  rocks >= (techTree.unlockWildWheat.cost.rocks ?? 0);

  useEffect(() => {
    rocksRef.current = rocks;
  }, [rocks]);

  useEffect(() => {
  if (hunger <= 25 && !hungerBarVisible) {
    setHungerBarVisible(true);
  }
}, [hunger, hungerBarVisible]);

  const handleClick = () => {
    const current = resources.rocks ?? 0;
    const cap = resourceData.rocks.maxAmount ?? Infinity;

    if (current >= cap) {
      setFeedback("❌ No more space");
      setTimeout(() => setFeedback(null), 800);
      return;
    }

    const result = performNamedAction("rocks", "harvest");

    if (result?.performed && result.amount && result.amount > 0) {
      setFeedback(`+${result.amount} ${resourceData.rocks.icon}`);
    } else {
      setFeedback("No rock found");
    }

    setTimeout(() => setFeedback(null), 800);
    console.log("Harvest result:", result);
  };

  return (
    
    <div
      className="page-one"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {hungerBarVisible && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          padding: '0.5rem',
          zIndex: 1000
        }}>
          <HungerBar />
          <EatingPanel />
        </div>
      )}

      {unlockedTechs.has("unlockPlanting") && <PlantingPanel />}

      {/* Centered action buttons */}
      <div
        style={{
          display: "absolute",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Gather Rocks Button */}
        <button
          onClick={handleClick}
          className="rock-button"
          style={{ fontSize: "4rem", background: "none", border: "none", cursor: "pointer" }}
          aria-label="Harvest Rock"
        >
          {resourceData.rocks.icon}
        </button>

        {/* Gather Wild Wheat Button – unlocked dynamically */}
        {unlockedTechs.has("unlockWildWheat") && (
          <button
            onClick={() => {
              if ((resources.wildWheat ?? 0) >= (resourceData.wildWheat.maxAmount ?? Infinity)) {
                setFeedback("❌ No more space");
                setTimeout(() => setFeedback(null), 800);
                return;
              }
              const result = performNamedAction("wildWheat", "harvest");
              if (result?.performed && result.amount && result.amount > 0) {
                setFeedback(`+${result.amount} ${resourceData.wildWheat.icon}`);
                setTimeout(() => setFeedback(null), 800);
              } else if (!result?.performed) {
                setFeedback("No wheat found");
                setTimeout(() => setFeedback(null), 800);
              }
            }}
            className="wheat-button"
            style={{ fontSize: "4rem", background: "none", border: "none", cursor: "pointer", paddingLeft: "2rem", }}
            aria-label="Harvest Wild Wheat"
          >
            {resourceData.wildWheat.icon}
          </button>
        )}
      </div>

      {/* Label below the button group */}
      <h3></h3>

      {/* Harvest feedback */}
      <div
        style={{
          fontSize: "1rem",
          color: "white",
          height: "1.2em", // Reserve space
          transition: "opacity 0.3s ease",
          opacity: feedback ? 1 : 0,
        }}
      >
        {feedback ?? ""}
      </div>

      {/* Inventory panel appears after first rock */}
      {Object.values(resources).some(amount => amount > 0) && (
        <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1000 }}>
          <InventoryDisplay />
        </div>
      )}

      {/* Technology panel appears after 10 rocks */}
      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}>
        <TechnologyPanel />
      </div>
    </div>
  );
}
