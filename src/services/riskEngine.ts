import { Category, Indicator } from '../types';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export interface RiskScore {
  totalScore: number;
  categoryScores: Record<string, number>;
  indicatorScores: Record<string, number>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  factors: RiskFactor[];
}

export interface RiskFactor {
  indicatorId: string;
  indicatorName: string;
  category: string;
  score: number;
  weight: number;
  contribution: number;
  description: string;
}

export interface RiskThreshold {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface RiskAlert {
  id: string;
  indicatorId: string;
  indicatorName: string;
  category: string;
  currentValue: number;
  threshold: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface HistoricalRiskData {
  date: string;
  totalScore: number;
  categoryScores: Record<string, number>;
  alertsCount: number;
  topRiskIndicators: string[];
}

export class RiskScoringEngine {
  private static readonly DEFAULT_THRESHOLDS: RiskThreshold = {
    low: 20,
    medium: 40,
    high: 70,
    critical: 90
  };

  private static readonly CATEGORY_WEIGHTS = {
    'A': 0.25, // 账号与身份维度
    'B': 0.30, // 资产与资金维度
    'C': 0.25, // 交易行为维度
    'D': 0.20  // 市场冲击维度
  };

  private static readonly PRIORITY_WEIGHTS = {
    'P0': 1.0,
    'P1': 0.7,
    'P2': 0.4
  };

  /**
   * 计算综合风险评分
   */
  static calculateRiskScore(data: Category[]): RiskScore {
    const categoryScores: Record<string, number> = {};
    const indicatorScores: Record<string, number> = {};
    const factors: RiskFactor[] = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;

    // 计算每个类别的风险评分
    data.forEach(category => {
      const categoryIndicators = category.subcategories.flatMap(sub => sub.indicators);
      const categoryScore = this.calculateCategoryScore(categoryIndicators);
      categoryScores[category.id] = categoryScore;

      // 计算类别权重
      const categoryWeight = this.CATEGORY_WEIGHTS[category.id as keyof typeof this.CATEGORY_WEIGHTS] || 0.25;
      totalWeightedScore += categoryScore * categoryWeight;
      totalWeight += categoryWeight;

      // 收集指标级别的风险因素
      categoryIndicators.forEach(indicator => {
        const indicatorScore = this.calculateIndicatorScore(indicator);
        indicatorScores[indicator.id] = indicatorScore;

        const priorityWeight = this.PRIORITY_WEIGHTS[indicator.priority];
        const contribution = (indicatorScore * priorityWeight * categoryWeight) / totalWeight;

        factors.push({
          indicatorId: indicator.id,
          indicatorName: indicator.name,
          category: category.name,
          score: indicatorScore,
          weight: priorityWeight * categoryWeight,
          contribution,
          description: this.generateRiskDescription(indicator, indicatorScore)
        });
      });
    });

    const totalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    const riskLevel = this.determineRiskLevel(totalScore);

    return {
      totalScore: Math.round(totalScore * 100) / 100,
      categoryScores,
      indicatorScores,
      riskLevel,
      timestamp: new Date(),
      factors: factors.sort((a, b) => b.contribution - a.contribution)
    };
  }

  /**
   * 计算类别风险评分
   */
  private static calculateCategoryScore(indicators: Indicator[]): number {
    if (indicators.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    indicators.forEach(indicator => {
      const indicatorScore = this.calculateIndicatorScore(indicator);
      const priorityWeight = this.PRIORITY_WEIGHTS[indicator.priority];
      totalScore += indicatorScore * priorityWeight;
      totalWeight += priorityWeight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * 计算单个指标的风险评分
   */
  private static calculateIndicatorScore(indicator: Indicator): number {
    // 基于状态和优先级的风险评分
    let baseScore = 0;

    // 优先级基础分数
    switch (indicator.priority) {
      case 'P0': baseScore = 80; break;
      case 'P1': baseScore = 50; break;
      case 'P2': baseScore = 20; break;
      default: baseScore = 30;
    }

    // 状态调整
    if (indicator.status === 'inactive') {
      baseScore *= 0.3; // 未激活指标降低权重
    }

    // 阈值风险调整（模拟）
    const thresholdRisk = this.calculateThresholdRisk(indicator);

    return Math.min(100, baseScore + thresholdRisk);
  }

  /**
   * 计算阈值风险（模拟实际业务逻辑）
   */
  private static calculateThresholdRisk(indicator: Indicator): number {
    // 基于指标名称和阈值进行风险评估的简化逻辑
    const riskPatterns = {
      '存续': indicator.name.includes('存续') ? 15 : 0,
      '黑地址': indicator.name.includes('黑地址') ? 25 : 0,
      '操纵': indicator.name.includes('操纵') ? 30 : 0,
      '洗钱': indicator.name.includes('洗钱') ? 35 : 0,
      '僵尸': indicator.name.includes('僵尸') ? 20 : 0,
      'HFT': indicator.name.includes('HFT') ? 25 : 0
    };

    return Object.values(riskPatterns).reduce((sum, risk) => sum + risk, 0);
  }

  /**
   * 生成风险描述
   */
  private static generateRiskDescription(indicator: Indicator, score: number): string {
    if (score >= 80) {
      return `🚨 ${indicator.name}存在极高风险，需立即处理`;
    } else if (score >= 60) {
      return `⚠️ ${indicator.name}存在较高风险，建议重点关注`;
    } else if (score >= 40) {
      return `📊 ${indicator.name}存在中等风险，需定期监控`;
    } else {
      return `✅ ${indicator.name}风险较低，保持正常监控`;
    }
  }

  /**
   * 确定风险等级
   */
  static determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= this.DEFAULT_THRESHOLDS.critical) return 'critical';
    if (score >= this.DEFAULT_THRESHOLDS.high) return 'high';
    if (score >= this.DEFAULT_THRESHOLDS.medium) return 'medium';
    return 'low';
  }

  /**
   * 生成风险告警
   */
  static generateRiskAlerts(data: Category[], riskScore: RiskScore): RiskAlert[] {
    const alerts: RiskAlert[] = [];

    data.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.indicators.forEach(indicator => {
          const indicatorScore = riskScore.indicatorScores[indicator.id];
          const threshold = this.getRiskThreshold(indicator.priority);

          if (indicatorScore >= threshold) {
            alerts.push({
              id: `alert_${indicator.id}_${Date.now()}`,
              indicatorId: indicator.id,
              indicatorName: indicator.name,
              category: category.name,
              currentValue: indicatorScore,
              threshold,
              riskLevel: this.determineRiskLevel(indicatorScore),
              message: this.generateAlertMessage(indicator, indicatorScore),
              timestamp: new Date(),
              acknowledged: false
            });
          }
        });
      });
    });

