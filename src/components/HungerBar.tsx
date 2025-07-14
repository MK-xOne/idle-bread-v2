import React from 'react';
import { useGame } from '../context/GameProvider';

export function HungerBar() {
  const { hunger } = useGame();

  return (
    <div style={{ marginTop: '1rem' }}>
      <label>🍽 Hunger:</label>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
          <div style={{ height: '20px', width: '200px', background: '#ccc', border: '1px solid #999' }}>
            <div
              style={{
                height: '100%',
                width: `${hunger}%`,
                background: hunger > 25 ? '#8bc34a' : '#e53935',
                transition: 'width 0.3s'
              }}
            />
          </div>
        </div>

        <div style={{
          height: '100%',
          width: `${hunger}%`,
          background: hunger > 25 ? '#8bc34a' : '#e53935',
          transition: 'width 0.3s'
        }} />
      </div>
  );
}
