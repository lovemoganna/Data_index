import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
  ScatterChart, Scatter, ZAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, ComposedChart
} from 'recharts';
import { Category, Indicator } from '../types';
import {
  BarChart3, PieChart as PieChartIcon, TrendingUp, Activity,
  AlertTriangle, Shield, Eye, Layers, Filter, Download,
  Calendar, Target, Zap
} from 'lucide-react';

interface DataAnalysisPanelProps {
  data: Category[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];

export function DataAnalysisPanel({ data }: DataAnalysisPanelProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'trends' | 'distribution' | 'correlation'>('overview');

  // 计算统计数据
  const stats = useMemo(() => {
    const indicators = data.flatMap(cat =>
      cat.subcategories.flatMap(sub => sub.indicators)
    );

    return {
      totalIndicators: indicators.length,
      activeIndicators: indicators.filter(i => i.status === 'active').length,
      p0Count: indicators.filter(i => i.priority === 'P0').length,
      p1Count: indicators.filter(i => i.priority === 'P1').length,
      p2Count: indicators.filter(i => i.priority === 'P2').length,
      categories: data.length,
      subcategories: data.reduce((sum, cat) => sum + cat.subcategories.length, 0)
    };
  }, [data]);

  // 优先级分布数据
  const priorityData = useMemo(() => [
    { name: 'P0 (紧急)', value: stats.p0Count, color: '#EF4444' },
    { name: 'P1 (重要)', value: stats.p1Count, color: '#F59E0B' },
    { name: 'P2 (普通)', value: stats.p2Count, color: '#10B981' }
  ], [stats]);

  // 分类分布数据
  const categoryData = useMemo(() =>
    data.map((cat, index) => ({
      name: cat.name,
      indicators: cat.subcategories.reduce((sum, sub) => sum + sub.indicators.length, 0),
      active: cat.subcategories.reduce((sum, sub) =>
        sum + sub.indicators.filter(i => i.status === 'active').length, 0
      ),
      color: COLORS[index % COLORS.length]
    })), [data]
  );

  // 风险评分模拟数据（基于优先级和状态）
  const riskScoreData = useMemo(() =>
    data.map(cat => {
      const indicators = cat.subcategories.flatMap(sub => sub.indicators);
      const avgRisk = indicators.reduce((sum, ind) => {
        const priorityScore = ind.priority === 'P0' ? 100 : ind.priority === 'P1' ? 60 : 30;
        const statusMultiplier = ind.status === 'active' ? 1 : 0.5;
        return sum + (priorityScore * statusMultiplier);
      }, 0) / indicators.length;

      return {
        category: cat.name.split('维度')[0],
        riskScore: Math.round(avgRisk),
        indicators: indicators.length,
        color: cat.color
      };
    }), [data]
  );

  // 时间趋势模拟数据（最近7天）
  const trendData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      alerts: Math.floor(Math.random() * 20) + 5,
      activeIndicators: stats.activeIndicators + Math.floor(Math.random() * 10) - 5,
      riskScore: 60 + Math.floor(Math.random() * 30)
    }));
  }, [stats.activeIndicators]);

  // 相关性分析数据（模拟）
  const correlationData = useMemo(() => [
    { indicator: '注册存续天数', correlation: 0.85, impact: 'high' },
    { indicator: '首提时间差', correlation: 0.72, impact: 'high' },
    { indicator: '设备重复率', correlation: 0.68, impact: 'medium' },
    { indicator: '充提平衡率', correlation: 0.91, impact: 'high' },
    { indicator: '交易频率', correlation: 0.45, impact: 'low' },
    { indicator: '代理IP偏好', correlation: 0.33, impact: 'low' }
  ], []);

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 关键指标卡片 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">总指标数</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalIndicators}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">活跃指标</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activeIndicators}</p>
          </div>
          <Activity className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">紧急指标</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.p0Count}</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">监控维度</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.categories}</p>
          </div>
          <Layers className="h-8 w-8 text-purple-500" />
        </div>
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 优先级分布饼图 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">优先级分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 分类指标分布柱状图 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">维度指标分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="indicators" fill="#3B82F6" name="总指标" />
            <Bar dataKey="active" fill="#10B981" name="活跃指标" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 风险评分雷达图 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">风险评分雷达</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={riskScoreData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="风险评分"
              dataKey="riskScore"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.3}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 相关性散点图 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">指标相关性分析</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={correlationData}>
            <CartesianGrid />
            <XAxis dataKey="correlation" name="相关系数" domain={[0, 1]} />
            <YAxis dataKey="impact" name="影响程度" />
            <ZAxis dataKey="correlation" range={[50, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => [
                name === 'correlation' ? `${(Number(value) * 100).toFixed(1)}%` : value,
                name === 'correlation' ? '相关系数' : '影响程度'
              ]}
            />
            <Scatter dataKey="correlation" fill="#8B5CF6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* 趋势图 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">风险趋势分析（最近7天）</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="alerts" fill="#EF4444" name="告警次数" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="riskScore"
              stroke="#3B82F6"
              strokeWidth={3}
              name="风险评分"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 面积图 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">活跃指标趋势</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="activeIndicators"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
              name="活跃指标数"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderHeatmap = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">风险分布热力图</h3>
      <div className="grid grid-cols-4 gap-2">
        {data.map((category, catIndex) =>
          category.subcategories.map((subcategory, subIndex) => {
            const indicators = subcategory.indicators;
            const riskLevel = indicators.reduce((sum, ind) => {
              const priorityScore = ind.priority === 'P0' ? 3 : ind.priority === 'P1' ? 2 : 1;
              const statusMultiplier = ind.status === 'active' ? 1 : 0.5;
              return sum + (priorityScore * statusMultiplier);
            }, 0) / indicators.length;

            const getHeatColor = (level: number) => {
              if (level >= 2.5) return 'bg-red-500';
              if (level >= 2.0) return 'bg-orange-500';
              if (level >= 1.5) return 'bg-yellow-500';
              return 'bg-green-500';
            };

            return (
              <div
                key={`${catIndex}-${subIndex}`}
                className={`p-4 rounded-lg ${getHeatColor(riskLevel)} text-white text-center transition-all hover:scale-105 cursor-pointer`}
                title={`${category.name} - ${subcategory.name}: ${indicators.length}个指标`}
              >
                <div className="text-sm font-medium">{subcategory.name}</div>
                <div className="text-xs opacity-75">{indicators.length}指标</div>
                <div className="text-xs opacity-75">风险:{riskLevel.toFixed(1)}</div>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-4 flex justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>低风险</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>中风险</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
          <span>高风险</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span>极高风险</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 视图切换器 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'overview', label: '概览面板', icon: BarChart3 },
          { key: 'trends', label: '趋势分析', icon: TrendingUp },
          { key: 'distribution', label: '分布可视化', icon: PieChartIcon },
          { key: 'correlation', label: '相关性分析', icon: Target }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedView(key as any)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              selectedView === key
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      {selectedView === 'overview' && (
        <>
          {renderOverview()}
          {renderCharts()}
        </>
      )}

      {selectedView === 'trends' && renderTrends()}

      {selectedView === 'distribution' && renderCharts()}

      {selectedView === 'correlation' && (
        <div className="space-y-6">
          {renderHeatmap()}

          {/* 相关性表格 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">指标相关性详情</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="text-left py-2 px-4">指标名称</th>
                    <th className="text-left py-2 px-4">相关系数</th>
                    <th className="text-left py-2 px-4">影响程度</th>
                    <th className="text-left py-2 px-4">风险等级</th>
                  </tr>
                </thead>
                <tbody>
                  {correlationData.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-2 px-4">{item.indicator}</td>
                      <td className="py-2 px-4">{(item.correlation * 100).toFixed(1)}%</td>
                      <td className="py-2 px-4 capitalize">{item.impact}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.correlation > 0.8 ? 'bg-red-100 text-red-800' :
                          item.correlation > 0.6 ? 'bg-orange-100 text-orange-800' :
                          item.correlation > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.correlation > 0.8 ? '高' :
                           item.correlation > 0.6 ? '中高' :
                           item.correlation > 0.4 ? '中' : '低'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 导出按钮 */}
      <div className="flex justify-end">
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          导出分析报告
        </button>
      </div>
    </div>
  );
}
