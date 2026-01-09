import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiX, FiInfo, FiCommand, FiZap } from 'react-icons/fi';
import { GAME_COLORS, GAME_INFO } from '../utils/constants';
import { useWindowSize } from '../hooks/useWindowSize';

/**
 * How to Play Modal
 * Shows game instructions, controls, and tips
 */
const HowToPlayModal = ({ gameId, onClose }) => {
  const colors = GAME_COLORS[gameId];
  const gameInfo = GAME_INFO[gameId];
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const { isMobile } = useWindowSize();

  useEffect(() => {
    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    // Trap focus inside modal
    const handleTab = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="glass-panel-dark p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiInfo className={`w-6 h-6 ${colors.text}`} />
            <h2 id="modal-title" className={`text-2xl md:text-3xl font-bold ${colors.text}`}>
              How to Play
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Game Name */}
        <h3 className="text-xl font-bold text-white mb-4">{gameInfo.name}</h3>

        {/* Description */}
        <p className="text-gray-300 mb-6">{gameInfo.description}</p>

        {/* Controls Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FiCommand className={`w-5 h-5 ${colors.text}`} />
            <h4 className="text-lg font-semibold text-white">Controls</h4>
          </div>

          {/* Desktop Controls */}
          {!isMobile && gameInfo.controls.desktop && (
            <div className="glass-panel p-4 mb-3">
              <p className="text-sm text-gray-400 mb-2 font-semibold">Desktop</p>
              <table className="w-full">
                <tbody>
                  {gameInfo.controls.desktop.map((control, index) => (
                    <tr key={index} className="border-b border-white/5 last:border-0">
                      <td className="py-2 pr-4">
                        <kbd className="px-3 py-1 bg-white/10 rounded text-sm text-white">
                          {control.key}
                        </kbd>
                      </td>
                      <td className="py-2 text-gray-300">{control.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Controls */}
          {gameInfo.controls.mobile && (
            <div className="glass-panel p-4">
              <p className="text-sm text-gray-400 mb-2 font-semibold">
                {isMobile ? 'Touch Controls' : 'Mobile'}
              </p>
              <table className="w-full">
                <tbody>
                  {gameInfo.controls.mobile.map((control, index) => (
                    <tr key={index} className="border-b border-white/5 last:border-0">
                      <td className="py-2 pr-4">
                        <kbd className="px-3 py-1 bg-white/10 rounded text-sm text-white">
                          {control.key}
                        </kbd>
                      </td>
                      <td className="py-2 text-gray-300">{control.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {gameInfo.tips && gameInfo.tips.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiZap className={`w-5 h-5 ${colors.text}`} />
              <h4 className="text-lg font-semibold text-white">Tips</h4>
            </div>
            <ul className="space-y-2">
              {gameInfo.tips.map((tip, index) => (
                <li key={index} className="flex gap-2 text-gray-300">
                  <span className={colors.text}>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-8 flex justify-center">
          <button onClick={onClose} className={`${colors.btn} text-white px-8 py-3 text-lg`}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

HowToPlayModal.propTypes = {
  gameId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HowToPlayModal;
