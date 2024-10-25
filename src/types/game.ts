export interface IRawGame {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface IGame extends IRawGame {
  startTime: Date;
  getTotalScore(): number;
  toString(): string;
}

export interface IGameService {
  fetchGameData(): Promise<IRawGame[]>;
  startGame(homeTeam: string, awayTeam: string): Promise<IGame>;
  finishGame(homeTeam: string, awayTeam: string): void;
  updateScore(
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number
  ): void;
  getGames(): Promise<IGame[]>;
  getSummaryByTotalScore(): Promise<IGame[]>;
}
