// src/components/PageOne.tsx
import "../App.css";
import "../utils/animations.css";
import { useGame } from "../context/GameContext";
import { useEffect, useRef, useState } from "react";
import { ActionButton } from './ui/ActionButton'; // Reuse existing button system

export default function PageOne({ rocks }: { rocks: number }) {
  const { performNamedAction } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);
  const rocksRef = useRef(rocks);

  useEffect(() => {
    rocksRef.current = rocks;
  }, [rocks]);

  return (
    <div className="page-one">
      <h1>Gathering Rocks</h1>

      {/* Replace custom rock icon click with action button */}
      <ActionButton actionId="harvest_rocks" />

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}
