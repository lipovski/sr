interface GameButtonsProps {
  homeTeam: string;
  awayTeam: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onFinish: () => void;
}

export const GameButtons: React.FC<GameButtonsProps> = ({
  homeTeam,
  awayTeam,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  onFinish,
}) => (
  <div className="flex space-x-2">
    {isEditing ? (
      <>
        <button
          data-testid={`save-score-${homeTeam}-${awayTeam}`}
          onClick={onSave}
          className="px-3 py-1 text-sm font-medium text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors"
        >
          Save
        </button>
        <button
          data-testid={`cancel-edit-${homeTeam}-${awayTeam}`}
          onClick={onCancel}
          className="px-3 py-1 text-sm font-medium text-gray-600 border border-gray-600 rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <button
          data-testid={`edit-button-${homeTeam}-${awayTeam}`}
          onClick={onStartEdit}
          className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
        >
          Update Score
        </button>
        <button
          data-testid={`finish-button-${homeTeam}-${awayTeam}`}
          onClick={onFinish}
          className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
        >
          Finish Game
        </button>
      </>
    )}
  </div>
);
