import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockInitialGames } from "../constants/apiMocks";
import { Game, GameService } from "./gameServices";

describe("GameService", () => {
  let service: GameService;

  beforeEach(() => {
    // Reset the singleton instance before each test
    vi.restoreAllMocks();
    // @ts-ignore - accessing private property for testing
    GameService.instance = undefined;
    service = GameService.getInstance();
  });

  describe("Game Class", () => {
    it("should create a new game with initial scores of 0", () => {
      const game = new Game("Team1", "Team2");
      expect(game.homeTeam).toBe("Team1");
      expect(game.awayTeam).toBe("Team2");
      expect(game.homeScore).toBe(0);
      expect(game.awayScore).toBe(0);
      expect(game.startTime).toBeInstanceOf(Date);
    });

    it("should calculate total score correctly", () => {
      const game = new Game("Team1", "Team2", 3, 2);
      expect(game.getTotalScore()).toBe(5);
    });

    it("should format toString correctly", () => {
      const game = new Game("Team1", "Team2", 3, 2);
      expect(game.toString()).toBe("Team1 3 - Team2 2");
    });
  });

  describe("GameService Initialization", () => {
    it("should be a singleton", () => {
      const instance1 = GameService.getInstance();
      const instance2 = GameService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should initialize with mock data", async () => {
      await service.waitForInitialization();
      const games = await service.getGames();
      expect(games.length).toBe(mockInitialGames.length);
    });

    it("should fetch game data", async () => {
      const data = await service.fetchGameData();
      expect(data).toEqual(mockInitialGames);
    });
  });

  describe("Game Management", () => {
    beforeEach(async () => {
      await service.waitForInitialization();
    });

    describe("startGame", () => {
      it("should start a new game", async () => {
        const game = await service.startGame("Portugal", "Greece");
        expect(game.homeTeam).toBe("Portugal");
        expect(game.awayTeam).toBe("Greece");
        expect(game.homeScore).toBe(0);
        expect(game.awayScore).toBe(0);
      });

      it("should throw error when starting game with empty team names", async () => {
        await expect(service.startGame("", "Greece")).rejects.toThrow(
          "Both home team and away team are required"
        );
      });

      it("should throw error when team is already playing", async () => {
        await service.startGame("Portugal", "Greece");
        await expect(service.startGame("Portugal", "Spain")).rejects.toThrow(
          "One or both teams are already playing"
        );
      });
    });

    describe("updateScore", () => {
      it("should update game score", async () => {
        await service.startGame("Portugal", "Greece");
        await service.updateScore("Portugal", "Greece", 2, 1);
        const games = await service.getGames();
        const game = games.find((g) => g.homeTeam === "Portugal");
        expect(game?.homeScore).toBe(2);
        expect(game?.awayScore).toBe(1);
      });

      it("should throw error when updating non-existent game", async () => {
        await expect(
          service.updateScore("Invalid", "Team", 1, 1)
        ).rejects.toThrow("Game not found");
      });

      it("should throw error when updating with negative scores", async () => {
        await service.startGame("Portugal", "Greece");
        await expect(
          service.updateScore("Portugal", "Greece", -1, 0)
        ).rejects.toThrow("Scores cannot be negative");
      });
    });

    describe("finishGame", () => {
      it("should finish a game", async () => {
        await service.startGame("Portugal", "Greece");
        await service.finishGame("Portugal", "Greece");
        const games = await service.getGames();
        expect(games.find((g) => g.homeTeam === "Portugal")).toBeUndefined();
      });

      it("should throw error when finishing non-existent game", async () => {
        await expect(service.finishGame("Invalid", "Team")).rejects.toThrow(
          "Game not found"
        );
      });
    });
  });

  describe("Integration Tests", () => {
    it("should maintain game state through multiple operations", async () => {
      await service.waitForInitialization();

      // Start new game
      await service.startGame("Portugal", "Greece");

      // Update score
      await service.updateScore("Portugal", "Greece", 2, 1);

      // Verify state
      let games = await service.getGames();
      let game = games.find((g) => g.homeTeam === "Portugal");
      expect(game?.homeScore).toBe(2);
      expect(game?.awayScore).toBe(1);

      // Finish game
      await service.finishGame("Portugal", "Greece");

      // Verify game is removed
      games = await service.getGames();
      game = games.find((g) => g.homeTeam === "Portugal");
      expect(game).toBeUndefined();
    });
  });

  describe("getSummaryByTotalScore", () => {
    it("should return games sorted by total score", async () => {
      const service = GameService.getInstance();
      await service.waitForInitialization();
      const summary = await service.getSummaryByTotalScore();

      const expectedOrder = [
        { homeTeam: "Spain", awayTeam: "Brazil", homeScore: 10, awayScore: 2 },
        { homeTeam: "Uruguay", awayTeam: "Italy", homeScore: 6, awayScore: 6 },
        { homeTeam: "Mexico", awayTeam: "Canada", homeScore: 0, awayScore: 5 },
        { homeTeam: "Germany", awayTeam: "France", homeScore: 2, awayScore: 2 },
        {
          homeTeam: "Argentina",
          awayTeam: "Australia",
          homeScore: 3,
          awayScore: 1,
        },
      ];

      expectedOrder.forEach((expected, index) => {
        expect(summary[index].homeTeam).toBe(expected.homeTeam);
        expect(summary[index].awayTeam).toBe(expected.awayTeam);
        expect(summary[index].homeScore).toBe(expected.homeScore);
        expect(summary[index].awayScore).toBe(expected.awayScore);
        expect(summary[index].getTotalScore()).toBe(
          expected.homeScore + expected.awayScore
        );
      });
    });

    it("should return games from the internal games map", async () => {
      const service = GameService.getInstance();
      await service.waitForInitialization();

      // Get games directly from map and through summary
      const directGames = await service.getGames();
      const summaryGames = await service.getSummaryByTotalScore();

      // Should contain the same games (though in different order)
      expect(new Set(directGames)).toEqual(new Set(summaryGames));
    });

    it("should update summary when games are modified", async () => {
      const service = GameService.getInstance();
      await service.waitForInitialization();

      // Get initial summary
      const initialSummary = await service.getSummaryByTotalScore();

      // Add a new game with high score
      await service.startGame("NewTeam1", "NewTeam2");
      await service.updateScore("NewTeam1", "NewTeam2", 10, 10);

      // Get updated summary
      const updatedSummary = await service.getSummaryByTotalScore();

      // New game should be first (highest total score)
      expect(updatedSummary[0].homeTeam).toBe("NewTeam1");
      expect(updatedSummary[0].getTotalScore()).toBe(20);
      expect(updatedSummary.length).toBe(initialSummary.length + 1);
    });

    it("should remove games from summary when finished", async () => {
      const service = GameService.getInstance();
      await service.waitForInitialization();

      const initialSummary = await service.getSummaryByTotalScore();
      await service.finishGame("Mexico", "Canada");
      const updatedSummary = await service.getSummaryByTotalScore();

      expect(updatedSummary.length).toBe(initialSummary.length - 1);
      expect(
        updatedSummary.find(
          (game) => game.homeTeam === "Mexico" || game.awayTeam === "Canada"
        )
      ).toBeUndefined();
    });

    it("should maintain sort order when scores are updated", async () => {
      const service = GameService.getInstance();
      await service.waitForInitialization();

      // Update a game's score to be the highest
      await service.updateScore("Germany", "France", 15, 15);
      const summary = await service.getSummaryByTotalScore();

      // Should now be first in the list
      expect(summary[0].homeTeam).toBe("Germany");
      expect(summary[0].awayTeam).toBe("France");
      expect(summary[0].getTotalScore()).toBe(30);
    });

    it("should handle games with equal scores", async () => {
      const service = GameService.getInstance();
      await service.waitForInitialization();

      // Add two games with equal scores
      await service.startGame("Team1", "Team2");
      await service.updateScore("Team1", "Team2", 3, 3);

      await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure different timestamps

      await service.startGame("Team3", "Team4");
      await service.updateScore("Team3", "Team4", 3, 3);

      const summary = await service.getSummaryByTotalScore();
      const equalScoreGames = summary.filter(
        (game) => game.getTotalScore() === 6
      );

      // Team3 vs Team4 should come before Team1 vs Team2 (added later)
      expect(equalScoreGames[0].homeTeam).toBe("Team3");
      expect(equalScoreGames[1].homeTeam).toBe("Team1");
    });
  });
});
