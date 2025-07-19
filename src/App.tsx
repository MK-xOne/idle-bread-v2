import './App.css';
import { useState, useEffect, useRef } from 'react';
import { useGame } from './context/GameProvider';
import { InventoryDisplay } from './components/InventoryDisplay';
import { useAnimation } from './utils/Animations';
import './utils/animations.css';
import type { ActionResult } from './context/actions/performNamedAction';

/**
 * App.tsx
 * ----------
 * Entry component for the game's initial interaction phase ("Phase 1").
 * 
 * Responsibilities:
 * - Uses unified `performNamedAction` for all harvests
 * - Guarantees +1 on first pick, triggers rock split animation only on success
 * - Displays inventory and feedback once game begins
 */

function App() {
  const { resources, performNamedAction, setResources } = useGame();
  const [firstPickDone, setFirstPickDone] = useState(false);
  const [rockId, setRockId] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isRockClicked, triggerRockAnimation] = useAnimation(1000);
  const rocksBeforeRef = useRef(resources.rocks ?? 0);

  useEffect(() => {
    rocksBeforeRef.current = resources.rocks ?? 0;
  }, [resources.rocks]);

  const handleRockClick = () => {
    const audio = new Audio("/sounds/rock-break.mp3");
    audio.play().catch((e) => console.warn("Audio play failed:", e));

    const isFirstPick = !firstPickDone;

    let before = resources.rocks ?? 0;

    if (isFirstPick) {
      setFirstPickDone(true);
      before = before + 1;
      setResources(prev => ({
        ...prev,
        rocks: (prev.rocks ?? 0) + 1,
      }));
    }

    const result = (performNamedAction?.("rocks", "harvest") ?? {
      performed: false,
    }) as ActionResult;

    const after = (resources.rocks ?? 0) + (isFirstPick ? 1 : 0);
    const gained = Math.max(0, after - before);

    if (result.performed || isFirstPick) {
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
      {firstPickDone && (
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
          <div className="rock-text">
            {firstPickDone ? "Gather Rock" : "Pick a Rock"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
