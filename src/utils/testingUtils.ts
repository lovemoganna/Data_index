/**
 * 自动化测试工具
 * 提供单元测试、集成测试和性能测试功能
 */

import { Category, Indicator, Priority } from '../types';
import logger from './logger';

// 测试结果接口
export interface TestResult {
  success: boolean;
  testName: string;
  duration: number;
  message?: string;
  error?: Error;
  data?: any;
}

export interface TestSuiteResult {
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  results: TestResult[];
  coverage?: TestCoverage;
}

export interface TestCoverage {
  functions: number;
  branches: number;
  lines: number;
  statements: number;
}

// 性能基准测试接口
export interface PerformanceBenchmark {
  operation: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  p95Time: number;
  memoryUsage?: {
    before: number;
    after: number;
    delta: number;
  };
}

export interface BenchmarkResult {
  timestamp: Date;
  benchmarks: PerformanceBenchmark[];
  environment: {
    userAgent: string;
    platform: string;
    memory?: any;
  };
}

// 自动化测试框架
export class AutomatedTesting {
  private static testSuites: Map<string, TestSuite> = new Map();

  /**
   * 注册测试套件
   */
  static registerSuite(name: string, suite: TestSuite): void {
    this.testSuites.set(name, suite);
  }

  /**
   * 运行所有测试
   */
  static async runAllTests(): Promise<TestSuiteResult[]> {
    const results: TestSuiteResult[] = [];

    for (const [name, suite] of this.testSuites) {
      const result = await this.runTestSuite(name, suite);
      results.push(result);
    }

    return results;
  }

  /**
   * 运行单个测试套件
   */
  static async runTestSuite(name: string, suite: TestSuite): Promise<TestSuiteResult> {
    const startTime = performance.now();
    const results: TestResult[] = [];

    logger.info(`Running test suite: ${name}`);

    for (const test of suite.tests) {
      const result = await this.runTest(test);
      results.push(result);
    }

    const duration = performance.now() - startTime;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    const suiteResult: TestSuiteResult = {
      suiteName: name,
      totalTests: results.length,
      passedTests,
      failedTests,
      duration,
      results
    };

    logger.info(`Test suite ${name} completed`, {
      passed: passedTests,
      failed: failedTests,
      duration: Math.round(duration)
    });

    return suiteResult;
  }

  /**
   * 运行单个测试
   */
  private static async runTest(test: TestCase): Promise<TestResult> {
    const startTime = performance.now();

    try {
      await test.fn();
      const duration = performance.now() - startTime;

      return {
        success: true,
        testName: test.name,
        duration,
        message: 'Test passed'
      };
    } catch (error) {
      const duration = performance.now() - startTime;

      return {
        success: false,
        testName: test.name,
        duration,
        message: error instanceof Error ? error.message : 'Test failed',
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }

  /**
   * 生成测试报告
   */
  static generateReport(results: TestSuiteResult[]): string {
    let report = '# Automated Testing Report\n\n';
    report += `Generated at: ${new Date().toISOString()}\n\n`;

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;

    results.forEach(suite => {
      report += `## ${suite.suiteName}\n\n`;
      report += `- Total Tests: ${suite.totalTests}\n`;
      report += `- Passed: ${suite.passedTests}\n`;
      report += `- Failed: ${suite.failedTests}\n`;
      report += `- Duration: ${suite.duration.toFixed(2)}ms\n\n`;

      suite.results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        report += `${status} ${result.testName} (${result.duration.toFixed(2)}ms)\n`;
        if (!result.success && result.message) {
          report += `  Error: ${result.message}\n`;
        }
      });

      report += '\n';

      totalTests += suite.totalTests;
      totalPassed += suite.passedTests;
      totalFailed += suite.failedTests;
      totalDuration += suite.duration;
    });

    report += '## Summary\n\n';
    report += `- Total Test Suites: ${results.length}\n`;
    report += `- Total Tests: ${totalTests}\n`;
    report += `- Passed: ${totalPassed}\n`;
    report += `- Failed: ${totalFailed}\n`;
    report += `- Success Rate: ${totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0}%\n`;
    report += `- Total Duration: ${totalDuration.toFixed(2)}ms\n`;

    return report;
  }
}