    return alerts.sort((a, b) => b.currentValue - a.currentValue);
  }

  /**
   * 获取风险阈值
   */
  private static getRiskThreshold(priority: string): number {
    switch (priority) {
      case 'P0': return 70;
      case 'P1': return 50;
      case 'P2': return 30;
      default: return 40;
    }
  }

  /**
   * 生成告警消息
   */
  private static generateAlertMessage(indicator: Indicator, score: number): string {
    const riskLevel = this.determineRiskLevel(score);
    const levelText = {
      critical: '严重',
      high: '高',
      medium: '中等',
      low: '低'
    }[riskLevel];

    return `${indicator.name}触发${levelText}风险告警 (分数: ${score.toFixed(1)})，${indicator.purpose}`;
  }

  /**
   * 生成历史风险数据（模拟）
   */
  static generateHistoricalData(days: number = 30): HistoricalRiskData[] {
    const data: HistoricalRiskData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const baseScore = 40 + Math.random() * 30; // 40-70的基础分数
      const dailyVariation = (Math.random() - 0.5) * 20; // 日变化
      const totalScore = Math.max(0, Math.min(100, baseScore + dailyVariation));

      data.push({
        date: format(date, 'yyyy-MM-dd'),
        totalScore: Math.round(totalScore * 100) / 100,
        categoryScores: {
          'A': Math.round((totalScore * 0.8 + Math.random() * 10) * 100) / 100,
          'B': Math.round((totalScore * 1.2 + Math.random() * 10) * 100) / 100,
          'C': Math.round((totalScore * 0.9 + Math.random() * 10) * 100) / 100,
          'D': Math.round((totalScore * 0.7 + Math.random() * 10) * 100) / 100
        },
        alertsCount: Math.floor(Math.random() * 15) + 5,
        topRiskIndicators: [
          '黑地址关联深度',
          '充提平衡率',
          '价格操纵指数',
          '设备重复率'
        ].sort(() => Math.random() - 0.5).slice(0, 3)
      });
    }

    return data;
  }

  /**
   * 计算风险趋势
   */
  static calculateRiskTrend(historicalData: HistoricalRiskData[]): {
    trend: 'improving' | 'worsening' | 'stable';
    changePercent: number;
    averageScore: number;
  } {
    if (historicalData.length < 2) {
      return { trend: 'stable', changePercent: 0, averageScore: 0 };
    }

    const recent = historicalData.slice(-7); // 最近7天
    const previous = historicalData.slice(-14, -7); // 前7天

    const recentAvg = recent.reduce((sum, d) => sum + d.totalScore, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.totalScore, 0) / previous.length;

    const changePercent = ((recentAvg - previousAvg) / previousAvg) * 100;

    let trend: 'improving' | 'worsening' | 'stable';
    if (Math.abs(changePercent) < 5) {
      trend = 'stable';
    } else if (changePercent > 0) {
      trend = 'worsening';
    } else {
      trend = 'improving';
    }

    return {
      trend,
      changePercent: Math.round(changePercent * 100) / 100,
      averageScore: Math.round(recentAvg * 100) / 100
    };
  }

  /**
   * 风险预测（基于历史趋势的简单预测）
   */
  static predictRiskTrend(historicalData: HistoricalRiskData[], daysAhead: number = 7): {
    predictedScore: number;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
  } {
    if (historicalData.length < 7) {
      return { predictedScore: 50, confidence: 0.5, trend: 'stable' };
    }

    const recent = historicalData.slice(-7);
    const scores = recent.map(d => d.totalScore);

    // 简单线性回归预测
    const n = scores.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = scores.reduce((sum, y) => sum + y, 0);
    const sumXY = scores.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const nextIndex = n + daysAhead - 1;
    const predictedScore = Math.max(0, Math.min(100, slope * nextIndex + intercept));

    // 计算置信度（基于数据波动性）
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - (sumY / n), 2), 0) / n;
    const confidence = Math.max(0.1, Math.min(0.9, 1 - variance / 100));

    let trend: 'up' | 'down' | 'stable';
    if (Math.abs(slope) < 0.1) {
      trend = 'stable';
    } else if (slope > 0) {
      trend = 'up';
    } else {
      trend = 'down';
    }

    return {
      predictedScore: Math.round(predictedScore * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      trend
    };
  }
}

// 导出类型和类
export type { RiskScore, RiskFactor, RiskThreshold, RiskAlert, HistoricalRiskData };
export default RiskScoringEngine;
