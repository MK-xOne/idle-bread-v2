// App.tsx
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { useGame } from './context/GameProvider';
import { InventoryDisplay } from './components/InventoryDisplay';
import { useAnimation } from './utils/Animations';
import './utils/animations.css';
import type { ActionResult } from './context/actions/performNamedAction';

function App() {
  const { resources, performNamedAction } = useGame();
  const [rockId, setRockId] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isRockClicked, triggerRockAnimation] = useAnimation(1000);
  const rocksBeforeRef = useRef(resources.rocks ?? 0);

  useEffect(() => {
    rocksBeforeRef.current = resources.rocks ?? 0;
  }, [resources.rocks]);

  const handleRockClick = () => {
    const audio = new Audio("/sounds/rock-break.mp3");
    audio.play().catch(e => console.warn("Audio play failed:", e));

    const before = rocksBeforeRef.current;
    const result: ActionResult = performNamedAction?.("rocks", "harvest") ?? { performed: false };
    const after = resources.rocks ?? 0;
    const gained = Math.max(0, after - before);

    if (result.performed) {
      triggerRockAnimation();
      setFeedback(`+${gained}`);
      setTimeout(() => {
        setFeedback(null);
        setRockId(prev => prev + 1);
      }, 1000);
    } else {
      setFeedback("No rock found");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="start-screen full-screen">
      {(resources.rocks ?? 0) > 0 && (
        <div className="left-panel">
          <InventoryDisplay />
        </div>
      )}

      <div className="centered-rock-wrapper">
        <div
          className={`rock-button ${isRockClicked ? "split" : ""}`}
          onClick={handleRockClick}
        >
          <div className="rock-icon" key={rockId}>
            {feedback && (
              <div
                className="rock-feedback"
                style={{
                  color: feedback === "No rock found" ? "#ff5252" : "#4caf50",
                }}
              >
                {feedback}
              </div>
            )}
            <span className="rock-left animate-out">🪨</span>
            <span className="rock-right animate-out">🪨</span>
          </div>
          <div className="rock-text">Gather Rock</div>
        </div>
      </div>
    </div>
  );
}

export default App;
