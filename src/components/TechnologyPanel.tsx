import { useGame } from '../context/GameContext';
import { techTree, isTechDiscoverable } from '../data/tech';
import { unlockTech } from "../context/logic/techHandlers";

/**
 * TechnologyPanel Component
 * --------------------------
 * Displays all available technologies from the `techTree` and allows
 * players to unlock them when they meet the resource requirements.
 * 
 * Integrates with game state to check affordability, deduct resources,
 * and trigger unlock logic via `unlockTech`. Prevents unlocking if
 * requirements aren't met.
 * 
 * This panel is central to progression and unlock mechanics, enabling
 * players to expand capabilities, access new actions, and evolve
 * through different ages or stages of the game.
 */


export const TechnologyPanel = () => {
  const gameState = useGame();
  
  const {
    resources,
    setResources,
    unlockedTechs,
    hunger,
  } = useGame();

  const canAfford = (cost: Partial<Record<string, number>>) => {
    return Object.entries(cost).every(
      ([key, amount]) => amount !== undefined && (resources as any)[key] >= amount
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

    // ✅ Call techHandlers.unlockTech with full state
    unlockTech(techId, gameState);

  };

  return (
    <div className="panel">
      {Object.values(techTree).map((tech) => {
        const isUnlocked = unlockedTechs.has(tech.id);
        const isDiscoverable = isTechDiscoverable(tech, unlockedTechs);
        const fireUnlocked = unlockedTechs.has("discoverFire");

        const shouldShow = isDiscoverable && (canAfford(tech.cost) || fireUnlocked);
        if (isUnlocked || !shouldShow) return null;

        const isClickable = canAfford(tech.cost) && hunger > 0;

        return (
          <div key={tech.id} style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              onClick={() => isClickable && handleUnlock(tech.id)}
              style={{
                transition: 'all 0.2s ease',
                boxShadow: isClickable ? '0 0 8px rgba(231, 211, 28, 0.61)' : 'none',
                opacity: isClickable ? 1 : 0.4,
                marginBottom: '0.75rem',
                textAlign: 'center',
                color: 'white',
                backgroundColor: 'black',
                padding: '0.5rem',
                borderRadius: '6px',
              }}
            >
              <div>
                {tech.icon} {tech.name}
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
            </div>
          </div>
        );
      })}
    </div>
  );
};
