import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  BookOpen, Target, Shield, Activity, Layers, AlertTriangle, BarChart3,
  Database, Users, Zap, ChevronRight, Play, CheckCircle, Star,
  Code, Lightbulb, TrendingUp, Eye, Cpu, FileText, Video,
  GraduationCap, Award, Clock, ArrowRight, Search
} from 'lucide-react';

export const TutorialView: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [completedTutorials, setCompletedTutorials] = useState<string[]>(() => {
    const saved = localStorage.getItem('completed_tutorials');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | '入门' | '进阶' | '专家'>('all');
  const [showQuiz, setShowQuiz] = useState<string | null>(null);

  // 教程章节定义
  const sections = [
    { id: 'overview', label: '平台概览', icon: BookOpen, difficulty: '入门' },
    { id: 'methodology', label: 'MECE方法论', icon: Target, difficulty: '进阶' },
    { id: 'cryptoIndicators', label: '加密货币指标', icon: Zap, difficulty: '进阶' },
    { id: 'bestPractices', label: '最佳实践', icon: Star, difficulty: '专家' },
    { id: 'caseStudies', label: '案例分析', icon: TrendingUp, difficulty: '专家' }
  ];

  useEffect(() => {
    localStorage.setItem('completed_tutorials', JSON.stringify(completedTutorials));
  }, [completedTutorials]);

  const markCompleted = (tutorialId: string) => {
    if (!completedTutorials.includes(tutorialId)) {
      setCompletedTutorials([...completedTutorials, tutorialId]);
    }
  };

  // 教程内容定义
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

    cryptoIndicators: {
      title: '加密货币风险指标详解',
      icon: Zap,
      estimatedTime: '25分钟',
      difficulty: '进阶',
      content: `
# 加密货币风险指标体系详解

## 🪙 加密货币特有的风险类型

### 1. **链上分析风险指标**

#### **地址关联网络分析**
\`\`\`typescript
interface AddressNetworkAnalysis {
  // 地址关联深度
  associationDepth: number;
  // 网络中心性
  centralityScore: number;
  // 资金流向复杂度
  flowComplexity: number;
  // 时间模式异常
  temporalAnomaly: boolean;
}

// 黑地址关联深度计算
class AddressAssociationEngine {
  async calculateAssociationDepth(targetAddress: string): Promise<number> {
    const visited = new Set<string>();
    const queue = [targetAddress];
    let depth = 0;
    let found = false;

    // 广度优先搜索
    while (queue.length > 0 && depth < 5) {
      const levelSize = queue.length;
      depth++;

      for (let i = 0; i < levelSize; i++) {
        const currentAddress = queue.shift()!;

        if (visited.has(currentAddress)) continue;
        visited.add(currentAddress);

        // 检查是否为已知风险地址
        if (await this.isKnownRiskAddress(currentAddress)) {
          found = true;
          break;
        }

        // 获取关联地址
        const associatedAddresses = await this.getAssociatedAddresses(currentAddress);
        queue.push(...associatedAddresses.filter(addr => !visited.has(addr)));
      }

      if (found) break;
    }

    return found ? depth : -1;
  }

  private async isKnownRiskAddress(address: string): Promise<boolean> {
    // 查询风险地址库
    const riskDatabases = [
      'OFAC_SDN', 'Chainalysis', 'Elliptic', 'CipherTrace'
    ];

    for (const db of riskDatabases) {
      if (await this.queryRiskDatabase(db, address)) {
        return true;
      }
    }

    return false;
  }
}
\`\`\`

#### **资金流向异常检测**
\`\`\`typescript
interface FundsFlowPattern {
  // 资金流转速度
  flowVelocity: number;
  // 地址跳跃次数
  hopCount: number;
  // 金额保持率
  amountRetention: number;
  // 时间窗口
  timeWindow: number;
}

class FundsFlowAnalyzer {
  // 检测典型的洗钱模式
  detectLaunderingPatterns(transactions: Transaction[]): LaunderingPattern[] {
    const patterns: LaunderingPattern[] = [];

    // 1. 快进快出模式检测
    const quickFlipPatterns = this.detectQuickFlipPatterns(transactions);
    patterns.push(...quickFlipPatterns);

    // 2. 循环交易检测
    const circularPatterns = this.detectCircularTransactions(transactions);
    patterns.push(...circularPatterns);

    // 3. 金字塔式分发
    const pyramidPatterns = this.detectPyramidDistribution(transactions);
    patterns.push(...pyramidPatterns);

    // 4. 定时释放模式
    const timedReleasePatterns = this.detectTimedReleasePatterns(transactions);
    patterns.push(...timedReleasePatterns);

    return patterns;
  }

  private detectQuickFlipPatterns(transactions: Transaction[]): LaunderingPattern[] {
    const patterns: LaunderingPattern[] = [];

    // 分析每个地址的快进快出行为
    const addressGroups = this.groupByAddress(transactions);

    for (const [address, txs] of addressGroups) {
      const inflows = txs.filter(tx => tx.to === address);
      const outflows = txs.filter(tx => tx.from === address);

      // 计算平均持有时间
      const avgHoldingTime = this.calculateAverageHoldingTime(inflows, outflows);

      if (avgHoldingTime < 3600000) { // 1小时内
        const totalVolume = inflows.reduce((sum, tx) => sum + tx.amount, 0);

        if (totalVolume > 10000) { // 大额快进快出
          patterns.push({
            type: 'quick_flip',
            address,
            severity: 'high',
            indicators: {
              avgHoldingTime,
              totalVolume,
              transactionCount: txs.length
            }
          });
        }
      }
    }

    return patterns;
  }
}
\`\`\`

### 2. **交易所特有风险指标**

#### **交易行为模式分析**
\`\`\`typescript
interface TradingBehaviorPattern {
  // 交易频率
  frequency: number;
  // 交易金额分布
  amountDistribution: number[];
  // 时间分布
  timeDistribution: number[];
  // 交易对手分布
  counterpartyDiversity: number;
  // 策略一致性
  strategyConsistency: number;
}

class TradingBehaviorAnalyzer {
  // 检测机器人交易特征
  detectBotTrading(signals: TradingSignal[]): BotDetectionResult {
    const features = this.extractFeatures(signals);

    // 1. 频率异常检测
    const frequencyAnomaly = this.detectFrequencyAnomaly(features.frequency);

    // 2. 时间模式分析
    const timingPattern = this.analyzeTimingPattern(features.timeDistribution);

    // 3. 金额分布分析
    const amountPattern = this.analyzeAmountDistribution(features.amountDistribution);

    // 4. 执行速度分析
    const executionSpeed = this.measureExecutionSpeed(signals);

    // 5. 策略一致性检查
    const strategyConsistency = this.checkStrategyConsistency(signals);

    // 综合评分
    const botScore = this.calculateBotScore({
      frequencyAnomaly,
      timingPattern,
      amountPattern,
      executionSpeed,
      strategyConsistency
    });

    return {
      isBot: botScore > 0.8,
      confidence: botScore,
      indicators: {
        frequencyAnomaly,
        timingPattern,
        amountPattern,
        executionSpeed,
        strategyConsistency
      },
      riskLevel: this.determineRiskLevel(botScore)
    };
  }

  private extractFeatures(signals: TradingSignal[]): TradingBehaviorPattern {
    const timestamps = signals.map(s => s.timestamp);
    const amounts = signals.map(s => s.amount);

    return {
      frequency: this.calculateFrequency(timestamps),
      amountDistribution: this.calculateDistribution(amounts),
      timeDistribution: this.calculateTimeDistribution(timestamps),
      counterpartyDiversity: this.calculateCounterpartyDiversity(signals),
      strategyConsistency: this.measureStrategyConsistency(signals)
    };
  }

  private calculateFrequency(timestamps: number[]): number {
    if (timestamps.length < 2) return 0;

    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return 1000 / avgInterval; // 每秒交易次数
  }

  private detectFrequencyAnomaly(frequency: number): number {
    // 人类平均交易频率通常在每分钟1-5次
    // 机器人可能达到每秒10次以上
    const humanMaxFrequency = 0.5; // 每秒0.5次
    const botMinFrequency = 5; // 每秒5次

    if (frequency < humanMaxFrequency) return 0;
    if (frequency > botMinFrequency) return 1;

    // 线性插值
    return (frequency - humanMaxFrequency) / (botMinFrequency - humanMaxFrequency);
  }
}
\`\`\`

#### **订单簿操纵检测**
\`\`\`typescript
interface OrderBookManipulation {
  // 大单挂撤比
  largeOrderCancelRatio: number;
  // 挂单时间分布
  orderTimingDistribution: number[];
  // 价格层级集中度
  priceLevelConcentration: number;
  // 订单大小分布
  orderSizeDistribution: number[];
}

class OrderBookManipulationDetector {
  // 检测订单簿操纵行为
  detectManipulation(orderBook: OrderBook, recentTrades: Trade[]): ManipulationAnalysis {
    const analysis: ManipulationAnalysis = {
      isManipulated: false,
      confidence: 0,
      manipulationTypes: [],
      indicators: {}
    };

    // 1. 洗盘行为检测（大单频繁挂撤）
    const washTrading = this.detectWashTrading(orderBook);
    if (washTrading.confidence > 0.7) {
      analysis.manipulationTypes.push('wash_trading');
      analysis.indicators.washTrading = washTrading;
    }

    // 2. 诱导行为检测（虚假挂单诱导）
    const spoofing = this.detectSpoofing(orderBook, recentTrades);
    if (spoofing.confidence > 0.7) {
      analysis.manipulationTypes.push('spoofing');
      analysis.indicators.spoofing = spoofing;
    }

    // 3. 层压行为检测（集中挂单影响价格）
    const layering = this.detectLayering(orderBook);
    if (layering.confidence > 0.7) {
      analysis.manipulationTypes.push('layering');
      analysis.indicators.layering = layering;
    }

    // 4. 报价操纵检测
    const quoteStuffing = this.detectQuoteStuffing(orderBook);
    if (quoteStuffing.confidence > 0.7) {
      analysis.manipulationTypes.push('quote_stuffing');
      analysis.indicators.quoteStuffing = quoteStuffing;
    }

    // 计算综合置信度
    analysis.confidence = this.calculateOverallConfidence([
      washTrading.confidence,
      spoofing.confidence,
      layering.confidence,
      quoteStuffing.confidence
    ]);

    analysis.isManipulated = analysis.confidence > 0.6;

    return analysis;
  }

  private detectWashTrading(orderBook: OrderBook): ManipulationIndicator {
    // 分析大单的挂撤行为
    const largeOrders = this.getLargeOrders(orderBook);
    const cancelRatio = largeOrders.filter(order => order.cancelled).length / largeOrders.length;

    return {
      confidence: Math.min(cancelRatio * 2, 1), // 归一化到0-1
      indicators: { cancelRatio, largeOrderCount: largeOrders.length }
    };
  }

  private detectSpoofing(orderBook: OrderBook, trades: Trade[]): ManipulationIndicator {
    // 检测虚假挂单（挂单后立即取消，且远离市场价格）
    const spoofOrders = orderBook.asks.concat(orderBook.bids)
      .filter(order =>
        order.cancelled &&
        Math.abs(order.price - this.getMarketPrice(trades)) > this.getPriceThreshold()
      );

    const spoofRatio = spoofOrders.length / (orderBook.asks.length + orderBook.bids.length);

    return {
      confidence: Math.min(spoofRatio * 3, 1),
      indicators: { spoofOrderCount: spoofOrders.length, spoofRatio }
    };
  }
}
\`\`\`

### 3. **DeFi协议特有风险指标**

#### **智能合约风险评估**
\`\`\`typescript
interface ContractRiskAssessment {
  // 代码复杂度
  codeComplexity: number;
  // 依赖关系复杂度
  dependencyComplexity: number;
  // 状态变量风险
  stateVariableRisk: number;
  // 函数调用风险
  functionCallRisk: number;
  // 访问控制风险
  accessControlRisk: number;
}

class SmartContractRiskAnalyzer {
  async assessContractRisk(contractAddress: string): Promise<ContractRiskAssessment> {
    // 获取合约源码
    const sourceCode = await this.getContractSource(contractAddress);

    // 代码静态分析
    const codeAnalysis = await this.performStaticAnalysis(sourceCode);

    // 依赖分析
    const dependencyAnalysis = await this.analyzeDependencies(contractAddress);

    // 历史交易分析
    const historicalAnalysis = await this.analyzeHistoricalTransactions(contractAddress);

    return {
      codeComplexity: codeAnalysis.complexity,
      dependencyComplexity: dependencyAnalysis.complexity,
      stateVariableRisk: codeAnalysis.stateRisk,
      functionCallRisk: codeAnalysis.functionRisk,
      accessControlRisk: codeAnalysis.accessRisk
    };
  }

  private async performStaticAnalysis(sourceCode: string): Promise<CodeAnalysis> {
    // 检测常见的漏洞模式
    const vulnerabilities = {
      reentrancy: this.detectReentrancy(sourceCode),
      overflow: this.detectOverflow(sourceCode),
      accessControl: this.detectAccessControlIssues(sourceCode),
      oracleManipulation: this.detectOracleDependencies(sourceCode)
    };

    return {
      complexity: this.calculateCodeComplexity(sourceCode),
      stateRisk: this.assessStateVariableRisk(sourceCode),
      functionRisk: this.assessFunctionCallRisk(sourceCode),
      accessRisk: this.assessAccessControlRisk(sourceCode),
      vulnerabilities
    };
  }

  private detectReentrancy(code: string): boolean {
    // 检测重入攻击模式
    const reentrancyPatterns = [
      /call\.value/,
      /\.send\(/,
      /\.transfer\(/,
      /external call/
    ];

    return reentrancyPatterns.some(pattern =>
      pattern.test(code.toLowerCase())
    );
  }

  private detectOverflow(code: string): boolean {
    // 检测整数溢出风险
    const overflowIndicators = [
      /\+=.*[^\%]/,  // 加法操作
      /\-=.*[^\%]/,  // 减法操作
      /\*=/,         // 乘法操作
      /uint/,        // 使用uint类型
      /int\d+/       // 使用int类型
    ];

    const overflowCount = overflowIndicators.filter(pattern =>
      pattern.test(code)
    ).length;

    return overflowCount > 3; // 超过3个指标认为是高风险
  }
}
\`\`\`

#### **预言机操纵检测**
\`\`\`typescript
interface OracleManipulationRisk {
  // 价格偏差程度
  priceDeviation: number;
  // 时间戳操纵风险
  timestampRisk: number;
  // 单源依赖风险
  singleSourceRisk: number;
  // 更新频率异常
  updateFrequencyRisk: number;
}

class OracleManipulationDetector {
  // 检测预言机价格操纵
  async detectPriceManipulation(
    oracleData: OraclePriceData[],
    marketData: MarketPriceData[]
  ): Promise<OracleManipulationRisk> {

    // 1. 价格偏差分析
    const priceDeviation = this.analyzePriceDeviation(oracleData, marketData);

    // 2. 时间戳一致性检查
    const timestampRisk = this.checkTimestampConsistency(oracleData);

    // 3. 数据源多样性评估
    const singleSourceRisk = this.assessSourceDiversity(oracleData);

    // 4. 更新频率分析
    const updateFrequencyRisk = this.analyzeUpdateFrequency(oracleData);

    return {
      priceDeviation,
      timestampRisk,
      singleSourceRisk,
      updateFrequencyRisk
    };
  }

  private analyzePriceDeviation(
    oracleData: OraclePriceData[],
    marketData: MarketPriceData[]
  ): number {
    if (oracleData.length === 0 || marketData.length === 0) return 0;

    // 计算价格偏差百分比
    const deviations = oracleData.map(oraclePrice => {
      const marketPrice = this.findClosestMarketPrice(oraclePrice.timestamp, marketData);
      if (!marketPrice) return 0;

      return Math.abs(oraclePrice.price - marketPrice.price) / marketPrice.price;
    });

    const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;

    // 超过5%的偏差认为是高风险
    return Math.min(avgDeviation / 0.05, 1);
  }

  private checkTimestampConsistency(oracleData: OraclePriceData[]): number {
    if (oracleData.length < 2) return 0;

    // 检查时间戳是否过于规律（可能是伪造的）
    const intervals = [];
    for (let i = 1; i < oracleData.length; i++) {
      intervals.push(oracleData[i].timestamp - oracleData[i-1].timestamp);
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    const regularity = Math.sqrt(variance) / avgInterval; // 变异系数

    // 过于规律的时间戳可能是伪造的
    return Math.max(0, regularity - 0.1) / 0.9; // 归一化
  }
}
\`\`\`

---

## 🔬 高级分析技术

### **机器学习增强检测**
\`\`\`python
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

class MLRiskDetector:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.feature_columns = [
            'transaction_amount', 'transaction_frequency',
            'address_age', 'interactions_count', 'gas_price',
            'contract_complexity', 'holder_concentration'
        ]

    def train_model(self, historical_data: pd.DataFrame, labels: pd.Series):
        # 特征工程
        features = self.engineer_features(historical_data)

        # 训练集验证集分割
        X_train, X_test, y_train, y_test = train_test_split(
            features, labels, test_size=0.2, random_state=42
        )

        # 模型训练
        self.model.fit(X_train, y_train)

        # 模型评估
        predictions = self.model.predict(X_test)
        print(classification_report(y_test, predictions))

    def predict_risk(self, transaction_data: pd.DataFrame) -> np.ndarray:
        features = self.engineer_features(transaction_data)
        return self.model.predict_proba(features)[:, 1]  # 返回风险概率

    def engineer_features(self, data: pd.DataFrame) -> pd.DataFrame:
        features = pd.DataFrame()

        # 金额特征
        features['amount_log'] = np.log1p(data['transaction_amount'])
        features['amount_percentile'] = data['transaction_amount'].rank(pct=True)

        # 频率特征
        features['tx_per_hour'] = data.groupby(
            pd.to_datetime(data['timestamp']).dt.hour
        )['transaction_amount'].transform('count')

        # 地址特征
        features['address_age_days'] = (
            pd.Timestamp.now() - pd.to_datetime(data['address_creation'])
        ).dt.days

        # 网络特征
        features['unique_interactions'] = data.groupby('address')['counterparty'].transform('nunique')
        features['interaction_diversity'] = features['unique_interactions'] / data['transaction_count']

        # 合约特征（如果是合约交互）
        if 'contract_address' in data.columns:
            features['contract_complexity'] = data['contract_functions'].fillna(0)
            features['gas_efficiency'] = data['gas_used'] / data['gas_limit']

        return features[self.feature_columns].fillna(0)
\`\`\`

### **实时流处理架构**
\`\`\`typescript
interface StreamProcessingConfig {
  windowSize: number;        // 时间窗口大小（秒）
  slideInterval: number;     // 滑动间隔（秒）
  riskThreshold: number;     // 风险阈值
  alertCooldown: number;     // 告警冷却时间（秒）
}

class RealTimeRiskProcessor {
  private config: StreamProcessingConfig;
  private eventBuffer: RiskEvent[] = [];
  private activeAlerts: Map<string, AlertState> = new Map();
  private processors: RiskProcessor[] = [];

  constructor(config: StreamProcessingConfig) {
    this.config = config;
    this.initializeProcessors();
    this.startProcessing();
  }

  private initializeProcessors() {
    // 初始化各种风险检测处理器
    this.processors = [
      new TransactionAnomalyProcessor(),
      new AddressRiskProcessor(),
      new ContractVulnerabilityProcessor(),
      new MarketManipulationProcessor(),
      new DeFiExploitProcessor()
    ];
  }

  async processEvent(event: RiskEvent): Promise<void> {
    // 添加到缓冲区
    this.eventBuffer.push(event);

    // 清理过期事件
    this.cleanupExpiredEvents();

    // 并行处理所有风险检测器
    const riskAssessments = await Promise.all(
      this.processors.map(processor =>
        processor.analyze(this.eventBuffer, event)
      )
    );

    // 聚合风险评估结果
    const aggregatedRisk = this.aggregateRiskAssessments(riskAssessments);

    // 检查是否需要触发告警
    await this.checkAndTriggerAlerts(aggregatedRisk, event);
  }

  private cleanupExpiredEvents(): void {
    const cutoffTime = Date.now() - (this.config.windowSize * 1000);
    this.eventBuffer = this.eventBuffer.filter(
      event => event.timestamp > cutoffTime
    );
  }

  private aggregateRiskAssessments(assessments: RiskAssessment[]): AggregatedRisk {
    const totalRisk = assessments.reduce((sum, assessment) => sum + assessment.riskScore, 0);
    const avgRisk = totalRisk / assessments.length;

    const maxRiskAssessment = assessments.reduce((max, current) =>
      current.riskScore > max.riskScore ? current : max
    );

    return {
      averageRisk: avgRisk,
      maxRisk: maxRiskAssessment.riskScore,
      dominantRiskType: maxRiskAssessment.riskType,
      riskFactors: assessments.map(a => ({
        type: a.riskType,
        score: a.riskScore,
        indicators: a.indicators
      }))
    };
  }

  private async checkAndTriggerAlerts(aggregatedRisk: AggregatedRisk, event: RiskEvent): Promise<void> {
    if (aggregatedRisk.averageRisk < this.config.riskThreshold) {
      return; // 未达到阈值
    }

    const alertKey = \`\${aggregatedRisk.dominantRiskType}_\${event.address || event.contract}\`;

    // 检查冷却时间
    const existingAlert = this.activeAlerts.get(alertKey);
    if (existingAlert && Date.now() - existingAlert.timestamp < this.config.alertCooldown * 1000) {
      return; // 还在冷却期内
    }

    // 触发告警
    const alert: RiskAlert = {
      id: generateAlertId(),
      type: aggregatedRisk.dominantRiskType,
      severity: this.determineSeverity(aggregatedRisk.maxRisk),
      message: this.generateAlertMessage(aggregatedRisk, event),
      data: aggregatedRisk,
      timestamp: Date.now(),
      event: event
    };

    await this.sendAlert(alert);

    // 记录活跃告警
    this.activeAlerts.set(alertKey, {
      alert,
      timestamp: Date.now()
    });
  }

  private determineSeverity(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 0.9) return 'critical';
    if (riskScore >= 0.7) return 'high';
    if (riskScore >= 0.5) return 'medium';
    return 'low';
  }
}
\`\`\`

---

## 📊 风险指标效果评估

### **检测效能指标**
\`\`\`typescript
interface DetectionMetrics {
  // 检出率：实际风险事件 / 总风险事件
  detectionRate: number;
  // 误报率：误报告警 / 总告警
  falsePositiveRate: number;
  // 响应时间：告警触发到响应的平均时间
  averageResponseTime: number;
  // 拦截成功率：成功拦截的风险事件 / 检出的风险事件
  interceptionRate: number;
  // 业务影响：因风险控制减少的经济损失
  lossPreventionValue: number;
}

// 计算综合效能评分
function calculateOverallEffectiveness(metrics: DetectionMetrics): number {
  const weights = {
    detectionRate: 0.3,
    falsePositiveRate: -0.2, // 负权重，因为误报率越低越好
    averageResponseTime: -0.2, // 负权重，因为响应时间越短越好
    interceptionRate: 0.4,
    lossPreventionValue: 0.3
  };

  // 归一化处理
  const normalizedMetrics = {
    detectionRate: Math.min(metrics.detectionRate, 1),
    falsePositiveRate: Math.max(0, 1 - metrics.falsePositiveRate), // 反转：误报率低=评分高
    averageResponseTime: Math.max(0, 1 - metrics.averageResponseTime / 3600000), // 1小时以内为满分
    interceptionRate: Math.min(metrics.interceptionRate, 1),
    lossPreventionValue: Math.min(metrics.lossPreventionValue / 10000000, 1) // 1kw人民币为满分
  };

  return Object.entries(weights).reduce((score, [key, weight]) => {
    return score + normalizedMetrics[key as keyof typeof normalizedMetrics] * Math.abs(weight);
  }, 0);
}
\`\`\`

### **持续优化策略**
1. **数据反馈循环**：收集真实的业务反馈数据
2. **模型迭代更新**：基于新数据定期重新训练模型
3. **阈值动态调整**：根据业务环境变化调整风险阈值
4. **新风险类型识别**：持续发现和定义新的风险模式
5. **跨平台协作**：与其他风控系统共享情报和经验
      `
    }
    };

    // 过滤和搜索教程
    const filteredSections = sections.filter(section => {
      const content = tutorialContent[section.id as keyof typeof tutorialContent];
      const matchesSearch = !searchTerm ||
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || content.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });

    return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 学习进度概览和搜索 */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">🎓 学习中心</h1>
              <p className="text-slate-600 dark:text-slate-400">深度掌握 MECE 风险本体设计方法论，提升金融风控专业能力</p>
                </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {completedTutorials.length}/{sections.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">已完成教程</div>
              <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedTutorials.length / sections.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 搜索和过滤 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索教程内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部难度</option>
              <option value="入门">入门</option>
              <option value="进阶">进阶</option>
              <option value="专家">专家</option>
            </select>
          </div>

          {/* 学习目标 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                <div className="font-semibold text-slate-900 dark:text-white">掌握MECE原则</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">学习系统化思维方法</div>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Code className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">精通指标计算</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">理解量化评估逻辑</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">提升风控能力</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">建立专业风险思维</div>
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
                {filteredSections.map((section) => {
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

        {/* 学习成就和下一步建议 */}
        {completedTutorials.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  🎉 学习成就
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  恭喜你已完成 {completedTutorials.length} 个教程！继续努力，成为MECE风险监控领域的专家。
                </p>

                {/* 成就徽章 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {completedTutorials.length >= 1 && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      🚀 初学者
                    </span>
                  )}
                  {completedTutorials.length >= 3 && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                      📚 学者
                    </span>
                  )}
                  {completedTutorials.length >= 5 && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                      🎯 专家
                    </span>
                  )}
                  {completedTutorials.length === sections.length && (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                      🏆 大师
                    </span>
                  )}
                </div>

                {/* 下一步建议 */}
                {completedTutorials.length < sections.length && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">📈 建议继续学习</h4>
                    <div className="space-y-2">
                      {sections
                        .filter(section => !completedTutorials.includes(section.id))
                        .slice(0, 3)
                        .map(section => (
                          <div key={section.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                            <div className="flex items-center gap-2">
                              <section.icon className="w-4 h-4 text-slate-500" />
                              <span className="text-sm font-medium">{section.label}</span>
                              <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded">
                                {tutorialContent[section.id as keyof typeof tutorialContent]?.difficulty}
                              </span>
                            </div>
                            <button
                              onClick={() => setActiveSection(section.id)}
                              className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              开始学习
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
            </div>
        </div>
    );
};
