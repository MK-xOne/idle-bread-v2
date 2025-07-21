import React, { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { actionLabels } from "../data/actionData";
import { actionData } from "../data/actionData";
import { mechanics } from "../data/actionData";

export default function PlantingPanel() {
  const state = useGame();
  const { farmSlots, getTick, performNamedAction } = state;

  // Handle plant or harvest per slot
  const handleClick = (index: number) => {
    const slot = farmSlots[index];

    if (slot.state === "empty") {
      const result = performNamedAction("primitiveWheat", "plant");
      if (result?.succeeded) {
        state.perform((s) => {
          s.farmSlots[index].state = "planted";
          s.farmSlots[index].plantedTick = s.getTick();
        });
      }
    } else if (slot.state === "planted" && getTick() - (slot.plantedTick ?? 0) >= 5) {
      const result = performNamedAction("primitiveWheat", "grow");
      if (result?.succeeded) {
        state.perform((s) => {
          s.farmSlots[index].state = "growing";
        });
      }
    } else if (slot.state === "growing") {
      const result = performNamedAction("primitiveWheat", "harvest");
      if (result?.succeeded) {
        state.perform((s) => {
          s.farmSlots[index].state = "empty";
          s.farmSlots[index].plantedTick = null;
        });
      }
    }
  };

  return (
    <div className="panel w-full flex justify-center">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 40px)', // 6 columns, each 40px wide
          gridTemplateRows: 'repeat(3, 40px)',   // 3 rows, each 40px tall
          gap: '8px',
        }}
      >
        {farmSlots.map((slot: typeof farmSlots[number], index: number) => (
          <div
            key={index}
            className={`w-10 h-10 flex items-center justify-center text-sm rounded cursor-pointer
              ${slot.state === "growing" ? "bg-yellow-300" :
                slot.state === "planted" ? "bg-green-400" :
                "bg-stone-500"}
              hover:scale-105 transition-transform`}
            onClick={() => handleClick(index)}
          >
          {slot.state === "growing"
            ? actionLabels["harvest"].icon
            : slot.state === "planted"
              ? actionLabels["plant"].icon
              : "🟫"}
          </div>
        ))}
      </div>
    </div>
  );
}
