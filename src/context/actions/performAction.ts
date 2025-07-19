// src/context/actions/performAction.ts
// ------------------------------------------------------
// Executes an arbitrary logic function using the full
// game state object. This allows you to encapsulate
// logic into reusable functions like:
//
//   performAction(myEffectFunction, gameState)
//
// Instead of hardcoding logic inside the context.
// ------------------------------------------------------

import type { GameStateHook } from '../gameState';

/**
 * performAction
 * -------------------
 * Generic logic executor. Receives a stateful function
 * and injects the current game state into it.
 */
export const performAction = (
  fn: (state: GameStateHook) => void,
  state: GameStateHook
): void => {
  fn(state);
};
