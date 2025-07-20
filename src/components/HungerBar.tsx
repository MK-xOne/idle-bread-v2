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

  const barColor = hunger > 25 ? '#81c784' : '#ef5350';

   return (
    <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto', position: 'relative' }}>
      <div
        style={{
          height: '28px',
          background: '#e0e0e0',
          borderRadius: '14px',
          boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Colored fill */}
        <div
          style={{
            height: '100%',
            width: `${hunger}%`,
            backgroundColor: barColor,
            transition: 'width 0.3s ease',
          }}
        />

        {/* Static black label overlaid on top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '14px',
            pointerEvents: 'none', // Let clicks pass through
          }}
        >
          Hunger
        </div>
      </div>
    </div>
  );
}
