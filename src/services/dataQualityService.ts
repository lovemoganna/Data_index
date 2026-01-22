import { Category, Indicator, Priority } from '../types';

// 数据质量报告接口
export interface DataQualityReport {
  overall: {
    score: number; // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    issues: number;
    recommendations: string[];
  };
  categories: CategoryQualityReport[];
  indicators: IndicatorQualityReport[];
  statistics: {
    totalCategories: number;
    totalSubcategories: number;
    totalIndicators: number;
    averageIndicatorsPerCategory: number;
    priorityDistribution: Record<Priority, number>;
    statusDistribution: Record<string, number>;
  };
}

export interface CategoryQualityReport {
  id: string;
  name: string;
  score: number;
  issues: string[];
  recommendations: string[];
  indicatorCount: number;
  completeness: number; // 0-1
}

export interface IndicatorQualityReport {
  id: string;
  name: string;
  category: string;
  score: number;
  issues: string[];
  recommendations: string[];
  qualityMetrics: {
    definitionCompleteness: number;
    purposeClarity: number;
    formulaValidity: number;
    thresholdReasonableness: number;
    calculationExample: number;
    interpretationQuality: number;
  };
}

// 数据质量规则
export interface QualityRule {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  check: (indicator: Indicator, category?: Category) => boolean;
  message: string;
  recommendation: string;
}

export class DataQualityService {
  private static readonly QUALITY_RULES: QualityRule[] = [
    {
      id: 'definition_required',
      name: '定义完整性',
      description: '指标必须有清晰的业务定义',
      severity: 'critical',
      check: (indicator) => indicator.definition && indicator.definition.length > 10,
      message: '指标定义不完整或过短',
      recommendation: '为指标提供详细的业务定义，说明其确切含义'
    },
    {
      id: 'purpose_required',
      name: '目的明确性',
      description: '指标必须明确其业务目的',
      severity: 'high',
      check: (indicator) => indicator.purpose && indicator.purpose.length > 10,
      message: '指标目的不明确',
      recommendation: '明确说明该指标用于解决什么业务问题'
    },
    {
      id: 'formula_validity',
      name: '计算公式有效性',
      description: '指标计算公式应合理且可执行',
      severity: 'high',
      check: (indicator) => {
        const formula = indicator.formula;
        if (!formula || formula.length < 3) return false;
        // 检查是否包含基本的数学运算符或函数
        return /[\+\-\*\/\(\)=<>]|\b(avg|sum|count|max|min|if|then)\b/i.test(formula);
      },
      message: '计算公式无效或过于简单',
      recommendation: '提供具体的计算公式或逻辑表达式'
    },
    {
      id: 'threshold_reasonable',
      name: '阈值合理性',
      description: '风险阈值应在合理范围内',
      severity: 'medium',
      check: (indicator) => {
        const threshold = indicator.threshold;
        if (!threshold) return false;
        // 检查是否包含数值
        return /\d/.test(threshold);
      },
      message: '风险阈值不明确',
      recommendation: '设定具体的数值阈值或范围'
    },
    {
      id: 'calculation_example',
      name: '计算示例完整性',
      description: '应提供具体的计算示例',
      severity: 'medium',
      check: (indicator) => indicator.calculationCase && indicator.calculationCase.length > 10,
      message: '缺少具体的计算示例',
      recommendation: '提供带数值的计算示例'
    },
    {
      id: 'interpretation_quality',
      name: '解读质量',
      description: '风险解读应详细且有用',
      severity: 'medium',
      check: (indicator) => indicator.riskInterpretation && indicator.riskInterpretation.length > 20,
      message: '风险解读过于简单',
      recommendation: '提供详细的风险含义解读和应对建议'
    },
    {
      id: 'unique_id',
      name: 'ID唯一性',
      description: '指标ID应在系统中唯一',
      severity: 'critical',
      check: (indicator, category) => {
        if (!category) return true;
        const allIndicators = category.subcategories.flatMap(sub => sub.indicators);
        const duplicates = allIndicators.filter(ind => ind.id === indicator.id);
        return duplicates.length === 1;
      },
      message: '指标ID不唯一',
      recommendation: '确保每个指标有唯一的标识符'
    },
    {
      id: 'naming_consistency',
      name: '命名一致性',
      description: '指标名称应清晰且一致',
      severity: 'low',
      check: (indicator) => {
        const name = indicator.name;
        if (!name || name.length < 2) return false;
        // 检查是否包含有意义的词汇
        return /[a-zA-Z\u4e00-\u9fa5]/.test(name) && name.length <= 50;
      },
      message: '指标名称不规范',
      recommendation: '使用清晰、简洁、有意义的名称'
    }
  ];

