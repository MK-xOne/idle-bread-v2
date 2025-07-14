import { useGame } from '../context/GameProvider';

export const InventoryDisplay = () => {
  const { resources } = useGame();

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h3>📦 Inventory</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Object.entries(resources).map(([key, value]) =>
          value > 0 ? (
            <li key={key}>
              {key}: {value}
            </li>
          ) : null
        )}
      </ul>
    </section>
  );
};
