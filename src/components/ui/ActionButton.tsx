// src/components/ui/ActionButton.tsx
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import { resources as resourceMeta } from "../../data/resources";

interface ActionButtonProps {
  actionId: string; // Example: "harvest_rocks"
  label?: string;
}

export const ActionButton = ({ actionId, label }: ActionButtonProps) => {
  const { performNamedAction, resources } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const [actionType, resourceId] = actionId.split("_") as [string, string];

  const handleClick = () => {
    // 1) Preflight capacity check
    const meta = resourceMeta[resourceId];
    const current = resources[resourceId] ?? 0;
    const cap = meta.maxAmount ?? Infinity;

    if (current >= cap) {
      setFeedback("No more space");
      setTimeout(() => setFeedback(null), 1200);
      return;             // ← EARLY RETURN: no hunger loss, no action called
    }

    // 2) Otherwise, proceed as normal
    const result = performNamedAction(resourceId, actionType);
    if (!result.performed) {
      setFeedback("Action failed");
    } else {
      setFeedback(`✅ +${result.amount ?? 0}`);
    }
    setTimeout(() => setFeedback(null), 1200);
  };


  return (
    <div className="action-button">
      <button onClick={handleClick}>
        {label ?? `${actionType} ${resourceId}`}
      </button>
      {feedback && <span className="feedback">{feedback}</span>}
    </div>
  );
};