  /**
   * 生成完整的数据质量报告
   */
  static generateQualityReport(data: Category[]): DataQualityReport {
    const categoryReports: CategoryQualityReport[] = [];
    const indicatorReports: IndicatorQualityReport[] = [];
    const allIssues: string[] = [];
    const allRecommendations: string[] = [];

    let totalIndicators = 0;
    const priorityDistribution: Record<Priority, number> = { P0: 0, P1: 0, P2: 0 };
    const statusDistribution: Record<string, number> = { active: 0, inactive: 0 };

    // 分析每个分类
    data.forEach(category => {
      const categoryIndicators = category.subcategories.flatMap(sub => sub.indicators);
      totalIndicators += categoryIndicators.length;

      const categoryReport = this.analyzeCategoryQuality(category);
      categoryReports.push(categoryReport);

      allIssues.push(...categoryReport.issues);
      allRecommendations.push(...categoryReport.recommendations);

      // 分析分类中的每个指标
      categoryIndicators.forEach(indicator => {
        const indicatorReport = this.analyzeIndicatorQuality(indicator, category);
        indicatorReports.push(indicatorReport);

        allIssues.push(...indicatorReport.issues);
        allRecommendations.push(...indicatorReport.recommendations);

        // 统计优先级和状态分布
        priorityDistribution[indicator.priority]++;
        statusDistribution[indicator.status || 'active']++;
      });
    });

    // 计算总体分数
    const averageCategoryScore = categoryReports.reduce((sum, cat) => sum + cat.score, 0) / categoryReports.length;
    const averageIndicatorScore = indicatorReports.reduce((sum, ind) => sum + ind.score, 0) / indicatorReports.length;
    const overallScore = (averageCategoryScore * 0.3 + averageIndicatorScore * 0.7);

    const grade = this.calculateGrade(overallScore);

    return {
      overall: {
        score: Math.round(overallScore),
        grade,
        issues: allIssues.length,
        recommendations: [...new Set(allRecommendations)] // 去重
      },
      categories: categoryReports.sort((a, b) => b.score - a.score),
      indicators: indicatorReports.sort((a, b) => b.score - a.score),
      statistics: {
        totalCategories: data.length,
        totalSubcategories: data.reduce((sum, cat) => sum + cat.subcategories.length, 0),
        totalIndicators,
        averageIndicatorsPerCategory: totalIndicators / data.length,
        priorityDistribution,
        statusDistribution
      }
    };
  }

  /**
   * 分析分类质量
   */
  private static analyzeCategoryQuality(category: Category): CategoryQualityReport {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const indicatorCount = category.subcategories.reduce((sum, sub) => sum + sub.indicators.length, 0);

    // 检查分类基本信息完整性
    if (!category.name || category.name.length < 2) {
      issues.push('分类名称不完整');
      recommendations.push('为分类提供清晰的名称');
      score -= 20;
    }

    if (!category.description || category.description.length < 10) {
      issues.push('分类描述不完整');
      recommendations.push('为分类提供详细的描述说明');
      score -= 15;
    }

    if (!category.icon) {
      issues.push('缺少分类图标');
      recommendations.push('为分类选择合适的图标');
      score -= 5;
    }

    // 检查子分类数量
    if (category.subcategories.length === 0) {
      issues.push('分类下没有子分类');
      recommendations.push('为分类添加至少一个子分类');
      score -= 30;
    }

    // 检查指标数量
    if (indicatorCount === 0) {
      issues.push('分类下没有指标');
      recommendations.push('为分类添加风险指标');
      score -= 30;
    } else if (indicatorCount < 3) {
      issues.push('指标数量过少');
      recommendations.push('建议增加更多相关的风险指标');
      score -= 10;
    }

    // 检查子分类质量
    const subcategoryIssues = category.subcategories.filter(sub => !sub.name || sub.name.length < 2).length;
    if (subcategoryIssues > 0) {
      issues.push(`${subcategoryIssues}个子分类名称不完整`);
      recommendations.push('为所有子分类提供清晰的名称');
      score -= subcategoryIssues * 5;
    }

    const completeness = indicatorCount > 0 ? Math.min(1, indicatorCount / 10) : 0;

    return {
      id: category.id,
      name: category.name,
      score: Math.max(0, Math.round(score)),
      issues,
      recommendations,
      indicatorCount,
      completeness
    };
  }

