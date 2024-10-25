interface ScoreboardHeaderProps {
  isSorted: boolean;
  onToggleSort: () => void;
}

export const ScoreboardHeader: React.FC<ScoreboardHeaderProps> = ({
  isSorted,
  onToggleSort,
}) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
    <div className="flex justify-between items-center">
      <h1
        data-testid="scoreboard-title"
        className="text-2xl font-bold text-white"
      >
        Football Score Board
      </h1>
      <button
        data-testid="sort-button"
        onClick={onToggleSort}
        className="px-4 py-2 text-sm font-medium text-white border border-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isSorted ? "Show Original" : "Sort by Total Score"}
      </button>
    </div>
  </div>
);
