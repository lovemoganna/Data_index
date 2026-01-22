import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  BookOpen, Target, Shield, Activity, Layers, AlertTriangle, BarChart3,
  Database, Users, Zap, ChevronRight, Play, CheckCircle, Star,
  Lightbulb, TrendingUp, Eye, Cpu, FileText, Video,
  GraduationCap, Award, Clock, ArrowRight, Search, Bitcoin, Coins,
  Network, PieChart, LineChart, BarChart, ScatterChart, Code
} from 'lucide-react';

// 重构学习中心：紧紧围绕加密货币指标学习，只讲解知识，不包含代码示例

export const TutorialView: React.FC = () => {
  const [activeSection, setActiveSection] = useState('cryptoBasics');
  const [completedTutorials, setCompletedTutorials] = useState<string[]>(() => {
    const saved = localStorage.getItem('completed_tutorials');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | '入门' | '进阶' | '专家'>('all');

  // 教程章节定义 - 紧紧围绕加密货币指标学习
  const sections = [
    { id: 'cryptoBasics', label: '加密货币基础', icon: Bitcoin, difficulty: '入门', category: '基础认知' },
    { id: 'blockchainTech', label: '区块链技术原理', icon: Network, difficulty: '入门', category: '技术原理' },
    { id: 'indicatorFramework', label: '指标体系框架', icon: Target, difficulty: '进阶', category: '指标体系' },
    { id: 'calculationMethods', label: '指标计算方法', icon: Code, difficulty: '进阶', category: '指标体系' },
    { id: 'addressRisk', label: '地址风险指标', icon: Users, difficulty: '进阶', category: '风险指标' },
    { id: 'capitalRisk', label: '资金风险指标', icon: PieChart, difficulty: '进阶', category: '风险指标' },
    { id: 'behaviorRisk', label: '交易行为风险', icon: Activity, difficulty: '专家', category: '风险指标' },
    { id: 'marketRisk', label: '市场冲击风险', icon: TrendingUp, difficulty: '专家', category: '风险指标' },
    { id: 'caseAnalysis', label: '经典案例分析', icon: BarChart3, difficulty: '专家', category: '实战应用' },
    { id: 'caseStudies', label: '案例深度剖析', icon: TrendingUp, difficulty: '专家', category: '实战应用' },
    { id: 'implementation', label: '最佳实践指南', icon: Lightbulb, difficulty: '专家', category: '实战应用' }
  ];

  useEffect(() => {
    localStorage.setItem('completed_tutorials', JSON.stringify(completedTutorials));
  }, [completedTutorials]);

  const markCompleted = (tutorialId: string) => {
    if (!completedTutorials.includes(tutorialId)) {
      setCompletedTutorials([...completedTutorials, tutorialId]);
    }
  };

  // 教程内容定义 - 紧紧围绕加密货币指标学习，只讲解知识，不包含代码
  const tutorialContent = {
    cryptoBasics: {
      title: '加密货币基础认知',
      icon: Bitcoin,
      estimatedTime: '15分钟',
      difficulty: '入门',
      content: `
# 🪙 加密货币基础认知

## 🎯 学习目标
全面掌握加密货币的基本概念、发展历程、市场生态和技术基础，为深入学习风险指标体系奠定坚实的理论基础

## 📋 一、加密货币的起源与演变

### 1.1 比特币的诞生 (2008-2009)
**背景**：2008年全球金融危机暴露了传统金融体系的脆弱性，中本聪发表了《比特币：一种点对点的电子现金系统》白皮书。

**核心创新**：
- **去中心化账本**：无需中央机构，通过分布式网络维护交易记录
- **工作量证明**：通过计算难题确保网络安全，防止双花问题
- **有限供应**：总量2100万枚的稀缺性设计，模拟数字黄金属性

### 1.2 区块链技术的诞生
区块链最初作为比特币的底层技术，后来被抽象出来成为通用基础设施：

**技术演进**：
- **区块链1.0**：数字货币和支付系统，比特币为代表
- **区块链2.0**：智能合约和去中心化应用，以太坊为代表
- **区块链3.0**：跨链交互和大规模应用，Polkadot、Cosmos等为代表

### 1.3 加密货币市场的成熟
**发展历程**：
- **2010-2013**：概念验证阶段，价格从0.0008美元上涨到最高266美元
- **2014-2017**：技术创新阶段，出现大量山寨币和ICO热潮
- **2018-2020**：机构入场阶段，传统金融开始关注和布局
- **2021至今**：大规模 adoption 阶段，DeFi、NFT、Web3等生态蓬勃发展

## 📊 二、加密货币的分类体系详解

### 2.1 市值排名前十大币种深度分析

#### 1. **比特币 (Bitcoin - BTC)**
- **市值占比**：约40-50%的加密货币总市值
- **定位**：数字黄金，主要用于价值存储
- **技术特点**：PoW共识，区块时间10分钟，供应上限2100万
- **风险特征**：流动性最佳，但波动性仍然极高

#### 2. **以太坊 (Ethereum - ETH)**
- **市值占比**：约15-20%的加密货币总市值
- **定位**：智能合约平台和DeFi基础设施
- **技术特点**：PoS共识，Gas费用机制，支持复杂合约
- **风险特征**：网络拥堵严重，Gas费高昂，存在智能合约风险

#### 3. **币安币 (Binance Coin - BNB)**
- **市值占比**：约3-5%的加密货币总市值
- **定位**：交易所生态代币
- **技术特点**：BEP-2/BEP-20双标准，支持跨链交易
- **风险特征**：与交易所命运紧密相连，监管风险较高

#### 4. **索拉纳 (Solana - SOL)**
- **市值占比**：约2-3%的加密货币总市值
- **定位**：高性能智能合约平台
- **技术特点**：PoS共识，区块时间400ms，支持高并发
- **风险特征**：网络稳定性待验证，存在中心化担忧

#### 5. **卡尔达诺 (Cardano - ADA)**
- **市值占比**：约1-2%的加密货币总市值
- **定位**：学术驱动的区块链平台
- **技术特点**：PoS共识，采用形式化验证，注重安全性
- **风险特征**：发展相对缓慢，技术复杂度较高

#### 6. **瑞波币 (XRP - XRP)**
- **市值占比**：约1-2%的加密货币总市值
- **定位**：跨境支付解决方案
- **技术特点**：Ripple共识，交易确认速度极快
- **风险特征**：面临重大法律诉讼，监管不确定性高

### 2.2 加密货币生态系统多维度分类

#### 按功能属性分类
**支付类货币**：
- 比特币 (BTC)、莱特币 (LTC)、比特币现金 (BCH)
- **特点**：注重价值存储和日常支付，强调安全性
- **风险**：价格波动影响支付稳定性

**智能合约平台**：
- 以太坊 (ETH)、索拉纳 (SOL)、波卡 (DOT)、雪崩 (AVAX)
- **特点**：支持复杂应用开发，提供图灵完备计算能力
- **风险**：合约漏洞、网络拥堵、Gas费用波动

**去中心化交易所代币**：
- Uniswap (UNI)、SushiSwap (SUSHI)、PancakeSwap (CAKE)
- **特点**：自动化做市商机制，提供去中心化交易服务
- **风险**：无常损失、流动性挖矿风险、治理风险

**稳定币**：
- USDT、USDC、DAI、BUSD、FRAX
- **特点**：价值稳定，与法定货币或资产挂钩
- **风险**：储备充足性、透明度、去中心化程度

**治理代币**：
- Compound (COMP)、Maker (MKR)、Aave (AAVE)、Curve (CRV)
- **特点**：持有者可参与协议治理和收益分配
- **风险**：治理攻击、代币经济模型设计缺陷

**预言机代币**：
- Chainlink (LINK)、Band Protocol (BAND)、API3 (API3)
- **特点**：提供区块链与外部世界的数据连接
- **风险**：数据源可靠性、预言机操纵攻击

#### 按市值规模分类
**大型市值币种 (Top 10)**：
- 市值超过100亿美元，流动性良好
- 适合机构投资者和主流应用

**中型市值币种 (Top 11-100)**：
- 市值10-100亿美元，具有一定影响力
- 适合风险偏好较高的投资者

**小型市值币种 (Top 101-1000)**：
- 市值1-10亿美元，增长潜力大
- 风险极高，流动性较差

**微型市值币种 (1000名以后)**：
- 市值小于1亿美元，多为早期项目
- 投机性极强，风险最大

## 💱 三、加密货币交易机制深度解析

### 3.1 订单类型详解

#### 基本订单类型
**市价单 (Market Order)**：
- **执行原理**：以当前市场最优价格立即执行
- **优势**：保证成交速度，适合急于成交的情况
- **劣势**：成交价格不确定，可能出现较大滑点
- **适用场景**：需要立即执行的交易，价格不是主要考虑因素

**限价单 (Limit Order)**：
- **执行原理**：设定具体价格，只有市场价格达到该水平时才执行
- **优势**：价格确定性高，可以获得更好的成交价
- **劣势**：可能无法成交，占用保证金时间较长
- **适用场景**：追求最佳价格，不急于成交的交易

**止损单 (Stop Order)**：
- **执行原理**：当价格达到预设水平时自动转换为市价单
- **优势**：自动控制风险，避免情绪化决策
- **劣势**：在极端市场情况下可能出现较大滑点
- **适用场景**：风险控制，设置止损点保护本金

**止损限价单 (Stop-Limit Order)**：
- **执行原理**：结合止损单和限价单，在触发后以限价方式执行
- **优势**：控制滑点范围，在保证成交的同时限制价格偏差
- **劣势**：在流动性差的市场可能无法完全执行
- **适用场景**：需要在控制风险的同时获得较好价格的交易

#### 高级订单类型
**冰山订单 (Iceberg Order)**：
- **执行原理**：将大单拆分为多个小单逐步执行
- **优势**：隐藏交易意图，避免影响市场价格
- **劣势**：执行时间较长，累计手续费较高

**时间加权平均价格单 (TWAP)**：
- **执行原理**：在指定时间段内均匀分布订单执行
- **优势**：最小化市场冲击，获得平均价格
- **劣势**：执行周期较长，不适合快速交易

**成交量加权平均价格单 (VWAP)**：
- **执行原理**：根据市场成交量分布执行订单
- **优势**：跟随市场成交节奏，获得更具代表性的价格
- **劣势**：依赖市场流动性，可能无法精确执行

### 3.2 撮合引擎的工作原理

#### 订单簿机制详解
**订单簿结构**：
- **买单簿 (Bid Book)**：显示所有买入挂单，按价格从高到低排序
- **卖单簿 (Ask Book)**：显示所有卖出挂单，按价格从低到高排序
- **价差 (Spread)**：卖一价与买一价之间的差价

**撮合原则**：
- **价格优先**：相同方向的订单，价格最优的优先成交
- **时间优先**：相同价格的订单，按照挂单时间顺序成交
- **先进先出**：遵循时间顺序，确保公平性

#### 滑点现象分析
**滑点产生原因**：
- **订单簿深度不足**：大单交易时买单或卖单数量不足
- **市场波动**：价格快速变动导致实际成交价偏离预期
- **流动性缺失**：极端行情下缺乏足够的市场深度

**滑点控制策略**：
- 分批下单：将大单拆分为多个小单执行
- 限价单替代市价单：在可接受的价格范围内交易
- 选择交易时段：在流动性好的时段执行交易

## ⚠️ 四、加密货币市场的风险类型体系

### 4.1 市场风险 (Market Risk)

#### 价格波动风险
**成因分析**：
- **信息不对称**：市场参与者获取信息的时间差和质量差
- **情绪驱动**：FOMO和恐慌情绪导致非理性行为
- **杠杆效应**：杠杆交易放大价格波动幅度
- **流动性影响**：流动性不足导致价格异常波动

**量化特征**：
- **波动率**：比特币日波动率通常在3-10%，极端情况可达20%以上
- **相关性**：加密货币之间存在较高相关性，市场整体联动性强
- **非对称性**：下跌波动通常大于上涨波动

#### 流动性风险
**表现形式**：
- **成交量不足**：小盘币种成交量过低，难以快速买卖
- **买卖价差过大**：买卖价差超过正常水平，交易成本升高
- **市场深度不足**：订单簿深度不够，大单交易困难

**影响因素**：
- **市值规模**：市值越小，流动性风险越高
- **交易活跃度**：交易频率和参与度影响流动性
- **市场情绪**：极端行情下流动性往往急剧恶化

#### 系统性风险
**来源分析**：
- **宏观经济因素**：通胀、通缩、利率变化影响整体市场
- **监管政策变化**：各国监管态度的转变影响市场信心
- **技术事件**：重大安全事件或技术故障影响整个生态

### 4.2 技术风险 (Technical Risk)

#### 智能合约风险
**漏洞类型**：
- **重入攻击**：合约被重复调用导致资金损失
- **整数溢出**：数学运算超出数据类型范围
- **访问控制缺陷**：权限检查不严格导致越权操作
- **预言机操纵**：外部数据源被操纵影响合约执行

**预防措施**：
- 代码审计：专业的安全审计服务
- 形式化验证：数学方法证明合约正确性
- 保险机制：DeFi保险协议提供风险保障

#### 网络安全风险
**攻击类型**：
- **交易所黑客攻击**：通过技术手段窃取交易所资金
- **钱包钓鱼攻击**：通过假冒应用窃取私钥信息
- **51%攻击**：控制网络算力发起双花攻击

**安全实践**：
- 多重签名：交易需要多个私钥签名确认
- 硬件钱包：冷存储保护私钥安全
- 定期备份：重要数据的多重备份策略

#### 共识机制风险
**PoW风险**：
- 能源消耗巨大，环境影响受关注
- 算力集中化，出现矿池垄断现象
- 区块重组风险，双花攻击可能性

**PoS风险**：
- 富者越富，代币持有量决定权益
- 无惩罚机制可能导致验证者作恶
- 长期持有收益递减影响网络安全

### 4.3 操作风险 (Operational Risk)

#### 私钥管理风险
**常见问题**：
- 私钥丢失：忘记备份或存储介质损坏
- 私钥泄露：被黑客窃取或内部人员泄露
- 私钥错误：转账地址输入错误导致资金丢失

**最佳实践**：
- 多重备份：采用多种备份方式和存储介质
- 助记词保护：使用标准BIP39助记词
- 冷热分离：大额资金采用冷钱包存储

#### 钓鱼攻击风险
**攻击手法**：
- 假冒网站：仿冒正规交易所或钱包网站
- 邮件钓鱼：伪造官方邮件诱导点击恶意链接
- 社交工程：通过电话或社交媒体获取信任

**防范策略**：
- 验证域名：仔细检查网站URL和SSL证书
- 双重验证：启用2FA保护账户安全
- 教育培训：提高安全意识和识别能力

#### 监管合规风险
**监管环境**：
- **友善地区**：新加坡、日本、瑞士等监管相对宽松
- **严格地区**：中国、韩国等对加密货币态度谨慎
- **不确定地区**：美国、欧盟等监管政策仍在演变

**合规考虑**：
- KYC/AML：了解你的客户/反洗钱要求
- 税务申报：加密货币交易的税务处理
- 报告义务：大额交易的可疑活动报告

### 4.4 交易风险 (Trading Risk)

#### 杠杆交易风险
**杠杆机制**：
- **保证金交易**：用少量资金控制更大头寸
- **强制平仓**：保证金不足时自动平仓
- ** liquidation cascade**：连锁清算导致价格雪崩

**风险控制**：
- 合理杠杆倍数：保守投资者建议不超过3倍杠杆
- 止损设置：及时止损避免重大损失
- 仓位管理：不要将所有资金投入单一交易

#### 流动性风险
**市场极端情况**：
- **闪崩事件**：价格在极短时间内大幅下跌
- **流动性枯竭**：市场深度不足无法正常交易
- **市场暂停**：交易所临时停止交易功能

**应对策略**：
- 分散交易：不要集中在一个交易所交易
- 备用方案：准备多个交易渠道和资金来源
- 应急预案：制定极端情况下的应对措施

## 🎯 五、加密货币风险指标体系的必要性

### 5.1 市场特殊性对风险管理的要求

#### 24小时不间断运行
传统金融市场有明确的开闭市时间，而加密货币市场7×24小时运行：
- **持续监控需求**：需要全天候的风险监控系统
- **疲劳效应**：长时间运行可能导致系统疲劳和漏洞暴露
- **时区差异**：全球性市场需要考虑不同时区的交易行为

#### 价格波动剧烈
加密货币价格波动幅度远超传统资产：
- **极端波动事件**：单日波动超过20%的情况时有发生
- **快速反应需求**：需要毫秒级别的风险识别和响应
- **连锁反应**：一个币种的异动可能迅速传导到整个市场

#### 技术复杂度高
区块链技术尚在快速发展中：
- **技术风险多样**：智能合约漏洞、共识机制缺陷、网络攻击等
- **更新频率快**：协议升级、硬分叉等事件频繁发生
- **兼容性挑战**：不同区块链之间的互操作性问题

### 5.2 投资者保护的迫切需求

#### 普通投资者的局限性
散户投资者普遍缺乏专业知识和工具：
- **信息获取难度**：区块链数据复杂，难以实时监控
- **风险识别能力**：难以区分正常波动和异常风险
- **应急处置能力**：面对风险事件时缺乏有效应对措施

#### 专业工具的缺失
传统金融的风险管理工具不适用于加密货币：
- **数据格式不同**：区块链数据的结构和获取方式特殊
- **风险类型独特**：许多风险类型在传统金融中不存在
- **实时性要求高**：需要毫秒级别的监控和响应能力

### 5.3 合规监管的要求

#### 金融监管的演变
各国监管机构逐渐认识到加密货币的重要性：
- **KYC/AML要求**：了解客户身份，反洗钱监管
- **交易报告义务**：可疑交易的大额报告制度
- **消费者保护**：投资者教育和风险警示要求

#### 平台合规压力
交易平台面临越来越严格的监管要求：
- **风险监控体系**：建立完善的风险识别和控制体系
- **报告和披露**：定期向监管机构报告风险状况
- **投资者保护**：采取措施保护投资者利益免受损失

### 5.4 技术风险防控的必要性

#### 区块链技术的成熟度
区块链技术仍处于快速发展阶段：
- **协议漏洞**：共识机制、加密算法可能存在未知漏洞
- **升级风险**：协议升级可能引入新的安全问题
- **互操作风险**：跨链交互增加复杂性和风险点

#### DeFi生态的复杂性
去中心化金融引入新的风险维度：
- **合约风险**：数百万美元的资金依赖代码正确性
- **预言机风险**：外部数据引入的操纵和错误风险
- **流动性风险**：自动做市商机制的独特风险特征

## 📚 六、系统化学习路径与方法

### 6.1 分阶段学习策略

#### 第一阶段：基础认知 (1-2周)
**学习重点**：
- 加密货币的基本概念和发展历程
- 区块链技术的核心原理和工作机制
- 主要币种的特性和应用场景

**学习目标**：
- 理解加密货币的本质和价值 proposition
- 掌握区块链的基本技术概念
- 建立对加密货币市场的整体认识

#### 第二阶段：市场理解 (2-3周)
**学习重点**：
- 加密货币的价格形成机制
- 市场供需关系和周期性规律
- 不同币种的投资价值分析

**学习目标**：
- 理解市场运行的基本规律
- 掌握基本的投资分析方法
- 培养市场洞察力和判断力

#### 第三阶段：风险识别 (3-4周)
**学习重点**：
- 各类风险类型的识别方法
- 风险产生的机理和影响因素
- 风险评估的基本框架和工具

**学习目标**：
- 建立全面的风险意识
- 掌握风险识别和评估的基本技能
- 培养风险管理思维方式

#### 第四阶段：指标学习 (4-6周)
**学习重点**：
- 风险监控指标的构建方法
- 量化分析工具的使用技巧
- 指标体系的优化和调整

**学习目标**：
- 熟练掌握风险指标的计算和应用
- 学会使用量化工具进行风险评估
- 能够独立构建适合的指标体系

#### 第五阶段：实战应用 (持续学习)
**学习重点**：
- 真实案例的分析和复盘
- 模拟交易和风险控制实践
- 实际投资策略的制定和执行

**学习目标**：
- 将理论知识应用于实际场景
- 培养实战经验和决策能力
- 建立持续学习和改进的习惯

### 6.2 学习方法建议

#### 理论与实践结合
**渐进式学习**：
- 从简单概念入手，逐步深入复杂内容
- 理论学习与实际操作相结合
- 定期复习巩固已学知识

**实践驱动**：
- 使用模拟账户进行交易练习
- 参与社区讨论和经验分享
- 跟踪市场动态和行业新闻

#### 持续学习习惯
**知识更新**：
- 关注行业动态和技术发展
- 学习新出现的风险类型和应对方法
- 跟踪监管政策的最新变化

**技能提升**：
- 掌握数据分析和量化工具
- 学习编程和自动化脚本编写
- 培养批判性思维和独立判断能力

#### 风险意识培养
**思维转变**：
- 从机会导向转向风险导向
- 始终将风险管理置于首位
- 建立防御性投资思维

**行为准则**：
- 永远不要投资无法承受损失的资金
- 保持理性，避免情绪化决策
- 持续学习，提升风险管理能力

通过系统化的学习路径和科学的方法，你将逐步建立起对加密货币市场的全面认识和专业风险管理能力，为未来的投资和风险控制实践奠定坚实基础。
      `
    },

    blockchainTech: {
      title: '区块链技术原理',
      icon: Network,
      estimatedTime: '15分钟',
      difficulty: '入门',
      content: `
# ⛓️ 区块链技术原理

## 🎯 学习目标
深入理解区块链的核心技术原理，掌握分布式账本、智能合约、共识机制等关键概念，为学习加密货币风险指标奠定技术基础

## 🔗 一、区块链技术核心概念

### 1.1 区块链的本质
区块链是一种分布式数据库技术，具有以下核心特征：

#### 分布式账本 (Distributed Ledger)
**技术内涵**：
- 数据在多个节点间分布式存储和维护
- 每个节点都保存完整的数据副本
- 无需中央权威机构进行协调和管理

**技术优势**：
- **容错性强**：单个节点故障不影响整体系统运行
- **抗审查性**：没有单一控制点，难以被外部干预
- **透明性高**：所有交易记录公开可见，任何人都可验证

#### 不可篡改性 (Immutability)
**实现机制**：
- 密码学哈希函数保证数据完整性
- 区块链接结构确保历史记录不可修改
- 共识机制防止恶意节点篡改数据

**技术保障**：
- **哈希函数特性**：SHA-256等单向哈希函数确保数据指纹唯一
- **默克尔树结构**：高效验证交易数据完整性
- **数字签名技术**：确保交易发起者的身份真实性

#### 去中心化 (Decentralization)
**组织架构**：
- P2P网络结构，无中心化服务器
- 节点平等参与网络维护和决策
- 权力和控制权在网络参与者之间分配

**实现方式**：
- **点对点通信**：节点间直接通信，无需中介
- **共识算法**：网络集体决策区块有效性
- **激励机制**：代币奖励鼓励节点参与维护

### 1.2 区块结构解析
区块链的基本组成单元是区块，每个区块包含以下关键信息：

#### 区块头 (Block Header)
**核心字段**：
- **版本号**：区块格式版本标识
- **前区块哈希**：指向前一个区块的哈希值
- **默克尔根**：区块内所有交易的默克尔树根哈希
- **时间戳**：区块创建时间
- **难度目标**：工作量证明的难度参数
- **随机数**：PoW共识的nonce值

#### 区块体 (Block Body)
**主要内容**：
- **交易列表**：该区块包含的所有交易记录
- **交易计数**：区块内交易的数量
- **交易数据**：完整的交易详情和数字签名

### 1.3 区块链网络架构
区块链网络由多个参与节点组成，形成复杂的网络拓扑：

#### 节点类型分类
**全节点 (Full Node)**：
- 保存完整的区块链历史记录
- 验证所有交易和区块的有效性
- 参与共识过程和网络维护

**轻节点 (Light Node)**：
- 只保存区块头信息，不存储完整交易数据
- 通过默克尔证明验证交易有效性
- 适用于资源受限的设备

**矿工节点 (Mining Node)**：
- 专门负责计算工作量证明
- 竞争区块打包权并获得奖励
- 维护网络安全和处理能力

**验证节点 (Validator Node)**：
- 在PoS系统中负责区块验证和签名
- 根据持币量获得验证权和奖励
- 维护网络共识和安全性

## ⚡ 二、共识机制详解

### 2.1 工作量证明 (Proof of Work - PoW)

#### 核心原理
**计算难题**：
- 寻找满足难度要求的随机数nonce
- 使区块头哈希值小于难度目标
- 通过计算竞争获得记账权

**数学表达**：
\`\`\`
SHA256(SHA256(block_header)) < target
\`\`\`

#### 安全性保障
**51%攻击防护**：
- 攻击者需要控制超过50%的网络算力
- 算力成本极高，经济上不划算
- 诚实节点总算力优势确保网络安全

#### 能源消耗问题
**资源密集**：
- 全球比特币网络每年消耗数百万度电
- 引发环境可持续性争议
- 推动向绿色共识机制转型

### 2.2 权益证明 (Proof of Stake - PoS)

#### 核心原理
**权益抵押**：
- 验证者根据持币量获得记账权
- 通过抵押代币参与区块验证
- 降低能源消耗，提高效率

**选择机制**：
- 随机选择验证者基于权益权重
- 降低中心化风险
- 提高网络参与度

#### 优势特点
**能源效率**：
- 无需大量计算资源
- 节能环保，降低运营成本
- 支持大规模网络扩展

**安全模型**：
- 经济惩罚机制防止作恶
- 验证者抵押品作为安全保证
- 长期持有代币符合网络利益

### 2.3 其他共识机制

#### 委托权益证明 (DPoS)
**代表选举**：
- 代币持有者选举见证人
- 见证人轮流负责区块生产
- 提高决策效率和网络性能

#### 实用拜占庭容错 (PBFT)
**确定性共识**：
- 适用于联盟链和私有链
- 强一致性保证，无分叉风险
- 适合金融级应用场景

#### 混合共识机制
**PoW + PoS结合**：
- 利用两种机制的互补优势
- 平衡安全性和效率要求
- 适应不同应用场景需求

## 📋 三、智能合约技术

### 3.1 智能合约概念
智能合约是部署在区块链上的自动执行程序，具有以下特征：

#### 自动执行 (Automated Execution)
**触发条件**：
- 预设条件满足时自动执行
- 无需人工干预，提高效率
- 减少人为错误和道德风险

#### 确定性结果 (Deterministic Outcomes)
**可预测性**：
- 相同输入产生相同输出
- 执行结果完全由代码决定
- 排除主观判断和外部影响

#### 不可篡改性 (Immutable)
**代码锁定**：
- 一旦部署无法修改代码逻辑
- 保证合约条款的长期有效性
- 提供可靠的执行保障

### 3.2 智能合约编程
以太坊智能合约使用Solidity语言编写：

#### 基本结构
\`\`\`solidity
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
\`\`\`

#### 关键特性
**状态变量**：存储合约持久状态的数据
**函数**：合约可执行的操作和逻辑
**事件**：向外部通知合约状态变化
**修饰符**：控制函数执行条件和权限

### 3.3 智能合约安全
智能合约面临多种安全风险：

#### 常见漏洞类型
**重入攻击**：
- 合约被递归调用导致资金损失
- 通过fallback函数实现攻击
- 需使用Checks-Effects-Interactions模式

**整数溢出**：
- 算术运算超出数据类型范围
- 导致意外结果或安全漏洞
- 使用SafeMath库或内置检查

**访问控制缺陷**：
- 权限检查不严格导致越权操作
- 缺少onlyOwner等访问控制
- 需实施严格的权限管理

#### 安全最佳实践
**代码审计**：
- 专业的安全审计服务
- 开源代码社区审查
- 自动化漏洞扫描工具

**形式化验证**：
- 数学方法证明合约正确性
- 排除逻辑错误和边界情况
- 提高合约安全可靠性

## 🌉 四、跨链交互技术

### 4.1 区块链孤岛问题
不同区块链网络间无法直接交互的挑战：

#### 互操作性障碍
**技术异构**：
- 不同共识机制难以兼容
- 数据格式和协议不统一
- 缺乏跨链通信标准

**价值孤岛**：
- 资产在各链间无法自由流动
- 限制了区块链技术的整体价值
- 阻碍了大规模应用 adoption

### 4.2 跨链技术解决方案

#### 哈希锁定 (Hash Time Lock Contract - HTLC)
**原子交换原理**：
- 通过哈希锁实现条件支付
- 时间锁提供安全保障
- 无需信任第三方中介

#### 中继链技术 (Relay Chain)
**Polkadot模式**：
- 主链负责跨链通信和共识
- 平行链专注于特定应用
- 共享安全和互操作性

#### 桥接技术 (Bridge)
**跨链桥**：
- 在不同区块链间转移资产
- 锁定原链资产，铸造目标链资产
- 提供流动性桥梁服务

#### 预言机网络 (Oracle Network)
**外部数据接入**：
- 将现实世界数据引入区块链
- 支持跨链数据共享
- 确保数据可靠性和及时性

### 4.3 区块链扩展性解决方案

#### Layer 2 扩容方案
**状态通道**：
- 链下进行频繁小额交易
- 仅在通道开启和关闭时上链
- 大幅提高交易处理能力

**侧链技术**：
- 独立区块链与主链双向锚定
- 扩展交易处理能力
- 保持主链安全性和去中心化

**Rollup技术**：
- 批量处理交易并压缩数据
- 在Layer 1上发布压缩证明
- 显著降低交易成本

## 🔒 五、区块链安全模型

### 5.1 密码学基础
区块链安全建立在坚实的密码学基础上：

#### 非对称加密
**公钥私钥机制**：
- 私钥签名交易，公钥验证身份
- 确保交易发起者身份真实性
- 防止交易伪造和篡改

#### 哈希函数
**数据完整性**：
- SHA-256等算法生成数据指纹
- 单向性保证无法逆向推导
- 用于区块链接和默克尔树

#### 数字签名
**身份认证**：
- ECDSA椭圆曲线数字签名算法
- 提供不可否认性和完整性
- 比特币和以太坊的核心安全机制

### 5.2 网络安全威胁
区块链网络面临多种安全威胁：

#### 51%攻击
**算力攻击**：
- 控制多数算力发起双花攻击
- 重写交易历史记录
- 破坏网络共识和信任

#### 女巫攻击 (Sybil Attack)
**身份伪造**：
- 创建大量虚假节点身份
- 控制网络决策过程
- 破坏共识机制正常运行

#### 拒绝服务攻击 (DoS Attack)
**网络拥堵**：
- 发送大量垃圾交易占用网络资源
- 提高交易费用和确认延迟
- 影响网络正常运行效率

### 5.3 去中心化安全
**安全假设**：
- 大多数节点保持诚实
- 密码学算法足够强大
- 网络通信相对安全

**风险平衡**：
- 去中心化提升抗审查能力
- 同时增加协调和决策难度
- 需要在安全性和效率间权衡

## 🚀 六、区块链技术的演进趋势

### 6.1 Web3 生态建设
区块链向更广阔的互联网应用扩展：

#### 去中心化身份 (DID)
**自主身份管理**：
- 用户控制自己的数字身份
- 无需依赖中心化平台
- 保护隐私和数据主权

#### 去中心化自治组织 (DAO)
**新型组织形式**：
- 代码即法律的组织治理
- 代币持有者参与决策
- 降低组织运营成本

### 6.2 企业级区块链应用
传统企业开始拥抱区块链技术：

#### 联盟链部署
**行业联盟**：
- 多家企业共同维护区块链网络
- 平衡效率和去中心化需求
- 适用于供应链金融等场景

#### 监管科技 (RegTech)
**合规创新**：
- 区块链提升监管效率
- 智能合约自动化合规检查
- 提高金融体系透明度

### 6.3 技术融合创新
区块链与其他前沿技术结合：

#### AI + 区块链
**智能决策**：
- AI优化共识算法效率
- 区块链确保AI决策可追溯
- 构建可信赖的AI系统

#### IoT + 区块链
**设备经济**：
- 为物联网设备提供身份认证
- 确保设备间数据传输安全
- 支持微支付和资源共享

## 📚 七、学习建议与实践

### 7.1 技术学习路径
**基础阶段**：
- 掌握密码学基本概念
- 理解区块链核心原理
- 学习共识机制工作方式

**进阶阶段**：
- 研究智能合约开发
- 探索DeFi协议设计
- 分析区块链安全模型

**实践阶段**：
- 参与开源项目贡献
- 部署私有链进行测试
- 开发去中心化应用

### 7.2 安全意识培养
**风险识别**：
- 识别常见区块链攻击手法
- 了解智能合约安全漏洞
- 掌握网络安全防护策略

**最佳实践**：
- 使用硬件钱包存储资产
- 验证合约代码安全性
- 保持软件及时更新

### 7.3 持续学习建议
**跟踪技术发展**：
- 关注区块链技术标准演进
- 学习新兴共识机制创新
- 了解跨链技术最新进展

**参与社区**：
- 加入区块链技术社区
- 参与技术讨论和分享
- 贡献开源项目和文档

通过深入理解区块链技术原理，你将能够更好地把握加密货币风险监控的本质，为构建更加安全的区块链生态系统贡献力量。
      `
    },

    indicatorFramework: {
      title: '指标体系框架',
      icon: Target,
      estimatedTime: '15分钟',
      difficulty: '进阶',
      content: `
# 🎯 加密货币指标体系框架

## 🎯 学习目标
理解加密货币风险监控的完整指标框架，掌握MECE原则在风险管理中的应用

## 📊 四维风险监控架构

### 1. 地址与身份维度

#### 账户特征分析
通过分析区块链地址的行为模式和特征来识别潜在风险：

**账户年龄特征**：新创建的地址通常具有更高的风险，因为它们可能与黑产活动相关联。

**交易活跃度**：异常的交易频率可能表明自动化交易、机器人操作或异常的资金活动。

**地址关联网络**：分析地址之间的关联关系，可以发现隐藏的资金转移路径和组织结构。

**行为一致性**：评估地址行为模式的稳定性，异常的行为变化可能表明风险事件的发生。

#### 身份验证机制
通过多维度数据验证地址的真实身份和信誉状况：

**地址声誉评分**：基于历史交易记录和社区反馈计算地址的信誉分数。

**关联风险评估**：分析地址与已知风险地址的关联程度和路径长度。

**行为模式识别**：识别地址的典型交易行为模式，用于异常检测。

#### **身份关联网络**
- **直接关联**：同一个钱包控制的多个地址
- **间接关联**：通过共同交易对手建立的关联
- **行为关联**：交易模式相似的地址群

### 2. 资产与资金维度 (Assets & Capital)

#### 资金流向分析
追踪资金在区块链网络中的流动路径和特征：

**净资金流入**：计算地址在特定时间段内的资金净流入量，识别大规模资金聚集。

**资金来源集中度**：评估资金来源的多样性，过度集中的资金来源表明潜在风险。

**资金流转速度**：测量资金在不同地址间的流转频率，异常快速的流转可能表明洗钱行为。

**金额分布特征**：分析交易金额的分布模式，识别异常的大额或小额交易集中。

#### 资产组合风险
评估地址持有的资产组合的整体风险水平：

**币种集中度风险**：单一币种占比过高导致的非系统性风险。

**流动性风险评估**：持有低流动性代币可能面临的变现困难。

**市值规模风险**：小盘币种面临的价格波动放大效应。

**关联资产风险**：相关资产之间的价格联动和 contagion 效应。

#### **资产组合风险**
- **币种集中度**：单一币种占比过高
- **流动性风险**：持有低流动性代币
- **市值风险**：小盘币价格波动大

### 3. 交易行为维度 (Transaction Behavior)

#### **交易模式识别**
\`\`\`typescript
interface TransactionPattern {
  // 交易时间分布
  timeDistribution: number[];      // 24小时交易分布
  // 交易金额模式
  amountPattern: 'small' | 'large' | 'mixed';
  // 对手方特征
  counterpartyProfile: {
    exchange: boolean;    // 是否为交易所地址
    service: boolean;     // 是否为服务商地址
    individual: boolean;  // 是否为个人地址
  };
  // 交易频率特征
  frequencyPattern: 'burst' | 'steady' | 'random';
}

// 交易行为指标
const transactionIndicators = [
  {
    id: 'C1-01',
    name: '异常交易时间',
    definition: '在非正常时间段的大额交易',
    formula: '交易时间在凌晨2-6点 && 交易金额 > 10000',
    threshold: '触发即告警',
    riskLevel: '中',
    interpretation: '凌晨大额交易可能绕过监管或利用时差'
  },
  {
    id: 'C1-02',
    name: '循环交易检测',
    definition: '资金在同一组地址间循环流转',
    formula: '检测地址间的循环交易模式',
    threshold: '循环路径长度 > 3',
    riskLevel: '高',
    interpretation: '循环交易通常用于操纵市场或洗钱'
  }
];
\`\`\`

#### **市场操纵识别**
- **洗盘行为**：大单频繁挂撤影响价格
- **诱导行为**：虚假挂单诱导他人交易
- **层压行为**：集中挂单影响市场深度

### 4. 市场冲击维度 (Market Impact)

#### **价格影响分析**
\`\`\`typescript
interface MarketImpactAnalysis {
  // 交易规模相对市值
  tradeToMarketCap: number;        // 交易金额 / 币种市值
  // 订单簿深度影响
  orderBookImpact: number;         // 对订单簿深度的影响程度
  // 价格滑点
  priceSlippage: number;           // 实际成交价与报价的差异
  // 市场波动放大
  volatilityAmplification: number; // 对整体市场波动的放大效应
}

// 市场冲击指标
const marketImpactIndicators = [
  {
    id: 'D1-01',
    name: '大额交易冲击',
    definition: '单笔交易对市场价格的冲击程度',
    formula: '交易金额 / 每日交易量 * 价格变化幅度',
    threshold: '> 5%',
    riskLevel: '高',
    interpretation: '大额交易可能造成市场操纵或引发连锁反应'
  },
  {
    id: 'D1-02',
    name: '订单簿操纵',
    definition: '通过大单挂撤影响市场深度的行为',
    formula: '大单挂撤频率 * 价格影响程度',
    threshold: '频繁且有价格影响',
    riskLevel: '高',
    interpretation: '订单簿操纵会误导其他交易者，影响市场公平'
  }
];
\`\`\`

## 🏗️ MECE原则在加密货币风险指标体系中的深度应用

### 互斥性 (Mutually Exclusive) 原则的严格遵循

#### 维度边界清晰定义
MECE原则要求各维度完全独立，互不重叠：

**地址与身份维度 (A)**：
- 专注分析区块链地址的特征和身份属性
- 包括账户年龄、地址关联、身份验证等指标
- 不涉及资金流动的具体金额和方向

**资产与资金维度 (B)**：
- 专注分析资金的流向、规模和组合特征
- 包括资金净流入、资产集中度、流动性风险等指标
- 不涉及交易行为模式和市场影响分析

**交易行为维度 (C)**：
- 专注分析交易行为的模式和特征
- 包括交易频率、时间分布、对手方特征等指标
- 不涉及地址身份验证和市场整体影响

**市场冲击维度 (D)**：
- 专注分析交易对市场整体的影响程度
- 包括价格冲击、市场深度变化、波动放大等指标
- 不涉及具体地址或交易行为的内部特征

#### 互斥性验证矩阵
| 维度 | 核心关注点 | 排除内容 | 验证标准 |
|------|------------|----------|----------|
| 地址与身份 | 账户特征、身份验证 | 资金金额、交易模式 | 是否涉及具体金额 |
| 资产与资金 | 资金流向、资产组合 | 交易行为、市场影响 | 是否涉及行为分析 |
| 交易行为 | 交易模式、时间特征 | 地址身份、市场冲击 | 是否涉及身份验证 |
| 市场冲击 | 价格影响、市场深度 | 地址特征、资金流向 | 是否涉及个体特征 |

### 穷尽性 (Collective Exhaustive) 原则的全面实现

#### 四维架构的逻辑完备性
通过四个维度的组合，覆盖加密货币风险监控的所有关键方面：

**身份风险覆盖**：
- 新账户风险：新创建地址的异常活跃度
- 关联风险：地址间的复杂关联网络
- 身份伪造风险：通过行为模式识别的身份异常

**资金风险覆盖**：
- 资金来源风险：异常集中的资金来源结构
- 资产配置风险：过度集中或高风险资产组合
- 流动性风险：资产变现能力和市场深度

**行为风险覆盖**：
- 操纵风险：通过交易模式识别的市场操纵行为
- 自动化风险：机器人交易和程序化交易的风险
- 时间异常风险：非正常时间段的异常交易行为

**市场风险覆盖**：
- 价格冲击风险：大额交易对市场价格的影响
- 深度影响风险：订单簿稳定性对市场流动性的影响
- 连锁反应风险：局部异常引发的系统性风险

#### 风险类型穷尽性验证
\`\`\`typescript
interface RiskUniverse {
  // 系统性风险：影响整个市场的风险
  systemicRisks: {
    marketWide: '市场崩溃' | '网络攻击' | '监管变化';
    protocolLevel: '共识机制故障' | '智能合约漏洞';
    infrastructure: '交易所宕机' | '网络拥堵';
  };

  // 非系统性风险：影响特定个体或群体的风险
  idiosyncraticRisks: {
    addressLevel: '地址被盗' | '私钥丢失' | '钓鱼攻击';
    transactionLevel: '交易错误' | '滑点损失' | '对手方违约';
    assetLevel: '资产贬值' | '流动性不足' | '技术故障';
  };

  // 复合型风险：多个维度共同作用的风险
  compoundRisks: {
    correlationBased: '资产相关性风险' | '行为传染风险';
    amplification: '杠杆放大风险' | '网络效应风险';
    feedbackLoop: '正反馈循环' | '负反馈循环';
  };
}

// 验证覆盖完整性
const validateRiskCoverage = (indicators: Indicator[]): CoverageReport => {
  const coveredRisks = new Set<string>();
  const missingRisks: string[] = [];

  indicators.forEach(indicator => {
    // 分析指标覆盖的风险类型
    const risks = mapIndicatorToRisks(indicator);
    risks.forEach(risk => coveredRisks.add(risk));
  });

  // 检查是否覆盖所有已知风险类型
  const allKnownRisks = getAllKnownRiskTypes();
  allKnownRisks.forEach(risk => {
    if (!coveredRisks.has(risk)) {
      missingRisks.push(risk);
    }
  });

  return {
    coverage: coveredRisks.size / allKnownRisks.length,
    coveredCount: coveredRisks.size,
    totalCount: allKnownRisks.length,
    missingRisks,
    isComplete: missingRisks.length === 0
  };
};
\`\`\`

#### 动态扩展机制
MECE原则并不意味着框架固定不变，而是要求在扩展时保持原则：

**新风险类型的纳入**：
1. 识别新的风险现象或模式
2. 确定其所属的维度（或创建新维度）
3. 验证新维度与其他维度的互斥性
4. 确认新增后体系的穷尽性

**指标体系的迭代优化**：
1. 基于新的风险案例调整指标权重
2. 根据市场变化更新阈值设定
3. 引入新的检测技术和算法
4. 保持整体框架的MECE特性

## 🏛️ 四维风险监控架构的系统性设计

### 架构层次分析

#### 数据采集层 (Data Collection Layer)
**原始数据获取**：
- 区块链全网交易数据实时同步
- 订单簿深度数据高频采集
- 链上地址行为历史追溯
- 市场价格和流动性指标监控

#### 特征提取层 (Feature Extraction Layer)
**多维度特征工程**：
- 地址特征：年龄、活跃度、关联度等
- 资金特征：流入流出、集中度、流动性等
- 行为特征：频率、模式、时间分布等
- 市场特征：深度、波动、冲击等

#### 风险评估层 (Risk Assessment Layer)
**指标计算与评估**：
- 单个指标的计算和阈值判断
- 多指标综合风险评分
- 风险等级的动态调整
- 异常模式的识别和预警

#### 决策响应层 (Decision & Response Layer)
**智能响应机制**：
- 风险等级对应的响应策略
- 自动化的干预措施执行
- 人工审核和专家决策
- 响应效果的持续监控

### 架构优势分析

#### 可扩展性 (Scalability)
**水平扩展**：
- 各维度可独立扩展新的指标
- 新风险类型可无缝集成到对应维度
- 系统容量可随数据规模线性增长

#### 容错性 (Fault Tolerance)
**模块化设计**：
- 单维度故障不影响其他维度运行
- 指标计算失败的降级处理机制
- 数据源异常时的备用方案

#### 实时性 (Real-time Performance)
**并行处理**：
- 四个维度可并行计算风险指标
- 分布式计算架构支持高并发
- 流处理技术保证实时性要求

## 📊 指标优先级与响应体系

### 三级响应机制的量化设计

#### P0级响应 (Critical - 立即响应)
**触发条件**：
- 可能造成重大经济损失 (>100万美元)
- 影响系统稳定性的严重风险
- 涉及监管合规的紧急情况

**响应标准**：
- 响应时间：<5分钟
- 处理方式：自动冻结 + 立即通知
- 参与人员：安全团队 + 高层领导
- 报告要求：实时同步监管机构

#### P1级响应 (High - 重点关注)
**触发条件**：
- 造成较大损失 (10-100万美元)
- 需要专项调查的复杂风险
- 影响业务连续性的重要事件

**响应标准**：
- 响应时间：<1小时
- 处理方式：人工审核 + 专项调查
- 参与人员：风控团队 + 业务负责人
- 报告要求：每日更新调查进展

#### P2级响应 (Medium - 常规监控)
**触发条件**：
- 一般性风险事件 (<10万美元)
- 用于统计分析的常规异常
- 潜在风险的早期预警信号

**响应标准**：
- 响应时间：<24小时
- 处理方式：数据记录 + 定期分析
- 参与人员：风控分析师
- 报告要求：每周风险总结报告

### 动态优先级调整机制

#### 基于上下文的智能调整
\`\`\`typescript
class DynamicPriorityAdjuster {
  // 基于市场环境的优先级调整
  adjustPriority(basePriority: RiskPriority, context: MarketContext): RiskPriority {
    const adjustments = {
      // 高波动市场：降低P2阈值，提高警惕性
      highVolatility: this.adjustForVolatility(context.volatility),
      // 大额交易时段：提高大单监控优先级
      largeTradePeriod: this.adjustForTradeSize(context.avgTradeSize),
      // 监管敏感期：提高合规相关风险优先级
      regulatoryPeriod: this.adjustForRegulatory(context.regulatoryFocus),
      // 市场情绪极度悲观：提高系统性风险优先级
      extremePessimism: this.adjustForSentiment(context.marketSentiment)
    };

    return this.combineAdjustments(basePriority, adjustments);
  }

  // 基于历史表现的优先级优化
  optimizeBasedOnHistory(alertHistory: AlertRecord[]): PriorityRules {
    const falsePositives = alertHistory.filter(a => a.wasFalsePositive);
    const missedRisks = alertHistory.filter(a => a.wasMissedRisk);

    // 分析误报模式，调整阈值
    const thresholdAdjustments = this.analyzeFalsePositives(falsePositives);

    // 分析漏报模式，降低阈值
    const sensitivityAdjustments = this.analyzeMissedRisks(missedRisks);

    return this.generateOptimizedRules(thresholdAdjustments, sensitivityAdjustments);
  }
}
\`\`\`

## 🎯 指标体系设计的核心原则

### 1. 可量化原则 (Quantifiable)
每个指标必须有明确的计算公式和量化标准：

#### 明确定义要求
\`\`\`typescript
interface IndicatorSpecification {
  // 必须有明确的业务定义
  definition: string;

  // 必须有可执行的计算公式
  formula: string;

  // 必须有具体的计算参数
  parameters: {
    dataSources: string[];    // 数据来源
    timeWindow: string;       // 时间窗口
    aggregationMethod: string; // 聚合方法
  };

  // 必须提供计算示例
  calculationExample: {
    input: Record<string, any>;
    output: number;
    explanation: string;
  };

  // 必须说明业务价值
  businessValue: {
    riskType: string;         // 识别的风险类型
    impact: string;          // 潜在影响
    prevention: string;      // 预防措施
  };
}
\`\`\`

### 2. 可操作性原则 (Actionable)
指标触发后必须有明确的应对措施：

#### 响应策略关联
\`\`\`typescript
interface IndicatorActionMapping {
  indicatorId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  // 自动化响应措施
  automatedActions: Action[];

  // 人工干预要求
  manualIntervention: {
    required: boolean;
    department: string;
    timeframe: string;
    escalationPath: string[];
  };

  // 监控和反馈机制
  monitoring: {
    keyMetrics: string[];
    followUpFrequency: string;
    successCriteria: string[];
  };
}
\`\`\`

### 3. 成本效益原则 (Cost-Effective)
指标体系的运行成本必须与带来的收益相匹配：

#### 效益评估框架
\`\`\`typescript
interface CostBenefitAnalysis {
  // 实施成本
  costs: {
    development: number;      // 开发成本
    maintenance: number;     // 维护成本
    operational: number;     // 运营成本
  };

  // 收益评估
  benefits: {
    lossPrevention: number;  // 损失预防金额
    efficiencyGain: number;  // 效率提升收益
    riskReduction: number;   // 风险降低价值
  };

  // ROI计算
  roi: {
    calculation: string;
    currentValue: number;
    projectedValue: number;
    paybackPeriod: number;
  };
}
\`\`\`

## 🚀 学习路径与实践指南

### 阶段一：框架理解 (基础学习)
**学习重点**：
- 掌握MECE原则的核心思想
- 理解四维风险监控架构的逻辑
- 熟悉各维度的职责边界和关系

**实践建议**：
- 绘制四维架构的思维导图
- 分析典型案例的维度归属
- 讨论新风险类型的维度分类

### 阶段二：指标学习 (进阶学习)
**学习重点**：
- 深入理解各维度的具体指标
- 掌握指标计算方法和阈值设定
- 学习指标间的关联和综合应用

**实践建议**：
- 动手计算示例指标的值
- 分析历史数据的指标表现
- 设计新的风险指标

### 阶段三：系统应用 (高级学习)
**学习重点**：
- 理解指标体系的整体协调机制
- 掌握响应策略的制定和执行
- 学习体系的持续优化方法

**实践建议**：
- 参与风险事件的调查和处理
- 设计完整的风险监控策略
- 评估和优化现有指标体系

通过深入学习这个四维风险监控架构，你将建立起系统化的风险管理思维，为加密货币领域的专业风险控制奠定坚实基础。
      `
    },

    addressRisk: {
      title: '地址风险指标',
      icon: Users,
      estimatedTime: '20分钟',
      difficulty: '进阶',
      content: `
# 👥 地址与身份风险指标体系

## 🎯 学习目标
深入理解区块链地址的风险特征分析，掌握身份验证机制和关联网络分析方法，建立地址维度的风险识别能力

## 📍 一、地址特征分析基础

### 1.1 地址生命周期特征
区块链地址从创建到使用经历不同的生命周期阶段，每个阶段具有独特的风险特征：

#### 账户年龄分析 (Account Age)
**核心指标**：地址创建至今的时间长度

**风险含义**：
- **新地址风险**：刚创建的地址通常具有更高的风险，因为它们可能与黑产活动相关联
- **老地址信誉**：长期存在的地址通常积累了一定的信誉历史
- **异常活跃**：突然激活的休眠地址可能表明风险事件的发生

**计算方法**：
\`\`\`typescript
interface AddressAgeAnalysis {
  // 地址创建时间
  creationTime: Date;
  // 首次交易时间
  firstTransactionTime: Date;
  // 最后交易时间
  lastTransactionTime: Date;
  // 地址年龄（天）
  ageInDays: number;
  // 活跃天数
  activeDays: number;
  // 休眠天数
  dormantDays: number;
}

// 风险评分计算
const calculateAgeRisk = (address: AddressAgeAnalysis): number => {
  const ageInDays = address.ageInDays;

  // 新地址风险权重更高
  if (ageInDays < 1) return 0.9;        // 24小时内创建
  if (ageInDays < 7) return 0.7;        // 1周内创建
  if (ageInDays < 30) return 0.5;       // 1月内创建
  if (ageInDays < 90) return 0.3;       // 3月内创建
  if (ageInDays < 365) return 0.1;      // 1年内创建

  // 老地址风险较低，但需考虑休眠激活
  const dormantRatio = address.dormantDays / address.ageInDays;
  if (dormantRatio > 0.8 && address.activeDays > 0) {
    return 0.4; // 长期休眠后突然激活
  }

  return 0.05; // 正常老地址
};
\`\`\`

#### 交易活跃度评估 (Activity Level)
**核心指标**：地址的交易频率和活跃程度

**风险含义**：
- **异常频率**：过于频繁的交易可能表明自动化操作或异常行为
- **突发活跃**：突然增加的交易频率可能表明风险事件的发生
- **不规律模式**：不规律的交易模式可能表明身份伪装或异常使用

**量化指标**：
\`\`\`typescript
interface ActivityMetrics {
  // 总交易次数
  totalTransactions: number;
  // 日均交易次数
  dailyTransactionRate: number;
  // 交易频率标准差
  frequencyStdDev: number;
  // 活跃时间分布
  timeDistribution: Map<string, number>; // 小时 -> 交易次数
  // 交易金额分布
  amountDistribution: {
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
  };
}

// 异常活跃检测
const detectAnomalousActivity = (activity: ActivityMetrics, baseline: ActivityMetrics): ActivityRisk => {
  const frequencyAnomaly = Math.abs(activity.dailyTransactionRate - baseline.dailyTransactionRate) /
                          baseline.dailyTransactionRate;

  const amountAnomaly = activity.amountDistribution.stdDev / baseline.amountDistribution.stdDev;

  const timeAnomaly = calculateTimeDistributionAnomaly(activity.timeDistribution, baseline.timeDistribution);

  return {
    frequencyRisk: Math.min(frequencyAnomaly, 1),
    amountRisk: Math.min(amountAnomaly, 1),
    timeRisk: timeAnomaly,
    overallRisk: (frequencyAnomaly + amountAnomaly + timeAnomaly) / 3
  };
};
\`\`\`

### 1.2 地址关联网络分析
区块链地址之间通过交易建立复杂的关联关系，形成网络结构：

#### 直接关联分析 (Direct Connections)
**关联类型**：
- **共同交易**：地址之间直接发生转账交易
- **多重交互**：地址之间存在多次交易记录
- **交易链条**：通过中间地址建立的间接关联

**风险识别**：
\`\`\`typescript
interface AddressConnection {
  sourceAddress: string;
  targetAddress: string;
  connectionType: 'direct' | 'indirect' | 'common_counterparty';
  strength: number; // 关联强度 0-1
  transactionCount: number;
  totalVolume: number;
  timeSpan: number; // 关联持续时间（天）
  riskScore: number; // 关联风险评分
}

// 关联强度计算
const calculateConnectionStrength = (connection: AddressConnection): number => {
  const volumeWeight = Math.min(connection.totalVolume / 100000, 1); // 交易量权重
  const frequencyWeight = Math.min(connection.transactionCount / 10, 1); // 频率权重
  const timeWeight = Math.min(connection.timeSpan / 365, 1); // 时间跨度权重

  return (volumeWeight * 0.4 + frequencyWeight * 0.3 + timeWeight * 0.3);
};
\`\`\`

#### 网络中心性分析 (Network Centrality)
**中心性指标**：
- **度中心性**：地址的直接连接数量
- **中介中心性**：地址在网络路径中的中介作用
- **接近中心性**：地址到其他地址的平均距离

**风险含义**：
\`\`\`typescript
interface NetworkCentrality {
  degreeCentrality: number;        // 度中心性
  betweennessCentrality: number;   // 中介中心性
  closenessCentrality: number;     // 接近中心性
  eigenvectorCentrality: number;   // 特征向量中心性
}

// 网络风险评估
const assessNetworkRisk = (centrality: NetworkCentrality, networkSize: number): NetworkRisk => {
  // 高中心性地址通常具有更高风险
  const degreeRisk = centrality.degreeCentrality / networkSize;
  const betweennessRisk = centrality.betweennessCentrality;
  const eigenvectorRisk = centrality.eigenvectorCentrality;

  // 综合风险评分
  const overallRisk = (degreeRisk + betweennessRisk + eigenvectorRisk) / 3;

  return {
    centralityRisk: overallRisk,
    influenceLevel: overallRisk > 0.7 ? 'high' : overallRisk > 0.4 ? 'medium' : 'low',
    monitoringPriority: overallRisk > 0.6 ? 'P0' : overallRisk > 0.3 ? 'P1' : 'P2'
  };
};
\`\`\`

## 🔍 二、身份验证机制详解

### 2.1 地址声誉评分系统
基于历史行为和外部数据源构建地址信誉评估体系：

#### 行为历史分析
**正面行为指标**：
- 长期稳定交易记录
- 与知名机构或交易所的关联
- 参与合法的DeFi协议
- 持有时间较长的资产

**负面行为指标**：
- 与已知风险地址的关联
- 异常的交易模式
- 参与可疑的资金活动
- 频繁的地址变更

#### 多源数据融合
**数据来源整合**：
\`\`\`typescript
interface ReputationDataSources {
  // 链上行为数据
  onChainBehavior: OnChainMetrics;
  // 外部风险数据库
  externalDatabases: RiskDatabase[];
  // 社区反馈数据
  communityFeedback: CommunityData;
  // 监管机构数据
  regulatoryData: RegulatoryInfo;
}

// 综合声誉评分
class ReputationScorer {
  private weights = {
    onChainBehavior: 0.4,
    externalDatabases: 0.3,
    communityFeedback: 0.2,
    regulatoryData: 0.1
  };

  calculateReputationScore(address: string, sources: ReputationDataSources): ReputationScore {
    const onChainScore = this.scoreOnChainBehavior(sources.onChainBehavior);
    const externalScore = this.scoreExternalDatabases(address, sources.externalDatabases);
    const communityScore = this.scoreCommunityFeedback(sources.communityFeedback);
    const regulatoryScore = this.scoreRegulatoryData(sources.regulatoryData);

    const overallScore = (
      onChainScore * this.weights.onChainBehavior +
      externalScore * this.weights.externalDatabases +
      communityScore * this.weights.communityFeedback +
      regulatoryScore * this.weights.regulatoryData
    );

    return {
      overallScore,
      componentScores: { onChainScore, externalScore, communityScore, regulatoryScore },
      confidence: this.calculateConfidence(sources),
      riskLevel: this.determineRiskLevel(overallScore)
    };
  }
}
\`\`\`

### 2.2 行为模式一致性检查
分析地址的行为模式是否符合其身份特征：

#### 交易模式分析
**个人地址特征**：
- 交易金额相对较小
- 交易频率中等
- 时间分布较为规律
- 交易对象多样化

**机构地址特征**：
- 交易金额较大
- 交易频率较高
- 时间分布受业务影响
- 交易对象相对固定

**异常模式识别**：
\`\`\`typescript
interface BehaviorPattern {
  // 交易金额模式
  amountPattern: {
    typicalAmount: number;
    amountVolatility: number;
    largeTransactionRatio: number;
  };

  // 时间模式
  timePattern: {
    activeHours: number[];      // 活跃时间段
    transactionFrequency: number; // 交易频率
    burstActivityRatio: number;   // 突发活跃比例
  };

  // 对手方模式
  counterpartyPattern: {
    uniqueCounterparties: number;
    topCounterpartyRatio: number;
    institutionalRatio: number;
  };
}

// 行为一致性检测
const detectBehaviorInconsistency = (
  currentPattern: BehaviorPattern,
  historicalPattern: BehaviorPattern,
  claimedIdentity: IdentityType
): InconsistencyReport => {

  const amountDeviation = calculatePatternDeviation(
    currentPattern.amountPattern,
    historicalPattern.amountPattern
  );

  const timeDeviation = calculateTimePatternDeviation(
    currentPattern.timePattern,
    historicalPattern.timePattern
  );

  const counterpartyDeviation = calculateCounterpartyDeviation(
    currentPattern.counterpartyPattern,
    historicalPattern.counterpartyPattern
  );

  const identityConsistency = checkIdentityConsistency(currentPattern, claimedIdentity);

  return {
    overallInconsistency: (amountDeviation + timeDeviation + counterpartyDeviation) / 3,
    identityMismatch: !identityConsistency,
    riskIndicators: [amountDeviation, timeDeviation, counterpartyDeviation],
    recommendedActions: this.generateActions(overallInconsistency, identityMismatch)
  };
};
\`\`\`

## 🕸️ 三、关联网络深度分析

### 3.1 网络结构分析
区块链地址形成的复杂网络结构揭示资金流向和关联关系：

#### 图论分析方法
**网络密度计算**：
\`\`\`typescript
interface NetworkStructure {
  nodes: AddressNode[];
  edges: AddressConnection[];
  density: number;              // 网络密度
  averageDegree: number;        // 平均度数
  clusteringCoefficient: number; // 聚类系数
  connectedComponents: number;   // 连通分量数
}

// 网络密度计算
const calculateNetworkDensity = (network: NetworkStructure): number => {
  const { nodes, edges } = network;
  const n = nodes.length;
  const maxPossibleEdges = n * (n - 1) / 2;
  return edges.length / maxPossibleEdges;
};
\`\`\`

#### 社区检测算法
识别地址网络中的社区结构，发现潜在的风险群体：
\`\`\`typescript
class CommunityDetector {
  // Louvain算法实现
  detectCommunities(network: NetworkStructure): Community[] {
    // 初始化：每个节点作为一个社区
    let communities = network.nodes.map(node => ({
      id: node.address,
      members: [node],
      modularity: 0
    }));

    let improved = true;
    while (improved) {
      improved = false;

      // 对每个节点，尝试将其移动到邻居所属的社区
      for (const node of network.nodes) {
        const bestCommunity = this.findBestCommunity(node, communities);
        if (bestCommunity !== node.communityId) {
          this.moveNodeToCommunity(node, bestCommunity, communities);
          improved = true;
        }
      }
    }

    return communities;
  }

  // 风险社区识别
  identifyRiskCommunities(communities: Community[], riskThreshold: number): RiskCommunity[] {
    return communities
      .map(community => ({
        ...community,
        averageRiskScore: this.calculateAverageRisk(community.members),
        riskMembers: community.members.filter(m => m.riskScore > riskThreshold)
      }))
      .filter(community => community.averageRiskScore > riskThreshold)
      .sort((a, b) => b.averageRiskScore - a.averageRiskScore);
  }
}
\`\`\`

### 3.2 资金流追踪分析
通过网络路径分析资金的流向和转化过程：

#### 路径分析算法
\`\`\`typescript
interface FundFlowPath {
  startAddress: string;
  endAddress: string;
  path: string[];              // 路径上的地址序列
  totalHops: number;           // 跳数
  totalAmount: number;         // 总金额
  timeSpan: number;            // 时间跨度
  complexity: number;          // 路径复杂度
}

// 多路径追踪
const traceFundFlows = (
  startAddress: string,
  endAddress: string,
  network: NetworkStructure,
  maxDepth: number = 5
): FundFlowPath[] => {

  const paths: FundFlowPath[] = [];
  const visited = new Set<string>();

  const dfs = (currentAddress: string, currentPath: string[], currentAmount: number) => {
    if (currentPath.length > maxDepth) return;
    if (currentAddress === endAddress) {
      paths.push({
        startAddress,
        endAddress,
        path: [...currentPath],
        totalHops: currentPath.length - 1,
        totalAmount: currentAmount,
        timeSpan: calculateTimeSpan(currentPath),
        complexity: calculatePathComplexity(currentPath)
      });
      return;
    }

    visited.add(currentAddress);

    // 探索邻居节点
    const neighbors = getNeighbors(currentAddress, network);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.address)) {
        dfs(neighbor.address, [...currentPath, neighbor.address], currentAmount + neighbor.amount);
      }
    }

    visited.delete(currentAddress);
  };

  dfs(startAddress, [startAddress], 0);
  return paths;
};
\`\`\`

#### 循环检测算法
识别资金在地址间的循环流转模式：
\`\`\`typescript
class CycleDetector {
  // 检测资金循环模式
  detectMoneyCycles(network: NetworkStructure, minCycleLength: number = 3): MoneyCycle[] {
    const cycles: MoneyCycle[] = [];

    for (const startNode of network.nodes) {
      const visited = new Set<string>();
      const path: string[] = [];

      const dfs = (currentNode: AddressNode, depth: number) => {
        if (depth > 10) return; // 防止过度递归

        visited.add(currentNode.address);
        path.push(currentNode.address);

        for (const neighbor of getNeighbors(currentNode.address, network)) {
          if (neighbor.address === startNode.address && path.length >= minCycleLength) {
            // 发现循环
            cycles.push({
              cycle: [...path, startNode.address],
              length: path.length,
              totalAmount: calculateCycleAmount(path),
              timeSpan: calculateCycleTimeSpan(path),
              riskScore: assessCycleRisk(path)
            });
          } else if (!visited.has(neighbor.address)) {
            dfs(network.nodes.find(n => n.address === neighbor.address)!, depth + 1);
          }
        }

        path.pop();
        visited.delete(currentNode.address);
      };

      dfs(startNode, 0);
    }

    return cycles;
  }
}
\`\`\`

## 📊 四、地址风险指标体系

### 4.1 核心指标定义

#### A1-01: 账龄风险指标
\`\`\`typescript
interface AccountAgeRiskIndicator {
  id: 'A1-01';
  name: '账龄异常';
  definition: '用户注册至今的时间长度风险';

  formula: \`
    账龄风险评分 = 1 / (1 + 账龄天数/30)
    其中：
    - 账龄天数：当前日期 - 注册日期
    - 风险评分：30天内为高风险，逐渐递减
  \`;

  threshold: 0.7;
  riskLevel: 'medium';
  interpretation: '新账户（<30天）更易涉及一次性套利行为';
}
\`\`\`

#### A1-02: KYC等级风险指标
\`\`\`typescript
interface KYCRiskIndicator {
  id: 'A1-02';
  name: '身份验证不足';
  definition: '用户身份认证级别的风险评估';

  formula: \`
    KYC风险评分 = 1 - (KYC等级分值 / 最高等级分值)
    其中：
    - L0等级：1.0（最高风险）
    - L1等级：0.7（中等风险）
    - L2-L3等级：0.0（低风险）
  \`;

  threshold: 0.5;
  riskLevel: 'medium';
  interpretation: '低KYC等级账户更易被用于违规操作';
}
\`\`\`

#### A1-03: 历史违规风险指标
\`\`\`typescript
interface HistoricalViolationRiskIndicator {
  id: 'A1-03';
  name: '历史违规累积';
  definition: '账户历史违规记录的累积风险';

  formula: \`
    历史违规风险 = min(1.0, 违规次数 × 0.3 + 最近违规权重 × 0.7)
    其中：
    - 违规次数：历史限制/警告次数
    - 最近违规权重：最近1年违规的加权值
  \`;

  threshold: 0.6;
  riskLevel: 'high';
  interpretation: '累犯用户风险更高，需从重处置';
}
\`\`\`

#### B1-01: 单笔充值风险指标
\`\`\`typescript
interface LargeDepositRiskIndicator {
  id: 'B1-01';
  name: '大额单笔充值';
  definition: '单次充值金额异常风险';

  formula: \`
    充值风险评分 = min(1.0, 充值金额 / 10000)
    其中：
    - 充值金额：单次充值USDT金额
    - 阈值：10,000 USDT为基准点
  \`;

  threshold: 0.8;
  riskLevel: 'medium';
  interpretation: '大额单笔充值后立即交易提示定向套利';
}
\`\`\`

#### B1-02: 充值频率风险指标
\`\`\`typescript
interface DepositFrequencyRiskIndicator {
  id: 'B1-02';
  name: '充值频率异常';
  definition: '指定时段内充值笔数的异常风险';

  formula: \`
    频率风险评分 = min(1.0, 充值笔数 / 3 - 1)
    其中：
    - 时间窗口：1小时
    - 基准值：3笔/小时为正常上限
  \`;

  threshold: 0.7;
  riskLevel: 'medium';
  interpretation: '多笔拆分充值可能规避大额监控';
}
\`\`\`

#### B1-03: 充提时差风险指标
\`\`\`typescript
interface DepositToTradeTimeRiskIndicator {
  id: 'B1-03';
  name: '充值到交易时差异常';
  definition: '充值完成到首笔交易的时间差风险';

  formula: \`
    时差风险评分 = max(0, 1 - (时差秒数 / 300))
    其中：
    - 时差秒数：首笔交易时间 - 充值到账时间
    - 基准值：5分钟以内为高风险
  \`;

  threshold: 0.8;
  riskLevel: 'high';
  interpretation: '充值后立即交易（<5分钟）提示预谋行为';
}
\`\`\`

#### C1-01: 交易频率风险指标
\`\`\`typescript
interface TradingFrequencyRiskIndicator {
  id: 'C1-01';
  name: '交易频率异常';
  definition: '单位时间内交易笔数的异常风险';

  formula: \`
    频率风险评分 = min(1.0, max(0, 交易频次/小时 - 10) / 10)
    其中：
    - 交易频次：笔/小时
    - 基准值：10笔/小时为关注阈值
  \`;

  threshold: 0.6;
  riskLevel: 'medium';
  interpretation: '高频交易需区分正常量化与异常刷单';
}
\`\`\`

#### C1-02: 持仓时间风险指标
\`\`\`typescript
interface HoldingTimeRiskIndicator {
  id: 'C1-02';
  name: '持仓时间异常';
  definition: '交易持仓时间的异常风险';

  formula: \`
    持仓风险评分 = max(0, 1 - (平均持仓秒数 / 60))
    其中：
    - 平均持仓秒数：多笔交易平均持仓时间
    - 基准值：60秒以内为高风险
  \`;

  threshold: 0.8;
  riskLevel: 'high';
  interpretation: '极短持仓属于"快进快出"高风险特征';
}
\`\`\`

#### C1-03: 收益率异常指标
\`\`\`typescript
interface ProfitRateRiskIndicator {
  id: 'C1-03';
  name: '收益率异常';
  definition: '单笔或累计收益率的异常风险';

  formula: \`
    收益率风险评分 = min(1.0, 收益率百分比 / 10)
    其中：
    - 收益率百分比：单笔收益率
    - 基准值：10%为关注阈值，结合持仓时间
  \`;

  threshold: 0.7;
  riskLevel: 'high';
  interpretation: '单笔收益率过高（>10%短周期）提示异常';
}
\`\`\`

#### D1-01: 买入价精准度指标
\`\`\`typescript
interface BuyPriceAccuracyRiskIndicator {
  id: 'D1-01';
  name: '买入价偏离异常';
  definition: '买入价与时段最低价的偏差风险';

  formula: \`
    买入价风险评分 = max(0, 1 - (偏离率百分比 / 2))
    其中：
    - 偏离率：(买入均价-时段最低价) / 时段最低价 × 100%
    - 基准值：<1%为高风险，<2%为可疑
  \`;

  threshold: 0.8;
  riskLevel: 'high';
  interpretation: '<1%说明精准买在最低点附近';
}
\`\`\`

#### D1-02: 卖出价精准度指标
\`\`\`typescript
interface SellPriceAccuracyRiskIndicator {
  id: 'D1-02';
  name: '卖出价偏离异常';
  definition: '卖出价与时段最高价的偏差风险';

  formula: \`
    卖出价风险评分 = max(0, 1 - (偏离率百分比 / 2))
    其中：
    - 偏离率：(时段最高价-卖出均价) / 时段最高价 × 100%
    - 基准值：<1%为高风险，<2%为可疑
  \`;

  threshold: 0.8;
  riskLevel: 'high';
  interpretation: '<1%说明精准卖在最高点附近';
}
\`\`\`

#### E1-01: 成交额占比风险指标
\`\`\`typescript
interface TradingVolumeDominanceRiskIndicator {
  id: 'E1-01';
  name: '成交额占比过高';
  definition: '用户成交额占时段总成交额的比例风险';

  formula: \`
    占比风险评分 = min(1.0, 成交额占比百分比 / 20)
    其中：
    - 成交额占比：用户成交额 / 时段总成交额 × 100%
    - 基准值：20%以上为高风险
  \`;

  threshold: 0.8;
  riskLevel: 'high';
  interpretation: '>20%说明对行情有显著影响力';
}
\`\`\`

#### E1-02: 自成交比例风险指标
\`\`\`typescript
interface SelfTradingRiskIndicator {
  id: 'E1-02';
  name: '自成交比例异常';
  definition: '用户自买自卖比例的异常风险';

  formula: \`
    自成交风险评分 = min(1.0, 自成交比例百分比 / 30)
    其中：
    - 自成交比例：自成交金额 / 用户总成交金额 × 100%
    - 基准值：30%以上为高度可疑
  \`;

  threshold: 0.9;
  riskLevel: 'high';
  interpretation: '高比例自成交是典型的刷量行为';
}
\`\`\`

#### F1-01: 设备指纹重合风险指标
\`\`\`typescript
interface DeviceFingerprintRiskIndicator {
  id: 'F1-01';
  name: '设备指纹重合';
  definition: '两账户使用相同设备的比例风险';

  formula: \`
    设备重合风险评分 = min(1.0, 相同设备比例百分比 / 30)
    其中：
    - 相同设备比例：相同设备登录次数 / 总登录次数 × 100%
    - 基准值：30%以上提示同一人控制多账户
  \`;

  threshold: 0.7;
  riskLevel: 'high';
  interpretation: '>30%提示同一人控制多账户';
}
\`\`\`

#### F1-02: IP重叠风险指标
\`\`\`typescript
interface IPRiskIndicator {
  id: 'F1-02';
  name: 'IP地址重叠';
  definition: '两账户使用相同IP的比例风险';

  formula: \`
    IP重叠风险评分 = min(1.0, 相同IP比例百分比 / 30)
    其中：
    - 相同IP比例：相同IP登录次数 / 总登录次数 × 100%
    - 基准值：30%以上提示账户关联
  \`;

  threshold: 0.7;
  riskLevel: 'high';
  interpretation: '>30%提示账户关联';
}
\`\`\`

#### F1-03: 交易时点差风险指标
\`\`\`typescript
interface TradingTimeSyncRiskIndicator {
  id: 'F1-03';
  name: '交易时点同步';
  definition: '两账户下单时间的差值风险';

  formula: \`
    时点差风险评分 = max(0, 1 - (时差毫秒 / 100))
    其中：
    - 时差毫秒：abs(A下单时间戳 - B下单时间戳)
    - 基准值：<100毫秒提示程序化协同下单
  \`;

  threshold: 0.9;
  riskLevel: 'high';
  interpretation: '<100毫秒提示程序化协同下单';
}
\`\`\`

#### G1-01: 链上跳数风险指标
\`\`\`typescript
interface OnChainHopRiskIndicator {
  id: 'G1-01';
  name: '链上关联路径';
  definition: '用户地址与目标地址的转账层数风险';

  formula: \`
    跳数风险评分 = max(0, 1 - (跳数 / 3))
    其中：
    - 跳数：追溯路径中的地址数 - 1
    - 基准值：≤3跳通常认为存在直接关联
  \`;

  threshold: 0.7;
  riskLevel: 'high';
  interpretation: '≤3跳通常认为存在直接关联';
}
\`\`\`

#### G1-02: 混币器使用风险指标
\`\`\`typescript
interface MixerUsageRiskIndicator {
  id: 'G1-02';
  name: '混币器使用';
  definition: '用户地址是否经过混币器的风险标记';

  formula: \`
    混币器风险评分 = 使用混币器 ? 1.0 : 0.0
    其中：
    - 使用标记：布尔值（是/否）
    - 风险程度：使用即为高风险
  \`;

  threshold: 0.5;
  riskLevel: 'high';
  interpretation: '使用混币器提示隐藏资金来源意图';
}
\`\`\`

#### H1-01: 时段涨跌幅风险指标
\`\`\`typescript
interface PriceFluctuationRiskIndicator {
  id: 'H1-01';
  name: '价格波动幅度';
  definition: '指定时段内的价格变动幅度风险';

  formula: \`
    波动风险评分 = min(1.0, abs(涨跌幅百分比) / 20)
    其中：
    - 涨跌幅：(收盘价-开盘价) / 开盘价 × 100%
    - 基准值：20%以上为高波动
  \`;

  threshold: 0.8;
  riskLevel: 'medium';
  interpretation: '衡量行情波动幅度，极端波动提示操纵可能';
}
\`\`\`

#### H1-02: 成交量异动风险指标
\`\`\`typescript
interface VolumeSpikeRiskIndicator {
  id: 'H1-02';
  name: '成交量异常放量';
  definition: '异常时段成交量与平均值的比值风险';

  formula: \`
    放量风险评分 = min(1.0, (成交量倍数 - 1) / 2)
    其中：
    - 成交量倍数：异常时段成交量 / 历史平均成交量
    - 基准值：>3倍属于异常放量
  \`;

  threshold: 0.7;
  riskLevel: 'high';
  interpretation: '>3倍属于异常放量，可能存在操纵行为';
}
\`\`\`

#### H1-03: 跨平台价格相关性指标
\`\`\`typescript
interface CrossPlatformCorrelationRiskIndicator {
  id: 'H1-03';
  name: '跨平台价格脱钩';
  definition: '本平台与外部平台价格的相关系数异常';

  formula: \`
    相关性风险评分 = max(0, 1 - 相关系数)
    其中：
    - 相关系数：corr(本平台价格序列, 外部价格序列)
    - 基准值：<0.8说明价格走势异常脱钩
  \`;

  threshold: 0.6;
  riskLevel: 'medium';
  interpretation: '<0.8说明价格走势异常脱钩，可能存在本地操纵';
}
\`\`\`

### 4.2 指标计算与应用

#### 实时监控实现
\`\`\`typescript
class AddressRiskMonitor {
  private indicators: RiskIndicator[] = [];
  private alertThresholds: Map<string, number> = new Map();

  constructor() {
    this.initializeIndicators();
    this.loadThresholds();
  }

  // 实时风险评估
  async assessAddressRisk(address: string): Promise<AddressRiskAssessment> {
    const addressData = await this.fetchAddressData(address);
    const riskScores: Map<string, number> = new Map();

    // 并行计算所有指标
    const calculations = this.indicators.map(async indicator => {
      const score = await this.calculateIndicator(indicator, addressData);
      riskScores.set(indicator.id, score);

      // 检查是否超过阈值
      const threshold = this.alertThresholds.get(indicator.id) || 0.5;
      if (score > threshold) {
        await this.triggerAlert(indicator, address, score);
      }

      return { indicatorId: indicator.id, score };
    });

    await Promise.all(calculations);

    return {
      address,
      overallRisk: this.calculateOverallRisk(riskScores),
      indicatorScores: Object.fromEntries(riskScores),
      riskLevel: this.determineRiskLevel(riskScores),
      assessmentTime: new Date()
    };
  }

  private calculateOverallRisk(scores: Map<string, number>): number {
    // 加权平均计算综合风险
    const weights = {
      'A1-01': 0.3,  // 新地址风险
      'A1-02': 0.4,  // 网络关联风险
      'A1-03': 0.3   // 行为模式风险
    };

    let totalWeight = 0;
    let weightedSum = 0;

    for (const [indicatorId, score] of scores) {
      const weight = weights[indicatorId as keyof typeof weights] || 0.1;
      weightedSum += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }
}
\`\`\`

## 🎯 五、学习实践与应用

### 5.1 指标应用场景
- **用户注册审核**：新用户地址风险评估
- **交易监控预警**：实时交易风险检测
- **投资组合审查**：关联风险网络分析
- **合规报告生成**：风险地址识别与报告

### 5.2 最佳实践建议
1. **多维度验证**：结合多种数据源进行综合判断
2. **动态阈值调整**：根据市场环境调整风险阈值
3. **持续学习更新**：定期更新风险模型和指标权重
4. **人工复核机制**：重要风险事件进行人工审核

通过深入理解地址风险指标体系，你将能够有效识别和防范区块链上的各种身份和关联风险，为加密货币交易的安全保驾护航。
      `
    },

    capitalRisk: {
      title: '资金风险指标',
      icon: PieChart,
      estimatedTime: '20分钟',
      difficulty: '进阶',
      content: `
# 💰 资产与资金风险指标体系

## 🎯 学习目标
掌握资金流向分析、资产组合风险评估等核心方法，建立资金维度的风险监控能力，防范各种资金相关的风险事件

## 💸 一、资金流向分析详解

### 1.1 净资金流入分析
监控地址资金的流入流出变化，识别异常的资金聚集行为：

#### 资金流入流出计算
\`\`\`typescript
interface CapitalFlowMetrics {
  // 时间窗口
  timeWindow: {
    start: Date;
    end: Date;
    duration: number; // 小时
  };

  // 资金流入
  inflows: {
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
    largestTransaction: number;
    sourceDiversity: number; // 资金来源多样性 0-1
  };

  // 资金流出
  outflows: {
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
    largestTransaction: number;
    destinationDiversity: number; // 资金去向多样性 0-1
  };

  // 净资金变化
  netFlow: number;
  flowRatio: number; // 净流入/总交易额
}

// 净资金流入风险评估
const assessNetInflowRisk = (flow: CapitalFlowMetrics): NetInflowRisk => {
  const netFlowRatio = flow.netFlow / (flow.inflows.totalAmount + flow.outflows.totalAmount);

  // 大额净流入风险
  const largeInflowRisk = flow.inflows.totalAmount > 100000 ? 0.8 : 0.2;

  // 来源集中风险
  const concentrationRisk = 1 - flow.inflows.sourceDiversity;

  // 异常流向风险
  const abnormalFlowRisk = Math.abs(netFlowRatio) > 0.8 ? 0.9 : 0.1;

  return {
    overallRisk: (largeInflowRisk + concentrationRisk + abnormalFlowRisk) / 3,
    riskFactors: {
      largeInflowRisk,
      concentrationRisk,
      abnormalFlowRisk
    },
    riskLevel: this.determineRiskLevel(overallRisk)
  };
};
\`\`\`

#### 资金来源集中度分析
评估资金来源的多样性，识别潜在的资金操纵风险：
\`\`\`typescript
interface SourceConcentrationAnalysis {
  // 资金来源分布
  sourceDistribution: Map<string, number>; // 地址 -> 金额

  // 集中度指标
  concentrationMetrics: {
    herfindahlIndex: number;     // 赫芬达尔指数
    giniCoefficient: number;     // 吉尼系数
    topSourceRatio: number;      // 最大来源占比
    top3SourcesRatio: number;    // 前三大来源占比
  };

  // 风险评估
  riskAssessment: {
    concentrationRisk: number;   // 集中度风险 0-1
    manipulationRisk: number;    // 操纵风险 0-1
    stabilityRisk: number;       // 稳定性风险 0-1
  };
}

// 集中度计算
const calculateConcentration = (distribution: Map<string, number>): ConcentrationMetrics => {
  const totalAmount = Array.from(distribution.values()).reduce((sum, amount) => sum + amount, 0);
  const amounts = Array.from(distribution.values());

  // 赫芬达尔指数 (0-10000，越大越集中)
  const herfindahlIndex = amounts.reduce((sum, amount) => {
    const ratio = amount / totalAmount;
    return sum + ratio * ratio;
  }, 0) * 10000;

  // 吉尼系数 (0-1，越接近1越不平等)
  const giniCoefficient = calculateGiniCoefficient(amounts);

  // 最大来源占比
  const maxAmount = Math.max(...amounts);
  const topSourceRatio = maxAmount / totalAmount;

  // 前三大来源占比
  const sortedAmounts = amounts.sort((a, b) => b - a);
  const top3Ratio = sortedAmounts.slice(0, 3).reduce((sum, amount) => sum + amount, 0) / totalAmount;

  return {
    herfindahlIndex,
    giniCoefficient,
    topSourceRatio,
    top3SourcesRatio: top3Ratio
  };
};
\`\`\`

### 1.2 资金流转速度分析
测量资金在不同地址间的流转频率，识别洗钱等异常行为：

#### 资金周转率计算
\`\`\`typescript
interface CapitalVelocityMetrics {
  // 资金周转指标
  turnoverMetrics: {
    turnoverRatio: number;       // 周转率（资金流转次数/时间单位）
    averageHoldingTime: number;  // 平均持有时间（小时）
    velocityIndex: number;       // 资金速度指数
  };

  // 流转模式分析
  flowPatterns: {
    rapidFlowRatio: number;      // 快速流转比例（<1小时）
    normalFlowRatio: number;     // 正常流转比例（1-24小时）
    slowFlowRatio: number;       // 慢速流转比例（>24小时）
  };

  // 异常检测
  anomalyDetection: {
    burstFlowEvents: number;     // 突发流转事件数
    circularFlowScore: number;   // 循环流转评分
    layerFlowScore: number;      // 分层流转评分
  };
}

// 资金速度风险评估
const assessVelocityRisk = (velocity: CapitalVelocityMetrics): VelocityRisk => {
  const highVelocityRisk = velocity.turnoverMetrics.velocityIndex > 10 ? 0.9 : 0.1;
  const rapidFlowRisk = velocity.flowPatterns.rapidFlowRatio > 0.5 ? 0.8 : 0.2;
  const circularRisk = velocity.anomalyDetection.circularFlowScore > 0.7 ? 0.9 : 0.1;

  return {
    overallRisk: (highVelocityRisk + rapidFlowRisk + circularRisk) / 3,
    riskType: this.identifyVelocityRiskType(velocity),
    recommendedAction: this.generateVelocityAction(overallRisk)
  };
};
\`\`\`

## 📊 二、资产组合风险评估

### 2.1 币种集中度风险
分析地址持有的资产组合集中程度：

#### 集中度风险指标
\`\`\`typescript
interface AssetConcentrationRisk {
  // 资产分布
  assetDistribution: Map<string, number>; // 代币 -> 持有数量

  // 市值分布
  marketValueDistribution: Map<string, number>; // 代币 -> 市值

  // 集中度指标
  concentrationIndicators: {
    singleAssetDominance: number;    // 单一资产占比
    top3AssetsDominance: number;     // 前三大资产占比
    assetDiversityIndex: number;     // 资产多样性指数 (0-1)
    riskAdjustedConcentration: number; // 风险调整集中度
  };

  // 风险评估
  riskMetrics: {
    unsystematicRisk: number;        // 非系统性风险
    liquidityRisk: number;           // 流动性风险
    volatilityRisk: number;          // 波动性风险
  };
}

// 资产集中度计算
const calculateAssetConcentration = (
  holdings: Map<string, number>,
  prices: Map<string, number>
): AssetConcentrationRisk => {

  // 计算市值分布
  const marketValues = new Map<string, number>();
  let totalValue = 0;

  for (const [asset, amount] of holdings) {
    const price = prices.get(asset) || 0;
    const value = amount * price;
    marketValues.set(asset, value);
    totalValue += value;
  }

  // 计算集中度指标
  const values = Array.from(marketValues.values());
  const sortedValues = values.sort((a, b) => b - a);

  const singleAssetDominance = sortedValues[0] / totalValue;
  const top3AssetsDominance = sortedValues.slice(0, 3).reduce((sum, v) => sum + v, 0) / totalValue;

  // 资产多样性指数 (Shannon entropy)
  const diversityIndex = calculateDiversityIndex(values.map(v => v / totalValue));

  return {
    assetDistribution: holdings,
    marketValueDistribution: marketValues,
    concentrationIndicators: {
      singleAssetDominance,
      top3AssetsDominance,
      assetDiversityIndex: diversityIndex,
      riskAdjustedConcentration: this.calculateRiskAdjustedConcentration(marketValues, prices)
    },
    riskMetrics: this.assessConcentrationRisks(singleAssetDominance, diversityIndex, marketValues)
  };
};
\`\`\`

### 2.2 流动性风险评估
评估资产的变现能力和流动性状况：

#### 流动性风险指标
\`\`\`typescript
interface LiquidityRiskAssessment {
  // 资产流动性指标
  assetLiquidity: Map<string, AssetLiquidity>; // 代币 -> 流动性指标

  // 组合流动性
  portfolioLiquidity: {
    immediateLiquidityRatio: number;    // 即时流动性比率
    shortTermLiquidityRatio: number;   // 短期流动性比率
    longTermLiquidityRatio: number;    // 长期流动性比率
    liquidityStressTest: number;       // 流动性压力测试得分
  };

  // 风险指标
  riskIndicators: {
    illiquidityRisk: number;           // 流动性不足风险
    fireSaleRisk: number;              // 抛售风险
    marketImpactRisk: number;          // 市场冲击风险
  };
}

interface AssetLiquidity {
  dailyVolume: number;         // 日交易量
  bidAskSpread: number;        // 买卖价差
  marketDepth: number;         // 市场深度
  volatility: number;          // 价格波动率
  liquidityScore: number;      // 综合流动性评分 (0-100)
}

// 流动性风险评估
const assessLiquidityRisk = (holdings: PortfolioHoldings): LiquidityRiskAssessment => {
  const assetLiquidity = new Map<string, AssetLiquidity>();

  // 计算每个资产的流动性指标
  for (const [asset, amount] of holdings.assets) {
    const liquidity = this.calculateAssetLiquidity(asset, amount);
    assetLiquidity.set(asset, liquidity);
  }

  // 计算组合流动性
  const portfolioLiquidity = this.calculatePortfolioLiquidity(assetLiquidity, holdings);

  // 评估风险
  const riskIndicators = this.evaluateLiquidityRisks(portfolioLiquidity, assetLiquidity);

  return {
    assetLiquidity,
    portfolioLiquidity,
    riskIndicators
  };
};
\`\`\`

### 2.3 资产相关性风险
分析资产间的相关性和 contagion 效应：

#### 相关性矩阵分析
\`\`\`typescript
interface AssetCorrelationAnalysis {
  // 资产价格序列
  priceSeries: Map<string, number[]>; // 代币 -> 价格历史

  // 相关性矩阵
  correlationMatrix: number[][]; // 资产间的相关系数矩阵

  // 相关性指标
  correlationMetrics: {
    averageCorrelation: number;         // 平均相关系数
    maxCorrelation: number;            // 最大相关系数
    correlationVolatility: number;     // 相关性波动率
    contagionIndex: number;            // 传染指数
  };

  // 风险评估
  correlationRisk: {
    diversificationRisk: number;       // 分散化不足风险
    contagionRisk: number;             // 传染风险
    systemicRisk: number;              // 系统性风险
  };
}

// 资产相关性计算
const calculateAssetCorrelations = (priceSeries: Map<string, number[]>): CorrelationAnalysis => {
  const assets = Array.from(priceSeries.keys());
  const n = assets.length;
  const correlationMatrix: number[][] = [];

  // 计算相关系数矩阵
  for (let i = 0; i < n; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        correlationMatrix[i][j] = 1;
      } else {
        const correlation = this.calculatePearsonCorrelation(
          priceSeries.get(assets[i])!,
          priceSeries.get(assets[j])!
        );
        correlationMatrix[i][j] = correlation;
      }
    }
  }

  // 计算综合指标
  const correlations = correlationMatrix.flat().filter(c => c !== 1);
  const averageCorrelation = correlations.reduce((sum, c) => sum + c, 0) / correlations.length;
  const maxCorrelation = Math.max(...correlations);

  return {
    correlationMatrix,
    correlationMetrics: {
      averageCorrelation,
      maxCorrelation,
      correlationVolatility: this.calculateCorrelationVolatility(correlationMatrix),
      contagionIndex: this.calculateContagionIndex(correlationMatrix)
    },
    correlationRisk: this.assessCorrelationRisks(averageCorrelation, maxCorrelation)
  };
};
\`\`\`

## 💱 三、资金风险指标体系

### 3.1 核心指标定义

#### B1-01: 异常资金流入指标
\`\`\`typescript
interface AbnormalInflowIndicator {
  id: 'B1-01';
  name: '异常资金流入';
  definition: '短时间内的大额资金异常聚集';

  formula: \`
    异常流入风险 = (流入金额异常度 × 0.4) + (流入速度异常度 × 0.3) + (来源集中度 × 0.3)
    其中：
    - 流入金额异常度：实际流入 / 历史平均流入
    - 流入速度异常度：单位时间流入速度 / 基准速度
    - 来源集中度：最大单一来源占比
  \`;

  threshold: 0.7;
  riskLevel: 'high';
  interpretation: '异常资金流入可能表明操纵行为或风险事件';
}
\`\`\`

#### B1-02: 资产集中度风险指标
\`\`\`typescript
interface AssetConcentrationIndicator {
  id: 'B1-02';
  name: '资产过度集中';
  definition: '资产组合缺乏多样性导致的非系统性风险';

  formula: \`
    集中度风险 = (单一资产占比 × 0.4) + (前三大资产占比 × 0.3) + (多样性不足度 × 0.3)
    其中：
    - 单一资产占比：最大持仓资产市值占比
    - 前三大资产占比：市值前三资产占比总和
    - 多样性不足度：1 - 资产多样性指数
  \`;

  threshold: 0.6;
  riskLevel: 'medium';
  interpretation: '过度集中投资增加非系统性风险敞口';
}
\`\`\`

#### B1-03: 资金流动性风险指标
\`\`\`typescript
interface LiquidityRiskIndicator {
  id: 'B1-03';
  name: '流动性不足风险';
  definition: '资产变现困难导致的流动性风险';

  formula: \`
    流动性风险 = (即时变现比例 × 0.4) + (流动性评分 × 0.3) + (市场深度不足度 × 0.3)
    其中：
    - 即时变现比例：可即时变现资产占比
    - 流动性评分：资产流动性综合评分
    - 市场深度不足度：1 - 市场深度充足度
  \`;

  threshold: 0.5;
  riskLevel: 'medium';
  interpretation: '流动性不足可能导致无法及时应对风险事件';
}
\`\`\`

### 3.2 指标计算与监控

#### 实时资金监控系统
\`\`\`typescript
class CapitalRiskMonitor {
  private indicators: RiskIndicator[] = [];
  private thresholds: Map<string, number> = new Map();

  constructor() {
    this.initializeIndicators();
    this.setupRealTimeMonitoring();
  }

  // 实时资金风险评估
  async assessCapitalRisk(address: string): Promise<CapitalRiskAssessment> {
    const capitalData = await this.fetchCapitalData(address);
    const riskScores = new Map<string, number>();

    // 并行计算所有指标
    const calculations = await Promise.all(
      this.indicators.map(indicator =>
        this.calculateIndicator(indicator, capitalData)
      )
    );

    calculations.forEach((result, index) => {
      const indicator = this.indicators[index];
      riskScores.set(indicator.id, result.score);

      // 触发告警
      if (result.score > (this.thresholds.get(indicator.id) || 0.5)) {
        this.triggerAlert(indicator, address, result.score, result.details);
      }
    });

    return {
      address,
      overallRisk: this.calculateOverallRisk(riskScores),
      indicatorBreakdown: Object.fromEntries(riskScores),
      riskLevel: this.determineRiskLevel(riskScores),
      dominantRiskFactors: this.identifyDominantFactors(riskScores),
      timestamp: new Date()
    };
  }

  // 资金流向趋势分析
  async analyzeFlowTrends(address: string, timeRange: TimeRange): Promise<FlowTrendAnalysis> {
    const historicalFlows = await this.fetchHistoricalFlows(address, timeRange);

    return {
      trendDirection: this.calculateTrendDirection(historicalFlows),
      volatility: this.calculateFlowVolatility(historicalFlows),
      seasonality: this.detectSeasonalPatterns(historicalFlows),
      anomalyPeriods: this.identifyAnomalyPeriods(historicalFlows),
      riskProjection: this.projectFutureRisks(historicalFlows)
    };
  }
}
\`\`\`

## 📈 四、资产组合优化策略

### 4.1 风险分散优化
基于现代投资组合理论的资产配置优化：

#### 有效前沿计算
\`\`\`typescript
interface PortfolioOptimization {
  // 资产池
  assetUniverse: string[];

  // 预期收益和风险
  expectedReturns: Map<string, number>;    // 资产 -> 预期收益
  covarianceMatrix: number[][];             // 协方差矩阵

  // 优化结果
  efficientFrontier: Portfolio[];           // 有效前沿组合
  optimalPortfolios: {
    maxSharpe: Portfolio;                   // 最大夏普比率组合
    minVolatility: Portfolio;               // 最小波动组合
    targetReturn: Map<number, Portfolio>;   // 指定收益组合
  };
}

class PortfolioOptimizer {
  // 均值-方差优化
  optimizePortfolio(
    assets: string[],
    returns: Map<string, number>,
    covariance: number[][],
    constraints: PortfolioConstraints
  ): OptimizedPortfolio {

    // 计算有效前沿
    const efficientFrontier = this.calculateEfficientFrontier(assets, returns, covariance);

    // 找到最优组合
    const optimalPortfolio = this.findOptimalPortfolio(efficientFrontier, constraints);

    return {
      weights: optimalPortfolio.weights,
      expectedReturn: optimalPortfolio.expectedReturn,
      volatility: optimalPortfolio.volatility,
      sharpeRatio: optimalPortfolio.sharpeRatio,
      diversificationMetrics: this.calculateDiversificationMetrics(optimalPortfolio.weights)
    };
  }

  // 分散化指标计算
  private calculateDiversificationMetrics(weights: Map<string, number>): DiversificationMetrics {
    const weightArray = Array.from(weights.values());

    return {
      effectiveNumber: this.calculateEffectiveNumber(weightArray), // 有效资产数量
      concentrationIndex: this.calculateConcentrationIndex(weightArray), // 集中度指数
      riskContributionDiversity: this.calculateRiskContributionDiversity(weights) // 风险贡献多样性
    };
  }
}
\`\`\`

### 4.2 动态再平衡策略
根据市场条件动态调整资产配置：

#### 再平衡触发条件
\`\`\`typescript
interface RebalancingStrategy {
  // 触发条件
  triggers: {
    thresholdBased: {
      deviationThreshold: number;    // 偏离度阈值
      timeBased: number;            // 时间间隔（天）
      volatilityBased: number;      // 波动率阈值
    };
    riskBased: {
      varThreshold: number;          // VaR阈值
      stressTestThreshold: number;   // 压力测试阈值
    };
  };

  // 再平衡方法
  methods: {
    constantMix: boolean;           // 固定比例再平衡
    constantWeight: boolean;        // 固定权重再平衡
    buyAndHold: boolean;            // 买入持有策略
  };

  // 执行参数
  execution: {
    transactionCosts: number;       // 交易成本
    taxConsiderations: boolean;     // 税务考虑
    marketImpact: boolean;          // 市场冲击考虑
  };
}

// 智能再平衡引擎
class RebalancingEngine {
  async executeRebalancing(
    currentPortfolio: Portfolio,
    targetPortfolio: Portfolio,
    strategy: RebalancingStrategy
  ): Promise<RebalancingResult> {

    // 检查是否需要再平衡
    const needsRebalancing = this.checkRebalancingTriggers(currentPortfolio, strategy.triggers);

    if (!needsRebalancing) {
      return { action: 'hold', reason: 'triggers_not_met' };
    }

    // 计算调整交易
    const trades = this.calculateRebalancingTrades(currentPortfolio, targetPortfolio);

    // 考虑交易成本和市场冲击
    const costAnalysis = await this.analyzeTransactionCosts(trades, strategy.execution);

    // 执行再平衡
    if (costAnalysis.netBenefit > 0) {
      const executionResult = await this.executeTrades(trades);
      return {
        action: 'rebalanced',
        trades: executionResult,
        costAnalysis,
        newPortfolio: executionResult.newPortfolio
      };
    } else {
      return {
        action: 'hold',
        reason: 'cost_benefit_negative',
        costAnalysis
      };
    }
  }
}
\`\`\`

## 🎯 五、学习实践与应用

### 5.1 资金风险监控场景
- **交易所风险控制**：监控大额资金流入流出
- **DeFi协议风险管理**：流动性池资金风险评估
- **投资组合管理**：资产配置风险监控和优化
- **反洗钱监控**：异常资金流转模式识别

### 5.2 最佳实践建议
1. **多维度监控**：结合流量、持仓、相关性等多维度指标
2. **动态阈值**：根据市场波动调整风险阈值
3. **成本效益平衡**：考虑交易成本和再平衡收益
4. **压力测试**：定期进行极端情况下的风险测试

通过深入理解资金风险指标体系，你将能够有效监控和管理加密货币资产的各种风险，为投资决策和风险控制提供科学依据。
      `
    },

    behaviorRisk: {
      title: '交易行为风险指标',
      icon: Activity,
      estimatedTime: '18分钟',
      difficulty: '专家',
      content: `
# 📈 交易行为风险指标体系

## 🎯 学习目标
掌握交易行为模式识别、市场操纵检测等高级方法，建立行为维度的风险监控能力

## 🔄 一、交易模式识别

### 1.1 机器人交易检测
识别高频自动化交易行为：

#### 频率异常分析
\`\`\`typescript
interface TradingFrequencyAnalysis {
  transactionsPerSecond: number;
  timeDistribution: Map<number, number>; // 小时 -> 交易数
  intervalRegularity: number; // 时间间隔规律性
  burstActivityScore: number; // 突发活跃评分
}

const detectBotTrading = (frequency: TradingFrequencyAnalysis): BotRisk => {
  const frequencyRisk = frequency.transactionsPerSecond > 5 ? 0.9 : 0.1;
  const regularityRisk = frequency.intervalRegularity > 0.8 ? 0.8 : 0.2;
  const burstRisk = frequency.burstActivityScore > 0.7 ? 0.9 : 0.1;

  return {
    overallRisk: (frequencyRisk + regularityRisk + burstRisk) / 3,
    riskType: 'automated_trading',
    confidence: 0.85
  };
};
\`\`\`

### 1.2 市场操纵识别

#### 洗盘行为检测
\`\`\`typescript
interface WashTradingPattern {
  orderCancelRatio: number;     // 撤单比例
  priceImpact: number;          // 价格影响度
  timeConcentration: number;    // 时间集中度
  volumeManipulation: number;   // 成交量操纵度
}

const detectWashTrading = (pattern: WashTradingPattern): WashTradingRisk => {
  const cancelRisk = pattern.orderCancelRatio > 0.8 ? 0.9 : 0.2;
  const impactRisk = pattern.priceImpact > 0.5 ? 0.8 : 0.1;
  const concentrationRisk = pattern.timeConcentration > 0.7 ? 0.9 : 0.2;

  return {
    overallRisk: Math.max(cancelRisk, impactRisk, concentrationRisk),
    patternType: 'wash_trading',
    severity: overallRisk > 0.7 ? 'high' : 'medium'
  };
};
\`\`\`

## 🎯 二、核心指标定义

#### C1-01: 异常交易时间
- **定义**: 在非正常时间段的大额交易
- **公式**: 交易时间在凌晨2-6点 && 交易金额 > 10000
- **阈值**: 触发即告警
- **风险等级**: 中
- **解读**: 凌晨大额交易可能绕过监管或利用时差

#### C1-02: 循环交易检测
- **定义**: 资金在同一组地址间循环流转
- **公式**: 检测地址间的循环交易模式
- **阈值**: 循环路径长度 > 3
- **风险等级**: 高
- **解读**: 循环交易通常用于操纵市场或洗钱

## 🚀 三、实践应用
通过交易行为分析，识别和防范各种市场操纵和自动化交易风险，建立行为层面的风险控制体系。
      `
    },

    marketRisk: {
      title: '市场冲击风险指标',
      icon: TrendingUp,
      estimatedTime: '18分钟',
      difficulty: '专家',
      content: `
# 📊 市场冲击风险指标体系

## 🎯 学习目标
掌握价格影响分析、订单簿操纵检测等方法，建立市场维度的风险监控能力

## 💥 一、市场冲击分析

### 1.1 大额交易冲击评估
分析单笔交易对市场价格的影响程度：

#### 交易规模相对性分析
\`\`\`typescript
interface MarketImpactAnalysis {
  tradeSize: number;              // 交易金额
  marketCap: number;              // 币种市值
  dailyVolume: number;            // 日交易量
  orderBookDepth: number;         // 订单簿深度

  // 相对规模指标
  tradeToMarketCap: number;       // 交易金额/市值
  tradeToVolume: number;          // 交易金额/日交易量
  depthImpact: number;            // 对订单簿深度的影响
}

const assessMarketImpact = (analysis: MarketImpactAnalysis): MarketImpactRisk => {
  const sizeRisk = analysis.tradeToMarketCap > 0.001 ? 0.8 : 0.2;  // 0.1%市值
  const volumeRisk = analysis.tradeToVolume > 0.1 ? 0.9 : 0.1;     // 10%日交易量
  const depthRisk = analysis.depthImpact > 0.5 ? 0.9 : 0.2;        // 50%深度影响

  return {
    overallRisk: Math.max(sizeRisk, volumeRisk, depthRisk),
    impactType: 'large_trade_impact',
    severity: overallRisk > 0.7 ? 'high' : 'medium'
  };
};
\`\`\`

### 1.2 订单簿操纵检测
识别通过挂撤单影响市场深度的操纵行为：

#### 订单簿模式分析
\`\`\`typescript
interface OrderBookManipulation {
  cancelToTradeRatio: number;     // 撤单交易比
  largeOrderConcentration: number; // 大单集中度
  priceLevelManipulation: number; // 价位操纵度
  timeBasedClustering: number;    // 时间聚类度
}

const detectOrderBookManipulation = (manipulation: OrderBookManipulation): ManipulationRisk => {
  const cancelRisk = manipulation.cancelToTradeRatio > 5 ? 0.9 : 0.2;
  const concentrationRisk = manipulation.largeOrderConcentration > 0.8 ? 0.8 : 0.1;
  const clusteringRisk = manipulation.timeBasedClustering > 0.7 ? 0.9 : 0.2;

  return {
    overallRisk: (cancelRisk + concentrationRisk + clusteringRisk) / 3,
    patternType: cancelRisk > 0.8 ? 'spoofing' : 'layering',
    confidence: 0.85
  };
};
\`\`\`

## 🎯 二、核心指标定义

#### D1-01: 大额交易冲击
- **定义**: 单笔交易对市场价格的冲击程度
- **公式**: 交易金额/每日交易量 × 价格变化幅度
- **阈值**: > 5%
- **风险等级**: 高
- **解读**: 大额交易可能造成市场操纵或引发连锁反应

#### D1-02: 订单簿操纵
- **定义**: 通过大单挂撤影响市场深度的行为
- **公式**: 大单挂撤频率 × 价格影响程度
- **阈值**: 频繁且有价格影响
- **风险等级**: 高
- **解读**: 订单簿操纵会误导其他交易者，影响市场公平

## 🚀 三、实践应用
通过市场冲击分析，识别和防范各种价格操纵和市场异常行为，建立市场层面的风险控制体系。
      `
    },

    caseAnalysis: {
      title: '经典案例深度剖析',
      icon: BarChart3,
      estimatedTime: '20分钟',
      difficulty: '专家',
      content: `
# 📚 经典案例深度剖析

## 🎯 案例学习目标
通过真实案例分析，掌握MECE风险监控体系的实际应用方法，理解复杂风险场景下的系统性应对策略

## 💰 跨境洗钱团伙识别案例

### 案例背景
某大型数字货币交易所监测到异常资金流动模式，单日处理可疑交易额超过2000万美元。

### 触发风险指标
- **充提平衡率**: 98.7%（阈值：>95%）
- **多地址归集密度**: 47个地址（异常集中模式）
- **密码重置频次**: 5次/天（阈值：>3次/天）

### 调查分析过程
1. **资金流追踪分析**: 构建交易网络图，识别循环洗钱模式
2. **行为模式识别**: 使用聚类分析检测异常交易行为
3. **地理位置分析**: 分析IP地址和交易位置的分布特征

### 处理结果
- 冻结账户：47个
- 冻结资产：$2,300,000
- 移交司法机关处理

## 🕵️ 高频交易机器人检测案例

### 市场异常信号
交易所监控系统检测到某交易对出现明显的价格操纵迹象。

### 技术检测方案
- **交易频率分析**: 检测每秒交易次数异常
- **订单簿分析**: 分析挂单集中度和深度
- **时间模式分析**: 识别非人类交易节奏

### 实时干预措施
1. **动态调整费率**: 对可疑账户提高交易手续费
2. **限速控制**: 限制异常账户的交易频率
3. **价格稳定机制**: 触发价格稳定算法

## 🎯 学习要点总结

### 1. 系统性思维应用
- 多个指标的综合判断
- 风险模式的识别和分类
- 应对策略的优先级排序

### 2. 技术与业务的结合
- 数据驱动的决策过程
- 自动化监控与人工干预的平衡
- 实时响应与长期治理的结合

### 3. 持续改进机制
- 案例复盘和经验总结
- 指标体系的动态优化
- 技术能力的迭代升级

通过这些经典案例的学习，你将掌握金融风险监控的核心技能和方法论，为构建更加安全的数字资产生态系统贡献力量。
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
},

caseStudies: {
  title: '案例分析',
  icon: TrendingUp,
  estimatedTime: '15分钟',
  difficulty: '专家',
  content: \`
# 经典案例深度剖析

## 🎯 案例学习目标

通过真实案例分析，掌握MECE风险监控体系的实际应用方法，理解复杂风险场景下的系统性应对策略。

## 💰 跨境洗钱团伙识别案例

### 案例背景
某大型数字货币交易所监测到异常资金流动模式，单日处理可疑交易额超过2000万美元。

### 触发风险指标
- **充提平衡率**: 98.7%（阈值：>95%）
- **多地址归集密度**: 47个地址（异常集中模式）
- **密码重置频次**: 5次/天（阈值：>3次/天）

### 调查分析过程
1. **资金流追踪分析**: 构建交易网络图，识别循环洗钱模式
2. **行为模式识别**: 使用聚类分析检测异常交易行为
3. **地理位置分析**: 分析IP地址和交易位置的分布特征

### 处理结果
- 冻结账户：47个
- 冻结资产：$2,300,000
- 移交司法机关处理

## 🕵️ 高频交易机器人检测案例

### 市场异常信号
交易所监控系统检测到某交易对出现明显的价格操纵迹象。

### 技术检测方案
- **交易频率分析**: 检测每秒交易次数异常
- **订单簿分析**: 分析挂单集中度和深度
- **时间模式分析**: 识别非人类交易节奏

### 实时干预措施
1. **动态调整费率**: 对可疑账户提高交易手续费
2. **限速控制**: 限制异常账户的交易频率
3. **价格稳定机制**: 触发价格稳定算法

## 🎯 学习要点总结

### 1. 系统性思维应用
- 多个指标的综合判断
- 风险模式的识别和分类
- 应对策略的优先级排序

### 2. 技术与业务的结合
- 数据驱动的决策过程
- 自动化监控与人工干预的平衡
- 实时响应与长期治理的结合

### 3. 持续改进机制
- 案例复盘和经验总结
- 指标体系的动态优化
- 技术能力的迭代升级

### 4. 合规与风险管理
- 监管要求的理解和执行
- 内部控制体系的建设
- 外部协作和情报共享

## 📈 案例分析方法论

### 问题识别阶段
- 异常信号的捕获和初步判断
- 多维度数据的关联分析
- 风险等级的初步评估

### 深度调查阶段
- 资金流的完整追踪
- 行为模式的深入分析
- 网络关系的挖掘和分析

### 应对策略制定
- 技术干预措施的确定
- 业务流程的调整优化
- 法律法规的合规处理

### 效果评估阶段
- 干预措施的有效性验证
- 系统改进措施的制定
- 经验教训的总结提炼

## 🔬 高级分析技术

### 资金流网络分析
\`\`\`typescript
interface TransactionNode {
  address: string;
  amount: number;
  timestamp: Date;
  risk_score: number;
  connections: string[];
}

class MoneyFlowAnalyzer {
  async traceMoneyFlow(rootAddress: string, depth: number = 3) {
    // 广度优先搜索构建资金流网络
    // 检测循环洗钱模式
    // 计算网络中心性
    // 识别层级结构
  }
}
\`\`\`

### 机器学习风险检测
\`\`\`python
from sklearn.ensemble import RandomForestClassifier

class MLRiskDetector:
    def __init__(self):
        self.model = RandomForestClassifier()

    def detect_anomalous_patterns(self, transaction_data):
        # 特征工程
        # 模型训练
        # 异常检测
        # 风险评分
\endcode

### 实时流处理架构
\`\`\`typescript
class RealTimeRiskProcessor {
  private eventBuffer: RiskEvent[] = [];

  async processEvent(event: RiskEvent): Promise<void> {
    // 实时风险计算
    // 动态阈值调整
    // 告警触发和响应
  }
}
\`\`\`

## 🎯 实践建议

### 1. 建立案例库
- 收集和整理典型案例
- 建立案例分类体系
- 定期复盘和更新

### 2. 培养分析能力
- 学习数据分析方法
- 掌握风险识别技巧
- 提升问题解决能力

### 3. 强化技术应用
- 熟悉各种分析工具
- 掌握自动化脚本编写
- 理解算法原理和局限性

### 4. 注重团队协作
- 建立多部门协作机制
- 培养跨专业沟通能力
- 形成知识共享文化

## 📊 案例分析效能评估

| 指标 | 2022年 | 2023年 | 2024年 |
|------|--------|--------|--------|
| 检测准确率 | 75% | 87% | 92% |
| 响应时间 | 45分钟 | 18分钟 | 8分钟 |
| 误报率 | 12% | 5.2% | 3.2% |
| 拦截金额 | $1200万 | $2800万 | $4200万 |

## 🚀 未来展望

1. **AI增强分析**: 引入深度学习提升检测精度
2. **自动化响应**: 建立智能自动化处置体系
3. **生态协作**: 构建行业风险情报共享平台
4. **技术创新**: 探索区块链原生安全解决方案

通过这些经典案例的学习，你将掌握金融风险监控的核心技能和方法论，为构建更加安全的数字资产生态系统贡献力量。
  \`
}
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

    calculationMethods: {
      title: '加密货币指标计算方法',
      icon: Code,
      estimatedTime: '20分钟',
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
      if (!content) return false;
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

                  if (!tutorialData) return null;

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
                  {tutorialContent[activeSection as keyof typeof tutorialContent]?.icon && React.createElement(tutorialContent[activeSection as keyof typeof tutorialContent].icon, {
                    className: "w-8 h-8 text-blue-500"
                  })}
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {tutorialContent[activeSection as keyof typeof tutorialContent]?.title || '教程内容'}
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        {tutorialContent[activeSection as keyof typeof tutorialContent]?.estimatedTime || '未知时间'}
                      </span>
                      <span className="text-sm px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                        {tutorialContent[activeSection as keyof typeof tutorialContent]?.difficulty || '未知难度'}
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
                  {tutorialContent[activeSection as keyof typeof tutorialContent]?.content || '内容加载中...'}
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
