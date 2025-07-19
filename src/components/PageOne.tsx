// PageOne.tsx
import "./PageOne.css";
import "../utils/animations.css";
import { useGame } from '../context/GameContext'; // ✅ Use this if useGame is exported from GameContext.ts
import type { ActionResult } from '../context/actions/performNamedAction';
import { useEffect, useRef, useState } from "react";

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
  const [rockId, setRockId] = useState(0);
  const rocksRef = useRef(resources.rocks ?? 0);

  useEffect(() => {
    rocksRef.current = resources.rocks ?? 0;
  }, [resources.rocks]);

  const handleClick = () => {
    const before = rocksRef.current;
    const result: ActionResult = performNamedAction?.('rocks', 'harvest') ?? { performed: false };

    setTimeout(() => {
      const after = resources.rocks ?? 0;
      const gained = Math.max(0, after - before);

      if (result?.performed && gained > 0) {
        setFeedback(`+${gained}`);
        setRockId(prev => prev + 1); // Trigger rerender
        setTimeout(() => setFeedback(null), 800); // Clear
      }
    }, 10);
  };

  return (
    <div className="page-one-container" onClick={handleClick}>
      <div className="rock-center">
        <div className="rock-icon" key={rockId}>
          {feedback && (
            <div className="rock-feedback">{feedback}</div>
          )}
          🪨
        </div>
        <div className="rock-text">Pick a Rock</div>
      </div>
    </div>
  );
}
