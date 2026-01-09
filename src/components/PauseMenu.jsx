import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiPlay, FiRefreshCw, FiHome, FiZap } from 'react-icons/fi';
import { GAME_COLORS } from '../utils/constants';

/**
 * Pause Menu Overlay
 * Shown when the game is paused
 */
const PauseMenu = ({
  gameId,
  gameName,
  onResume,
  onRestart,
  onMainMenu,
  speed = null,
  onSpeedChange = null,
  speedOptions = [0.5, 1, 1.5, 2],
}) => {
  const colors = GAME_COLORS[gameId];
  const resumeButtonRef = useRef(null);

  useEffect(() => {
    // Focus the resume button when menu opens
    resumeButtonRef.current?.focus();

    const handleKeyPress = (e) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P' || e.key === ' ') {
        e.preventDefault();
        onResume();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onResume, onRestart]);

  return (
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-labelledby="pause-menu-title"
      aria-modal="true"
    >
      <div className="glass-panel-dark p-8 md:p-12 max-w-md w-full mx-4 text-center">
        <h2
          id="pause-menu-title"
          className={`text-3xl md:text-4xl font-bold mb-2 ${colors.text}`}
        >
          Paused
        </h2>

        <p className="text-gray-400 mb-8">{gameName}</p>

        <div className="space-y-3">
          <button
            ref={resumeButtonRef}
            onClick={onResume}
            className={`w-full ${colors.btn} text-white flex items-center justify-center gap-3`}
            aria-label="Resume game"
          >
            <FiPlay className="w-5 h-5" />
            <span>Resume</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full btn-glass text-white flex items-center justify-center gap-3"
            aria-label="Restart game"
          >
            <FiRefreshCw className="w-5 h-5" />
            <span>Restart</span>
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

        {/* Optional speed control */}
        {speed !== null && onSpeedChange && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FiZap className={`w-5 h-5 ${colors.text}`} />
              <label htmlFor="speed-control" className="text-white font-semibold">
                Speed: {speed}x
              </label>
            </div>
            <div className="flex gap-2 justify-center">
              {speedOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onSpeedChange(option)}
                  className={`px-4 py-2 rounded transition-all ${
                    speed === option
                      ? `${colors.btn} ${colors.glow}`
                      : 'glass-panel hover:border-white/30'
                  } text-white`}
                  aria-label={`Set speed to ${option}x`}
                  aria-pressed={speed === option}
                >
                  {option}x
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-gray-500 text-sm mt-6">
          Press <kbd className="px-2 py-1 bg-white/10 rounded">P</kbd> or{' '}
          <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> to resume
        </p>
      </div>
    </div>
  );
};

PauseMenu.propTypes = {
  gameId: PropTypes.string.isRequired,
  gameName: PropTypes.string.isRequired,
  onResume: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired,
  onMainMenu: PropTypes.func.isRequired,
  speed: PropTypes.number,
  onSpeedChange: PropTypes.func,
  speedOptions: PropTypes.arrayOf(PropTypes.number),
};

export default PauseMenu;
