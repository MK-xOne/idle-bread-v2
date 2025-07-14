import { useGame } from '../context/GameProvider';
import { techTree } from '../data/tech';

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
    <section style={{ marginTop: '2rem' }}>
      <h3>🧠 Technologies</h3>

    {Object.values(techTree).map((tech) => {
      const isUnlocked = unlockedTechs.has(tech.id);
      if (isUnlocked) return null; // ⬅️ hide unlocked techs

      return (
        <button
          key={tech.id}
          onClick={() => handleUnlock(tech.id)}
          disabled={!canAfford(tech.cost) || hunger <= 0}
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          {tech.icon} {tech.name}{' '}
          ({Object.entries(tech.cost)
            .map(([k, v]) => `${v} ${k}`)
            .join(' + ')})
        </button>
      );
    })}

    </section>
  );
};
