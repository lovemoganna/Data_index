import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  BookOpen, Target, Shield, Activity, Layers, AlertTriangle, BarChart3,
  Database, Users, Zap, ChevronRight, Play, CheckCircle, Star,
  Code, Lightbulb, TrendingUp, Eye, Cpu, FileText, Video,
  GraduationCap, Award, Clock, ArrowRight
} from 'lucide-react';

export const TutorialView: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);

  const markCompleted = (tutorialId: string) => {
    if (!completedTutorials.includes(tutorialId)) {
      setCompletedTutorials([...completedTutorials, tutorialId]);
    }
  };

  const tutorialContent = {
    overview: {
      title: '平台概览',
      icon: BookOpen,
      estimatedTime: '5分钟',
      difficulty: '入门',
      content: `
# MECE 风险本体生产力平台

## 🎯 核心价值主张

**构建金融风险监控的标准化、可量化、可扩展的指标体系**

### 三大核心特性

#### 1. **科学性** 📊
基于金融风险管理理论，建立量化指标体系
- 遵循MECE原则（互斥且完全穷尽）
- 本体论方法确保概念清晰和推理严谨
- 量化指标支持数据驱动决策

#### 2. **系统性** 🔄
从四个维度全面覆盖金融风险监控
- **账号与身份维度**：监控账户静态特征和信誉评分
- **资产与资金维度**：监控资金来源纯净度和异常流转
- **交易行为维度**：监控交易逻辑和市场操纵行为
- **市场冲击维度**：监控单笔交易对整体市场的宏观影响

#### 3. **实用性** ⚡
每个指标都有明确的业务价值
- **计算公式**：明确的量化算法
- **阈值设定**：基于历史数据的最佳实践
- **风险解读**：具体的业务场景和应对策略

### 技术架构优势

#### 前端技术栈
- **React 19** + TypeScript：现代化前端框架
- **Tailwind CSS**：原子化CSS设计系统
- **Recharts**：专业数据可视化库
- **IndexedDB**：高性能本地数据存储

#### 数据架构
- **MECE原则**：确保指标体系的完整性和无冗余
- **本体设计**：支持复杂的关系推理和知识图谱构建
- **优先级分层**：P0/P1/P2三级响应机制

### 快速开始指南

#### 第一步：熟悉界面
\`\`\`typescript
// 主要功能区域
const features = [
  'monitor'    // 生产看板 - 核心指标监控
  'manage'     // 体系管理 - 指标配置和维护
  'analytics'  // 数据分析 - 专业可视化面板
  'tutorial'   // 学习中心 - 知识库和教程
];
\`\`\`

#### 第二步：导入示例数据
1. 点击"体系管理"标签
2. 点击"导入体系"按钮
3. 选择预置的示例数据文件
4. 观察系统自动构建完整的指标体系

#### 第三步：探索分析功能
1. 切换到"数据分析"标签
2. 查看各类图表和统计信息
3. 尝试不同的视图模式（概览、趋势、分布、相关性）

### 学习路径建议

\`\`\`mermaid
graph LR
    A[新手入门] --> B[理解MECE原则]
    B --> C[掌握指标体系]
    C --> D[数据分析技能]
    D --> E[高级配置]

    A --> F[界面熟悉]
    F --> G[基础操作]
    G --> H[进阶使用]
    H --> I[自定义扩展]
\`\`\`
      `
    },

    methodology: {
      title: 'MECE方法论',
      icon: Target,
      estimatedTime: '10分钟',
      difficulty: '进阶',
      content: `
# MECE 原则与本体设计方法论

## 🎯 MECE 原则详解

### 什么是MECE？
**MECE** = **Mutually Exclusive, Collectively Exhaustive**
- **Mutually Exclusive**：各部分互不重叠
- **Collectively Exhaustive**：完全覆盖，不遗漏

### 在风险监控中的应用

#### 四维分解架构
\`\`\`mermaid
graph TD
    A[金融风险监控] --> B[账号与身份维度]
    A --> C[资产与资金维度]
    A --> D[交易行为维度]
    A --> E[市场冲击维度]

    B --> B1[账户成熟度]
    B --> B2[环境指纹]
    B1 --> B11[注册存续天数]
    B1 --> B12[首提时间差]

    C --> C1[入金异常]
    C --> C2[出金异常]
    D --> D1[交易逻辑]
    D --> D2[价格操纵]
    E --> E1[市场深度]
    E --> E2[波动影响]
\`\`\`

#### 优先级体系设计
\`\`\`typescript
enum Priority {
  P0 = '紧急',    // 立即响应，系统级风险
  P1 = '重要',    // 重点关注，需要专项处理
  P2 = '普通'     // 常规监控，流程化处理
}

// 响应策略
const responseStrategy = {
  [Priority.P0]: {
    responseTime: '< 5分钟',
    action: '立即冻结',
    escalation: '高级别告警'
  },
  [Priority.P1]: {
    responseTime: '< 1小时',
    action: '人工审核',
    escalation: '专项处理'
  },
  [Priority.P2]: {
    responseTime: '< 24小时',
    action: '自动处理',
    escalation: '定期审查'
  }
};
\`\`\`

## 🧠 本体设计原则

### 本体论基础
- **概念定义**：明确的业务含义和边界
- **关系建模**：指标间的因果关系和依赖关系
- **推理机制**：基于规则的风险判断逻辑

### 指标体系设计原则

#### 量化可测原则
\`\`\`typescript
interface Indicator {
  id: string;              // 唯一标识符
  name: string;           // 指标名称
  definition: string;     // 业务定义
  purpose: string;        // 业务价值
  formula: string;        // 计算公式
  threshold: string;      // 风险阈值
  calculationCase: string; // 计算案例
  riskInterpretation: string; // 风险解读
  priority: Priority;     // 优先级
  status: 'active' | 'inactive'; // 状态
}

// 示例指标定义
const accountAgeIndicator: Indicator = {
  id: 'A1-01',
  name: '注册存续天数',
  definition: '账号从注册到当前的时间长度',
  purpose: '识别新号闪击交易风险',
  formula: '今日日期 - 注册日期',
  threshold: '小于 3 天',
  calculationCase: '1号注册，2号交易，结果1天',
  riskInterpretation: '黑产号通常存活期极短，快速操作后即废弃',
  priority: Priority.P0,
  status: 'active'
};
\`\`\`

#### 设计验证流程
\`\`\`typescript
class IndicatorValidator {
  // 1. 完整性验证
  validateCompleteness(indicator: Indicator): boolean {
    return !!(
      indicator.name &&
      indicator.definition &&
      indicator.formula &&
      indicator.threshold
    );
  }

  // 2. 无歧义性验证
  validateClarity(indicator: Indicator): boolean {
    // 检查定义是否清晰，无模糊概念
    return !this.containsAmbiguousTerms(indicator.definition);
  }

  // 3. 可操作性验证
  validateActionability(indicator: Indicator): boolean {
    // 检查是否能实际计算和监控
    return this.isCalculable(indicator.formula);
  }

  // 4. 价值验证
  validateValue(indicator: Indicator): boolean {
    // 检查是否有明确的业务价值和风险解读
    return !!(
      indicator.purpose &&
      indicator.riskInterpretation &&
      indicator.calculationCase
    );
  }
}
\`\`\`

### 体系扩展方法

#### 横向扩展
\`\`\`typescript
// 在现有维度下添加新的子类别
const extendSubcategory = (categoryId: string, newSubcategory: SubCategory) => {
  // 确保不与现有子类别重叠
  // 验证新子类别的完整性
  // 更新指标体系
};

// 示例：为交易行为维度添加新子类
const algorithmicTradingCategory: SubCategory = {
  id: 'C3',
  name: '算法交易检测',
  indicators: [
    {
      id: 'C3-01',
      name: 'HFT特征识别',
      definition: '高频交易的特征模式识别',
      // ... 其他属性
    }
  ]
};
\`\`\`

#### 纵向深化
\`\`\`typescript
// 为现有指标添加更细粒度的子指标
const deepenIndicator = (indicatorId: string, subIndicators: Indicator[]) => {
  // 创建父子关系
  // 建立权重体系
  // 实现复合计算
};
\`\`\`

### 质量保证体系

#### 评审流程
1. **业务评审**：确保指标对业务有价值
2. **技术评审**：确保指标可计算和监控
3. **测试验证**：通过历史数据验证有效性
4. **上线部署**：分批次逐步上线新指标

#### 持续优化
\`\`\`sql
-- 指标效果评估
SELECT
  indicator_id,
  COUNT(*) as trigger_count,
  AVG(response_time) as avg_response_time,
  SUM(loss_prevented) as total_loss_prevented,
  COUNT(CASE WHEN is_false_positive THEN 1 END) as false_positives
FROM risk_alerts
WHERE created_at >= '2024-01-01'
GROUP BY indicator_id
ORDER BY total_loss_prevented DESC;
\`\`\`
      `
    },

    bestPractices: {
      title: '最佳实践指南',
      icon: Star,
      estimatedTime: '15分钟',
      difficulty: '专家',
      content: `
# 风险监控最佳实践指南

## 📋 实施流程

### 1. 需求调研阶段
\`\`\`bash
# 识别核心业务场景
业务场景分析:
├── 用户注册和认证流程
├── 资金充值和提现流程
├── 交易执行和撮合流程
├── 市场波动和异常检测
├── 客户服务和投诉处理
└── 监管合规和报告要求
\`\`\`

### 2. 指标设计阶段
\`\`\`typescript
// 指标设计模板
interface IndicatorDesign {
  businessContext: string;    // 业务背景
  riskHypothesis: string;     // 风险假设
  dataSources: string[];      // 数据来源
  calculationLogic: string;   // 计算逻辑
  validationMethod: string;   // 验证方法
  successMetrics: string[];   // 成功指标
}

// 示例：设计洗钱检测指标
const moneyLaunderingIndicator: IndicatorDesign = {
  businessContext: '平台存在被利用进行洗钱活动的风险',
  riskHypothesis: '异常的资金流转模式表明洗钱行为',
  dataSources: [
    '用户交易记录',
    '资金流水日志',
    'IP地址信息',
    '设备指纹数据'
  ],
  calculationLogic: \`
    多维度综合评分:
    1. 资金流转复杂度 (权重30%)
    2. 时间模式异常度 (权重25%)
    3. 金额分布特征 (权重25%)
    4. 关联网络密度 (权重20%)
  \`,
  validationMethod: '历史案例回溯验证 + A/B测试',
  successMetrics: [
    '检出率 > 95%',
    '误报率 < 5%',
    '响应时间 < 10分钟'
  ]
};
\`\`\`

### 3. 阈值调优阶段
\`\`\`sql
-- A/B测试不同阈值效果
WITH threshold_tests AS (
  SELECT
    threshold_value,
    COUNT(*) as total_cases,
    COUNT(CASE WHEN is_true_positive THEN 1 END) as true_positives,
    COUNT(CASE WHEN is_false_positive THEN 1 END) as false_positives,
    AVG(response_time_minutes) as avg_response_time
  FROM risk_test_cases
  WHERE test_period = '2024-Q1'
  GROUP BY threshold_value
)
SELECT
  threshold_value,
  total_cases,
  true_positives,
  false_positives,
  ROUND(true_positives::decimal / NULLIF(total_cases, 0) * 100, 2) as detection_rate,
  ROUND(false_positives::decimal / NULLIF(total_cases, 0) * 100, 2) as false_positive_rate,
  avg_response_time
FROM threshold_tests
ORDER BY detection_rate DESC, false_positive_rate ASC;
\`\`\`

### 4. 响应流程设计
\`\`\`mermaid
flowchart TD
    A[风险告警触发] --> B{优先级评估}
    B -->|P0: 紧急| C[立即响应流程]
    B -->|P1: 重要| D[专项处理流程]
    B -->|P2: 普通| E[常规处理流程]

    C --> C1[自动冻结账户/资金]
    C --> C2[触发高级别告警]
    C --> C3[通知安全团队]

    D --> D1[人工审核任务分配]
    D --> D2[专项调查启动]
    D --> D3[业务部门协同处理]

    E --> E1[自动记录日志]
    E --> E2[定期批量处理]
    E --> E3[生成统计报告]

    C1 --> F[结果记录与反馈]
    D1 --> F
    E1 --> F

    F --> G{需要调整阈值?}
    G -->|是| H[阈值优化]
    G -->|否| I[流程结束]

    H --> J[新阈值测试验证]
    J --> K[正式上线]
    K --> L[监控效果]
    L --> G
\`\`\`

## 🛠️ 工具使用指南

### 数据导入导出
\`\`\`typescript
// 批量导入指标体系
import { dataService } from './services/dataService';

const importIndicators = async (jsonData: string) => {
  try {
    const imported = await dataService.validateAndImport(jsonData, 'indicators.json');
    console.log(\`✅ 成功导入 \${imported.length} 个维度\`);

    // 验证导入完整性
    const validation = await validateImportedData(imported);
    if (!validation.isValid) {
      console.warn('⚠️ 导入数据存在问题:', validation.issues);
    }

    return imported;
  } catch (error) {
    console.error('❌ 导入失败:', error);
    throw error;
  }
};

// 数据验证函数
const validateImportedData = (data: Category[]) => {
  const issues: string[] = [];

  data.forEach((category, catIndex) => {
    // 检查分类完整性
    if (!category.id || !category.name) {
      issues.push(\`分类 \${catIndex + 1} 缺少必要字段\`);
    }

    category.subcategories.forEach((sub, subIndex) => {
      // 检查子类完整性
      if (!sub.id || !sub.name) {
        issues.push(\`子类 \${category.id}-\${subIndex + 1} 缺少必要字段\`);
      }

      sub.indicators.forEach((ind, indIndex) => {
        // 检查指标完整性
        if (!ind.id || !ind.name || !ind.formula) {
          issues.push(\`指标 \${sub.id}-\${indIndex + 1} 缺少必要字段\`);
        }
      });
    });
  });

  return {
    isValid: issues.length === 0,
    issues
  };
};
\`\`\`

### 自定义指标创建
\`\`\`typescript
// 指标创建向导
class IndicatorWizard {
  private steps = ['basic', 'calculation', 'threshold', 'validation'];

  async createIndicator(): Promise<Indicator> {
    const indicator: Partial<Indicator> = {};

    // 步骤1: 基本信息
    indicator.id = await this.generateUniqueId();
    indicator.name = await this.promptUser('指标名称');
    indicator.definition = await this.promptUser('业务定义');

    // 步骤2: 计算逻辑
    indicator.formula = await this.designFormula();
    indicator.calculationCase = await this.createCalculationCase();

    // 步骤3: 阈值设定
    indicator.threshold = await this.setThreshold();
    indicator.priority = await this.determinePriority();

    // 步骤4: 验证测试
    await this.validateIndicator(indicator as Indicator);

    return indicator as Indicator;
  }

  private async designFormula(): Promise<string> {
    const formula = await this.promptUser('计算公式');

    // 验证公式语法
    if (!this.validateFormula(formula)) {
      throw new Error('公式语法错误，请检查');
    }

    // 测试计算示例
    const testResult = await this.testFormula(formula);
    if (!testResult.success) {
      throw new Error(\`公式测试失败: \${testResult.error}\`);
    }

    return formula;
  }

  private async setThreshold(): Promise<string> {
    // 基于历史数据推荐阈值
    const historicalData = await this.getHistoricalData();
    const recommendedThreshold = this.calculateRecommendedThreshold(historicalData);

    const confirmed = await this.promptUser(
      \`推荐阈值: \${recommendedThreshold}. 是否使用?\`,
      ['yes', 'no']
    );

    if (confirmed === 'yes') {
      return recommendedThreshold;
    }

    return await this.promptUser('自定义阈值');
  }
}
\`\`\`

## 📊 效果评估体系

### 关键绩效指标 (KPI)
\`\`\`typescript
interface RiskMonitoringKPI {
  // 检出效能
  detection: {
    truePositiveRate: number;    // 真正率
    falsePositiveRate: number;   // 误报率
    detectionSpeed: number;      // 检出速度(分钟)
  };

  // 业务影响
  business: {
    lossPrevented: number;       // 防止损失金额
    operationalCost: number;     // 运营成本
    roi: number;                 // 投资回报率
  };

  // 系统效能
  system: {
    uptime: number;              // 系统可用性
    alertAccuracy: number;        // 告警准确性
    responseTime: number;         // 响应时间
  };
}

// 综合评分计算
const calculateOverallScore = (kpi: RiskMonitoringKPI): number => {
  const weights = {
    detection: 0.4,
    business: 0.4,
    system: 0.2
  };

  const detectionScore = (
    kpi.detection.truePositiveRate * 0.6 +
    (1 - kpi.detection.falsePositiveRate) * 0.3 +
    Math.max(0, 1 - kpi.detection.detectionSpeed / 60) * 0.1
  );

  const businessScore = Math.min(1, kpi.business.lossPrevented / kpi.business.operationalCost);

  const systemScore = (
    kpi.system.uptime * 0.5 +
    kpi.system.alertAccuracy * 0.3 +
    Math.max(0, 1 - kpi.system.responseTime / 300) * 0.2
  );

  return (
    detectionScore * weights.detection +
    businessScore * weights.business +
    systemScore * weights.system
  );
};
\`\`\`

### 持续监控和优化
\`\`\`sql
-- 月度效果评估报告
CREATE OR REPLACE VIEW monthly_risk_metrics AS
SELECT
  DATE_TRUNC('month', alert_time) as report_month,

  -- 告警统计
  COUNT(*) as total_alerts,
  COUNT(CASE WHEN priority = 'P0' THEN 1 END) as p0_alerts,
  COUNT(CASE WHEN priority = 'P1' THEN 1 END) as p1_alerts,
  COUNT(CASE WHEN priority = 'P2' THEN 1 END) as p2_alerts,

  -- 响应效能
  AVG(response_time_minutes) as avg_response_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_minutes) as p95_response_time,

  -- 业务影响
  SUM(loss_prevented_amount) as total_loss_prevented,
  SUM(operational_cost) as total_operational_cost,
  ROUND(
    SUM(loss_prevented_amount)::decimal / NULLIF(SUM(operational_cost), 0),
    2
  ) as roi_ratio,

  -- 准确性指标
  ROUND(
    COUNT(CASE WHEN is_true_positive THEN 1 END)::decimal / NULLIF(COUNT(*), 0) * 100,
    2
  ) as true_positive_rate,

  ROUND(
    COUNT(CASE WHEN is_false_positive THEN 1 END)::decimal / NULLIF(COUNT(*), 0) * 100,
    2
  ) as false_positive_rate

FROM risk_alerts
WHERE alert_time >= '2024-01-01'
GROUP BY DATE_TRUNC('month', alert_time)
ORDER BY report_month DESC;
\`\`\`
      `
    },

    caseStudies: {
      title: '经典案例分析',
      icon: TrendingUp,
      estimatedTime: '20分钟',
      difficulty: '专家',
      content: `
# 经典案例深度剖析

## 💰 案例一：跨境洗钱团伙识别与打击

### 🎯 案例背景
某大型数字货币交易所监测到异常资金流动模式，单日处理可疑交易额超过2000万美元。经初步分析，怀疑涉及有组织的跨境洗钱活动。

### 📊 触发风险指标
\`\`\`json
{
  "multi_indicator_alert": {
    "indicators": [
      {
        "id": "B1-04",
        "name": "充提平衡率",
        "value": "98.7%",
        "threshold": ">95%",
        "deviation": "+3.7%",
        "confidence": "高"
      },
      {
        "id": "B1-03",
        "name": "多地址归集密度",
        "value": "47个地址",
        "threshold": ">50个",
        "status": "临近阈值",
        "pattern": "集中归集"
      },
      {
        "id": "A1-04",
        "name": "密码重置频次",
        "value": "5次/天",
        "threshold": ">3次/天",
        "risk_level": "高",
        "unusual_pattern": true
      }
    ],
    "overall_risk_score": 89,
    "risk_category": "跨境洗钱",
    "priority": "P0"
  }
}
\`\`\`

### 🔍 深度调查过程

#### 阶段一：资金流追踪分析
\`\`\`typescript
// 资金流网络图构建
interface TransactionNode {
  address: string;
  amount: number;
  timestamp: Date;
  risk_score: number;
  connections: string[];
}

class MoneyFlowAnalyzer {
  async traceMoneyFlow(rootAddress: string, depth: number = 3) {
    const network = new Map<string, TransactionNode>();

    // 广度优先搜索构建资金流网络
    const queue = [rootAddress];
    const visited = new Set<string>();

    while (queue.length > 0 && depth > 0) {
      const currentLevel = queue.splice(0);
      const nextLevel: string[] = [];

      for (const address of currentLevel) {
        if (visited.has(address)) continue;
        visited.add(address);

        const transactions = await this.getAddressTransactions(address);
        const node = this.createTransactionNode(address, transactions);

        network.set(address, node);

        // 添加下一层地址
        for (const tx of transactions) {
          if (!visited.has(tx.counterparty)) {
            nextLevel.push(tx.counterparty);
          }
        }
      }

      queue.push(...nextLevel);
      depth--;
    }

    return this.analyzeNetworkPatterns(network);
  }

  private analyzeNetworkPatterns(network: Map<string, TransactionNode>) {
    // 检测循环洗钱模式
    const cycles = this.detectCycles(network);

    // 计算网络中心性
    const centrality = this.calculateCentrality(network);

    // 识别层级结构
    const hierarchy = this.identifyHierarchy(network);

    return {
      cycles,
      centrality,
      hierarchy,
      risk_patterns: this.classifyRiskPatterns(network)
    };
  }
}
\`\`\`

#### 阶段二：行为模式识别
\`\`\`python
import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler

class BehaviorPatternAnalyzer:
    def __init__(self, transaction_data):
        self.data = self.preprocess_data(transaction_data)

    def preprocess_data(self, raw_data):
        # 特征工程
        features = pd.DataFrame()

        # 时间特征
        features['hour_of_day'] = pd.to_datetime(raw_data['timestamp']).dt.hour
        features['day_of_week'] = pd.to_datetime(raw_data['timestamp']).dt.dayofweek
        features['is_weekend'] = features['day_of_week'].isin([5, 6]).astype(int)

        # 金额特征
        features['amount_log'] = np.log1p(raw_data['amount'])
        features['amount_rounded'] = (raw_data['amount'] % 100 == 0).astype(int)
        features['amount_common'] = raw_data['amount'].isin([1000, 5000, 10000]).astype(int)

        # 频率特征
        features['tx_per_hour'] = raw_data.groupby(
          pd.to_datetime(raw_data['timestamp']).dt.hour
        )['amount'].transform('count')

        return features

    def detect_anomalous_patterns(self):
        # 标准化特征
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(self.data)

        # 密度聚类检测异常模式
        clustering = DBSCAN(eps=0.5, min_samples=5)
        clusters = clustering.fit_predict(scaled_features)

        # 识别异常簇
        anomalous_clusters = []
        for cluster_id in np.unique(clusters):
            if cluster_id == -1:  # DBSCAN噪声点
                continue

            cluster_data = self.data[clusters == cluster_id]
            cluster_size = len(cluster_data)

            # 计算簇的异常程度
            anomaly_score = self.calculate_cluster_anomaly(cluster_data)

            if anomaly_score > 0.8:  # 高异常阈值
                anomalous_clusters.append({
                    'cluster_id': cluster_id,
                    'size': cluster_size,
                    'anomaly_score': anomaly_score,
                    'pattern_type': self.classify_pattern_type(cluster_data)
                })

        return anomalous_clusters

    def calculate_cluster_anomaly(self, cluster_data):
        # 多维度异常评分
        time_anomaly = self.score_time_pattern(cluster_data)
        amount_anomaly = self.score_amount_pattern(cluster_data)
        frequency_anomaly = self.score_frequency_pattern(cluster_data)

        # 加权综合评分
        return (
            time_anomaly * 0.3 +
            amount_anomaly * 0.4 +
            frequency_anomaly * 0.3
        )
\`\`\`

#### 阶段三：地理位置分析
\`\`\`typescript
interface GeoLocationData {
  ip: string;
  country: string;
  region: string;
  city: string;
  coordinates: [number, number];
  risk_score: number;
}

class GeoAnalysisEngine {
  async analyzeLocationPatterns(transactions: Transaction[]): Promise<GeoAnalysisResult> {
    const locations = await this.extractLocations(transactions);

    return {
      location_diversity: this.calculateLocationDiversity(locations),
      high_risk_regions: this.identifyHighRiskRegions(locations),
      unusual_patterns: this.detectUnusualGeoPatterns(locations),
      network_analysis: this.analyzeGeoNetwork(locations)
    };
  }

  private calculateLocationDiversity(locations: GeoLocationData[]): number {
    const uniqueCountries = new Set(locations.map(l => l.country));
    const uniqueRegions = new Set(locations.map(l => \`\${l.country}-\${l.region}\`));

    // 计算地理多样性指数
    const diversity_score = Math.log(uniqueCountries.size + 1) * Math.log(uniqueRegions.size + 1);

    // 归一化到0-1范围
    return Math.min(diversity_score / 10, 1);
  }

  private identifyHighRiskRegions(locations: GeoLocationData[]): string[] {
    const risk_threshold = 0.7;
    const region_stats = this.calculateRegionStats(locations);

    return region_stats
      .filter(region => region.avg_risk_score > risk_threshold)
      .sort((a, b) => b.avg_risk_score - a.avg_risk_score)
      .slice(0, 5)
      .map(region => region.region);
  }
}
\`\`\`

### 🎯 处置策略与结果

#### 即时响应措施
1. **账户冻结**：立即冻结涉案账户及关联账户
2. **资金控制**：暂停可疑资金的提币操作
3. **交易拦截**：阻断正在进行的异常交易

#### 调查取证过程
1. **链上分析**：追踪所有相关地址的交易历史
2. **情报收集**：关联已知黑产团伙的特征模式
3. **国际合作**：与相关司法机构共享情报信息

#### 最终处理结果
\`\`\`json
{
  "case_outcome": {
    "frozen_accounts": 47,
    "frozen_assets": "$2,300,000",
    "blocked_transactions": 156,
    "legal_referral": true,
    "international_cooperation": true,
    "case_status": "已移交司法机关"
  },
  "system_improvements": {
    "new_indicators": 3,
    "threshold_adjustments": 5,
    "pattern_updates": 2,
    "detection_accuracy": "+15%"
  }
}
\`\`\`

---

## 🕵️ 案例二：高频交易机器人检测

### 📈 市场异常信号
交易所监控系统检测到某交易对出现明显的价格操纵迹象：
- 成交量突然放大300%
- 价格在极短时间内大幅波动
- 交易频率异常集中

### 🤖 技术检测方案
\`\`\`typescript
class HFTDetectionEngine {
  private readonly DETECTION_WINDOW = 300; // 5分钟检测窗口
  private readonly HFT_THRESHOLDS = {
    tradeFrequency: 100,     // 每秒交易次数
    orderBookDepth: 0.8,     // 挂单簿集中度
    priceSlippage: 0.001,    // 价格滑点阈值
    timeDistribution: 0.1     // 时间分布集中度
  };

  async detectHFTActivity(marketData: MarketData): Promise<HFTAnalysis> {
    const analysis = {
      isHFT: false,
      confidence: 0,
      indicators: [],
      risk_score: 0
    };

    // 1. 交易频率分析
    const frequencyScore = this.analyzeTradeFrequency(marketData);
    analysis.indicators.push({
      name: '交易频率',
      score: frequencyScore,
      threshold: this.HFT_THRESHOLDS.tradeFrequency
    });

    // 2. 挂单簿分析
    const orderBookScore = this.analyzeOrderBookDepth(marketData);
    analysis.indicators.push({
      name: '挂单集中度',
      score: orderBookScore,
      threshold: this.HFT_THRESHOLDS.orderBookDepth
    });

    // 3. 价格行为分析
    const priceScore = this.analyzePriceBehavior(marketData);
    analysis.indicators.push({
      name: '价格滑点',
      score: priceScore,
      threshold: this.HFT_THRESHOLDS.priceSlippage
    });

    // 4. 时间分布分析
    const timeScore = this.analyzeTimeDistribution(marketData);
    analysis.indicators.push({
      name: '时间集中度',
      score: timeScore,
      threshold: this.HFT_THRESHOLDS.timeDistribution
    });

    // 计算综合风险评分
    analysis.risk_score = this.calculateCompositeScore([
      frequencyScore, orderBookScore, priceScore, timeScore
    ]);

    analysis.isHFT = analysis.risk_score > 0.8;
    analysis.confidence = analysis.risk_score;

    return analysis;
  }

  private analyzeTradeFrequency(data: MarketData): number {
    const recentTrades = data.trades.filter(
      trade => Date.now() - trade.timestamp < this.DETECTION_WINDOW * 1000
    );

    return recentTrades.length / this.DETECTION_WINDOW; // 每秒交易数
  }

  private analyzeOrderBookDepth(data: MarketData): number {
    // 计算订单簿的集中度
    const topOrders = data.orderBook.bids.slice(0, 10).concat(data.orderBook.asks.slice(0, 10));
    const totalVolume = topOrders.reduce((sum, order) => sum + order.amount, 0);
    const top10PercentVolume = topOrders
      .sort((a, b) => b.amount - a.amount)
      .slice(0, Math.ceil(topOrders.length * 0.1))
      .reduce((sum, order) => sum + order.amount, 0);

    return top10PercentVolume / totalVolume;
  }

  private calculateCompositeScore(scores: number[]): number {
    // 加权平均计算
    const weights = [0.3, 0.3, 0.2, 0.2]; // 频率30%, 挂单30%, 价格20%, 时间20%
    const weightedSum = scores.reduce((sum, score, index) => sum + score * weights[index], 0);
    const maxPossibleScore = weights.reduce((sum, weight) => sum + weight, 0);

    return weightedSum / maxPossibleScore;
  }
}
\`\`\`

### ⚡ 实时干预措施
1. **动态调整费率**：对可疑账户提高交易手续费
2. **限速控制**：限制异常账户的交易频率
3. **价格稳定机制**：触发价格稳定算法
4. **监控升级**：增加该账户的监控等级

### 📊 技术改进成果
- **检测准确率**：95%（之前80%）
- **响应时间**：从30秒缩短到5秒
- **误报率**：从8%降低到2%
- **系统稳定性**：HFT攻击成功拦截100%

---

## 🎯 案例三：DeFi协议攻击防护

### 🚨 攻击事件概述
某主流DeFi协议遭受闪电贷攻击，损失超过1000万美元。攻击者利用价格预言机操纵和重入漏洞实施了复杂的套利攻击。

### 🔒 风险监控体系的角色

#### 预攻击检测信号
\`\`\`json
{
  "early_warning_signals": [
    {
      "indicator": "异常大额闪电贷",
      "value": "$50M",
      "threshold": "$10M",
      "risk_level": "极高"
    },
    {
      "indicator": "价格预言机异常波动",
      "deviation": "45%",
      "time_window": "30秒",
      "manipulation_probability": "92%"
    },
    {
      "indicator": "合约交互复杂度",
      "interaction_depth": 8,
      "threshold": 5,
      "attack_pattern": "重入攻击"
    }
  ],
  "system_response": {
    "alert_priority": "P0",
    "automatic_actions": [
      "暂停大额闪电贷",
      "冻结可疑地址",
      "通知协议管理员"
    ],
    "manual_review": "立即启动"
  }
}
\`\`\`

#### 攻击链分析
\`\`\`typescript
interface AttackChain {
  stages: AttackStage[];
  total_loss: number;
  exploited_vulnerabilities: string[];
  attack_complexity: number;
}

class DeFiAttackAnalyzer {
  async analyzeAttackChain(transactionHash: string): Promise<AttackChain> {
    const attackTx = await this.getTransactionDetails(transactionHash);
    const attackChain = await this.reconstructAttackFlow(attackTx);

    return {
      stages: attackChain.stages,
      total_loss: this.calculateTotalLoss(attackChain),
      exploited_vulnerabilities: this.identifyVulnerabilities(attackChain),
      attack_complexity: this.assessAttackComplexity(attackChain)
    };
  }

  private async reconstructAttackFlow(rootTx: Transaction): Promise<AttackFlow> {
    const stages: AttackStage[] = [];
    const visited = new Set<string>();
    const queue = [rootTx];

    while (queue.length > 0) {
      const currentTx = queue.shift()!;
      if (visited.has(currentTx.hash)) continue;

      visited.add(currentTx.hash);

      // 识别攻击阶段
      const stage = this.classifyAttackStage(currentTx);
      stages.push(stage);

      // 查找后续交易
      const subsequentTxs = await this.findSubsequentTransactions(currentTx);
      queue.push(...subsequentTxs.filter(tx => !visited.has(tx.hash)));
    }

    return { stages, complexity: this.calculateFlowComplexity(stages) };
  }
}
\`\`\`

### 🛡️ 防御策略升级

#### 实时监控增强
1. **闪电贷监控**：大额闪电贷的实时检测和限制
2. **预言机保护**：多源价格数据的交叉验证
3. **合约安全**：智能合约漏洞的自动化扫描

#### 自动化响应机制
\`\`\`typescript
class AutomatedDefenseSystem {
  private readonly RESPONSE_THRESHOLDS = {
    CRITICAL: { threshold: 0.9, actions: ['emergency_pause', 'admin_alert'] },
    HIGH: { threshold: 0.7, actions: ['limit_transactions', 'increase_monitoring'] },
    MEDIUM: { threshold: 0.5, actions: ['flag_suspicious', 'log_detailed'] }
  };

  async respondToThreat(threat: ThreatAnalysis): Promise<ResponseActions> {
    const riskLevel = this.assessRiskLevel(threat);
    const threshold = this.RESPONSE_THRESHOLDS[riskLevel];

    if (threat.confidence >= threshold.threshold) {
      return await this.executeActions(threshold.actions, threat);
    }

    return { actions: [], reason: 'below_threshold' };
  }

  private async executeActions(actions: string[], threat: ThreatAnalysis) {
    const results = [];

    for (const action of actions) {
      try {
        const result = await this.executeAction(action, threat);
        results.push({ action, success: true, result });
      } catch (error) {
        results.push({ action, success: false, error: error.message });
      }
    }

    return { actions: results, executed_at: new Date() };
  }
}
\`\`\`

---

## 📈 综合效果评估

### 🎯 拦截效能统计
\`\`\`chart
{
  "type": "bar",
  "data": {
    "labels": ["洗钱拦截", "市场操纵", "机器人攻击", "DeFi攻击", "其他违规"],
    "datasets": [{
      "label": "拦截金额（万美元）",
      "data": [2300, 890, 456, 1200, 340],
      "backgroundColor": [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 205, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(153, 102, 255, 0.8)"
      ]
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "2024年风险拦截统计"
      }
    }
  }
}
\`\`\`

### 💰 投资回报分析
| 年度 | 投入成本 | 拦截损失 | ROI |
|------|----------|----------|-----|
| 2022 | $50万 | $1200万 | 24:1 |
| 2023 | $80万 | $2800万 | 35:1 |
| 2024 | $120万 | $4200万 | 35:1 |

### 🔬 技术指标改进
- **检测准确率**：从75%提升到92%
- **平均响应时间**：从45分钟缩短到8分钟
- **误报率**：从12%降低到3.2%
- **系统可用性**：99.97%

### 🚀 未来展望

基于这些成功案例，我们将继续：
1. **AI增强**：引入机器学习算法提升检测精度
2. **实时协作**：建立安全团队间的实时情报共享
3. **生态共建**：与其他交易所和机构建立联合防御体系
4. **技术创新**：探索区块链原生安全解决方案
      `
    }
  };

  const sections = [
    { id: 'overview', label: '平台概览', icon: BookOpen, difficulty: '入门' },
    { id: 'methodology', label: 'MECE方法论', icon: Target, difficulty: '进阶' },
    { id: 'bestPractices', label: '最佳实践', icon: Star, difficulty: '专家' },
    { id: 'caseStudies', label: '案例分析', icon: TrendingUp, difficulty: '专家' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                🎓 学习中心
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
                深度掌握 MECE 风险本体设计方法论，提升金融风控专业能力
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                学习进度
              </div>
              <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(completedTutorials.length / sections.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {completedTutorials.length} / {sections.length} 已完成
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">学习目录</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isCompleted = completedTutorials.includes(section.id);
                  const tutorialData = tutorialContent[section.id as keyof typeof tutorialContent];

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{section.label}</div>
                        <div className="text-xs opacity-75 flex items-center gap-2">
                          <span>{tutorialData.estimatedTime}</span>
                          <span>•</span>
                          <span>{tutorialData.difficulty}</span>
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>掌握MECE设计原则</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-500" />
                    <span>学习指标计算方法</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-green-500" />
                    <span>理解风险评估逻辑</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {React.createElement(tutorialContent[activeSection as keyof typeof tutorialContent].icon, {
                    className: "w-8 h-8 text-blue-500"
                  })}
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {tutorialContent[activeSection as keyof typeof tutorialContent].title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        {tutorialContent[activeSection as keyof typeof tutorialContent].estimatedTime}
                      </span>
                      <span className="text-sm px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                        {tutorialContent[activeSection as keyof typeof tutorialContent].difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => markCompleted(activeSection)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    completedTutorials.includes(activeSection)
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {completedTutorials.includes(activeSection) ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      已完成
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      标记完成
                    </>
                  )}
                </button>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {tutorialContent[activeSection as keyof typeof tutorialContent].content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
