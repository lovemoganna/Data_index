import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < breakpoints.md;
  const isTablet = windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;

  const greaterThan = (breakpoint: Breakpoint) => windowSize.width >= breakpoints[breakpoint];
  const lessThan = (breakpoint: Breakpoint) => windowSize.width < breakpoints[breakpoint];
  const between = (min: Breakpoint, max: Breakpoint) =>
    windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max];

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
    greaterThan,
    lessThan,
    between,
    breakpoint: Object.entries(breakpoints)
      .reverse()
      .find(([_, size]) => windowSize.width >= size)?.[0] as Breakpoint
  };
}
