import './App.css';
import { HungerBar } from './components/HungerBar';
import { InventoryDisplay } from './components/InventoryDisplay';
import { ActionPanel } from './components/ActionPanel';
import { EatingPanel } from './components/EatingPanel';
import { TechnologyPanel } from './components/TechnologyPanel';
import { StatusPanel } from './components/StatusPanel';

function App() {
  return (

      <div className="grid-layout">
        <div className="panel panel-top-left">
        <div className="panel"><StatusPanel /></div> 
      </div>
         
        <div className="panel"><ActionPanel /></div>
        <div className="panel"><HungerBar /></div>
        <div className="panel"><InventoryDisplay /></div>
        <div className="panel"><TechnologyPanel /></div>
        <div className="panel"><EatingPanel /></div>
        
      </div>
    

  );
}

export default App;
