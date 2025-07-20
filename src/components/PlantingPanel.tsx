import React, { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { actionLabels } from "../data/actionData";


type SlotState = {
  planted: boolean;
  plantedAt: number | null;
  readyToHarvest: boolean;
};

export default function PlantingPanel() {
  const {
    getTick,
    resources,
    performNamedAction,
  } = useGame();

  const [slots, setSlots] = useState<SlotState[]>(
    Array.from({ length: 18 }, () => ({
      planted: false,
      plantedAt: null,
      readyToHarvest: false,
    }))
  );

  // Track plant growth based on ticks
  useEffect(() => {
    const currentTick = getTick();
    setSlots((prev) =>
      prev.map((slot) => {
        if (
          slot.planted &&
          !slot.readyToHarvest &&
          slot.plantedAt !== null &&
          currentTick - slot.plantedAt >= 20
        ) {
          return { ...slot, readyToHarvest: true };
        }
        return slot;
      })
    );
  }, [getTick()]);

  // Handle plant or harvest per slot
  const handleClick = (index: number) => {
    const slot = slots[index];
    if (!slot.planted && resources.seeds >= 5) {
      const result = performNamedAction("primitiveWheat", "plant");
      if (result?.succeeded) {
        setSlots((prev) => {
          const newSlots = [...prev];
          newSlots[index] = {
            planted: true,
            plantedAt: getTick(),
            readyToHarvest: false,
          };
          return newSlots;
        });
      }
    } else if (slot.readyToHarvest) {
      const result = performNamedAction("primitiveWheat", "harvest");
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
    <div className="w-full max-w-md mx-auto mt-4">
      <div className="grid grid-cols-6 gap-3">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded 
              ${slot.readyToHarvest ? "bg-yellow-300" :
                slot.planted ? "bg-green-400" :
                "bg-gray-300"}
              cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => handleClick(index)}
          >
            {slot.readyToHarvest ? actionLabels["harvest"].icon : slot.planted   ? actionLabels["plant"].icon : "⬜"}
          </div>
        ))}
      </div>
    </div>
  );
}
