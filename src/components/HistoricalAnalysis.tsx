import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
  ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import RiskScoringEngine, { HistoricalRiskData } from '../services/riskEngine';
import {
  TrendingUp, TrendingDown, Calendar, BarChart3,
  Activity, AlertTriangle, Target, Clock,
  Filter, Download, RefreshCw, Zap
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface HistoricalAnalysisProps {
  currentRiskScore: number;
}

export function HistoricalAnalysis({ currentRiskScore }: HistoricalAnalysisProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalRiskData[]>([]);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'total' | 'categories' | 'alerts'>('total');

  // 生成历史数据
  useEffect(() => {
    const loadHistoricalData = async () => {
      setLoading(true);
      try {
        const data = RiskScoringEngine.generateHistoricalData(timeRange);
        setHistoricalData(data);
      } catch (error) {
        console.error('加载历史数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistoricalData();
  }, [timeRange]);

  // 计算趋势分析
  const trendAnalysis = useMemo(() => {
    if (historicalData.length < 2) return null;

    return RiskScoringEngine.calculateRiskTrend(historicalData);
  }, [historicalData]);

  // 计算预测数据
  const predictionData = useMemo(() => {
    if (historicalData.length < 7) return null;

    const prediction = RiskScoringEngine.predictRiskTrend(historicalData, 7);
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    const predictionDate = format(lastDate, 'yyyy-MM-dd');

    return {
      date: predictionDate,
      predictedScore: prediction.predictedScore,
      confidence: prediction.confidence,
      trend: prediction.trend
    };
  }, [historicalData]);

  // 统计数据
  const stats = useMemo(() => {
    if (historicalData.length === 0) return null;

    const scores = historicalData.map(d => d.totalScore);
    const alerts = historicalData.map(d => d.alertsCount);

    return {
      avgRiskScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      maxRiskScore: Math.max(...scores),
      minRiskScore: Math.min(...scores),
      totalAlerts: alerts.reduce((sum, count) => sum + count, 0),
      avgAlertsPerDay: alerts.reduce((sum, count) => sum + count, 0) / alerts.length,
      riskVolatility: calculateVolatility(scores)
    };
  }, [historicalData]);

  const calculateVolatility = (scores: number[]): number => {
    if (scores.length < 2) return 0;

    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
  };

  // 准备图表数据
  const chartData = useMemo(() => {
    return historicalData.map(item => ({
      ...item,
      dateFormatted: format(new Date(item.date), 'MM/dd'),
      currentScore: currentRiskScore,
      riskLevel: item.totalScore >= 80 ? '极高' :
                 item.totalScore >= 60 ? '高' :
                 item.totalScore >= 40 ? '中等' : '低'
    }));
  }, [historicalData, currentRiskScore]);

  // 类别趋势数据
  const categoryTrendData = useMemo(() => {
    return historicalData.map(item => ({
      date: item.date,
      dateFormatted: format(new Date(item.date), 'MM/dd'),
      账号与身份: item.categoryScores.A || 0,
      资产与资金: item.categoryScores.B || 0,
      交易行为: item.categoryScores.C || 0,
      市场冲击: item.categoryScores.D || 0
    }));
  }, [historicalData]);

  const exportData = () => {
    const csvData = [
      ['日期', '综合风险评分', '账号风险', '资金风险', '交易风险', '市场风险', '告警数量'],
      ...historicalData.map(item => [
        item.date,
        item.totalScore,
        item.categoryScores.A || 0,
        item.categoryScores.B || 0,
        item.categoryScores.C || 0,
        item.categoryScores.D || 0,
        item.alertsCount
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk_analysis_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">正在加载历史数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部控制栏 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">历史数据分析</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">时间序列分析和趋势预测</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">时间范围:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value) as 7 | 30 | 90)}
                className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
              >
                <option value={7}>最近7天</option>
                <option value={30}>最近30天</option>
                <option value={90}>最近90天</option>
              </select>
            </div>

            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
            >
              <Download className="w-4 h-4" />
              导出数据
            </button>
          </div>
        </div>

        {/* 统计概览 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">平均风险评分</span>
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.avgRiskScore.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                波动率: {stats.riskVolatility.toFixed(1)}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">最高风险评分</span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.maxRiskScore.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                峰值风险
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">总告警次数</span>
                <Bell className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.totalAlerts}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                平均每天 {stats.avgAlertsPerDay.toFixed(1)} 次
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">趋势状态</span>
                {trendAnalysis && (
                  trendAnalysis.trend === 'improving' ? <TrendingDown className="w-4 h-4 text-green-500" /> :
                  trendAnalysis.trend === 'worsening' ? <TrendingUp className="w-4 h-4 text-red-500" /> :
                  <div className="w-4 h-0.5 bg-blue-500 rounded"></div>
                )}
              </div>
              <div className={`text-2xl font-bold ${
                trendAnalysis?.trend === 'improving' ? 'text-green-600 dark:text-green-400' :
                trendAnalysis?.trend === 'worsening' ? 'text-red-600 dark:text-red-400' :
                'text-blue-600 dark:text-blue-400'
              }`}>
                {trendAnalysis?.trend === 'improving' ? '改善' :
                 trendAnalysis?.trend === 'worsening' ? '恶化' : '稳定'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                变化: {trendAnalysis?.changePercent > 0 ? '+' : ''}{trendAnalysis?.changePercent}%
              </div>
            </div>
          </div>
        )}

        {/* 视图切换 */}
        <div className="flex gap-2">
          {[
            { key: 'total', label: '综合风险', icon: BarChart3 },
            { key: 'categories', label: '类别分析', icon: Activity },
            { key: 'alerts', label: '告警统计', icon: AlertTriangle }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedMetric === key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 图表区域 */}
      {selectedMetric === 'total' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 风险评分趋势图 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">风险评分趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}分`,
                    name === 'totalScore' ? '历史风险评分' :
                    name === 'currentScore' ? '当前风险评分' : name
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="totalScore"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  name="totalScore"
                />
                <ReferenceLine
                  y={currentRiskScore}
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  label={{ value: `当前: ${currentRiskScore}`, position: 'topRight' }}
                />
                {predictionData && (
                  <ReferenceLine
                    y={predictionData.predictedScore}
                    stroke="#10B981"
                    strokeDasharray="3 3"
                    label={{
                      value: `预测: ${predictionData.predictedScore.toFixed(1)}`,
                      position: 'bottomRight'
                    }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 风险等级分布 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">风险等级分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'totalScore' ? `${Number(value).toFixed(1)}分` : value,
                    name === 'totalScore' ? '风险评分' : name
                  ]}
                />
                <Bar dataKey="totalScore" fill="#3B82F6" name="totalScore" />
              </BarChart>
            </ResponsiveContainer>

            {/* 风险等级说明 */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>低风险 (0-40)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>中等 (40-60)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>高风险 (60-80)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>极高 (80-100)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMetric === 'categories' && (
        <div className="space-y-6">
          {/* 类别趋势对比 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">四大维度风险趋势对比</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={categoryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}分`, '']} />
                <Legend />
                <Line type="monotone" dataKey="账号与身份" stroke="#3B82F6" strokeWidth={2} name="账号与身份" />
                <Line type="monotone" dataKey="资产与资金" stroke="#10B981" strokeWidth={2} name="资产与资金" />
                <Line type="monotone" dataKey="交易行为" stroke="#F59E0B" strokeWidth={2} name="交易行为" />
                <Line type="monotone" dataKey="市场冲击" stroke="#EF4444" strokeWidth={2} name="市场冲击" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 类别风险统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['A', 'B', 'C', 'D'].map(categoryId => {
              const categoryName = {
                A: '账号与身份',
                B: '资产与资金',
                C: '交易行为',
                D: '市场冲击'
              }[categoryId];

              const categoryData = historicalData.map(d => d.categoryScores[categoryId] || 0);
              const avgScore = categoryData.reduce((sum, score) => sum + score, 0) / categoryData.length;
              const maxScore = Math.max(...categoryData);
              const trend = categoryData[categoryData.length - 1] - categoryData[categoryData.length - 2];

              return (
                <div key={categoryId} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900 dark:text-white">{categoryName}</h4>
                    {trend > 0 ? <TrendingUp className="w-4 h-4 text-red-500" /> :
                     trend < 0 ? <TrendingDown className="w-4 h-4 text-green-500" /> :
                     <div className="w-4 h-0.5 bg-blue-500 rounded"></div>}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {avgScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    峰值: {maxScore.toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedMetric === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 告警次数趋势 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">告警触发趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} 次`, '告警次数']} />
                <Bar dataKey="alertsCount" fill="#EF4444" name="alertsCount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 告警统计 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">告警统计</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300">总告警次数</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {historicalData.reduce((sum, d) => sum + d.alertsCount, 0)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300">平均每日告警</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(historicalData.reduce((sum, d) => sum + d.alertsCount, 0) / historicalData.length).toFixed(1)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300">最高日告警</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {Math.max(...historicalData.map(d => d.alertsCount))}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300">告警天数占比</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {((historicalData.filter(d => d.alertsCount > 0).length / historicalData.length) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 预测分析 */}
      {predictionData && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">风险趋势预测</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">基于历史数据进行7天风险趋势预测</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {predictionData.predictedScore.toFixed(1)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">预测风险评分</div>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className={`text-3xl font-bold mb-2 ${
                predictionData.trend === 'up' ? 'text-red-600 dark:text-red-400' :
                predictionData.trend === 'down' ? 'text-green-600 dark:text-green-400' :
                'text-blue-600 dark:text-blue-400'
              }`}>
                {predictionData.trend === 'up' ? '上升' :
                 predictionData.trend === 'down' ? '下降' : '稳定'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">趋势方向</div>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {(predictionData.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">预测置信度</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>预测说明：</strong>
              基于最近{timeRange}天的历史数据，使用线性回归算法进行趋势预测。
              置信度表示预测的可靠性程度，建议结合实际业务情况进行综合判断。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
