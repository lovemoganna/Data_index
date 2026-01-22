/**
 * React 19 性能优化工具
 * 利用新的性能特性和优化策略
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import logger from './logger';

// 性能监控接口
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  interactionTime: number;
}

// 组件性能追踪 Hook
export function usePerformanceTracker(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;

    if (renderTime > 16.67) { // 超过一帧的时间 (60fps)
      logger.warn(`Component ${componentName} slow render`, {
        renderTime,
        renderCount: renderCount.current
      });
    }

    lastRenderTime.current = currentTime;
  });

  return {
    renderCount: renderCount.current,
    averageRenderTime: renderCount.current > 0 ?
      (performance.now() - lastRenderTime.current) / renderCount.current : 0
  };
}

// 虚拟化列表优化 Hook
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      item,
      index: visibleRange.start + index,
      style: {
        position: 'absolute' as const,
        top: (visibleRange.start + index) * itemHeight - offsetY,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, visibleRange, itemHeight, offsetY]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: handleScroll,
    scrollTop
  };
}

// 防抖优化 Hook（使用 React 19 的 useDeferredValue）
export function useOptimizedDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 内存使用优化 Hook
export function useMemoryOptimization() {
  const memoryRef = useRef<PerformanceMemory | null>(null);

  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      memoryRef.current = (performance as any).memory;
      return {
        used: memoryRef.current.usedJSHeapSize,
        total: memoryRef.current.totalJSHeapSize,
        limit: memoryRef.current.jsHeapSizeLimit,
        usagePercent: (memoryRef.current.usedJSHeapSize / memoryRef.current.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }, []);

  const checkMemoryPressure = useCallback(() => {
    const memory = getMemoryUsage();
    if (!memory) return 'unknown';

    if (memory.usagePercent > 90) return 'critical';
    if (memory.usagePercent > 75) return 'high';
    if (memory.usagePercent > 50) return 'moderate';
    return 'low';
  }, [getMemoryUsage]);

  const forceGC = useCallback(() => {
    if ('gc' in window) {
      (window as any).gc();
      logger.info('Manual garbage collection triggered');
    }
  }, []);

  return {
    getMemoryUsage,
    checkMemoryPressure,
    forceGC
  };
}

// 资源预加载优化
export function useResourcePreloader() {
  const preloadCache = useRef(new Map<string, Promise<any>>());

  const preloadResource = useCallback(async <T>(
    key: string,
    loader: () => Promise<T>
  ): Promise<T> => {
    if (preloadCache.current.has(key)) {
      return preloadCache.current.get(key)!;
    }

    const promise = loader().catch(error => {
      preloadCache.current.delete(key);
      throw error;
    });

    preloadCache.current.set(key, promise);
    return promise;
  }, []);

  const clearPreloadCache = useCallback(() => {
    preloadCache.current.clear();
  }, []);

  return {
    preloadResource,
    clearPreloadCache
  };
}

// 组件懒加载优化
export function useLazyComponent(Component: React.ComponentType<any>, fallback?: React.ReactNode) {
  return useMemo(() => {
    const LazyComponent = React.lazy(() =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ default: Component });
        }, 100); // 模拟网络延迟
      })
    );

    return (props: any) => (
      <React.Suspense fallback={fallback || <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  }, [Component, fallback]);
}

// 渲染性能监控
export function useRenderPerformance(componentName: string) {
  const renderTimes = useRef<number[]>([]);
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    renderTimes.current.push(renderTime);

    // 保持最近10次渲染的时间
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }

    // 如果平均渲染时间超过16ms，记录警告
    const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    if (avgRenderTime > 16) {
      logger.warn(`Component ${componentName} has slow average render time`, {
        averageRenderTime: avgRenderTime,
        recentRenders: renderTimes.current.length
      });
    }
  });

  return {
    averageRenderTime: renderTimes.current.length > 0 ?
      renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length : 0,
    renderCount: renderTimes.current.length
  };
}

// 事件处理优化（使用 useEventCallback 模式）
export function useEventCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// 状态更新批处理优化
export function useBatchedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const batchedUpdates = useRef<Partial<T>[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((update: Partial<T>) => {
    batchedUpdates.current.push(update);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(currentState => {
        let newState = { ...currentState };
        batchedUpdates.current.forEach(update => {
          newState = { ...newState, ...update };
        });
        batchedUpdates.current = [];
        return newState;
      });
    }, 0);
  }, []);

  const immediateUpdate = useCallback((update: Partial<T>) => {
    setState(currentState => ({ ...currentState, ...update }));
  }, []);

  return [state, batchUpdate, immediateUpdate] as const;
}

// 依赖优化 Hook
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  compare?: (prev: T, next: T) => boolean
): T {
  const prevDeps = useRef<React.DependencyList>();
  const prevResult = useRef<T>();

  return useMemo(() => {
    // 检查依赖是否真的改变了
    const depsChanged = !prevDeps.current ||
      deps.length !== prevDeps.current.length ||
      deps.some((dep, index) => !Object.is(dep, prevDeps.current![index]));

    if (!depsChanged && prevResult.current !== undefined) {
      return prevResult.current;
    }

    const result = factory();
    prevDeps.current = deps;
    prevResult.current = result;

    // 如果提供了比较函数，使用它来决定是否更新
    if (compare && prevResult.current !== undefined && compare(prevResult.current, result)) {
      return prevResult.current;
    }

    return result;
  }, deps);
}

// 错误边界性能监控
export function useErrorBoundaryPerformance() {
  const errorCount = useRef(0);
  const lastErrorTime = useRef<number>(0);

  const reportError = useCallback((error: Error, errorInfo?: any) => {
    errorCount.current += 1;
    lastErrorTime.current = Date.now();

    logger.error('Error boundary caught error', error, {
      errorCount: errorCount.current,
      errorInfo,
      timeSinceLastError: Date.now() - lastErrorTime.current
    });
  }, []);

  return {
    reportError,
    errorStats: {
      count: errorCount.current,
      lastErrorTime: lastErrorTime.current
    }
  };
}
