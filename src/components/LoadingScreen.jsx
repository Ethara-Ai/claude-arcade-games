import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GradientText from './GradientText';
import BackgroundOrbs from './BackgroundOrbs';

/**
 * Loading Screen Component
 * Displayed when the app first loads
 */
const LoadingScreen = ({ duration = 3500, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // Complete loading after duration
    const timeout = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-500 ${
        isComplete ? 'opacity-0' : 'opacity-100'
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Loading arcade games"
    >
      <BackgroundOrbs count={3} />

      <div className="relative z-10 text-center px-4">
        {/* Animated Title */}
        <GradientText className="text-5xl md:text-7xl font-black mb-8 animate-float">
          ARCADE GAMES
        </GradientText>

        {/* Spinning Loader */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-accent-pink border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="glass-panel h-3 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-accent-cyan via-accent-pink to-accent-amber transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm">Loading... {progress}%</p>
        </div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  duration: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
};

export default LoadingScreen;
