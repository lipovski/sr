import { IGame } from "../../types/game";
import { EditScore, GameButtons, GameScore } from "../index";

interface GameItemProps {
  game: IGame;
  isEditing: boolean;
  newHomeScore: string;
  newAwayScore: string;
  startEditing: (game: IGame) => void;
  handleUpdateScore: (homeTeam: string, awayTeam: string) => void;
  cancelEditing: () => void;
  finishGame: (homeTeam: string, awayTeam: string) => void;
  setNewHomeScore: (score: string) => void;
  setNewAwayScore: (score: string) => void;
}

export const GameItem: React.FC<GameItemProps> = ({
  game,
  isEditing,
  newHomeScore,
  newAwayScore,
  finishGame,
  startEditing,
  cancelEditing,
  handleUpdateScore,
  setNewHomeScore,
  setNewAwayScore,
}) => (
  <div
    data-testid={`game-item-${game.homeTeam}-${game.awayTeam}`}
    className="p-4 hover:bg-gray-50 transition-colors rounded-lg"
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4 flex-1 px-4">
        <div className="flex items-center justify-end w-1/3">
          <span
            data-testid={`home-team-${game.homeTeam}`}
            className="font-semibold text-gray-900"
          >
            {game.homeTeam}
          </span>
        </div>
        {isEditing ? (
          <EditScore
            homeTeam={game.homeTeam}
            awayTeam={game.awayTeam}
            newHomeScore={newHomeScore}
            newAwayScore={newAwayScore}
            onHomeScoreChange={setNewHomeScore}
            onAwayScoreChange={setNewAwayScore}
          />
        ) : (
          <GameScore
            homeTeam={game.homeTeam}
            awayTeam={game.awayTeam}
            homeScore={game.homeScore}
            awayScore={game.awayScore}
          />
        )}
        <div className="flex items-center w-1/3">
          <span
            data-testid={`away-team-${game.awayTeam}`}
            className="font-semibold text-gray-900"
          >
            {game.awayTeam}
          </span>
        </div>
      </div>
      <GameButtons
        homeTeam={game.homeTeam}
        awayTeam={game.awayTeam}
        isEditing={isEditing}
        onStartEdit={() => startEditing(game)}
        onSave={() => handleUpdateScore(game.homeTeam, game.awayTeam)}
        onCancel={cancelEditing}
        onFinish={() => finishGame(game.homeTeam, game.awayTeam)}
      />
    </div>
  </div>
);
