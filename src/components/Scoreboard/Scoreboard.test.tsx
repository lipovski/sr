import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Scoreboard from "./Scoreboard";

vi.mock("./useScoreboard", () => ({
  useScoreboard: vi.fn(),
}));

describe("Scoreboard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders single game correctly", () => {
    const mockGame = {
      homeTeam: "Uruguay",
      awayTeam: "Italy",
      homeScore: 6,
      awayScore: 6,
    };

    render(<Scoreboard />);

    expect(
      screen.getByTestId(`game-item-${mockGame.homeTeam}-${mockGame.awayTeam}`)
    ).toBeTruthy();
    expect(
      screen.getByTestId(`home-team-${mockGame.homeTeam}`)
    ).toHaveTextContent("Uruguay");
    expect(
      screen.getByTestId(`away-team-${mockGame.awayTeam}`)
    ).toHaveTextContent("Italy");
    expect(
      screen.getByTestId(`home-score-${mockGame.homeTeam}`)
    ).toHaveTextContent("6");
    expect(
      screen.getByTestId(`away-score-${mockGame.awayTeam}`)
    ).toHaveTextContent("6");
  });

  it("renders multiple games correctly", () => {
    const mockGames = [
      {
        homeTeam: "Uruguay",
        awayTeam: "Italy",
        homeScore: 6,
        awayScore: 6,
      },
      {
        homeTeam: "Spain",
        awayTeam: "Brazil",
        homeScore: 10,
        awayScore: 2,
      },
    ];

    render(<Scoreboard />);

    expect(screen.getByTestId("games-list")).toBeTruthy();

    mockGames.forEach((game) => {
      expect(
        screen.getByTestId(`game-item-${game.homeTeam}-${game.awayTeam}`)
      ).toBeTruthy();
      expect(
        screen.getByTestId(`home-team-${game.homeTeam}`)
      ).toHaveTextContent(game.homeTeam);
      expect(
        screen.getByTestId(`away-team-${game.awayTeam}`)
      ).toHaveTextContent(game.awayTeam);
      expect(
        screen.getByTestId(`home-score-${game.homeTeam}`)
      ).toHaveTextContent(game.homeScore.toString());
      expect(
        screen.getByTestId(`away-score-${game.awayTeam}`)
      ).toHaveTextContent(game.awayScore.toString());
    });
  });
});
