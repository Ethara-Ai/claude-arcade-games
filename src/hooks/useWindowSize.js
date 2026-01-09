import { useState, useEffect } from 'react';
import { debounce } from '../utils/helpers';
import { BREAKPOINTS } from '../utils/constants';

/**
 * Custom hook for tracking window size and breakpoints
 * @returns {Object} Window dimensions and breakpoint flags
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [breakpoint, setBreakpoint] = useState({
    isMobile: window.innerWidth < BREAKPOINTS.mobile,
    isTablet:
      window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.desktop,
    isDesktop: window.innerWidth >= BREAKPOINTS.desktop,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });
      setBreakpoint({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
        isDesktop: width >= BREAKPOINTS.desktop,
      });
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...windowSize,
    ...breakpoint,
  };
};

export default useWindowSize;
