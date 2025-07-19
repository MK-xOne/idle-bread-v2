import { useState } from "react";

/**
 * Animations.ts
 * ----------------
 * Provides a reusable hook for triggering time-based animations in React components.
 * 
 * `useAnimation(duration)`:
 * - Returns a boolean `isAnimating` and a `trigger` function
 * - When `trigger` is called, `isAnimating` becomes true for the specified duration
 * - Used to control CSS class toggles or conditional rendering tied to animation timing
 * 
 * This utility decouples animation timing logic from component internals
 * and simplifies integration with interactive UI events.
 */

export function useAnimation(duration: number = 1000) {
  const [isAnimating, setIsAnimating] = useState(false);

  const trigger = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  };

  return [isAnimating, trigger] as const;
}
