import { useGame } from '../context/GameProvider';
import { techTree, isTechDiscoverable } from '../data/tech';

export const TechnologyPanel = () => {
  const {
    unlockedTechs,
    unlockTech,
    resources,
    setResources,
    hunger,
    performAction,
  } = useGame();

  const canAfford = (cost: Partial<Record<string, number>>) => {
    return Object.entries(cost).every(
      ([key, amount]) => (resources as any)[key] >= amount
    );
  };

  const handleUnlock = (techId: keyof typeof techTree) => {
    const tech = techTree[techId];
    if (!canAfford(tech.cost)) return;

    setResources(prev => {
      const updated = { ...prev };
      for (const [res, amt] of Object.entries(tech.cost)) {
        updated[res as keyof typeof updated] -= amt!;
      }
      return updated;
    });

    unlockTech(techId);
  };


  return (
      <div className="panel">
      <h3>🧠 Technologies</h3>

      {Object.values(techTree).map((tech) => {
        const isUnlocked = unlockedTechs.has(tech.id);
        const isDiscoverable = isTechDiscoverable(tech, unlockedTechs);

        if (isUnlocked || !isDiscoverable) return null;

        return (
          <div key={tech.id} style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => handleUnlock(tech.id)}
              disabled={!canAfford(tech.cost) || hunger <= 0}
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                textAlign: 'center',
                width: '100%',
              }}
            >
              <div>
                {tech.icon} {tech.name}{' '}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontStyle: 'italic',
                  color: '#888',
                }}
              >
                ({Object.entries(tech.cost)
                  .map(([k, v]) => `${v} ${k}`)
                  .join(' + ')})
              </span>
            </button>
          </div>
        );
      })}


    </div>
  );
};
