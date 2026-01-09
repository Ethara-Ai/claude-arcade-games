import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiRefreshCw, FiHome, FiAward, FiStar } from 'react-icons/fi';
import { GAME_COLORS } from '../utils/constants';
import { formatNumber } from '../utils/helpers';

/**
 * Game Over Menu Overlay
 * Shown when the game ends
 */
const GameOverMenu = ({
  gameId,
  gameName,
  score,
  highScore,
  isNewHighScore = false,
  stats = {},
  onPlayAgain,
  onMainMenu,
}) => {
  const colors = GAME_COLORS[gameId];
  const playAgainButtonRef = useRef(null);

  useEffect(() => {
    // Focus the play again button when menu opens
    playAgainButtonRef.current?.focus();

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlayAgain();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayAgain]);

  return (
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-labelledby="game-over-title"
      aria-modal="true"
      aria-live="polite"
    >
      <div className="glass-panel-dark p-8 md:p-12 max-w-lg w-full mx-4 text-center">
        <h2 id="game-over-title" className="text-4xl md:text-5xl font-bold mb-2 text-white">
          Game Over
        </h2>

        <p className="text-gray-400 mb-8">{gameName}</p>

        {/* Score Section */}
        <div className="mb-8 space-y-4">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiStar className={`w-6 h-6 ${colors.text}`} />
              <p className="text-gray-400 text-lg">Final Score</p>
            </div>
            <p className={`text-5xl font-bold ${colors.text}`}>{formatNumber(score)}</p>
          </div>

          <div className="glass-panel p-4">
            <div className="flex items-center justify-center gap-2">
              <FiAward className="w-5 h-5 text-amber-400" />
              <p className="text-gray-400">
                High Score: <span className="text-white font-semibold">{formatNumber(highScore)}</span>
              </p>
            </div>
            {isNewHighScore && (
              <p className="text-accent-pink font-bold mt-2 animate-pulse">🎉 New High Score!</p>
            )}
          </div>
        </div>

        {/* Optional Stats */}
        {Object.keys(stats).length > 0 && (
          <div className="glass-panel p-4 mb-8">
            <h3 className="text-white font-semibold mb-3">Stats</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="text-left">
                  <p className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-white font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            ref={playAgainButtonRef}
            onClick={onPlayAgain}
            className={`w-full ${colors.btn} text-white text-xl flex items-center justify-center gap-3`}
            aria-label="Play again"
          >
            <FiRefreshCw className="w-6 h-6" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onMainMenu}
            className="w-full btn-glass text-white flex items-center justify-center gap-3"
            aria-label="Return to main menu"
          >
            <FiHome className="w-5 h-5" />
            <span>Main Menu</span>
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Press <kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd> to play again
        </p>
      </div>
    </div>
  );
};

GameOverMenu.propTypes = {
  gameId: PropTypes.string.isRequired,
  gameName: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  highScore: PropTypes.number.isRequired,
  isNewHighScore: PropTypes.bool,
  stats: PropTypes.object,
  onPlayAgain: PropTypes.func.isRequired,
  onMainMenu: PropTypes.func.isRequired,
};

export default GameOverMenu;
