/**
 * 结构化日志系统
 * 支持多种日志级别、上下文信息和远程日志收集
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration?: number;
    memoryUsage?: number;
    networkLatency?: number;
  };
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  maxEntries: number;
  enablePerformanceLogging: boolean;
  enableErrorTracking: boolean;
}

class Logger {
  private config: LoggerConfig;
  private entries: LogEntry[] = [];
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: 'info',
      enableConsole: true,
      enableRemote: false,
      maxEntries: 1000,
      enablePerformanceLogging: false,
      enableErrorTracking: true,
      ...config
    };

    this.sessionId = this.generateSessionId();

    // 自动清理旧日志
    this.setupAutoCleanup();

    // 监听未捕获错误
    if (this.config.enableErrorTracking) {
      this.setupErrorTracking();
    }

    // 监听性能指标
    if (this.config.enablePerformanceLogging) {
      this.setupPerformanceTracking();
    }
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 设置自动清理
   */
  private setupAutoCleanup(): void {
    setInterval(() => {
      if (this.entries.length > this.config.maxEntries) {
        this.entries = this.entries.slice(-this.config.maxEntries);
      }
    }, 60000); // 每分钟清理一次
  }

  /**
   * 设置错误跟踪
   */
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.error('Uncaught error', {
        error: {
          name: event.error?.name || 'UnknownError',
          message: event.error?.message || event.message,
          stack: event.error?.stack
        },
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', {
        error: {
          name: 'UnhandledRejection',
          message: event.reason?.toString() || 'Unknown rejection'
        }
      });
    });
  }

  /**
   * 设置性能跟踪
   */
  private setupPerformanceTracking(): void {
    // 页面加载性能
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.info('Page load performance', {
            performance: {
              duration: perfData.loadEventEnd - perfData.fetchStart,
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
              firstPaint: perfData.responseStart - perfData.fetchStart
            }
          });
        }
      }, 0);
    });

    // 定期记录内存使用情况
    setInterval(() => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        this.debug('Memory usage', {
          performance: {
            usedJSHeapSize: memInfo.usedJSHeapSize,
            totalJSHeapSize: memInfo.totalJSHeapSize,
            jsHeapSizeLimit: memInfo.jsHeapSizeLimit
          }
        });
      }
    }, 30000); // 每30秒记录一次
  }

  /**
   * 创建日志条目
   */
  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 添加用户信息（如果有）
    const userId = localStorage.getItem('user_id');
    if (userId) {
      entry.userId = userId;
    }

    return entry;
  }

  /**
   * 检查日志级别是否应该记录
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context);

    // 添加到本地存储
    this.entries.push(entry);

    // 控制台输出
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // 远程日志收集
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.sendToRemote(entry);
    }
  }

  /**
   * 输出到控制台
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}:`;
    const args = [prefix, entry.message];

    if (entry.context) {
      args.push(entry.context);
    }

    switch (entry.level) {
      case 'debug':
        console.debug(...args);
        break;
      case 'info':
        console.info(...args);
        break;
      case 'warn':
        console.warn(...args);
        break;
      case 'error':
      case 'fatal':
        console.error(...args);
        if (entry.error?.stack) {
          console.error(entry.error.stack);
        }
        break;
    }
  }

  /**
   * 发送到远程服务器
   */
  private async sendToRemote(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.warn('Failed to send log to remote server:', error);
    }
  }

  // 公共日志方法
  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const logContext = { ...context };
    if (error) {
      logContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }
    this.log('error', message, logContext);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    const logContext = { ...context };
    if (error) {
      logContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }
    this.log('fatal', message, logContext);
  }

  /**
   * 性能计时开始
   */
  startTimer(label: string): () => void {
    const startTime = performance.now();
    this.debug(`Timer started: ${label}`);

    return () => {
      const duration = performance.now() - startTime;
      this.info(`Timer ended: ${label}`, {
        performance: { duration: Math.round(duration * 100) / 100 }
      });
    };
  }

  /**
   * 获取日志条目
   */
  getEntries(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = level ? this.entries.filter(entry => entry.level === level) : this.entries;

    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  /**
   * 清除日志
   */
  clear(): void {
    this.entries = [];
  }

  /**
   * 导出日志
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'userId', 'sessionId', 'url'];
      const rows = this.entries.map(entry => [
        entry.timestamp,
        entry.level,
        entry.message,
        entry.userId || '',
        entry.sessionId || '',
        entry.url || ''
      ]);

      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// 创建全局日志实例
const logger = new Logger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  enableConsole: true,
  enableRemote: false,
  enablePerformanceLogging: true,
  enableErrorTracking: true
});

export default logger;
export { Logger };
