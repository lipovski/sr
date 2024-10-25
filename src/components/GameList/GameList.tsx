import { IGame } from "../../types/game";
import { GameItem } from "../index";

interface GameListProps {
  games: IGame[];
  editingGame: string | null;
  newHomeScore: string;
  newAwayScore: string;
  startEditing: (game: IGame) => void;
  handleUpdateScore: (homeTeam: string, awayTeam: string) => void;
  cancelEditing: () => void;
  finishGame: (homeTeam: string, awayTeam: string) => void;
  setNewHomeScore: (score: string) => void;
  setNewAwayScore: (score: string) => void;
}

export const GameList: React.FC<GameListProps> = (props) => {
  const { games } = props;

  if (games.length === 0) {
    return (
      <div
        data-testid="no-games-message"
        className="p-8 text-center text-gray-500"
      >
        No live games at the moment
      </div>
    );
  }

  return (
    <div data-testid="games-list" className="p-4 space-y-2">
      {games.map((game) => (
        <GameItem
          key={`${game.homeTeam}-${game.awayTeam}`}
          game={game}
          isEditing={props.editingGame === `${game.homeTeam}-${game.awayTeam}`}
          {...props}
        />
      ))}
    </div>
  );
};