// 测试套件接口
export interface TestSuite {
  name: string;
  tests: TestCase[];
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

export interface TestCase {
  name: string;
  fn: () => Promise<void>;
}

// 断言工具
export class Assert {
  static equal<T>(actual: T, expected: T, message?: string): void {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
  }

  static notEqual<T>(actual: T, expected: T, message?: string): void {
    if (actual === expected) {
      throw new Error(message || `Expected ${actual} to not equal ${expected}`);
    }
  }

  static truthy(value: any, message?: string): void {
    if (!value) {
      throw new Error(message || `Expected ${value} to be truthy`);
    }
  }

  static falsy(value: any, message?: string): void {
    if (value) {
      throw new Error(message || `Expected ${value} to be falsy`);
    }
  }

  static throws(fn: () => void, message?: string): void {
    try {
      fn();
      throw new Error(message || 'Expected function to throw');
    } catch (error) {
      if (error instanceof Error && error.message === (message || 'Expected function to throw')) {
        throw error;
      }
      // 如果抛出了其他错误，说明测试通过
    }
  }

  static greaterThan(actual: number, expected: number, message?: string): void {
    if (actual <= expected) {
      throw new Error(message || `Expected ${actual} to be greater than ${expected}`);
    }
  }

  static lessThan(actual: number, expected: number, message?: string): void {
    if (actual >= expected) {
      throw new Error(message || `Expected ${actual} to be less than ${expected}`);
    }
  }

  static includes<T>(array: T[], item: T, message?: string): void {
    if (!array.includes(item)) {
      throw new Error(message || `Expected array to include ${item}`);
    }
  }

  static matches(value: string, regex: RegExp, message?: string): void {
    if (!regex.test(value)) {
      throw new Error(message || `Expected ${value} to match ${regex}`);
    }
  }
}

// 数据验证测试套件
export const dataValidationTestSuite: TestSuite = {
  name: 'Data Validation Tests',
  tests: [
    {
      name: 'Should validate category structure',
      fn: async () => {
        const { validateData } = await import('./dataValidation');
        const testData = [{
          id: 'A',
          name: 'Test Category',
          description: 'Test Description',
          icon: 'Activity',
          subcategories: [{
            id: 'A1',
            name: 'Test Subcategory',
            indicators: [{
              id: 'A1-1',
              name: 'Test Indicator',
              definition: 'Test definition with sufficient length',
              purpose: 'Test purpose',
              formula: 'SUM(A)',
              threshold: '> 100',
              calculationCase: 'Example calculation',
              riskInterpretation: 'Risk interpretation text',
              priority: 'P1' as Priority,
              status: 'active'
            }]
          }]
        }];

        const report = validateData(testData);
        Assert.greaterThan(report.score, 80, 'Data validation score should be above 80');
        Assert.equal(report.grade, 'B', 'Should achieve grade B or higher');
      }
    },
    {
      name: 'Should detect missing required fields',
      fn: async () => {
        const { validateData } = await import('./dataValidation');
        const invalidData = [{
          id: 'A',
          name: '', // Missing name
          description: 'Test Description',
          icon: 'Activity',
          subcategories: []
        }];

        const report = validateData(invalidData);
        Assert.greaterThan(report.errors.length, 0, 'Should detect validation errors');
      }
    },
    {
      name: 'Should validate ID uniqueness',
      fn: async () => {
        const { validateData } = await import('./dataValidation');
        const duplicateData = [{
          id: 'A',
          name: 'Category A',
          description: 'Test',
          icon: 'Activity',
          subcategories: [{
            id: 'A', // Duplicate ID with category
            name: 'Subcategory',
            indicators: []
          }]
        }];

        const report = validateData(duplicateData);
        Assert.greaterThan(report.errors.length, 0, 'Should detect duplicate IDs');
      }
    }
  ]
};

// 性能基准测试套件
export class PerformanceBenchmarking {
  private static benchmarks: PerformanceBenchmark[] = [];

  /**
   * 运行性能基准测试
   */
  static async runBenchmarks(): Promise<BenchmarkResult> {
    const results: PerformanceBenchmark[] = [];

    // 数据加载性能测试
    results.push(await this.benchmarkDataLoading());

    // 数据验证性能测试
    results.push(await this.benchmarkDataValidation());

    // 搜索性能测试
    results.push(await this.benchmarkSearch());

    // 导出性能测试
    results.push(await this.benchmarkExport());

    return {
      timestamp: new Date(),
      benchmarks: results,
      environment: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        memory: (performance as any).memory
      }
    };
  }

