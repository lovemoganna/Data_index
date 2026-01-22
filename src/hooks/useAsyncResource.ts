/**
 * React 19 use Hook 兼容的异步资源 Hook
 * 提供更好的异步数据管理
 */

import { use, useCallback, useMemo, useState, useTransition } from 'react';
import logger from '../utils/logger';

export interface AsyncResource<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface AsyncResourceOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  staleTime?: number;
}

/**
 * 异步资源 Hook - 使用 React 19 的 use 模式
 */
export function useAsyncResource<T>(
  resourcePromise: () => Promise<T>,
  options: AsyncResourceOptions = {}
): AsyncResource<T> {
  const {
    initialData = null,
    onSuccess,
    onError,
    enabled = true,
    staleTime = 0
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const isStale = useMemo(() => {
    if (staleTime === 0) return true;
    return Date.now() - lastFetchTime > staleTime;
  }, [lastFetchTime, staleTime]);

  const execute = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await resourcePromise();
      setData(result);
      setLastFetchTime(Date.now());
      onSuccess?.(result);

      logger.debug('Async resource loaded successfully', {
        hasData: !!result,
        timestamp: Date.now()
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);

      logger.error('Async resource loading failed', error);
    } finally {
      setLoading(false);
    }
  }, [resourcePromise, enabled, onSuccess, onError]);

  const refetch = useCallback(() => {
    startTransition(() => {
      execute();
    });
  }, [execute]);

  // 自动执行
  useMemo(() => {
    if (enabled && (data === null || isStale)) {
      execute();
    }
  }, [enabled, data, isStale, execute]);

  return {
    data,
    loading: loading || isPending,
    error,
    refetch
  };
}

/**
 * 资源预加载 Hook
 */
export function useResourcePreloader() {
  const preload = useCallback(<T>(resourcePromise: () => Promise<T>) => {
    // 使用 React 19 的 cache 概念预加载
    const promise = resourcePromise();

    // 预热缓存
    promise.then(result => {
      logger.debug('Resource preloaded', { success: true });
      return result;
    }).catch(error => {
      logger.warn('Resource preload failed', error);
    });

    return promise;
  }, []);

  return { preload };
}

/**
 * 乐观更新 Hook
 */
export function useOptimisticUpdate<T>(
  currentData: T,
  updateFn: (newData: T) => Promise<T>
) {
  const [optimisticData, setOptimisticData] = useState<T>(currentData);
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(async (newData: T) => {
    // 乐观更新
    setOptimisticData(newData);
    setIsUpdating(true);

    try {
      const result = await updateFn(newData);
      setOptimisticData(result);
      return result;
    } catch (error) {
      // 回滚乐观更新
      setOptimisticData(currentData);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [currentData, updateFn]);

  return {
    data: optimisticData,
    isUpdating,
    update
  };
}
