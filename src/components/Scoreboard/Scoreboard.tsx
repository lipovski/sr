import React from "react";
import { GameList } from "../index";
import { mockInitialGames } from "../../mocks";

const Scoreboard: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <GameList games={mockInitialGames} />
      </div>
    </div>
  );
};

export default Scoreboard;
