/**
 * AI 助手工具类
 * 提供智能建议、数据分析辅助和自动化功能
 */

import { Category, Indicator, Priority } from '../types';
import logger from './logger';

// AI 建议接口
export interface AISuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'insight' | 'automation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionable: boolean;
  category?: string;
  indicatorId?: string;
  suggestedValue?: any;
  confidence: number; // 0-1
  timestamp: Date;
}

// AI 分析结果接口
export interface AIAnalysisResult {
  summary: string;
  suggestions: AISuggestion[];
  insights: string[];
  riskAssessment: {
    overallRisk: Priority;
    riskFactors: string[];
    mitigationStrategies: string[];
  };
  trends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
}

// AI 助手类
export class AIAssistant {
  private static readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  /**
   * 分析风险数据并生成智能建议
   */
  static async analyzeRiskData(data: Category[]): Promise<AIAnalysisResult> {
    try {
      const analysis = this.performLocalAnalysis(data);
      const aiInsights = await this.getAIInsights(data, analysis);

      return {
        ...analysis,
        insights: [...analysis.insights, ...aiInsights]
      };
    } catch (error) {
      logger.error('AI analysis failed, falling back to local analysis', error);
      return this.performLocalAnalysis(data);
    }
  }

  /**
   * 本地分析（离线可用）
   */
  private static performLocalAnalysis(data: Category[]): AIAnalysisResult {
    const suggestions: AISuggestion[] = [];
    const insights: string[] = [];
    const riskFactors: string[] = [];
    const mitigationStrategies: string[] = [];
    const trends = { improving: [] as string[], declining: [] as string[], stable: [] as string[] };

    // 分析每个分类
    data.forEach(category => {
      const indicators = category.subcategories.flatMap(sub => sub.indicators);

      // 检查指标完整性
      const completeIndicators = indicators.filter(ind =>
        ind.definition && ind.purpose && ind.formula && ind.threshold
      );

      if (completeIndicators.length < indicators.length * 0.8) {
        suggestions.push({
          id: `completeness-${category.id}`,
          type: 'improvement',
          priority: 'high',
          title: `完善 ${category.name} 分类的指标定义`,
          description: `${completeIndicators.length}/${indicators.length} 个指标信息不完整`,
          actionable: true,
          category: category.id,
          confidence: 0.9,
          timestamp: new Date()
        });
      }

      // 检查优先级分布
      const priorityCount = indicators.reduce((acc, ind) => {
        acc[ind.priority] = (acc[ind.priority] || 0) + 1;
        return acc;
      }, {} as Record<Priority, number>);

      if ((priorityCount.P0 || 0) > indicators.length * 0.3) {
        riskFactors.push(`${category.name} 有过多高风险指标`);
        mitigationStrategies.push(`重新评估 ${category.name} 中 P0 级指标的优先级`);
      }

      // 检查重复指标
      const names = indicators.map(ind => ind.name.toLowerCase());
      const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

      if (duplicates.length > 0) {
        suggestions.push({
          id: `duplicates-${category.id}`,
          type: 'warning',
          priority: 'medium',
          title: `发现重复指标名称`,
          description: `分类 ${category.name} 中存在重复的指标名称`,
          actionable: true,
          category: category.id,
          confidence: 0.8,
          timestamp: new Date()
        });
      }
    });

    // 生成洞察
    const totalIndicators = data.reduce((sum, cat) =>
      sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0
    );

    if (totalIndicators < 10) {
      insights.push('建议增加更多风险指标以提高监控覆盖率');
    } else if (totalIndicators > 100) {
      insights.push('指标数量较多，建议进行分类整理和优先级排序');
    }

    // 确定整体风险等级
    let overallRisk: Priority = 'P2';
    if (riskFactors.length > 5) overallRisk = 'P0';
    else if (riskFactors.length > 2) overallRisk = 'P1';

    return {
      summary: `分析了 ${data.length} 个风险分类，共 ${totalIndicators} 个指标`,
      suggestions,
      insights,
      riskAssessment: {
        overallRisk,
        riskFactors,
        mitigationStrategies
      },
      trends
    };
  }

