import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiPlay, FiHelpCircle } from 'react-icons/fi';
import { GAME_COLORS } from '../utils/constants';

/**
 * Start Menu Overlay
 * Shown before the game starts
 */
const StartMenu = ({ gameId, gameName, description, onStart, onShowHelp }) => {
  const colors = GAME_COLORS[gameId];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        onShowHelp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onStart, onShowHelp]);

  return (
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-labelledby="start-menu-title"
      aria-modal="true"
    >
      <div className="glass-panel-dark p-8 md:p-12 max-w-md w-full mx-4 text-center">
        <h2
          id="start-menu-title"
          className={`text-4xl md:text-5xl font-bold mb-4 ${colors.text}`}
        >
          {gameName}
        </h2>

        <p className="text-gray-300 mb-8 text-lg">{description}</p>

        <div className="space-y-4">
          <button
            onClick={onStart}
            className={`w-full ${colors.btn} text-white text-xl flex items-center justify-center gap-3`}
            autoFocus
            aria-label={`Start playing ${gameName}`}
          >
            <FiPlay className="w-6 h-6" />
            <span>Start Game</span>
          </button>

          <button
            onClick={onShowHelp}
            className="w-full btn-glass text-white flex items-center justify-center gap-3"
            aria-label="View how to play"
          >
            <FiHelpCircle className="w-5 h-5" />
            <span>How to Play</span>
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Press <kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd> to start or{' '}
          <kbd className="px-2 py-1 bg-white/10 rounded">H</kbd> for help
        </p>
      </div>
    </div>
  );
};

StartMenu.propTypes = {
  gameId: PropTypes.string.isRequired,
  gameName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onStart: PropTypes.func.isRequired,
  onShowHelp: PropTypes.func.isRequired,
};

export default StartMenu;
