/**
 * StatusPanel Component
 * ----------------------
 * Displays a thematic title and short narrative blurb representing the current
 * stage or era of the game. This version introduces the "Age of Pain" along
 * with a symbolic icon and role description.
 * 
 * Intended to enhance immersion and communicate the player's narrative context
 * as they progress through different gameplay phases.
 */

export const StatusPanel = () => {
  return (
    <div className="panel">
    <>
      <h1>🍞</h1>
      <h2>Age of Pain</h2>
      <p><em>You are a lone forager in the wild.</em></p>
    </>
    </div>
  );
};