  /**
   * 获取 AI 洞察（需要 API 密钥）
   */
  private static async getAIInsights(data: Category[], localAnalysis: AIAnalysisResult): Promise<string[]> {
    if (!this.GEMINI_API_KEY) {
      logger.warn('No Gemini API key available, skipping AI insights');
      return [];
    }

    try {
      const prompt = this.buildAIPrompt(data, localAnalysis);

      const response = await fetch(`${this.API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }

      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        throw new Error('No AI response content');
      }

      // 解析 AI 响应并提取洞察
      return this.parseAIInsights(aiText);
    } catch (error) {
      logger.error('AI insights request failed', error);
      return [];
    }
  }

  /**
   * 构建 AI 提示
   */
  private static buildAIPrompt(data: Category[], analysis: AIAnalysisResult): string {
    const summary = `
基于 MECE 原则的风险监控系统分析：

系统概况：
- ${analysis.summary}

发现的问题：
${analysis.suggestions.map(s => `- ${s.title}: ${s.description}`).join('\n')}

请提供3-5个智能洞察，帮助用户更好地理解和改进风险监控体系。重点关注：
1. 潜在的风险模式或趋势
2. 改进建议的具体实施步骤
3. 最佳实践和行业标准对比
4. 自动化监控的可能性

请用中文回复，保持简洁专业。
    `.trim();

    return summary;
  }

  /**
   * 解析 AI 洞察
   */
  private static parseAIInsights(aiText: string): string[] {
    try {
      // 简单解析：按行分割并清理
      const insights = aiText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 10 && !line.startsWith('#'))
        .slice(0, 5); // 限制为5个洞察

      return insights;
    } catch (error) {
      logger.error('Failed to parse AI insights', error);
      return [];
    }
  }

  /**
   * 生成指标改进建议
   */
  static generateIndicatorSuggestions(indicator: Indicator, category: Category): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    // 检查定义质量
    if (!indicator.definition || indicator.definition.length < 20) {
      suggestions.push({
        id: `definition-${indicator.id}`,
        type: 'improvement',
        priority: 'high',
        title: '完善指标定义',
        description: '指标定义过于简短，建议提供更详细的业务含义说明',
        actionable: true,
        indicatorId: indicator.id,
        confidence: 0.9,
        timestamp: new Date()
      });
    }

    // 检查计算公式
    if (!indicator.formula || !indicator.formula.includes('=')) {
      suggestions.push({
        id: `formula-${indicator.id}`,
        type: 'improvement',
        priority: 'high',
        title: '完善计算公式',
        description: '建议提供具体的计算公式或逻辑表达式',
        actionable: true,
        indicatorId: indicator.id,
        confidence: 0.8,
        timestamp: new Date()
      });
    }

    // 检查阈值合理性
    if (!indicator.threshold || !/\d/.test(indicator.threshold)) {
      suggestions.push({
        id: `threshold-${indicator.id}`,
        type: 'warning',
        priority: 'medium',
        title: '设定风险阈值',
        description: '建议设定具体的数值阈值或范围',
        actionable: true,
        indicatorId: indicator.id,
        confidence: 0.7,
        timestamp: new Date()
      });
    }

    // 检查计算案例
    if (!indicator.calculationCase || indicator.calculationCase.length < 10) {
      suggestions.push({
        id: `example-${indicator.id}`,
        type: 'improvement',
        priority: 'low',
        title: '添加计算示例',
        description: '建议提供具体的数值计算示例',
        actionable: true,
        indicatorId: indicator.id,
        confidence: 0.6,
        timestamp: new Date()
      });
    }

    return suggestions;
  }

  /**
   * 生成自动化建议
   */
  static generateAutomationSuggestions(data: Category[]): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    // 检查是否可以自动化数据收集
    const indicatorsWithFormula = data.flatMap(cat =>
      cat.subcategories.flatMap(sub =>
        sub.indicators.filter(ind => ind.formula && ind.formula.length > 5)
      )
    );

    if (indicatorsWithFormula.length > 10) {
      suggestions.push({
        id: 'automation-data-collection',
        type: 'automation',
        priority: 'medium',
        title: '实施自动化数据收集',
        description: `发现 ${indicatorsWithFormula.length} 个有计算公式的指标，可以实施自动化数据收集和计算`,
        actionable: true,
        confidence: 0.8,
        timestamp: new Date()
      });
    }

    // 检查是否可以实施定期审核
    const highPriorityIndicators = data.flatMap(cat =>
      cat.subcategories.flatMap(sub =>
        sub.indicators.filter(ind => ind.priority === 'P0')
      )
    );

    if (highPriorityIndicators.length > 0) {
      suggestions.push({
        id: 'automation-regular-review',
        type: 'automation',
        priority: 'high',
        title: '建立定期审核机制',
        description: `为 ${highPriorityIndicators.length} 个高优先级指标建立自动化定期审核机制`,
        actionable: true,
        confidence: 0.9,
        timestamp: new Date()
      });
    }

    return suggestions;
  }

  /**
   * 智能搜索建议
   */
  static generateSearchSuggestions(query: string, data: Category[]): string[] {
    const suggestions: string[] = [];

    if (!query || query.length < 2) return suggestions;

    const lowerQuery = query.toLowerCase();

    // 基于现有指标生成建议
    const matchingIndicators = data.flatMap(cat =>
      cat.subcategories.flatMap(sub =>
        sub.indicators.filter(ind =>
          ind.name.toLowerCase().includes(lowerQuery) ||
          ind.definition.toLowerCase().includes(lowerQuery) ||
          ind.purpose.toLowerCase().includes(lowerQuery)
        )
      )
    );

    // 提取相关的关键词
    const keywords = new Set<string>();
    matchingIndicators.forEach(ind => {
      // 提取指标名称中的关键词
      const words = ind.name.split(/[\s,，。；；]/).filter(word => word.length > 1);
      words.forEach(word => keywords.add(word));

      // 提取定义中的关键词
      if (ind.definition) {
        const defWords = ind.definition.split(/[\s,，。；；]/).filter(word => word.length > 1);
        defWords.forEach(word => keywords.add(word));
      }
    });

    // 生成建议（限制为5个）
    Array.from(keywords)
      .filter(keyword => keyword.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .forEach(keyword => suggestions.push(keyword));

    return suggestions;
  }
}

// 导出便捷函数
export const analyzeRiskData = AIAssistant.analyzeRiskData.bind(AIAssistant);
export const generateIndicatorSuggestions = AIAssistant.generateIndicatorSuggestions.bind(AIAssistant);
export const generateAutomationSuggestions = AIAssistant.generateAutomationSuggestions.bind(AIAssistant);
export const generateSearchSuggestions = AIAssistant.generateSearchSuggestions.bind(AIAssistant);
