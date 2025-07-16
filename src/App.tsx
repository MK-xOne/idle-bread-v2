import './App.css';
import { HungerBar } from './components/HungerBar';
import { InventoryDisplay } from './components/InventoryDisplay';
import { ActionPanel } from './components/ActionPanel';
import { EatingPanel } from './components/EatingPanel';
import { TechnologyPanel } from './components/TechnologyPanel';
import { StatusPanel } from './components/StatusPanel';
import DiscoveryBar from './components/DiscoveryBar';
import { DataPanelWrapper } from './components/DataPanel';
import { useState } from 'react';
import DataPanel from './components/DataPanel';


function App() {
  const [showDataPanel, setShowDataPanel] = useState(false);
  return (
    <div className="app-container">
      <div className="discovery-bar-wrapper">
        <DiscoveryBar />
        <button className="data-toggle-btn" onClick={() => setShowDataPanel(prev => !prev)}>
          {showDataPanel ? '✖' : '📊'}
        </button>
      </div>

      {showDataPanel && (
        <div className="data-panel-slide open">
          <DataPanel onClose={() => setShowDataPanel(false)} />
        </div>
      )}

      <div className="main-layout">
        {/* Column 1 */}
        <div className="column">
          <StatusPanel />
          <InventoryDisplay />
        </div>

        {/* Column 2 */}
        <div className="column">
          <ActionPanel />
          <EatingPanel />
        </div>

        {/* Column 3 */}
        <div className="column">
          <HungerBar />
          <TechnologyPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
