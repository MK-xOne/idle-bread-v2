import React, { useContext } from 'react';
import { techTree } from '../data/tech';
import { GameContext } from '../context/GameContext';

/**
 * DiscoveryBar Component
 * -----------------------
 * Visually displays the list of technologies currently unlocked by the player.
 * Pulls the `unlockedTechs` set from the GameContext and matches each ID
 * against entries in the `techTree` to retrieve metadata like the name and icon.
 * 
 * Each unlocked technology is shown as a small icon with a tooltip,
 * providing a compact visual summary of the player's current progress
 * in the tech system.
 */

const DiscoveryBar = () => {
  const context = useContext(GameContext);
  if (!context) return null;

  const { unlockedTechs } = context;
  return (

    <div className="discovery-bar">
      {Array.from(unlockedTechs).map((techId) => {
        const tech = Object.values(techTree).find(t => t.id === techId);
        if (!tech) return null;
        return (
          <span key={tech.id} title={tech.name} className="tech-icon">
            {tech.icon}
          </span>
        );
      })}
    </div>
  
  );
};

export default DiscoveryBar;
