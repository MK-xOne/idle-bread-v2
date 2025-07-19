// src/components/ui/ActionButton.tsx
import { useGame } from "../../context/GameContext";
import { useState } from "react";

interface ActionButtonProps {
  actionId: string; // Example: "harvest_rocks"
  label?: string;
}

export const ActionButton = ({ actionId, label }: ActionButtonProps) => {
  const { performNamedAction } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const [actionType, resourceId] = actionId.split("_") as [string, string];

  const handleClick = () => {
    const result = performNamedAction(resourceId, actionType);

    if (!result.performed) {
      setFeedback("❌ Action failed");
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
