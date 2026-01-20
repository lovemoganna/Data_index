import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, AlertTriangle, Shield, Zap, Wifi, WifiOff,
  TrendingUp, TrendingDown, Clock, Target, BarChart3,
  Bell, BellOff, Settings, Play, Pause, RotateCcw
} from 'lucide-react';

interface Alert {
  id: string;
  indicator: string;
  value: number;
  threshold: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  category: string;
}

interface Metric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

interface RealtimeMonitorProps {
  data: any[];
}

export function RealtimeMonitor({ data }: RealtimeMonitorProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertSoundEnabled, setAlertSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio('/alert-sound.mp3');
    audioRef.current.volume = 0.3;
  }, []);

  // 模拟实时数据生成
  const generateRealtimeData = () => {
    const newMetrics: Metric[] = [
      {
        id: 'active_alerts',
        name: '活跃告警',
        value: Math.floor(Math.random() * 20) + 5,
        change: Math.floor(Math.random() * 10) - 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        unit: '个'
      },
      {
        id: 'risk_score',
        name: '综合风险评分',
        value: Math.floor(Math.random() * 30) + 60,
        change: Math.floor(Math.random() * 6) - 3,
        trend: Math.random() > 0.6 ? 'stable' : Math.random() > 0.5 ? 'up' : 'down',
        unit: '分'
      },
      {
        id: 'transaction_volume',
        name: '交易监控量',
        value: Math.floor(Math.random() * 1000) + 5000,
        change: Math.floor(Math.random() * 200) - 100,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        unit: '笔/分'
      },
      {
        id: 'response_time',
        name: '平均响应时间',
        value: Math.floor(Math.random() * 20) + 10,
        change: Math.floor(Math.random() * 4) - 2,
        trend: Math.random() > 0.5 ? 'down' : 'up',
        unit: '秒'
      }
    ];

    setMetrics(newMetrics);

    // 模拟告警生成 (10%概率)
    if (Math.random() < 0.1) {
      const riskLevels: Alert['risk'][] = ['low', 'medium', 'high', 'critical'];
      const categories = ['账号风险', '资金风险', '交易风险', '市场风险'];
      const indicators = ['注册存续天数', '充提平衡率', '交易频率', '价格波动'];

      const newAlert: Alert = {
        id: Date.now().toString(),
        indicator: indicators[Math.floor(Math.random() * indicators.length)],
        value: Math.floor(Math.random() * 100) + 50,
        threshold: Math.floor(Math.random() * 30) + 20,
        risk: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        timestamp: new Date(),
        category: categories[Math.floor(Math.random() * categories.length)]
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // 保留最新的10个告警

      // 播放告警音效
      if (alertSoundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {
          // 忽略音频播放错误
        });
      }
    }
  };

  // 连接/断开监控
  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setIsMonitoring(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsConnected(true);
      setIsMonitoring(true);
      // 模拟连接延迟
      setTimeout(() => {
        intervalRef.current = setInterval(generateRealtimeData, 2000);
      }, 1000);
    }
  };

  // 开始/暂停监控
  const toggleMonitoring = () => {
    if (isMonitoring) {
      setIsMonitoring(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsMonitoring(true);
      intervalRef.current = setInterval(generateRealtimeData, 2000);
    }
  };

  // 清除告警
  const clearAlerts = () => {
    setAlerts([]);
  };

  // 获取告警颜色
  const getAlertColor = (risk: Alert['risk']) => {
    switch (risk) {
      case 'critical': return 'bg-red-500 border-red-600';
      case 'high': return 'bg-orange-500 border-orange-600';
      case 'medium': return 'bg-yellow-500 border-yellow-600';
      case 'low': return 'bg-blue-500 border-blue-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  // 获取趋势图标
  const getTrendIcon = (trend: Metric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'stable': return <div className="w-4 h-0.5 bg-gray-500 rounded"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {isConnected ? (
                <Wifi className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                实时监控中心
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isConnected ? '已连接 - 实时监控中' : '未连接 - 点击连接开始监控'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 告警音效开关 */}
            <button
              onClick={() => setAlertSoundEnabled(!alertSoundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                alertSoundEnabled
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
              }`}
              title={alertSoundEnabled ? '关闭告警音效' : '开启告警音效'}
            >
              {alertSoundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>

            {/* 清除告警 */}
            <button
              onClick={clearAlerts}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="清除所有告警"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* 开始/暂停监控 */}
            <button
              onClick={toggleMonitoring}
              disabled={!isConnected}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isConnected
                  ? isMonitoring
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  开始
                </>
              )}
            </button>

            {/* 连接/断开 */}
            <button
              onClick={toggleConnection}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isConnected
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isConnected ? (
                <>
                  <WifiOff className="w-4 h-4" />
                  断开
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4" />
                  连接
                </>
              )}
            </button>
          </div>
        </div>

        {/* 实时指标 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {metric.name}
                </span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metric.value.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {metric.unit}
                </span>
              </div>
              <div className={`text-sm font-medium ${
                metric.change > 0 ? 'text-red-600 dark:text-red-400' :
                metric.change < 0 ? 'text-green-600 dark:text-green-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 实时告警面板 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              实时告警 ({alerts.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {isMonitoring ? '监控中' : '已暂停'}
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">暂无告警，所有系统运行正常</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.risk)} bg-slate-50 dark:bg-slate-700/50`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {alert.indicator}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                        alert.risk === 'critical' ? 'bg-red-600' :
                        alert.risk === 'high' ? 'bg-orange-600' :
                        alert.risk === 'medium' ? 'bg-yellow-600' :
                        'bg-blue-600'
                      }`}>
                        {alert.risk === 'critical' ? '紧急' :
                         alert.risk === 'high' ? '高' :
                         alert.risk === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      当前值: <span className="font-medium">{alert.value}</span> |
                      阈值: <span className="font-medium">{alert.threshold}</span> |
                      分类: <span className="font-medium">{alert.category}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <Settings className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 系统状态面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-blue-500" />
            <h4 className="font-medium text-slate-900 dark:text-white">系统性能</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">CPU使用率</span>
              <span className="text-sm font-medium">23%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">内存使用</span>
              <span className="text-sm font-medium">1.2GB / 4GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">响应时间</span>
              <span className="text-sm font-medium">45ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-green-500" />
            <h4 className="font-medium text-slate-900 dark:text-white">检测统计</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">今日检测</span>
              <span className="text-sm font-medium">12,847笔</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">告警触发</span>
              <span className="text-sm font-medium text-orange-600">23个</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">拦截成功</span>
              <span className="text-sm font-medium text-green-600">21个</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h4 className="font-medium text-slate-900 dark:text-white">数据质量</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">数据完整性</span>
              <span className="text-sm font-medium text-green-600">99.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">实时性</span>
                <span className="text-sm font-medium text-green-600">&lt; 2秒</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">准确性</span>
              <span className="text-sm font-medium text-green-600">97.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
