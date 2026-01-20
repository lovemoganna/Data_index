import React, { useState, useRef } from 'react';
import { Category } from '../types';
import { RiskScore, HistoricalRiskData, RiskScoringEngine } from '../services/riskEngine';
import {
  FileText, Download, Calendar, BarChart3, TrendingUp,
  AlertTriangle, CheckCircle, Clock, User, Building
} from 'lucide-react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
  data: Category[];
  riskScore: RiskScore;
  historicalData: HistoricalRiskData[];
}

interface ReportConfig {
  title: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeExecutiveSummary: boolean;
  includeDetailedAnalysis: boolean;
  includeHistoricalTrends: boolean;
  includeRecommendations: boolean;
  format: 'pdf' | 'html' | 'json';
}

export function ReportGenerator({ data, riskScore, historicalData }: ReportGeneratorProps) {
  const [config, setConfig] = useState<ReportConfig>({
    title: `风险评估报告 - ${format(new Date(), 'yyyy年MM月dd日')}`,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
      end: new Date()
    },
    includeExecutiveSummary: true,
    includeDetailedAnalysis: true,
    includeHistoricalTrends: true,
    includeRecommendations: true,
    format: 'pdf'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      switch (config.format) {
        case 'pdf':
          await generatePDF();
          break;
        case 'html':
          await generateHTML();
          break;
        case 'json':
          generateJSON();
          break;
      }
    } catch (error) {
      console.error('生成报告失败:', error);
      alert('生成报告失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，继续添加页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${config.title}.pdf`);
  };

  const generateHTML = async () => {
    if (!reportRef.current) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <style>
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; }
        .content { padding: 30px; }
        .section { margin-bottom: 30px; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .risk-high { color: #dc2626; }
        .risk-medium { color: #d97706; }
        .risk-low { color: #059669; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        ${reportRef.current.innerHTML}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateJSON = () => {
    const reportData = {
      metadata: {
        title: config.title,
        generatedAt: new Date().toISOString(),
        dateRange: config.dateRange,
        version: '1.0'
      },
      executiveSummary: config.includeExecutiveSummary ? generateExecutiveSummary() : null,
      riskAnalysis: {
        currentScore: riskScore,
        alerts: RiskScoringEngine.generateRiskAlerts(data, riskScore),
        categoryBreakdown: riskScore.categoryScores
      },
      historicalTrends: config.includeHistoricalTrends ? historicalData : null,
      recommendations: config.includeRecommendations ? generateRecommendations() : null
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateExecutiveSummary = () => {
    const totalIndicators = data.reduce((sum, cat) =>
      sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0
    );

    const activeIndicators = data.reduce((sum, cat) =>
      sum + cat.subcategories.reduce((subSum, sub) =>
        subSum + sub.indicators.filter(ind => ind.status === 'active').length, 0), 0
    );

    return {
      totalIndicators,
      activeIndicators,
      currentRiskScore: riskScore.totalScore,
      riskLevel: riskScore.riskLevel,
      topRiskFactors: riskScore.factors.slice(0, 5),
      trendAnalysis: RiskScoringEngine.calculateRiskTrend(historicalData)
    };
  };

  const generateRecommendations = () => {
    const recommendations = [];

    if (riskScore.riskLevel === 'critical' || riskScore.riskLevel === 'high') {
      recommendations.push({
        priority: 'high',
        category: 'immediate_action',
        title: '立即采取干预措施',
        description: '当前风险水平较高，建议立即启动应急响应程序',
        actions: [
          '暂停高风险用户的交易权限',
          '增加人工审核频次',
          '通知相关业务部门'
        ]
      });
    }

    // 基于具体指标的建议
    riskScore.factors.slice(0, 3).forEach(factor => {
      if (factor.score > 70) {
        recommendations.push({
          priority: 'medium',
          category: 'indicator_optimization',
          title: `优化${factor.indicatorName}监控`,
          description: `${factor.indicatorName}的风险评分较高，建议调整监控策略`,
          actions: [
            '审查当前阈值设置',
            '考虑增加监控频次',
            '评估是否需要增加新的子指标'
          ]
        });
      }
    });

    recommendations.push({
      priority: 'low',
      category: 'continuous_improvement',
      title: '持续改进监控体系',
      description: '定期review和优化风险监控体系',
      actions: [
        '每月进行效果评估',
        '收集业务部门反馈',
        '更新指标权重和阈值'
      ]
    });

    return recommendations;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'critical': return '严重';
      case 'high': return '高';
      case 'medium': return '中等';
      case 'low': return '低';
      default: return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* 配置面板 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">报告生成器</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本配置 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                报告标题
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                导出格式
              </label>
              <select
                value={config.format}
                onChange={(e) => setConfig({ ...config, format: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="pdf">PDF 文档</option>
                <option value="html">HTML 页面</option>
                <option value="json">JSON 数据</option>
              </select>
            </div>
          </div>

          {/* 报告内容选项 */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900 dark:text-white">包含内容</h4>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.includeExecutiveSummary}
                onChange={(e) => setConfig({ ...config, includeExecutiveSummary: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">执行摘要</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.includeDetailedAnalysis}
                onChange={(e) => setConfig({ ...config, includeDetailedAnalysis: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">详细分析</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.includeHistoricalTrends}
                onChange={(e) => setConfig({ ...config, includeHistoricalTrends: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">历史趋势</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.includeRecommendations}
                onChange={(e) => setConfig({ ...config, includeRecommendations: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">改进建议</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                生成中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                生成报告
              </>
            )}
          </button>
        </div>
      </div>

      {/* 报告预览 */}
      <div ref={reportRef} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* 报告头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
              <p className="text-blue-100">MECE 风险本体生产力平台 - 风险评估报告</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">生成时间</div>
              <div className="font-semibold">{format(new Date(), 'yyyy年MM月dd日 HH:mm')}</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* 执行摘要 */}
          {config.includeExecutiveSummary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-600 pb-2">
                执行摘要
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {data.reduce((sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">总指标数</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {data.reduce((sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.filter(ind => ind.status === 'active').length, 0), 0)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">活跃指标</div>
                </div>
                <div className={`bg-slate-50 dark:bg-slate-700 p-4 rounded-lg`}>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {riskScore.totalScore}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">当前风险评分</div>
                </div>
                <div className={`bg-slate-50 dark:bg-slate-700 p-4 rounded-lg`}>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {getRiskLevelText(riskScore.riskLevel)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">风险等级</div>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                本报告基于MECE原则构建的风险监控体系，对当前系统的风险状况进行了全面评估。
                综合风险评分为 <strong className={getRiskLevelColor(riskScore.riskLevel)}>{riskScore.totalScore}</strong>，
                整体风险等级为 <strong className={getRiskLevelColor(riskScore.riskLevel)}>{getRiskLevelText(riskScore.riskLevel)}</strong>。
                报告涵盖了账号与身份、资产与资金、交易行为、市场冲击四大维度的风险监控指标。
              </p>
            </div>
          )}

          {/* 详细分析 */}
          {config.includeDetailedAnalysis && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-600 pb-2">
                详细风险分析
              </h2>

              {/* 类别风险分布 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">维度风险分布</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(riskScore.categoryScores).map(([categoryId, score]) => {
                    const category = data.find(c => c.id === categoryId);
                    return (
                      <div key={categoryId} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {category?.name || categoryId}
                        </div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {score.toFixed(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 主要风险因素 */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">主要风险因素</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-600">
                        <th className="text-left py-2 px-4">指标名称</th>
                        <th className="text-left py-2 px-4">维度</th>
                        <th className="text-left py-2 px-4">风险评分</th>
                        <th className="text-left py-2 px-4">贡献度</th>
                        <th className="text-left py-2 px-4">描述</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskScore.factors.slice(0, 10).map((factor, index) => (
                        <tr key={index} className="border-b border-slate-100 dark:border-slate-700">
                          <td className="py-2 px-4 font-medium">{factor.indicatorName}</td>
                          <td className="py-2 px-4">{factor.category}</td>
                          <td className="py-2 px-4">
                            <span className={`font-medium ${factor.score > 70 ? 'text-red-600' : factor.score > 50 ? 'text-orange-600' : 'text-green-600'}`}>
                              {factor.score.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2 px-4">{(factor.contribution * 100).toFixed(1)}%</td>
                          <td className="py-2 px-4 text-slate-600 dark:text-slate-400">{factor.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 历史趋势 */}
          {config.includeHistoricalTrends && historicalData.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-600 pb-2">
                历史趋势分析
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {(() => {
                  const trend = RiskScoringEngine.calculateRiskTrend(historicalData);
                  const prediction = RiskScoringEngine.predictRiskTrend(historicalData);
                  return (
                    <>
                      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">风险趋势</div>
                        <div className={`text-xl font-bold ${
                          trend.trend === 'improving' ? 'text-green-600' :
                          trend.trend === 'worsening' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {trend.trend === 'improving' ? '改善中' :
                           trend.trend === 'worsening' ? '恶化中' : '稳定'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          变化: {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">平均风险评分</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {trend.averageScore}
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">7天预测</div>
                        <div className={`text-xl font-bold ${
                          prediction.trend === 'up' ? 'text-red-600' :
                          prediction.trend === 'down' ? 'text-green-600' :
                          'text-blue-600'
                        }`}>
                          {prediction.predictedScore}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          置信度: {(prediction.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* 改进建议 */}
          {config.includeRecommendations && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-600 pb-2">
                改进建议
              </h2>

              <div className="space-y-4">
                {generateRecommendations().map((rec, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                        rec.priority === 'medium' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        {rec.priority === 'high' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                         rec.priority === 'medium' ? <Clock className="w-4 h-4 text-orange-600" /> :
                         <CheckCircle className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {rec.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {rec.description}
                        </p>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 报告页脚 */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-600 text-center text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Building className="w-4 h-4" />
              <span>MECE 风险本体生产力平台</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Calendar className="w-4 h-4" />
              <span>报告生成时间: {format(new Date(), 'yyyy年MM月dd日 HH:mm:ss')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
