import React from "react";
import { useScoreboard } from "./useScoreboard";
import {
  ErrorMessage,
  GameList,
  LoadingSpinner,
  ScoreboardHeader,
} from "../index";

const Scoreboard: React.FC = () => {
  const scoreboardState = useScoreboard();
  const { isLoading, error } = scoreboardState;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ScoreboardHeader
          isSorted={scoreboardState.isSorted}
          onToggleSort={scoreboardState.toggleSort}
        />
        <GameList {...scoreboardState} />
      </div>
    </div>
  );
};

export default Scoreboard;
