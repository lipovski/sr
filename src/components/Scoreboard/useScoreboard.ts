import { useEffect, useState } from "react";
import { GameService } from "../../services/gameServices";
import { IGame } from "../../types/game";

export const useScoreboard = () => {
  const [games, setGames] = useState<IGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSorted, setIsSorted] = useState(false);
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [newHomeScore, setNewHomeScore] = useState<string>("");
  const [newAwayScore, setNewAwayScore] = useState<string>("");

  const loadGames = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const gameService = GameService.getInstance();
      const summaryGames = await gameService.getGames();
      setGames(summaryGames);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred loading games"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
    const intervalId = setInterval(loadGames, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const toggleSort = async () => {
    try {
      setIsLoading(true);
      const gameService = GameService.getInstance();
      const games = isSorted
        ? await gameService.getGames()
        : await gameService.getSummaryByTotalScore();
      setGames(games);
      setIsSorted(!isSorted);
    } finally {
      setIsLoading(false);
    }
  };

  const finishGame = async (homeTeam: string, awayTeam: string) => {
    try {
      setIsLoading(true);
      const gameService = GameService.getInstance();
      await gameService.finishGame(homeTeam, awayTeam);
      await loadGames();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred finishing the game"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (game: IGame) => {
    setEditingGame(`${game.homeTeam}-${game.awayTeam}`);
    setNewHomeScore(game.homeScore.toString());
    setNewAwayScore(game.awayScore.toString());
  };

  const cancelEditing = () => {
    setEditingGame(null);
    setNewHomeScore("");
    setNewAwayScore("");
  };

  const handleUpdateScore = async (homeTeam: string, awayTeam: string) => {
    const homeScore = parseInt(newHomeScore);
    const awayScore = parseInt(newAwayScore);

    if (isNaN(homeScore) || isNaN(awayScore)) {
      setError("Invalid score values");
      return;
    }

    try {
      setIsLoading(true);
      const gameService = GameService.getInstance();
      await gameService.updateScore(homeTeam, awayTeam, homeScore, awayScore);
      await loadGames();
      setEditingGame(null);
      setNewHomeScore("");
      setNewAwayScore("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred updating the score"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    games,
    isLoading,
    error,
    isSorted,
    editingGame,
    newHomeScore,
    newAwayScore,
    toggleSort,
    finishGame,
    startEditing,
    cancelEditing,
    handleUpdateScore,
    setNewHomeScore,
    setNewAwayScore,
  };
};
