import { useState, useEffect, useCallback } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  breakpoint: Breakpoint;
  orientation: 'portrait' | 'landscape';
  greaterThan: (breakpoint: Breakpoint) => boolean;
  lessThan: (breakpoint: Breakpoint) => boolean;
  between: (min: Breakpoint, max: Breakpoint) => boolean;
}

export function useResponsive(): ResponsiveState {
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

    // 使用防抖优化性能
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = windowSize.width < BREAKPOINTS.md;
  const isTablet = windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg;
  const isDesktop = windowSize.width >= BREAKPOINTS.lg && windowSize.width < BREAKPOINTS.xl;
  const isLargeDesktop = windowSize.width >= BREAKPOINTS.xl;

  const orientation = windowSize.height > windowSize.width ? 'portrait' : 'landscape';

  const greaterThan = useCallback((breakpoint: Breakpoint) =>
    windowSize.width >= BREAKPOINTS[breakpoint], [windowSize.width]);

  const lessThan = useCallback((breakpoint: Breakpoint) =>
    windowSize.width < BREAKPOINTS[breakpoint], [windowSize.width]);

  const between = useCallback((min: Breakpoint, max: Breakpoint) =>
    windowSize.width >= BREAKPOINTS[min] && windowSize.width < BREAKPOINTS[max], [windowSize.width]);

  const breakpoint = Object.entries(BREAKPOINTS)
    .reverse()
    .find(([_, size]) => windowSize.width >= size)?.[0] as Breakpoint || 'xs';

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint,
    orientation,
    greaterThan,
    lessThan,
    between
  };
}

// 自定义 Hook：监听特定断点
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const { width } = useResponsive();
  return width >= BREAKPOINTS[breakpoint];
}

// 自定义 Hook：监听设备方向
export function useOrientation(): 'portrait' | 'landscape' {
  const { orientation } = useResponsive();
  return orientation;
}

// 自定义 Hook：根据屏幕大小返回不同的值
export function useResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>> & { default: T }
): T {
  const { breakpoint } = useResponsive();
  return values[breakpoint] || values.default;
}

// 自定义 Hook：容器查询 (Container Queries)
export function useContainerQuery(
  containerRef: React.RefObject<HTMLElement>,
  breakpoints: Record<string, number>
): Record<string, boolean> {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const queries: Record<string, boolean> = {};
  Object.entries(breakpoints).forEach(([name, minWidth]) => {
    queries[name] = containerSize.width >= minWidth;
  });

  return queries;
}

// 工具函数：根据设备类型返回合适的列数
export function getGridColumns(isMobile: boolean, isTablet: boolean, isDesktop: boolean): number {
  if (isMobile) return 1;
  if (isTablet) return 2;
  if (isDesktop) return 3;
  return 4; // Large desktop
}

// 工具函数：根据设备类型返回合适的间距
export function getSpacing(isMobile: boolean, isTablet: boolean): string {
  if (isMobile) return 'gap-4';
  if (isTablet) return 'gap-6';
  return 'gap-8';
}

// 工具函数：根据设备类型返回合适的字体大小
export function getTextSize(isMobile: boolean): 'text-sm' | 'text-base' | 'text-lg' {
  return isMobile ? 'text-sm' : 'text-base';
}

// 工具函数：根据设备类型返回合适的内边距
export function getPadding(isMobile: boolean): string {
  return isMobile ? 'p-4' : 'p-6';
}
