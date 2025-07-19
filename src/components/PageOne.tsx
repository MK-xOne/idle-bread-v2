// PageOne.tsx
import "./PageOne.css";
import "../utils/animations.css";
import { useGame } from "../context/GameContext";
import { useEffect, useRef, useState } from "react";
import type { ActionResult } from '../context/types'; 

/**
 * PageOne.tsx
 * -------------------
 * Initial game screen with central rock icon and text.
 * Clicking the rock triggers a real harvest via performNamedAction.
 * On success, shows floating "+N" feedback.
 */

export default function PageOne() {
  const { resources, performNamedAction } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);
  const rocksRef = useRef(resources.rocks ?? 0);

  const [previousRock, setPreviousRock] = useState(resources.rocks ?? 0);

  useEffect(() => {
    if (resources.rocks != null && resources.rocks > previousRock) {
      setFeedback(`+${resources.rocks - previousRock}`);
      setTimeout(() => setFeedback(null), 1000);
    }
    setPreviousRock(resources.rocks ?? 0);
  }, [resources.rocks]);


  const handleClick = () => {
    
    const before = rocksRef.current;
    if (!performNamedAction) return;
    const result: ActionResult = performNamedAction("rocks", "harvest");

    const gained = (resources.rocks ?? 0) - before;
    if (result.performed && gained > 0) {
      setFeedback(`+${gained}`);
      setFeedback(`+${gained}`);
      setTimeout(() => {
        document.querySelector(".rock-feedback")?.classList.add("animate-out");
        setTimeout(() => setFeedback(null), 300);
      }, 1000);
    }
  };

  return (
    <div className="page-one-container">
      <div className="rock-center" onClick={handleClick}>
        <div className="rock-icon gather-rock">🪨</div>
        {feedback && <div className="rock-feedback">{feedback}</div>}
        <div className="rock-text">Click the rock to gather resources</div>
      </div>
    </div>
  );
}
