import './App.css';
import { useState } from 'react';
import { useGame } from './context/GameProvider';
import { InventoryDisplay } from './components/InventoryDisplay';
import { useAnimation } from './utils/Animations';
import './utils/animations.css';

function App() {
  const { resources, setResources, performNamedAction } = useGame();
  const [firstPickDone, setHasClickedFirstRock] = useState(false);
  const [hasPickedOnce, setHasPickedOnce] = useState(false);
  const [isRockClicked, triggerRockAnimation] = useAnimation(1000);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const handleRockClick = () => {
    const audio = new Audio("/sounds/rock-break.mp3");
    audio.play().catch((e) => console.warn("Audio play failed:", e));
    audio.play();

    if (!hasPickedOnce) {
      // Guarantee +1 rock on first click
      triggerRockAnimation();
      setFeedback("+1");
      setHasPickedOnce(true);
      setHasClickedFirstRock(true);

      // Manually update resources
        setResources(prev => ({
        ...prev,
        rocks: (prev.rocks ?? 0) + 1,
      }));

      setTimeout(() => {
        triggerRockAnimation();;
        setFeedback(null);
      }, 1000);
      return;
    }

    const before = resources.rocks ?? 0;

    setResources(prev => {
      performNamedAction?.("harvest_rocks"); // triggers state update
      return prev; // trigger side-effect but don’t change state here
    });

    // Wait a tick before comparing
    setTimeout(() => {
      const after = resources.rocks ?? 0;
      const gained = after - before;

      if (gained > 0) {
        triggerRockAnimation();
        setFeedback(`+${gained}`);
      } else {
        setFeedback("No rock found");
      }

      setTimeout(() => {
        triggerRockAnimation();;
        setFeedback(null);
      }, 1000);
    }, 10);
  };


  return (
    <div className="start-screen full-screen">
      {firstPickDone && (
        <div className="left-panel">
          <InventoryDisplay />
        </div>
      )}

      <div className="centered-rock-wrapper">
        <div className={`rock-button ${isRockClicked ? "split" : ""}`} onClick={handleRockClick}>
          <div className="rock-icon">
            {feedback && (
              <div
                className="rock-feedback"
                style={{ color: feedback === "No rock found" ? "#ff5252" : "#4caf50" }}
              >
                {feedback}
              </div>
            )}
            <span className="rock-left">🪨</span>
            <span className="rock-right">🪨</span>
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
