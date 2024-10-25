import { mockInitialGames } from "../constants/apiMocks";
import { IGame, IGameService, IRawGame } from "../types/game";

export class Game implements IGame {
  public readonly startTime: Date;

  constructor(
    public readonly homeTeam: string,
    public readonly awayTeam: string,
    public homeScore: number = 0,
    public awayScore: number = 0
  ) {
    this.startTime = new Date();
  }

  getTotalScore(): number {
    return this.homeScore + this.awayScore;
  }
}

export class GameService implements IGameService {
  private games: Map<string, IGame>;
  private static instance: GameService;
  private initialized: Promise<void>;

  private constructor() {
    this.games = new Map<string, IGame>();
    this.initialized = this.initializeMockData();
  }

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  fetchGameData(): Promise<IRawGame[]> {
    const random = Math.random() * 2000;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInitialGames);
      }, random);
    });
  }

  private createGameFromRawData(rawGame: IRawGame): Game {
    const game = new Game(rawGame.homeTeam, rawGame.awayTeam);
    game.homeScore = rawGame.homeScore;
    game.awayScore = rawGame.awayScore;
    return game;
  }

  private async initializeMockData(): Promise<void> {
    try {
      const rawGames = await this.fetchGameData();

      rawGames.forEach((rawGame) => {
        const game = this.createGameFromRawData(rawGame);
        this.games.set(game.homeTeam, game);
        this.games.set(game.awayTeam, game);
      });
    } catch (error) {
      console.error("Failed to initialize game data:", error);
      throw error;
    }
  }

  async waitForInitialization(): Promise<void> {
    return this.initialized;
  }

  async getGames(): Promise<IGame[]> {
    await this.waitForInitialization();
    return Array.from(new Set(this.games.values()));
  }

  async getSummaryByTotalScore(): Promise<IGame[]> {
    await this.waitForInitialization();
    const games = Array.from(new Set(this.games.values()));
    const sortedGames = games.sort((a, b) => {
      const scoreDiff = b.homeScore + b.awayScore - (a.homeScore + a.awayScore);
      return scoreDiff === 0
        ? b.startTime.getTime() - a.startTime.getTime()
        : scoreDiff;
    });

    return sortedGames;
  }

  async startGame(homeTeam: string, awayTeam: string): Promise<IGame> {
    await this.waitForInitialization();

    if (!homeTeam || !awayTeam) {
      throw new Error("Both home team and away team are required");
    }
    if (this.games.has(homeTeam) || this.games.has(awayTeam)) {
      throw new Error("One or both teams are already playing");
    }
    const game = new Game(homeTeam, awayTeam);
    this.games.set(homeTeam, game);
    this.games.set(awayTeam, game);
    return game;
  }

  async finishGame(homeTeam: string, awayTeam: string): Promise<void> {
    await this.waitForInitialization();

    if (!this.games.has(homeTeam) || !this.games.has(awayTeam)) {
      throw new Error("Game not found");
    }
    this.games.delete(homeTeam);
    this.games.delete(awayTeam);
  }

  async updateScore(
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number
  ): Promise<void> {
    await this.waitForInitialization();

    if (!this.games.has(homeTeam) || !this.games.has(awayTeam)) {
      throw new Error("Game not found");
    }
    if (homeScore < 0 || awayScore < 0) {
      throw new Error("Scores cannot be negative");
    }
    const game = this.games.get(homeTeam) as Game;
    game.homeScore = homeScore;
    game.awayScore = awayScore;
  }
}
