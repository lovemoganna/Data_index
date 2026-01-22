/**
 * AI 助手组件
 * 提供智能建议和自动化帮助
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Category, Indicator } from '../types';
import { AISuggestion, analyzeRiskData, generateIndicatorSuggestions, generateAutomationSuggestions, generateSearchSuggestions } from '../utils/aiAssistant';
import { Lightbulb, AlertTriangle, TrendingUp, Zap, X, RefreshCw, Sparkles } from 'lucide-react';
import i18n from '../utils/i18n';

interface AIAssistantProps {
  data: Category[];
  currentQuery?: string;
  selectedIndicator?: Indicator;
  onSuggestionApply?: (suggestion: AISuggestion) => void;
  className?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  data,
  currentQuery = '',
  selectedIndicator,
  onSuggestionApply,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);

  // 分析风险数据
  const performAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeRiskData(data);
      setSuggestions(result.suggestions);
      setInsights(result.insights);
      setLastAnalysisTime(new Date());
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 生成搜索建议
  useEffect(() => {
    if (currentQuery.length >= 2) {
      const suggestions = generateSearchSuggestions(currentQuery, data);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [currentQuery, data]);

  // 分析单个指标
  useEffect(() => {
    if (selectedIndicator) {
      // 找到对应的分类
      const category = data.find(cat =>
        cat.subcategories.some(sub =>
          sub.indicators.some(ind => ind.id === selectedIndicator.id)
        )
      );

      if (category) {
        const indicatorSuggestions = generateIndicatorSuggestions(selectedIndicator, category);
        setSuggestions(prev => {
          // 移除之前的指标建议，添加新的
          const filtered = prev.filter(s => s.indicatorId !== selectedIndicator.id);
          return [...filtered, ...indicatorSuggestions];
        });
      }
    }
  }, [selectedIndicator, data]);

  // 初始分析
  useEffect(() => {
    if (data.length > 0 && !lastAnalysisTime) {
      performAnalysis();
    }
  }, [data, lastAnalysisTime]);

  // 获取建议图标
  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'improvement': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'insight': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'automation': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: AISuggestion['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  // 过滤建议（显示最重要的）
  const filteredSuggestions = useMemo(() => {
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 5); // 只显示前5个最重要的建议
  }, [suggestions]);

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            AI 智能助手
          </h3>
        </div>
        <button
          onClick={performAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? '分析中...' : '重新分析'}
        </button>
      </div>

      {/* 搜索建议 */}
      {searchSuggestions.length > 0 && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            搜索建议
          </h4>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((suggestion, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 洞察 */}
      {insights.length > 0 && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            智能洞察
          </h4>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 建议列表 */}
      {filteredSuggestions.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            改进建议 ({filteredSuggestions.length})
          </h4>
          <div className="space-y-3">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-slate-900 dark:text-white text-sm">
                        {suggestion.title}
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          置信度: {Math.round(suggestion.confidence * 100)}%
                        </span>
                        {suggestion.category && (
                          <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                            {suggestion.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {suggestion.actionable && onSuggestionApply && (
                    <button
                      onClick={() => onSuggestionApply(suggestion)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      应用
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!isAnalyzing && suggestions.length === 0 && insights.length === 0 && (
        <div className="p-8 text-center">
          <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            正在分析您的数据...
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
            AI 助手将为您提供智能建议和改进意见
          </p>
        </div>
      )}

      {/* 底部状态 */}
      {lastAnalysisTime && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            上次分析: {lastAnalysisTime.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};
