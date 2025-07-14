import './App.css';
import { HungerBar } from './components/HungerBar';
import { InventoryDisplay } from './components/InventoryDisplay';
import { ActionPanel } from './components/ActionPanel';
import { EatingPanel } from './components/EatingPanel';
import { TechnologyPanel } from './components/TechnologyPanel';

function App() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🌾 Rise of Bread</h1>
      <p>You are a lone forager in the wild.</p>

      <HungerBar />
      <InventoryDisplay />
      <ActionPanel />
      <EatingPanel />
      <TechnologyPanel />

      {/* More game UI to come here */}

    </main>
  );
}

export default App;
