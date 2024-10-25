interface GameScoreProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export const GameScore: React.FC<GameScoreProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
}) => (
  <div className="flex items-center space-x-3">
    <span
      data-testid={`home-score-${homeTeam}`}
      className="text-2xl font-bold text-gray-900"
    >
      {homeScore}
    </span>
    <span className="text-gray-400">-</span>
    <span
      data-testid={`away-score-${awayTeam}`}
      className="text-2xl font-bold text-gray-900"
    >
      {awayScore}
    </span>
  </div>
);
