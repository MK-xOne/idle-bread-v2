// src/App.tsx
import "./App.css";
import { useGame } from "./context/GameContext";
import PageOne from "./components/PageOne";

export default function App() {
  const { resources } = useGame();

  return (
    <div className="App">
      <PageOne rocks={resources.rocks} />
    </div>
  );
}
