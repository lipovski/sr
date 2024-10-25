export const EditScore: React.FC<any> = ({
  homeTeam,
  awayTeam,
  newHomeScore,
  newAwayScore,
  onHomeScoreChange,
  onAwayScoreChange,
}) => (
  <div className="flex items-center space-x-3">
    <input
      type="number"
      data-testid={`home-score-input-${homeTeam}`}
      value={newHomeScore}
      onChange={(e) => onHomeScoreChange(e.target.value)}
      className="w-16 px-2 py-1 text-center border rounded"
      min="0"
    />
    <span className="text-gray-400">-</span>
    <input
      type="number"
      data-testid={`away-score-input-${awayTeam}`}
      value={newAwayScore}
      onChange={(e) => onAwayScoreChange(e.target.value)}
      className="w-16 px-2 py-1 text-center border rounded"
      min="0"
    />
  </div>
);