  /**
   * 数据加载性能测试
   */
  private static async benchmarkDataLoading(): Promise<PerformanceBenchmark> {
    const { dataService } = await import('../services/dataService');

    const times: number[] = [];
    const iterations = 10;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await dataService.getAll();
      const end = performance.now();
      times.push(end - start);
    }

    return this.createBenchmarkResult('Data Loading', times);
  }

  /**
   * 数据验证性能测试
   */
  private static async benchmarkDataValidation(): Promise<PerformanceBenchmark> {
    const { validateData } = await import('./dataValidation');
    const { dataService } = await import('../services/dataService');

    const data = await dataService.getAll();
    const times: number[] = [];
    const iterations = 5;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      validateData(data);
      const end = performance.now();
      times.push(end - start);
    }

    return this.createBenchmarkResult('Data Validation', times);
  }

  /**
   * 搜索性能测试
   */
  private static async benchmarkSearch(): Promise<PerformanceBenchmark> {
    const { dataService } = await import('../services/dataService');

    const data = await dataService.getAll();
    const searchTerms = ['风险', '指标', '监控', '数据'];
    const times: number[] = [];
    const iterations = 20;

    for (let i = 0; i < iterations; i++) {
      const searchTerm = searchTerms[i % searchTerms.length];
      const start = performance.now();

      // 模拟搜索操作
      data.forEach(category => {
        category.subcategories.forEach(subcategory => {
          subcategory.indicators.forEach(indicator => {
            if (indicator.name.includes(searchTerm) ||
                indicator.definition.includes(searchTerm)) {
              // 找到匹配
            }
          });
        });
      });

      const end = performance.now();
      times.push(end - start);
    }

    return this.createBenchmarkResult('Search Operation', times);
  }

  /**
   * 导出性能测试
   */
  private static async benchmarkExport(): Promise<PerformanceBenchmark> {
    const { dataService } = await import('../services/dataService');
    const { exportToJSON } = await import('./exportService');

    const data = await dataService.getAll();
    const times: number[] = [];
    const iterations = 5;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      exportToJSON(data);
      const end = performance.now();
      times.push(end - start);
    }

    return this.createBenchmarkResult('Data Export', times);
  }

  /**
   * 创建基准测试结果
   */
  private static createBenchmarkResult(
    operation: string,
    times: number[]
  ): PerformanceBenchmark {
    const sortedTimes = [...times].sort((a, b) => a - b);
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / times.length;
    const minTime = sortedTimes[0];
    const maxTime = sortedTimes[sortedTimes.length - 1];
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p95Time = sortedTimes[p95Index];

    return {
      operation,
      iterations: times.length,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      p95Time
    };
  }

  /**
   * 生成性能报告
   */
  static generatePerformanceReport(result: BenchmarkResult): string {
    let report = '# Performance Benchmark Report\n\n';
    report += `Generated at: ${result.timestamp.toISOString()}\n\n`;
    report += `Environment: ${result.environment.platform}\n`;
    report += `User Agent: ${result.environment.userAgent}\n\n`;

    if (result.environment.memory) {
      report += `Memory: ${Math.round(result.environment.memory.usedJSHeapSize / 1024 / 1024)}MB used\n\n`;
    }

    result.benchmarks.forEach(benchmark => {
      report += `## ${benchmark.operation}\n\n`;
      report += `- Iterations: ${benchmark.iterations}\n`;
      report += `- Average Time: ${benchmark.averageTime.toFixed(2)}ms\n`;
      report += `- Min Time: ${benchmark.minTime.toFixed(2)}ms\n`;
      report += `- Max Time: ${benchmark.maxTime.toFixed(2)}ms\n`;
      report += `- P95 Time: ${benchmark.p95Time.toFixed(2)}ms\n`;
      report += `- Total Time: ${benchmark.totalTime.toFixed(2)}ms\n\n`;
    });

    return report;
  }

  /**
   * 比较性能结果
   */
  static compareBenchmarks(current: BenchmarkResult, previous: BenchmarkResult): {
    operation: string;
    change: number;
    status: 'improved' | 'degraded' | 'stable';
  }[] {
    const comparisons = current.benchmarks.map(currentBench => {
      const previousBench = previous.benchmarks.find(b => b.operation === currentBench.operation);

      if (!previousBench) {
        return {
          operation: currentBench.operation,
          change: 0,
          status: 'stable' as const
        };
      }

      const change = ((currentBench.averageTime - previousBench.averageTime) / previousBench.averageTime) * 100;
      let status: 'improved' | 'degraded' | 'stable';

      if (Math.abs(change) < 5) {
        status = 'stable';
      } else if (change < 0) {
        status = 'improved';
      } else {
        status = 'degraded';
      }

      return {
        operation: currentBench.operation,
        change: Math.round(change * 100) / 100,
        status
      };
    });

    return comparisons;
  }
}

