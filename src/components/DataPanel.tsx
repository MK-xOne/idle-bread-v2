import React, { useState } from 'react';
import { useGame } from '../context/GameProvider';
import type { ResourceID } from '../data/resources';

/**
 * DataPanel Component
 * --------------------
 * Displays real-time gameplay statistics related to resource interactions.
 * Fetches interaction data from the game context and renders a detailed
 * breakdown by resource and action (e.g., harvest, plant, eat).
 * 
 * Includes a close button for user-controlled visibility and is wrapped
 * in a toggleable panel component (`DataPanelWrapper`) to allow it to
 * slide in and out of view.
 * 
 * This component is primarily used for debugging, playtesting, or offering
 * players deeper insight into their gameplay behavior.
 */


const DataPanel = ({ onClose }: { onClose: () => void }) => {
  const { resourceInteractions } = useGame();

  return (
    <div className="data-panel">
      <button className="close-button" onClick={onClose}>✖</button>
      <h2>📊 Game Stats</h2>
      <ul>
        {Object.entries(resourceInteractions).map(([resourceId, stats]) => (
          <li key={resourceId}>
            <strong>{resourceId}:</strong>
            <ul>
              {typeof stats === 'object'
                ? Object.entries(stats).map(([action, count]) => (
                    <li key={action}>{action}: {count}</li>
                  ))
                : <li>{stats}</li>
              }
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const DataPanelWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(prev => !prev);

  return (
    <div className="data-panel-wrapper">
      <button onClick={togglePanel} className="data-toggle-btn">
        {isOpen ? 'Hide Stats' : 'Show Stats'}
      </button>

      <div className={`data-panel-slide ${isOpen ? 'open' : ''}`}>
        {isOpen && <DataPanel onClose={togglePanel} />}
      </div>
    </div>
  );
};

export default DataPanel;
