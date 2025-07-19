import "../App.css";
import "../utils/animations.css";
import { useGame } from "../context/GameContext";
import { useEffect, useRef, useState } from "react";
import { resources as resourceData } from "../data/resources"; // ✅ This is the metadata!


export default function PageOne() {
  const { resources, performNamedAction } = useGame();
  const { resources: gameResources } = useGame(); // ✅ Rename to avoid collision
  const rocks = resources.rocks ?? 0;
  const [feedback, setFeedback] = useState<string | null>(null);
  const rocksRef = useRef(rocks);

  useEffect(() => {
    rocksRef.current = rocks;
  }, [rocks]);

  const handleClick = () => {
    const result = performNamedAction("rocks", "harvest");

    if (result?.performed && result.amount && result.amount > 0) {
      setFeedback(`+${result.amount} ${resourceData.rocks.icon}`);
      setTimeout (() => setFeedback(null), 800)
    } 
    else if (!result?.performed){
      setFeedback("❌ Could not harvest rocks.");
      setTimeout (() => setFeedback(null), 800)
    }
    console.log("Harvest result:", result);
  };

  return (
  <div className="page-one" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <button
        onClick={handleClick}
        className="rock-button"
        style={{ fontSize: "4rem", background: "none", border: "none", cursor: "pointer" }}
        aria-label="Harvest Rock"
      >
        {resourceData.rocks.icon}
      </button>
      <h3>Gather Rock</h3>
      {feedback && (
        <div style={{ fontSize: "2rem", color: "white", transition: "opacity 0.3s ease" }}>
          {feedback}
        </div>
      )}
    </div>
  );
}
