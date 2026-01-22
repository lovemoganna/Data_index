/**
 * 应用监控工具
 * 提供性能监控、用户行为跟踪和健康检查
 */

import logger from './logger';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift

  // 自定义指标
  pageLoadTime: number;
  timeToInteractive: number;
  memoryUsage: number;
  networkRequests: number;
  errorsCount: number;
}

export interface UserBehaviorMetrics {
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  featureUsage: Record<string, number>;
  errorRate: number;
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: boolean;
    api: boolean;
    memory: boolean;
    performance: boolean;
  };
  metrics: PerformanceMetrics;
  timestamp: Date;
}

class MonitoringService {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    timeToInteractive: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errorsCount: 0
  };

  private userMetrics: UserBehaviorMetrics = {
    pageViews: 0,
    sessionDuration: 0,
    bounceRate: 0,
    featureUsage: {},
    errorRate: 0
  };

  private sessionStartTime: number = Date.now();
  private errorCount: number = 0;
  private networkRequests: XMLHttpRequest[] = [];

  constructor() {
    this.initialize();
  }

  /**
   * 初始化监控
   */
  private initialize(): void {
    this.setupPerformanceObserver();
    this.setupErrorTracking();
    this.setupNetworkMonitoring();
    this.setupUserBehaviorTracking();

    logger.info('Monitoring service initialized');
  }

  /**
   * 设置性能观察器
   */
  private setupPerformanceObserver(): void {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          logger.debug('LCP recorded', { lcp: this.metrics.lcp });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        logger.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            logger.debug('FID recorded', { fid: this.metrics.fid });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        logger.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          logger.debug('CLS recorded', { cls: this.metrics.cls });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        logger.warn('CLS observer not supported');
      }
    }

    // 页面加载时间
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.fetchStart;
          this.metrics.timeToInteractive = perfData.domInteractive - perfData.fetchStart;

          logger.info('Page load metrics', {
            performance: {
              pageLoadTime: this.metrics.pageLoadTime,
              timeToInteractive: this.metrics.timeToInteractive
            }
          });
        }
      }, 0);
    });
  }

  /**
   * 设置错误跟踪
   */
  private setupErrorTracking(): void {
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      this.errorCount++;
      this.metrics.errorsCount = this.errorCount;

      logger.error('JavaScript error detected', error, {
        message: message.toString(),
        source,
        lineno,
        colno
      });

      if (originalOnError) {
        originalOnError(message, source, lineno, colno, error);
      }
    };

    // React 错误边界集成
    window.addEventListener('errorboundary', (event: any) => {
      logger.error('React error boundary triggered', event.detail?.error, {
        component: event.detail?.componentName,
        errorInfo: event.detail?.errorInfo
      });
    });
  }

  /**
   * 设置网络监控
   */
  private setupNetworkMonitoring(): void {
    // 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
      const xhr = this;
      monitoringService.networkRequests.push(xhr);

      const originalOnLoad = this.onload;
      const originalOnError = this.onerror;

      this.onload = function() {
        monitoringService.metrics.networkRequests++;
        logger.debug('Network request completed', {
          method,
          url: url.toString(),
          status: xhr.status,
          duration: Date.now() - startTime
        });
        if (originalOnLoad) originalOnLoad.call(this);
      };

      this.onerror = function() {
        logger.warn('Network request failed', {
          method,
          url: url.toString(),
          status: xhr.status
        });
        if (originalOnError) originalOnError.call(this);
      };

      const startTime = Date.now();
      return originalOpen.call(this, method, url, ...args);
    };

    // 拦截 Fetch API
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const startTime = Date.now();
      monitoringService.metrics.networkRequests++;

      try {
        const response = await originalFetch(...args);
        logger.debug('Fetch request completed', {
          url: args[0],
          status: response.status,
          duration: Date.now() - startTime
        });
        return response;
      } catch (error) {
        logger.warn('Fetch request failed', {
          url: args[0],
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime
        });
        throw error;
      }
    };
  }

  /**
   * 设置用户行为跟踪
   */
  private setupUserBehaviorTracking(): void {
    // 页面浏览
    this.userMetrics.pageViews = 1;

    // 会话持续时间
    const updateSessionDuration = () => {
      this.userMetrics.sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    };

    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        updateSessionDuration();
      }
    });

    // 页面离开时更新
    window.addEventListener('beforeunload', updateSessionDuration);

    // 定期更新会话时间
    setInterval(updateSessionDuration, 30000);
  }

  /**
   * 记录功能使用
   */
  trackFeatureUsage(featureName: string): void {
    this.userMetrics.featureUsage[featureName] = (this.userMetrics.featureUsage[featureName] || 0) + 1;

    logger.debug('Feature usage tracked', {
      feature: featureName,
      count: this.userMetrics.featureUsage[featureName]
    });
  }

  /**
   * 记录用户行为
   */
  trackUserAction(action: string, metadata?: Record<string, any>): void {
    logger.info('User action tracked', {
      action,
      metadata,
      timestamp: Date.now()
    });
  }

  /**
   * 获取当前性能指标
   */
  getPerformanceMetrics(): PerformanceMetrics {
    // 更新内存使用情况
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      this.metrics.memoryUsage = memInfo.usedJSHeapSize;
    }

    return { ...this.metrics };
  }

  /**
   * 获取用户行为指标
   */
  getUserBehaviorMetrics(): UserBehaviorMetrics {
    return { ...this.userMetrics };
  }

  /**
   * 执行健康检查
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const checks = {
      database: false,
      api: false,
      memory: false,
      performance: false
    };

    try {
      // 检查 IndexedDB
      if ('indexedDB' in window) {
        checks.database = true;
      }

      // 检查 API 连接（这里可以扩展为实际的 API 健康检查）
      checks.api = navigator.onLine;

      // 检查内存使用
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const memoryUsageRatio = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
        checks.memory = memoryUsageRatio < 0.9; // 内存使用率低于90%
      } else {
        checks.memory = true; // 如果无法检测，默认认为正常
      }

      // 检查性能
      const metrics = this.getPerformanceMetrics();
      checks.performance = !metrics.lcp || metrics.lcp < 2500; // LCP 低于2.5秒

    } catch (error) {
      logger.error('Health check failed', error as Error);
    }

    const healthyChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyChecks === totalChecks) {
      status = 'healthy';
    } else if (healthyChecks >= totalChecks * 0.5) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    const result: HealthCheckResult = {
      status,
      checks,
      metrics: this.getPerformanceMetrics(),
      timestamp: new Date()
    };

    logger.info('Health check completed', {
      status,
      healthyChecks: `${healthyChecks}/${totalChecks}`,
      checks
    });

    return result;
  }

  /**
   * 生成监控报告
   */
  generateReport(): {
    performance: PerformanceMetrics;
    userBehavior: UserBehaviorMetrics;
    health: HealthCheckResult;
    recommendations: string[];
  } {
    const performance = this.getPerformanceMetrics();
    const userBehavior = this.getUserBehaviorMetrics();

    const recommendations: string[] = [];

    // 基于性能指标生成建议
    if (performance.lcp && performance.lcp > 2500) {
      recommendations.push('优化最大内容绘制时间 (LCP)，考虑压缩图片和减少阻塞资源');
    }

    if (performance.fid && performance.fid > 100) {
      recommendations.push('优化首次输入延迟 (FID)，减少 JavaScript 执行时间');
    }

    if (performance.cls && performance.cls > 0.1) {
      recommendations.push('优化累积布局偏移 (CLS)，避免页面元素位置突变');
    }

    if (performance.pageLoadTime > 3000) {
      recommendations.push('优化页面加载时间，考虑代码分割和资源优化');
    }

    if (performance.errorsCount > 0) {
      recommendations.push(`解决 ${performance.errorsCount} 个 JavaScript 错误`);
    }

    // 基于用户行为生成建议
    if (userBehavior.bounceRate > 0.5) {
      recommendations.push('降低跳出率，改善页面内容和用户体验');
    }

    const mostUsedFeatures = Object.entries(userBehavior.featureUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (mostUsedFeatures.length > 0) {
      recommendations.push(`重点优化高频使用的功能: ${mostUsedFeatures.map(([feature]) => feature).join(', ')}`);
    }

    return {
      performance,
      userBehavior,
      health: {
        status: 'unknown' as any,
        checks: {
          database: false,
          api: false,
          memory: false,
          performance: false
        },
        metrics: performance,
        timestamp: new Date()
      },
      recommendations
    };
  }

  /**
   * 重置监控数据
   */
  reset(): void {
    this.metrics = {
      pageLoadTime: 0,
      timeToInteractive: 0,
      memoryUsage: 0,
      networkRequests: 0,
      errorsCount: 0
    };

    this.userMetrics = {
      pageViews: 1,
      sessionDuration: 0,
      bounceRate: 0,
      featureUsage: {},
      errorRate: 0
    };

    this.errorCount = 0;
    this.sessionStartTime = Date.now();

    logger.info('Monitoring data reset');
  }
}

// 创建全局监控实例
const monitoringService = new MonitoringService();

export default monitoringService;
export { MonitoringService };
