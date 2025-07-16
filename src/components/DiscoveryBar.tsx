import React, { useContext } from 'react';
import { techTree } from '../data/tech';
import { GameContext } from '../context/GameContext';


const DiscoveryBar = () => {
  const { unlockedTechs } = useContext(GameContext);
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
