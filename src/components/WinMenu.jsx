import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiPlay, FiHome, FiTrophy } from 'react-icons/fi';
import { GAME_COLORS } from '../utils/constants';
import { formatNumber } from '../utils/helpers';

/**
 * Win Menu Overlay
 * Shown when the player wins the game (e.g., reaches 1024)
 */
const WinMenu = ({
  gameId,
  gameName,
  score,
  highScore,
  isNewHighScore = false,
  onContinue = null,
  onPlayAgain,
  onMainMenu,
}) => {
  const colors = GAME_COLORS[gameId];
  const continueButtonRef = useRef(null);

  useEffect(() => {
    // Focus the continue/play again button when menu opens
    continueButtonRef.current?.focus();

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onContinue) {
          onContinue();
        } else {
          onPlayAgain();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onContinue, onPlayAgain]);

  return (
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-labelledby="win-title"
      aria-modal="true"
      aria-live="polite"
    >
      <div className="glass-panel-dark p-8 md:p-12 max-w-lg w-full mx-4 text-center">
        {/* Trophy Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-bounce">
            <FiTrophy className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 id="win-title" className="text-4xl md:text-5xl font-bold mb-2 text-white">
          🎉 Congratulations! 🎉
        </h2>

        <p className={`text-xl md:text-2xl font-semibold mb-8 ${colors.text}`}>You Won!</p>

        {/* Score Section */}
        <div className="mb-8 space-y-4">
          <div className="glass-panel p-6">
            <p className="text-gray-400 text-lg mb-2">Final Score</p>
            <p className={`text-5xl font-bold ${colors.text}`}>{formatNumber(score)}</p>
          </div>

          <div className="glass-panel p-4">
            <p className="text-gray-400">
              High Score: <span className="text-white font-semibold">{formatNumber(highScore)}</span>
            </p>
            {isNewHighScore && (
              <p className="text-accent-pink font-bold mt-2 animate-pulse">🎉 New High Score!</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {onContinue && (
            <button
              ref={continueButtonRef}
              onClick={onContinue}
              className={`w-full ${colors.btn} text-white text-xl flex items-center justify-center gap-3`}
              aria-label="Continue playing"
            >
              <FiPlay className="w-6 h-6" />
              <span>Keep Playing</span>
            </button>
          )}

          <button
            ref={!onContinue ? continueButtonRef : null}
            onClick={onPlayAgain}
            className={`w-full ${onContinue ? 'btn-glass' : colors.btn} text-white flex items-center justify-center gap-3`}
            aria-label="Play again"
          >
            <FiPlay className="w-5 h-5" />
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
          Press <kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd> to continue
        </p>
      </div>
    </div>
  );
};

WinMenu.propTypes = {
  gameId: PropTypes.string.isRequired,
  gameName: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  highScore: PropTypes.number.isRequired,
  isNewHighScore: PropTypes.bool,
  onContinue: PropTypes.func,
  onPlayAgain: PropTypes.func.isRequired,
  onMainMenu: PropTypes.func.isRequired,
};

export default WinMenu;
