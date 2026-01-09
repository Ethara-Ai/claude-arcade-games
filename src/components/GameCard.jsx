import PropTypes from 'prop-types';
import { GAME_COLORS, GAME_INFO } from '../utils/constants';

/**
 * Game Card Component
 * Displays a game option in the selector
 */
const GameCard = ({ gameId, icon: Icon, onSelect, shortcut }) => {
  const colors = GAME_COLORS[gameId];
  const info = GAME_INFO[gameId];

  return (
    <button
      onClick={() => onSelect(gameId)}
      className={`glass-panel p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:${colors.border} hover:${colors.glow} group focus:outline-none focus:ring-2 focus:ring-${colors.primary}`}
      aria-label={`Play ${info.name}`}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${colors.text} bg-opacity-10 flex items-center justify-center group-hover:${colors.glow} transition-all duration-300`}
        >
          <Icon className={`w-10 h-10 md:w-12 md:h-12 ${colors.text}`} />
        </div>
      </div>

      {/* Game Name */}
      <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${colors.text} group-hover:scale-110 transition-transform`}>
        {info.name}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-sm md:text-base mb-4">{info.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {info.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Shortcut */}
      {shortcut && (
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            Press <kbd className="px-2 py-1 bg-white/10 rounded font-mono">{shortcut}</kbd>
          </p>
        </div>
      )}
    </button>
  );
};

GameCard.propTypes = {
  gameId: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  onSelect: PropTypes.func.isRequired,
  shortcut: PropTypes.string,
};

export default GameCard;