// 错误跟踪增强
export class ErrorTracking {
  private static errors: Array<{
    timestamp: Date;
    error: Error;
    context: any;
    userAgent: string;
    url: string;
  }> = [];

  /**
   * 捕获错误
   */
  static captureError(error: Error, context?: any): void {
    const errorInfo = {
      timestamp: new Date(),
      error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.push(errorInfo);

    // 限制错误数量
    if (this.errors.length > 100) {
      this.errors.shift();
    }

    logger.error('Error captured', error, context);
  }

  /**
   * 获取错误报告
   */
  static getErrorReport(): {
    totalErrors: number;
    recentErrors: any[];
    errorTypes: Record<string, number>;
    errorTrends: { date: string; count: number }[];
  } {
    const errorTypes: Record<string, number> = {};
    const errorTrends: Record<string, number> = {};

    this.errors.forEach(errorInfo => {
      // 统计错误类型
      const errorType = errorInfo.error.name || 'Unknown';
      errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;

      // 统计错误趋势（按天）
      const date = errorInfo.timestamp.toISOString().split('T')[0];
      errorTrends[date] = (errorTrends[date] || 0) + 1;
    });

    const errorTrendsArray = Object.entries(errorTrends)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalErrors: this.errors.length,
      recentErrors: this.errors.slice(-10), // 最近10个错误
      errorTypes,
      errorTrends: errorTrendsArray
    };
  }

  /**
   * 清除错误历史
   */
  static clearErrorHistory(): void {
    this.errors = [];
  }

  /**
   * 生成错误报告
   */
  static generateErrorReport(): string {
    const report = this.getErrorReport();

    let markdown = '# Error Tracking Report\n\n';
    markdown += `Generated at: ${new Date().toISOString()}\n\n`;
    markdown += `Total Errors: ${report.totalErrors}\n\n`;

    markdown += '## Error Types\n\n';
    Object.entries(report.errorTypes).forEach(([type, count]) => {
      markdown += `- ${type}: ${count}\n`;
    });

    markdown += '\n## Recent Errors\n\n';
    report.recentErrors.forEach((error, index) => {
      markdown += `### Error ${index + 1}\n`;
      markdown += `- Time: ${error.timestamp.toISOString()}\n`;
      markdown += `- Type: ${error.error.name}\n`;
      markdown += `- Message: ${error.error.message}\n`;
      markdown += `- URL: ${error.url}\n`;
      if (error.context) {
        markdown += `- Context: ${JSON.stringify(error.context, null, 2)}\n`;
      }
      markdown += '\n';
    });

    markdown += '## Error Trends\n\n';
    report.errorTrends.forEach(trend => {
      markdown += `- ${trend.date}: ${trend.count} errors\n`;
    });

    return markdown;
  }
}

// 注册测试套件
AutomatedTesting.registerSuite('Data Validation', dataValidationTestSuite);

// 导出便捷函数
export const runAllTests = AutomatedTesting.runAllTests.bind(AutomatedTesting);
export const generateTestReport = AutomatedTesting.generateReport.bind(AutomatedTesting);

export const runBenchmarks = PerformanceBenchmarking.runBenchmarks.bind(PerformanceBenchmarking);
export const generatePerformanceReport = PerformanceBenchmarking.generatePerformanceReport.bind(PerformanceBenchmarking);
export const compareBenchmarks = PerformanceBenchmarking.compareBenchmarks.bind(PerformanceBenchmarking);

export const captureError = ErrorTracking.captureError.bind(ErrorTracking);
export const getErrorReport = ErrorTracking.getErrorReport.bind(ErrorTracking);
export const generateErrorReport = ErrorTracking.generateErrorReport.bind(ErrorTracking);
