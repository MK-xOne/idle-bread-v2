import { useGame } from '../context/GameContext';
import { resources as resourceMeta, type ResourceID } from "../data/resources";

/**
 * InventoryDisplay Component
 * ---------------------------
 * Renders a grid-based visual of the player's discovered resources and their quantities.
 * Pulls resource data from the game context and formats it with dynamic max capacity
 * (including any bonuses). Only resources the player has discovered are shown.
 * 
 * Each resource is displayed with its current amount, and optionally its max limit,
 * giving players a real-time understanding of their inventory state.
 * 
 * Aesthetic formatting and dynamic grid layout help adapt the display to
 * different screen sizes and resource counts.
 */

const shouldShowMax = (key: ResourceID) => {
  // Only show max values for resources that the player has “understood”
  return false; // Later you can unlock others dynamically
};

const formatLabel = (id: string) =>
  id
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());

export const InventoryDisplay = () => {
  const { resources, discoveredResources, maxResourceBonuses } = useGame();;

  return (
    <div className="panel">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
       {Array.from(discoveredResources)
        .filter((key): key is ResourceID => key in resources && resources[key] > 0)
        .map((key) => {
          const value = resources[key];
          const baseMax = resourceMeta[key]?.maxAmount ?? Infinity;
          const bonus = maxResourceBonuses?.[key] ?? 0;
          const max = baseMax + bonus;

          return (
            <div
              key={key}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              <strong>{formatLabel(key)}</strong>: {value}
              {shouldShowMax(key) ? ` / ${max}` : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};
