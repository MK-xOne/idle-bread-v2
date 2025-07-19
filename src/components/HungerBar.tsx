import React from 'react';
import { useGame } from '../context/GameContext';

/**
 * HungerBar Component
 * --------------------
 * Displays the player's current hunger level as a horizontal progress bar.
 * Pulls hunger value from the game context and uses color-coding:
 * green for healthy (>25) and red for low hunger (≤25).
 * 
 * Visually reinforces the importance of food and consumption mechanics
 * in the gameplay loop. Smooth transition effects enhance UI responsiveness.
 */

export function HungerBar() {
  const { hunger } = useGame();

  const barColor = hunger > 25 ? '#8bc34a' : '#e53935';

  return (
    <div className="panel">
    <div style={{ textAlign: 'center' }}>
      <label>🍽 Hunger</label>
      <div
        style={{
          height: '20px',
          width: '200px',
          margin: '4px auto 0',
          background: '#ccc',
          border: '1px solid #999',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${hunger}%`,
            background: barColor,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
    </div>
  );
}
