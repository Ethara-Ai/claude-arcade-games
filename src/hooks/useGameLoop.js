import { useEffect, useRef } from 'react';

/**
 * Custom hook for game loop with requestAnimationFrame
 * Provides delta time for frame-independent movement
 * @param {Function} callback - Function called each frame with deltaTime
 * @param {boolean} isRunning - Whether the loop should be running
 * @param {number} targetFPS - Target frames per second (optional, for throttling)
 */
export const useGameLoop = (callback, isRunning, targetFPS = null) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const fpsIntervalRef = useRef(targetFPS ? 1000 / targetFPS : 0);
  const lastFrameTimeRef = useRef(0);

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      // Calculate delta time in seconds
      const deltaTime = (time - previousTimeRef.current) / 1000;

      // FPS throttling if targetFPS is specified
      if (targetFPS) {
        const timeSinceLastFrame = time - lastFrameTimeRef.current;
        if (timeSinceLastFrame >= fpsIntervalRef.current) {
          callback(deltaTime);
          lastFrameTimeRef.current = time - (timeSinceLastFrame % fpsIntervalRef.current);
        }
      } else {
        callback(deltaTime);
      }
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isRunning, callback]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useGameLoop;
