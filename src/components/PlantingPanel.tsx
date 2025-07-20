import React, { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { actionLabels } from "../data/actionData";
import { actionData } from "../data/actionData";
import { mechanics } from "../data/actionData";


type SlotState = {
  planted: boolean;
  plantedAt: number | null;
  readyToHarvest: boolean;
};

export default function PlantingPanel() {
const state = useGame();


  const [slots, setSlots] = useState<SlotState[]>(
    Array.from({ length: 18 }, () => ({
      planted: false,
      plantedAt: null,
      readyToHarvest: false,
    }))
  );

  // Track plant growth based on ticks
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTick = state.getTick();
      setSlots((prev) =>
        prev.map((slot) =>
          slot.planted && !slot.readyToHarvest && slot.plantedAt !== null && currentTick - slot.plantedAt >= 20
            ? { ...slot, readyToHarvest: true }
            : slot
        )
      );
    }, 1000); // 1 second poll
    return () => clearInterval(interval);
  }, []);


  // Handle plant or harvest per slot
  const handleClick = (index: number) => {
    const slot = slots[index];
      if (
        !slot.planted &&
        mechanics["plant"]?.(state)
      ) {
      const result = state.performNamedAction("primitiveWheat", "plant");
      if (result?.succeeded) {
        setSlots((prev) => {
          const newSlots = [...prev];
          newSlots[index] = {
            planted: true,
            plantedAt: state.getTick(),
            readyToHarvest: false,
          };
          return newSlots;
        });
      }
    } else if (slot.readyToHarvest) {
      const result = state.performNamedAction("primitiveWheat", "harvest");
      if (result?.succeeded) {
        setSlots((prev) => {
          const newSlots = [...prev];
          newSlots[index] = {
            planted: false,
            plantedAt: null,
            readyToHarvest: false,
          };
          return newSlots;
        });
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="panel bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-rows-3 grid-flow-col gap-2">
          {slots.map((slot, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center text-sm rounded
                ${slot.readyToHarvest ? "bg-yellow-300" :
                  slot.planted ? "bg-green-400" :
                  "bg-gray-300"}
                border border-white cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => handleClick(index)}
            >
              {slot.readyToHarvest
                ? actionLabels["harvest"].icon
                : slot.planted
                  ? actionLabels["plant"].icon
                  : "⬜"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
