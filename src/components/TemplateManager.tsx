import React, { useState, useMemo } from 'react';
import { Indicator } from '../types';
import {
  LayoutTemplate, Plus, Star, Copy, Download,
  Upload, Trash2, Edit3, Save, X, Search,
  Tag, Clock, User, FileText
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  indicators: Indicator[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  usageCount: number;
}

interface TemplateManagerProps {
  onApplyTemplate: (indicators: Indicator[]) => void;
  currentIndicators: Indicator[];
}

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: 'basic-account',
    name: '基础账号风险监控',
    description: '涵盖账号生命周期和基础风险识别的核心指标模板',
    category: '账号风险',
    tags: ['基础', '账号', '必备'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    isFavorite: true,
    usageCount: 45,
    indicators: [
      {
        id: 'A1-01',
        name: '注册存续天数',
        definition: '账号从注册到当前的时间长度',
        purpose: '识别新号闪击交易风险',
        formula: '今日日期 - 注册日期',
        threshold: '小于 3 天',
        calculationCase: '1号注册，2号交易，结果1天',
        riskInterpretation: '黑产号通常存活期极短，快速操作后即废弃',
        priority: 'P0',
        status: 'active'
      },
      {
        id: 'A1-04',
        name: '密码重置频次',
        definition: '短时间内密码重设并立即尝试大额提现',
        purpose: '识别账号劫持后的资金洗劫',
        formula: '提现时间 - 重置时间',
        threshold: '小于 1 小时',
        calculationCase: '改密码 5 分钟后申请全额提现',
        riskInterpretation: '极高概率为盗号洗劫',
        priority: 'P0',
        status: 'active'
      }
    ]
  },
  {
    id: 'comprehensive-funds',
    name: '全面资金流监控',
    description: '完整的资金流入流出监控体系，覆盖各类洗钱场景',
    category: '资金风险',
    tags: ['全面', '资金', '洗钱'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    isFavorite: false,
    usageCount: 32,
    indicators: [
      {
        id: 'B1-01',
        name: '黑地址关联深度',
        definition: '充值来源与涉案地址的最短距离',
        purpose: '防范涉案资金流入平台',
        formula: '跳数 (Depth)',
        threshold: '小于等于 2 层',
        calculationCase: '资金是从黑客地址转了两手过来的',
        riskInterpretation: '反洗钱红线，必须立即拦截并冻结',
        priority: 'P0',
        status: 'active'
      },
      {
        id: 'B1-04',
        name: '充提平衡率',
        definition: '资产充入与提走的差值比例',
        purpose: '识别洗钱中转（即充即提）',
        formula: '提现金额 / 充值金额',
        threshold: '大于 98%',
        calculationCase: '充了1万，10分钟后提走9900',
        riskInterpretation: '平台被当成了洗钱的免损耗工具',
        priority: 'P0',
        status: 'active'
      }
    ]
  },
  {
    id: 'market-manipulation',
    name: '市场操纵检测套件',
    description: '专门针对各类市场操纵行为的检测指标集合',
    category: '交易风险',
    tags: ['市场操纵', '高级', '专业'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    isFavorite: true,
    usageCount: 28,
    indicators: [
      {
        id: 'C3-01',
        name: 'HFT特征识别',
        definition: '高频交易的特征模式识别',
        purpose: '检测自动化高频交易行为',
        formula: '交易频率分析 + 订单簿模式识别',
        threshold: '频率 > 100次/秒',
        calculationCase: '单账户5秒内完成1000笔交易',
        riskInterpretation: '可能存在自动化交易脚本或HFT策略',
        priority: 'P1',
        status: 'active'
      },
      {
        id: 'D1-02',
        name: '价格操纵指数',
        definition: '单账户对市场价格的影响程度',
        purpose: '量化单一账户的市场影响力',
        formula: '账户交易额 / 市场总交易额',
        threshold: '大于 15%',
        calculationCase: '单账户交易额占市场总量的20%',
        riskInterpretation: '存在市场操纵风险，需要重点监控',
        priority: 'P0',
        status: 'active'
      }
    ]
  }
];

export function TemplateManager({ onApplyTemplate, currentIndicators }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>(SAMPLE_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchTerm]);

  const handleApplyTemplate = (template: Template) => {
    onApplyTemplate(template.indicators);

    // 更新使用次数
    setTemplates(prev => prev.map(t =>
      t.id === template.id
        ? { ...t, usageCount: t.usageCount + 1 }
        : t
    ));
  };

  const handleToggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(t =>
      t.id === templateId
        ? { ...t, isFavorite: !t.isFavorite }
        : t
    ));
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('确定要删除这个模板吗？此操作无法撤销。')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (副本)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleExportTemplate = (template: Template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const TemplateCard = ({ template }: { template: Template }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <LayoutTemplate className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{template.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{template.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleFavorite(template.id)}
            className={`p-1 rounded transition-colors ${
              template.isFavorite
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
        {template.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {template.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {template.indicators.length}指标
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            使用{template.usageCount}次
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {template.updatedAt.toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleApplyTemplate(template)}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          应用模板
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => handleDuplicateTemplate(template)}
            className="p-2 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            title="复制模板"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleExportTemplate(template)}
            className="p-2 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            title="导出模板"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditingTemplate(template)}
            className="p-2 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            title="编辑模板"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteTemplate(template.id)}
            className="p-2 text-red-500 hover:text-red-600 transition-colors"
            title="删除模板"
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
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <LayoutTemplate className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">指标模板库</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">预置的指标模板，快速搭建监控体系</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              创建模板
            </button>
            <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <Upload className="w-4 h-4" />
              导入模板
            </button>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索模板名称、描述或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部分类</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <LayoutTemplate className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">未找到匹配的模板</h3>
          <p className="text-slate-600 dark:text-slate-400">尝试调整搜索条件或创建新的模板</p>
        </div>
      )}

      {/* 创建/编辑模板模态框 */}
      {(showCreateForm || editingTemplate) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingTemplate ? '编辑模板' : '创建新模板'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTemplate(null);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  模板名称
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  placeholder="输入模板名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  分类
                </label>
                <select className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                  <option>账号风险</option>
                  <option>资金风险</option>
                  <option>交易风险</option>
                  <option>市场风险</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  描述
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  rows={3}
                  placeholder="描述这个模板的作用和适用场景"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  标签
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  placeholder="用逗号分隔多个标签"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  取消
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  {editingTemplate ? '保存修改' : '创建模板'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
