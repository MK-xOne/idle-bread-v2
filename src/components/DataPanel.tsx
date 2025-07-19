
import { useGame } from "../context/GameProvider";

export default function DataPanel() {
  const { tracker } = useGame();
  const interactions = tracker.tracker;

  return (
    <div>
      <h2>Interaction Stats</h2>
      <ul>
        {Object.entries(interactions).map(([type, stats]) => (
          <li key={type}>
            {type}: {JSON.stringify(stats)}
          </li>
        ))}
      </ul>
    </div>
  );
}
