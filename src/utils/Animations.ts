import { useState } from "react";

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