  /**
   * 分析指标质量
   */
  private static analyzeIndicatorQuality(indicator: Indicator, category: Category): IndicatorQualityReport {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // 应用质量规则
    this.QUALITY_RULES.forEach(rule => {
      const passed = rule.check(indicator, category);
      if (!passed) {
        issues.push(rule.message);
        recommendations.push(rule.recommendation);

        // 根据严重程度扣分
        const penalties = { critical: 20, high: 15, medium: 10, low: 5 };
        score -= penalties[rule.severity];
      }
    });

    // 计算质量指标
    const qualityMetrics = {
      definitionCompleteness: this.calculateTextQuality(indicator.definition),
      purposeClarity: this.calculateTextQuality(indicator.purpose),
      formulaValidity: this.calculateFormulaQuality(indicator.formula),
      thresholdReasonableness: this.calculateThresholdQuality(indicator.threshold),
      calculationExample: this.calculateTextQuality(indicator.calculationCase),
      interpretationQuality: this.calculateTextQuality(indicator.riskInterpretation)
    };

    return {
      id: indicator.id,
      name: indicator.name,
      category: category.name,
      score: Math.max(0, Math.round(score)),
      issues,
      recommendations,
      qualityMetrics
    };
  }

  /**
   * 计算文本质量分数 (0-1)
   */
  private static calculateTextQuality(text: string): number {
    if (!text || text.length === 0) return 0;
    if (text.length < 10) return 0.2;
    if (text.length < 50) return 0.6;
    return 1;
  }

  /**
   * 计算公式质量分数 (0-1)
   */
  private static calculateFormulaQuality(formula: string): number {
    if (!formula) return 0;
    let score = 0;

    // 检查长度
    if (formula.length > 5) score += 0.3;

    // 检查是否包含运算符
    if (/[\+\-\*\/\(\)=<>]/.test(formula)) score += 0.3;

    // 检查是否包含函数
    if (/\b(avg|sum|count|max|min|if|then|and|or)\b/i.test(formula)) score += 0.4;

    return Math.min(1, score);
  }

  /**
   * 计算阈值质量分数 (0-1)
   */
  private static calculateThresholdQuality(threshold: string): number {
    if (!threshold) return 0;

    // 检查是否包含数值
    if (!/\d/.test(threshold)) return 0.2;

    // 检查是否包含比较运算符
    if (/[<>=]/.test(threshold)) return 0.8;

    // 检查是否包含范围
    if (/-|到|~|between/i.test(threshold)) return 1;

    return 0.6;
  }

  /**
   * 根据分数计算等级
   */
  private static calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * 获取质量改进建议
   */
  static getQualityImprovementSuggestions(report: DataQualityReport): {
    priority: string[];
    quickWins: string[];
    longTerm: string[];
  } {
    const suggestions = {
      priority: [] as string[],
      quickWins: [] as string[],
      longTerm: [] as string[]
    };

    // 优先级改进项
    if (report.overall.score < 70) {
      suggestions.priority.push('完善关键指标的定义和计算公式');
      suggestions.priority.push('为所有指标设定合理的风险阈值');
    }

    // 快速改进项
    if (report.statistics.totalIndicators < 20) {
      suggestions.quickWins.push('增加更多维度的风险指标覆盖');
    }

    const emptyDescriptions = report.indicators.filter(ind => ind.qualityMetrics.definitionCompleteness < 0.5).length;
    if (emptyDescriptions > 0) {
      suggestions.quickWins.push(`完善 ${emptyDescriptions} 个指标的定义描述`);
    }

    // 长期改进项
    suggestions.longTerm.push('建立数据质量监控和定期审查机制');
    suggestions.longTerm.push('开发自动化数据验证规则');
    suggestions.longTerm.push('建立指标生命周期管理流程');

    return suggestions;
  }

  /**
   * 生成数据质量趋势分析
   */
  static analyzeQualityTrend(reports: DataQualityReport[]): {
    trend: 'improving' | 'declining' | 'stable';
    changePercent: number;
    insights: string[];
  } {
    if (reports.length < 2) {
      return {
        trend: 'stable',
        changePercent: 0,
        insights: ['需要更多的数据质量报告来分析趋势']
      };
    }

    const scores = reports.map(r => r.overall.score);
    const recent = scores.slice(-3); // 最近3次报告
    const previous = scores.slice(-6, -3); // 前3次报告

    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const previousAvg = previous.length > 0 ? previous.reduce((sum, score) => sum + score, 0) / previous.length : recentAvg;

    const changePercent = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    let trend: 'improving' | 'declining' | 'stable';
    if (Math.abs(changePercent) < 5) {
      trend = 'stable';
    } else if (changePercent > 0) {
      trend = 'improving';
    } else {
      trend = 'declining';
    }

    const insights: string[] = [];
    if (trend === 'improving') {
      insights.push('数据质量正在稳步提升');
    } else if (trend === 'declining') {
      insights.push('数据质量有所下降，需要关注');
    } else {
      insights.push('数据质量保持稳定');
    }

    if (recentAvg < 70) {
      insights.push('整体数据质量有待提升');
    }

    return {
      trend,
      changePercent: Math.round(changePercent * 100) / 100,
      insights
    };
  }
}
