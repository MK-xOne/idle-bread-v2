import { useGame } from '../context/GameProvider';
import { resources as resourceMeta, type ResourceID } from "../data/resources";

const formatLabel = (id: string) =>
  id
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());

export const InventoryDisplay = () => {
  const { resources, discoveredResources, maxResourceBonuses } = useGame();;

  return (
    <div className="panel">
      <h3>📦 Inventory</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
        {(Object.entries(resources) as [ResourceID, number][])
          .filter(([key]) => discoveredResources.has(key))
          .map(([key, value]) => {
            const baseMax = resourceMeta[key]?.maxAmount ?? Infinity;
            const bonus = maxResourceBonuses?.[key] ?? 0;
            const max = baseMax + bonus;
            return (
              <div
                key={key}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "4px",
                }}
              >
                <strong>{formatLabel(key)}</strong>: {value} / {max}
              </div>
            );
          })}
      </div>
    </div>
  );
};
