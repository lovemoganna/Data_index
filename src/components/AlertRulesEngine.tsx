import React, { useState, useEffect } from 'react';
import { Category, Indicator } from '../types';
import RiskScoringEngine, { RiskScore } from '../services/riskEngine';
import {
  Bell, Plus, Trash2, Edit3, Save, X, TestTube,
  Mail, MessageSquare, Smartphone, Webhook,
  Clock, AlertTriangle, CheckCircle, Zap,
  Settings, Filter, Send
} from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: AlertCondition[];
  actions: AlertAction[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  cooldownMinutes: number;
  lastTriggered?: Date;
  triggerCount: number;
}

interface AlertCondition {
  id: string;
  type: 'risk_score' | 'indicator_value' | 'category_score' | 'trend_change';
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
  value: number;
  target?: string; // 指标ID或类别ID
}

interface AlertAction {
  id: string;
  type: 'email' | 'webhook' | 'sms' | 'slack' | 'internal_alert';
  config: Record<string, any>;
  enabled: boolean;
}

interface AlertRulesEngineProps {
  data: Category[];
  riskScore: RiskScore;
}

export function AlertRulesEngine({ data, riskScore }: AlertRulesEngineProps) {
  // 默认规则配置
  const getDefaultRules = (): AlertRule[] => [
    {
      id: 'high_risk_alert',
      name: '高风险告警',
      description: '当综合风险评分超过70时触发告警',
      enabled: true,
      conditions: [{
        id: 'high_risk_condition',
        type: 'risk_score',
        operator: 'gte',
        value: 70
      }],
      actions: [{
        id: 'internal_alert_action',
        type: 'internal_alert',
        config: {
          title: '高风险告警',
          message: '系统检测到高风险情况，请立即处理！',
          severity: 'high'
        },
        enabled: true
      }],
      priority: 'high',
      cooldownMinutes: 30,
      triggerCount: 0
    },
    {
      id: 'critical_risk_alert',
      name: '紧急风险告警',
      description: '当综合风险评分超过90时触发紧急告警',
      enabled: true,
      conditions: [{
        id: 'critical_risk_condition',
        type: 'risk_score',
        operator: 'gte',
        value: 90
      }],
      actions: [
        {
          id: 'internal_alert_critical',
          type: 'internal_alert',
          config: {
            title: '🚨 紧急风险告警',
            message: '系统检测到紧急风险情况，立即启动应急响应！',
            severity: 'critical'
          },
          enabled: true
        },
        {
          id: 'email_alert',
          type: 'email',
          config: {
            to: 'security@company.com',
            subject: '紧急风险告警 - MECE系统',
            message: '系统检测到紧急风险情况，请立即处理！'
          },
          enabled: false // 默认关闭，需要配置
        }
      ],
      priority: 'critical',
      cooldownMinutes: 15,
      triggerCount: 0
    }
  ];

  const [rules, setRules] = useState<AlertRule[]>(() => {
    const saved = localStorage.getItem('alert_rules');
    return saved ? JSON.parse(saved) : getDefaultRules();
  });

  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  // 保存规则到本地存储
  useEffect(() => {
    localStorage.setItem('alert_rules', JSON.stringify(rules));
  }, [rules]);

  // 检查规则并执行告警
  useEffect(() => {
    rules.forEach(rule => {
      if (!rule.enabled) return;

      // 检查冷却时间
      if (rule.lastTriggered) {
        const cooldownMs = rule.cooldownMinutes * 60 * 1000;
        if (Date.now() - rule.lastTriggered.getTime() < cooldownMs) {
          return;
        }
      }

      // 检查条件
      if (evaluateConditions(rule.conditions, riskScore, data)) {
        executeActions(rule.actions);
        updateRuleTrigger(rule.id);
      }
    });
  }, [riskScore, data, rules]);

  const evaluateConditions = (conditions: AlertCondition[], riskScore: RiskScore, data: Category[]): boolean => {
    return conditions.every(condition => {
      switch (condition.type) {
        case 'risk_score':
          return compareValues(riskScore.totalScore, condition.operator, condition.value);

        case 'category_score':
          const categoryScore = riskScore.categoryScores[condition.target || ''];
          return categoryScore !== undefined && compareValues(categoryScore, condition.operator, condition.value);

        case 'indicator_value':
          const indicatorScore = riskScore.indicatorScores[condition.target || ''];
          return indicatorScore !== undefined && compareValues(indicatorScore, condition.operator, condition.value);

        case 'trend_change':
          // 简化的趋势检测，这里可以扩展为更复杂的趋势分析
          return Math.abs(riskScore.totalScore - condition.value) > 5;

        default:
          return false;
      }
    });
  };

  const compareValues = (actual: number, operator: string, threshold: number): boolean => {
    switch (operator) {
      case 'gt': return actual > threshold;
      case 'gte': return actual >= threshold;
      case 'lt': return actual < threshold;
      case 'lte': return actual <= threshold;
      case 'eq': return actual === threshold;
      case 'neq': return actual !== threshold;
      default: return false;
    }
  };

  const executeActions = async (actions: AlertAction[]) => {
    for (const action of actions) {
      if (!action.enabled) continue;

      try {
        switch (action.type) {
          case 'email':
            await sendEmail(action.config);
            break;
          case 'webhook':
            await sendWebhook(action.config);
            break;
          case 'sms':
            await sendSMS(action.config);
            break;
          case 'slack':
            await sendSlackMessage(action.config);
            break;
          case 'internal_alert':
            showInternalAlert(action.config);
            break;
        }
      } catch (error) {
        console.error(`执行告警动作失败: ${action.type}`, error);
      }
    }
  };

  const sendEmail = async (config: any) => {
    // 这里应该调用实际的邮件发送API
    console.log('发送邮件告警:', config);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const sendWebhook = async (config: any) => {
    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify({
          alert: config.message,
          riskScore: riskScore.totalScore,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Webhook调用失败');
    } catch (error) {
      console.error('Webhook发送失败:', error);
      throw error;
    }
  };

  const sendSMS = async (config: any) => {
    // 这里应该调用实际的短信发送API
    console.log('发送短信告警:', config);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const sendSlackMessage = async (config: any) => {
    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: config.message,
          attachments: [{
            color: riskScore.riskLevel === 'critical' ? 'danger' :
                   riskScore.riskLevel === 'high' ? 'warning' : 'good',
            fields: [
              { title: '风险评分', value: riskScore.totalScore.toString(), short: true },
              { title: '风险等级', value: riskScore.riskLevel, short: true }
            ]
          }]
        })
      });
      if (!response.ok) throw new Error('Slack消息发送失败');
    } catch (error) {
      console.error('Slack消息发送失败:', error);
      throw error;
    }
  };

  const showInternalAlert = (config: any) => {
    // 显示内部系统告警
    const alert = {
      id: Date.now().toString(),
      type: 'internal',
      title: config.title || '风险告警',
      message: config.message,
      severity: config.severity || 'medium',
      timestamp: new Date()
    };

    // 这里可以触发全局的告警状态管理
    console.log('内部告警:', alert);
  };

  const updateRuleTrigger = (ruleId: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId
        ? { ...rule, lastTriggered: new Date(), triggerCount: rule.triggerCount + 1 }
        : rule
    ));
  };

  const testRule = async (rule: AlertRule) => {
    const result = evaluateConditions(rule.conditions, riskScore, data);
    setTestResults(prev => ({ ...prev, [rule.id]: result }));

    // 3秒后清除测试结果
    setTimeout(() => {
      setTestResults(prev => {
        const newResults = { ...prev };
        delete newResults[rule.id];
        return newResults;
      });
    }, 3000);
  };

  const RuleCard = ({ rule }: { rule: Rule }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            rule.enabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {rule.enabled ? (
              <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Bell className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{rule.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{rule.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            rule.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
            rule.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
            rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
          }`}>
            {rule.priority === 'critical' ? '紧急' :
             rule.priority === 'high' ? '高' :
             rule.priority === 'medium' ? '中' : '低'}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">触发条件：</span>
          <span className="text-slate-600 dark:text-slate-400">
            {rule.conditions.map(condition => {
              const targetText = condition.target ?
                (data.find(c => c.id === condition.target)?.name || condition.target) : '综合评分';
              return `${targetText} ${condition.operator === 'gte' ? '≥' : condition.operator === 'gt' ? '>' :
                     condition.operator === 'lte' ? '≤' : condition.operator === 'lt' ? '<' :
                     condition.operator === 'eq' ? '=' : '≠'} ${condition.value}`;
            }).join(' 且 ')}
          </span>
        </div>

        <div className="text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">告警动作：</span>
          <span className="text-slate-600 dark:text-slate-400">
            {rule.actions.filter(a => a.enabled).map(action =>
              action.type === 'email' ? '邮件' :
              action.type === 'webhook' ? 'Webhook' :
              action.type === 'sms' ? '短信' :
              action.type === 'slack' ? 'Slack' : '内部告警'
            ).join('、')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              冷却: {rule.cooldownMinutes}分钟
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Zap className="w-4 h-4" />
              触发: {rule.triggerCount}次
            </span>
          </div>
          {rule.lastTriggered && (
            <span className="text-xs text-slate-500 dark:text-slate-500">
              最后触发: {rule.lastTriggered.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRules(prev => prev.map(r =>
              r.id === rule.id ? { ...r, enabled: !r.enabled } : r
            ))}
            className={`px-3 py-1 rounded text-sm font-medium ${
              rule.enabled
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {rule.enabled ? '启用' : '禁用'}
          </button>

          <button
            onClick={() => testRule(rule)}
            className="flex items-center gap-1 px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            <TestTube className="w-4 h-4" />
            测试
          </button>

          {testResults[rule.id] !== undefined && (
            <span className={`flex items-center gap-1 text-sm font-medium ${
              testResults[rule.id]
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {testResults[rule.id] ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  会触发
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  不会触发
                </>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingRule(rule)}
            className="p-2 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
            title="编辑规则"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))}
            className="p-2 text-red-500 hover:text-red-600"
            title="删除规则"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 头部工具栏 */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">告警规则引擎</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">自定义告警规则和通知机制</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              活跃规则: {rules.filter(r => r.enabled).length} / {rules.length}
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <Plus className="w-4 h-4" />
              新建规则
            </button>
          </div>
        </div>

        {/* 当前状态概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {rules.filter(r => r.enabled).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">活跃规则</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {rules.reduce((sum, r) => sum + r.triggerCount, 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">总触发次数</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {rules.filter(r => r.lastTriggered).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">已触发规则</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {rules.filter(r => r.enabled && !r.lastTriggered).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">待触发规则</div>
          </div>
        </div>
      </div>

      {/* 规则列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rules.map(rule => (
          <RuleCard key={rule.id} rule={rule} />
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">暂无告警规则</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">创建告警规则来监控风险指标变化</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            创建第一个规则
          </button>
        </div>
      )}

      {/* 创建/编辑规则模态框 */}
      {(showCreateForm || editingRule) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingRule ? '编辑告警规则' : '创建告警规则'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingRule(null);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <RuleForm
                rule={editingRule}
                data={data}
                onSave={(ruleData) => {
                  if (editingRule) {
                    // 编辑现有规则
                    setRules(prev => prev.map(r => r.id === editingRule.id ? ruleData : r));
                  } else {
                    // 创建新规则
                    setRules(prev => [...prev, ruleData]);
                  }
                  setShowCreateForm(false);
                  setEditingRule(null);
                }}
                onCancel={() => {
                  setShowCreateForm(false);
                  setEditingRule(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 规则创建/编辑表单组件
interface RuleFormProps {
  rule: AlertRule | null;
  data: Category[];
  onSave: (rule: AlertRule) => void;
  onCancel: () => void;
}

function RuleForm({ rule, data, onSave, onCancel }: RuleFormProps) {
  const [formData, setFormData] = useState<Partial<AlertRule>>(rule || {
    name: '',
    description: '',
    enabled: true,
    conditions: [{ id: 'cond_1', type: 'risk_score', operator: 'gte', value: 70 }],
    actions: [{ id: 'action_1', type: 'internal_alert', config: { title: '风险告警', message: '检测到高风险情况' }, enabled: true }],
    priority: 'medium',
    cooldownMinutes: 30,
    triggerCount: 0
  });

  const addCondition = () => {
    const newCondition: AlertCondition = {
      id: `cond_${Date.now()}`,
      type: 'risk_score',
      operator: 'gte',
      value: 50
    };
    setFormData(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), newCondition]
    }));
  };

  const updateCondition = (index: number, updates: Partial<AlertCondition>) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.map((cond, i) =>
        i === index ? { ...cond, ...updates } : cond
      )
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index)
    }));
  };

  const addAction = () => {
    const newAction: AlertAction = {
      id: `action_${Date.now()}`,
      type: 'internal_alert',
      config: { title: '风险告警', message: '检测到风险情况' },
      enabled: true
    };
    setFormData(prev => ({
      ...prev,
      actions: [...(prev.actions || []), newAction]
    }));
  };

  const updateAction = (index: number, updates: Partial<AlertAction>) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions?.map((action, i) =>
        i === index ? { ...action, ...updates } : action
      )
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    const ruleData: AlertRule = {
      id: rule?.id || `rule_${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      enabled: formData.enabled || false,
      conditions: formData.conditions || [],
      actions: formData.actions || [],
      priority: formData.priority || 'medium',
      cooldownMinutes: formData.cooldownMinutes || 30,
      triggerCount: rule?.triggerCount || 0,
      lastTriggered: rule?.lastTriggered
    };

    onSave(ruleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            规则名称 *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            placeholder="输入规则名称"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            优先级
          </label>
          <select
            value={formData.priority || 'medium'}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as AlertRule['priority'] }))}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
            <option value="critical">紧急</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          规则描述 *
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          placeholder="描述此规则的触发条件和作用"
          rows={3}
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.enabled || false}
            onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">启用规则</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            冷却时间（分钟）
          </label>
          <input
            type="number"
            value={formData.cooldownMinutes || 30}
            onChange={(e) => setFormData(prev => ({ ...prev, cooldownMinutes: parseInt(e.target.value) }))}
            className="w-20 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            min="1"
            max="1440"
          />
        </div>
      </div>

      {/* 触发条件 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">触发条件</h4>
          <button
            type="button"
            onClick={addCondition}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
          >
            <Plus size={14} />
            添加条件
          </button>
        </div>

        <div className="space-y-3">
          {formData.conditions?.map((condition, index) => (
            <div key={condition.id} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <select
                value={condition.type}
                onChange={(e) => updateCondition(index, { type: e.target.value as AlertCondition['type'] })}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
              >
                <option value="risk_score">综合风险评分</option>
                <option value="category_score">类别风险评分</option>
                <option value="indicator_value">指标风险评分</option>
                <option value="trend_change">趋势变化</option>
              </select>

              <select
                value={condition.operator}
                onChange={(e) => updateCondition(index, { operator: e.target.value as AlertCondition['operator'] })}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
              >
                <option value="gt">大于 (&gt;)</option>
                <option value="gte">大于等于 (≥)</option>
                <option value="lt">小于 (&lt;)</option>
                <option value="lte">小于等于 (≤)</option>
                <option value="eq">等于 (=)</option>
                <option value="neq">不等于 (≠)</option>
              </select>

              <input
                type="number"
                value={condition.value}
                onChange={(e) => updateCondition(index, { value: parseFloat(e.target.value) })}
                className="w-24 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                step="0.1"
              />

              {(condition.type === 'category_score' || condition.type === 'indicator_value') && (
                <select
                  value={condition.target || ''}
                  onChange={(e) => updateCondition(index, { target: e.target.value })}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                >
                  <option value="">选择目标...</option>
                  {condition.type === 'category_score' && data.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  {condition.type === 'indicator_value' && data.flatMap(cat =>
                    cat.subcategories.flatMap(sub => sub.indicators)
                  ).map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 执行动作 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">执行动作</h4>
          <button
            type="button"
            onClick={addAction}
            className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
          >
            <Plus size={14} />
            添加动作
          </button>
        </div>

        <div className="space-y-3">
          {formData.actions?.map((action, index) => (
            <div key={action.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <select
                  value={action.type}
                  onChange={(e) => updateAction(index, { type: e.target.value as AlertAction['type'] })}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                >
                  <option value="internal_alert">内部告警</option>
                  <option value="email">邮件通知</option>
                  <option value="webhook">Webhook</option>
                  <option value="sms">短信通知</option>
                  <option value="slack">Slack消息</option>
                </select>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={action.enabled}
                    onChange={(e) => updateAction(index, { enabled: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">启用</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeAction(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg ml-auto"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* 动作配置 */}
              <div className="space-y-2">
                {action.type === 'internal_alert' && (
                  <>
                    <input
                      type="text"
                      placeholder="告警标题"
                      value={action.config.title || ''}
                      onChange={(e) => updateAction(index, {
                        config: { ...action.config, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    <textarea
                      placeholder="告警消息内容"
                      value={action.config.message || ''}
                      onChange={(e) => updateAction(index, {
                        config: { ...action.config, message: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                      rows={2}
                    />
                  </>
                )}

                {action.type === 'email' && (
                  <>
                    <input
                      type="email"
                      placeholder="收件人邮箱"
                      value={action.config.to || ''}
                      onChange={(e) => updateAction(index, {
                        config: { ...action.config, to: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="邮件主题"
                      value={action.config.subject || ''}
                      onChange={(e) => updateAction(index, {
                        config: { ...action.config, subject: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                    />
                  </>
                )}

                {action.type === 'webhook' && (
                  <>
                    <input
                      type="url"
                      placeholder="Webhook URL"
                      value={action.config.url || ''}
                      onChange={(e) => updateAction(index, {
                        config: { ...action.config, url: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="消息内容"
                      value={action.config.message || ''}
                      onChange={(e) => updateAction(index, {
                        config: { ...action.config, message: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                    />
                  </>
                )}

                {action.type === 'slack' && (
                  <>
                    <input
                      type="url"
                      placeholder="Slack Webhook URL"
                      value={action.config.webhookUrl || ''}
                      onChange={(e) => updateAction(index, {
                        config: { ...action.config, webhookUrl: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    <textarea
                      placeholder="Slack消息内容"
                      value={action.config.message || ''}
                      onChange={(e) => updateAction(index, {
                        config: { ...action.config, message: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm"
                      rows={2}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {rule ? '更新规则' : '创建规则'}
        </button>
      </div>
    </form>
  );
}
