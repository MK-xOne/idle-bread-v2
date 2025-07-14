import { useGame } from '../context/GameProvider';

const formatLabel = (id: string) =>
  id
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());

export const InventoryDisplay = () => {
  const { resources } = useGame();

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h3>📦 Inventory</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
        {Object.entries(resources).map(([key, value]) =>
          value > 0 ? (
            <div key={key} style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
              <strong>{formatLabel(key)}</strong>: {value}
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};
