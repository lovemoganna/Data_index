import { Category } from './types';

// 导入集成后的完整指标数据
import { INTEGRATED_INDICATORS } from './constants-integrated';

// 获取当前数据模式（运行时动态获取）
export const getCurrentDataMode = (): 'basic' | 'full' => {
  // 首先检查localStorage中的用户偏好
  const savedMode = localStorage.getItem('preferred_data_mode');
  if (savedMode === 'basic' || savedMode === 'full') {
    return savedMode;
  }

  // 然后检查环境变量
  const envMode = process.env.REACT_APP_DATA_MODE;
  if (envMode === 'basic' || envMode === 'full') {
    return envMode;
  }

  // 默认使用full模式以确保173个专业指标完全加载
  return 'full';
};

// 基础模式的原始数据
const BASIC_DATA: Category[] = [
    {
        id: 'A',
        name: '账号与身份维度',
        icon: 'Users',
        description: '监控账户本身的静态特征与信誉评分',
        color: 'blue',
        subcategories: [
            {
                id: 'A1',
                name: '账户成熟度',
                indicators: [
                    { id: 'A1-01', name: '注册存续天数', definition: '账号从注册到当前的时间长度。', purpose: '识别新号闪击交易风险。', formula: '今日日期 - 注册日期', threshold: '小于 3 天', calculationCase: '1号注册，2号交易，结果1天。', riskInterpretation: '黑产号通常存活期极短，快速操作后即废弃。', priority: 'P0', status: 'active' },
                    { id: 'A1-02', name: '首提时间差', definition: '第一笔充值到第一笔提现的时间差。', purpose: '拦截即充即提的洗钱行为。', formula: '首提时间 - 首充时间', threshold: '小于 30 分钟', calculationCase: '10点充值，10点10分提现，差值10分钟。', riskInterpretation: '真实用户通常会有一定的持仓/交易时间。', priority: 'P0', status: 'active' },
                    { id: 'A1-03', name: 'KYC变更频率', definition: '最近24小时修改实名信息的次数。', purpose: '识别账号买卖或黑产接管。', formula: '修改总次数', threshold: '大于 1 次', calculationCase: '一天内改了2次绑定的手机号。', riskInterpretation: '正常用户不会频繁变更核心认证信息。', priority: 'P1', status: 'active' },
                    { id: 'A1-04', name: '密码重置频次', definition: '短时间内密码重设并立即尝试大额提现。', purpose: '识别账号劫持后的资金洗劫。', formula: '提现时间 - 重置时间', threshold: '小于 1 小时', calculationCase: '改密码 5 分钟后申请全额提现。', riskInterpretation: '极高概率为盗号洗劫。', priority: 'P0', status: 'active' },
                    { id: 'A1-05', name: '静默唤醒倍率', definition: '沉睡账号激活后的交易额与历史均值对比。', purpose: '监控僵尸号被盗激活。', formula: '今日成交额 / 历史平均额', threshold: '大于 100 倍', calculationCase: '半年没动，今天突然交易了10万刀。', riskInterpretation: '休眠号常被黑产批量购买用于洗钱。', priority: 'P1', status: 'active' }
                ]
            },
            {
                id: 'A2',
                name: '环境指纹',
                indicators: [
                    { id: 'A2-01', name: '设备重复率', definition: '单一设备登录的不同账户数量。', purpose: '识别群控工作室。', formula: 'UID 累计总数', threshold: '大于 5 个', calculationCase: '一台手机登录了 20 个不同的 UID。', riskInterpretation: '单人操作多号是市场操纵的物理证据。', priority: 'P0', status: 'active' },
                    { id: 'A2-02', name: '模拟器指纹', definition: '命中环境监测中模拟器特征的个数。', purpose: '过滤自动化脚本攻击。', formula: '命中特征数汇总', threshold: '大于 2 个', calculationCase: '命中“无电量信息”和“固定IMEI”。', riskInterpretation: '模拟器是批量脚本操作的最常见环境。', priority: 'P0', status: 'active' },
                    { id: 'A2-03', name: '代理IP偏好', definition: '该账号使用已知中继IP登录的占比。', purpose: '识别刻意隐藏位置的行为。', formula: '代理登录次数 / 总登录次数', threshold: '大于 80%', calculationCase: '10次登录有8次用了VPN跳板。', riskInterpretation: '高度伪装往往预示着违规操作。', priority: 'P2', status: 'active' },
                    { id: 'A2-04', name: 'MAC黑名单关联', definition: '设备硬件地址是否命中过封禁库。', purpose: '彻底阻断惯犯。', formula: '命中标记 (0/1)', threshold: '等于 1', calculationCase: '该手机之前因为刷量被封过。', riskInterpretation: '对高危设备保持永久警惕。', priority: 'P0', status: 'active' },
                    { id: 'A2-05', name: '屏幕操作熵值', definition: '鼠标/触摸轨迹的无序程度。', purpose: '区分真人与机器自动化操作。', formula: '轨迹拟合度评分', threshold: '小于 0.2', calculationCase: '点击位置完全固定，无任何抖动。', riskInterpretation: '百分之百的脚本自动化行为。', priority: 'P1', status: 'active' }
                ]
            }
        ]
    },
    {
        id: 'B',
        name: '资产与资金维度',
        icon: 'Shield',
        description: '监控资产来源的纯净度与异常划转',
        color: 'green',
        subcategories: [
            {
                id: 'B1',
                name: '入金异常',
                indicators: [
                    { id: 'B1-01', name: '黑地址关联深度', definition: '充值来源与涉案地址的最短距离。', purpose: '防范涉案资金流入平台。', formula: '跳数 (Depth)', threshold: '小于等于 2 层', calculationCase: '资金是从黑客地址转了两手过来的。', riskInterpretation: '反洗钱红线，必须立即拦截并冻结。', priority: 'P0', status: 'active' },
                    { id: 'B1-02', name: '小额探测笔数', definition: '充值金额小于1USDT的次数。', purpose: '识别灰产在探测通道可用性。', formula: '小额充值次数汇总', threshold: '大于 10 次', calculationCase: '一分钟充了20次 0.1 USDT。', riskInterpretation: '寻找接口响应漏洞或洗钱路径测试。', priority: 'P1', status: 'active' },
                    { id: 'B1-03', name: '多地址归集密度', definition: '不同外部地址汇聚到同一UID的笔数。', purpose: '识别非法集资或归集。', formula: '来源地址总数', threshold: '大于 50 个', calculationCase: '50个不同的人往一个号里打钱。', riskInterpretation: '极高风险，通常为犯罪团伙的收金号。', priority: 'P0', status: 'active' },
                    { id: 'B1-04', name: '充提平衡率', definition: '资产充入与提走的差值比例。', purpose: '识别洗钱中转（即充即提）。', formula: '提现金额 / 充值金额', threshold: '大于 98%', calculationCase: '充了1万，10分钟后提走9900。', riskInterpretation: '平台被当成了洗钱的免损耗工具。', priority: 'P0', status: 'active' },
                    { id: 'B1-05', name: '整数入金占比', definition: '充值金额是否全部为整数的比例。', purpose: '识别线下非法承兑。', formula: '整钱笔数 / 总笔数', threshold: '大于 90%', calculationCase: '全是1000、5000这种整钱。', riskInterpretation: '典型场外现金交易入金特征。', priority: 'P2', status: 'active' }
                ]
            },
            {
                id: 'B2',
                name: '异动监控',
                indicators: [
                    { id: 'B2-01', name: '余额暴增倍数', definition: '今日余额与过去7日均值的对比。', purpose: '预警非正常资产激增。', formula: '今日 / 7日均值', threshold: '大于 20 倍', calculationCase: '平时100刀，今天突然变2万刀。', riskInterpretation: '可能涉及欺诈、错发或特大额异常操作。', priority: 'P1', status: 'active' },
                    { id: 'B2-02', name: '手续费偏离率', definition: '愿意支付远高于市场的Gas费。', purpose: '识别急于出逃的资产。', formula: '支付手续费 / 市场均价', threshold: '大于 10 倍', calculationCase: '宁愿付100刀也要转账1000刀。', riskInterpretation: '逃离追踪比资产损耗更重要。', priority: 'P2', status: 'active' },
                    { id: 'B2-03', name: '币种分散度', definition: '账户内持有的不同小额币种数量。', purpose: '识别垃圾币搬砖机器人。', formula: '持有币种总数', threshold: '大于 50 种', calculationCase: '持有50种流动性极差的垃圾币。', riskInterpretation: '可能在进行广泛的低频对冲或测试。', priority: 'P2', status: 'active' },
                    { id: 'B2-04', name: '新地址提现突增', definition: '短时间内绑定的新提现地址数量。', purpose: '防范被盗后资产大面积转移。', formula: '新地址计数', threshold: '大于 3 个', calculationCase: '半小时内加了3个陌生地址提现。', riskInterpretation: '典型的黑客接管后清仓动作。', priority: 'P0', status: 'active' },
                    { id: 'B2-05', name: '资金停留秒数', definition: '资产从进来到出去的存留时间。', purpose: '识别自动化洗钱。', formula: '提现时间 - 充值时间', threshold: '小于 60 秒', calculationCase: '钱待了30秒就被转走了。', riskInterpretation: '完全由程序自动化控制的洗钱流水。', priority: 'P0', status: 'active' }
                ]
            }
        ]
    },
    {
        id: 'C',
        name: '交易行为维度',
        icon: 'Activity',
        description: '监控交易逻辑，识别洗售、刷量及价格操纵',
        color: 'orange',
        subcategories: [
            {
                id: 'C1',
                name: '操纵洗售',
                indicators: [
                    { id: 'C1-01', name: '自成交占比', definition: '买卖双方为同一账户或关联账户的量。', purpose: '识别虚假繁荣与刷量。', formula: '自成交额 / 总成交额', threshold: '大于 10%', calculationCase: '成交100万，15万是自己买自己的。', riskInterpretation: '虚构成交量误导散户，典型的市场操纵。', priority: 'P0', status: 'active' },
                    { id: 'C1-02', name: '价格对敲差价', definition: '关联交易的价格与市场价的偏离度。', purpose: '识别通过对敲实现利益输送。', formula: '(成交价 - 市场价) / 市场价', threshold: '大于 5%', calculationCase: '比特币10万一个，他5万卖给自己。', riskInterpretation: '通过极低/极高价向特定账号转资产。', priority: 'P0', status: 'active' },
                    { id: 'C1-03', name: '撤单比率 (Cancel)', definition: '撤单数量占总下单数量的比例。', purpose: '识别虚假深度墙。', formula: '撤单数 / 下单数', threshold: '大于 95%', calculationCase: '挂了100单，成交了1单，撤了99单。', riskInterpretation: '利用挂单干扰盘口，诱导下单。', priority: 'P1', status: 'active' },
                    { id: 'C1-04', name: '挂单生命周期', definition: '从下单到撤单之间的存续秒数。', purpose: '识别“闪烁”订单。', formula: '撤单时间 - 下单时间', threshold: '小于 1 秒', calculationCase: '订单挂上去 0.5 秒就撤。', riskInterpretation: '机器人利用超高频撤单制造虚假活跃。', priority: 'P1', status: 'active' },
                    { id: 'C1-05', name: '循环交易路径', definition: '发现 A->B->C->A 的闭环。', purpose: '识别高级团伙洗钱。', formula: '路径闭环识别', threshold: '存在闭环', calculationCase: '三个账号之间形成完美的互买互卖。', riskInterpretation: '躲避单账号检测，系统化操纵行为。', priority: 'P0', status: 'active' }
                ]
            },
            {
                id: 'C2',
                name: '异常频率',
                indicators: [
                    { id: 'C2-01', name: '下单QPS峰值', definition: '每秒钟提交的订单笔数。', purpose: '防止暴力下单攻击。', formula: '笔数 / 秒', threshold: '大于 20 次', calculationCase: '1秒内发了 50 个买单。', riskInterpretation: '严重挤占系统带宽，非人类操作。', priority: 'P1', status: 'active' },
                    { id: 'C2-02', name: '单笔异常偏离', definition: '单笔成交相对于上一笔价格的跳动。', purpose: '识别恶意插针。', formula: '(当前价 - 上一价) / 上一价', threshold: '大于 3%', calculationCase: '上一秒100块，下一秒跳到90块。', riskInterpretation: '故意击穿深度，触发散户爆仓。', priority: 'P1', status: 'active' },
                    { id: 'C2-03', name: '高胜率稳定性', definition: '在极窄波动内的成交胜率。', purpose: '识别利用延迟抢跑。', formula: '盈利次数 / 总次数', threshold: '大于 95%', calculationCase: '交易 1000 次，稳赚不赔。', riskInterpretation: '怀疑利用 API 延迟漏洞获利。', priority: 'P1', status: 'active' },
                    { id: 'C2-04', name: '非主流币对冲', definition: '在该号总成交中僵尸币种的占比。', purpose: '利用冷门币洗钱。', formula: '僵尸币额 / 总成交额', threshold: '大于 70%', calculationCase: '只盯着没人要的币玩命对敲。', riskInterpretation: '利用僵尸币价格易控的特点转移非法金。', priority: 'P1', status: 'active' },
                    { id: 'C2-05', name: '分笔数/总额比', definition: '极小额多笔成交的密集程度。', purpose: '识别“拆单”规避。', formula: '笔数 / 单笔平均额', threshold: '大于 1000', calculationCase: '1万块钱拆成 1 万笔成交。', riskInterpretation: '刻意规避大额交易风控监测。', priority: 'P2', status: 'active' }
                ]
            }
        ]
    },
    {
        id: 'D',
        name: '市场冲击维度',
        icon: 'TrendingUp',
        description: '监控单笔交易对盘面产生的宏观影响',
        color: 'red',
        subcategories: [
            {
                id: 'D1',
                name: '流动性破坏',
                indicators: [
                    { id: 'D1-01', name: '滑点系数', definition: '实际成交价与下单时最优价的偏离。', purpose: '衡量对深度造成的冲击力。', formula: '(成交价 - 最优价) / 最优价', threshold: '大于 2%', calculationCase: '想 100 块买，结果 103 块成交。', riskInterpretation: '大额砸盘瞬间耗尽流动性。', priority: 'P1', status: 'active' },
                    { id: 'D1-02', name: '深度占有率', definition: '该号挂单占盘口前5档的比例。', purpose: '识别垄断盘口。', formula: '个人挂单量 / 5档总量', threshold: '大于 30%', calculationCase: '盘面上三成的买单都是他的。', riskInterpretation: '形成价格控制，左右市场走向。', priority: 'P1', status: 'active' },
                    { id: 'D1-03', name: '价格跳空频率', definition: '两笔连续成交之间出现的价格缺口。', purpose: '识别闪跌/闪涨。', formula: '当前价 - 前价', threshold: '大于 1%', calculationCase: '价格瞬间跳空，无任何成交缓冲。', riskInterpretation: '流动性真空预警，极易发生连锁爆仓。', priority: 'P0', status: 'active' },
                    { id: 'D1-04', name: '外部溢价偏离', definition: '本平台价与全网均价的价差比。', purpose: '识别单点操纵。', formula: '本台价 / 全网价', threshold: '大于 5%', calculationCase: '全世界卖 100，本台卖 110。', riskInterpretation: '明显的单台恶意拉升。', priority: 'P0', status: 'active' },
                    { id: 'D1-05', name: '关联联动性', definition: '多币种同秒同步涨跌的概率。', purpose: '识别算法化大户操作。', formula: '同涨同跌币种数', threshold: '大于 10 个', calculationCase: '10个不相干币种在 1 毫秒齐涨。', riskInterpretation: '典型的量化集群操纵行为。', priority: 'P2', status: 'active' }
                ]
            },
            {
                id: 'D2',
                name: '买卖压力',
                indicators: [
                    { id: 'D2-01', name: '挂单失衡比', definition: '挂单簿买总量与卖总量的对比。', purpose: '预警单边崩盘。', formula: '买单总量 / 卖单总量', threshold: '小于 0.2', calculationCase: '卖盘是买盘的 5 倍。', riskInterpretation: '市场极度恐慌，承接力严重不足。', priority: 'P1', status: 'active' },
                    { id: 'D2-02', name: '价差(Spread)突增', definition: '买一与卖一之间的空档倍数。', purpose: '评估用户交易成本。', formula: '当前价差 / 平时价差', threshold: '大于 5 倍', calculationCase: '平时差 1 毛，现在差 5 块。', riskInterpretation: '市场进入极度危险期，易发爆仓。', priority: 'P1', status: 'active' },
                    { id: 'D2-03', name: '单笔成交密度', definition: '1秒内的成交总笔数。', purpose: '识别暴力洗盘。', formula: '成交总笔数', threshold: '大于 100 笔', calculationCase: '1秒钟内完成了150笔小额成交。', riskInterpretation: '干扰正常用户看盘，掩盖出货。', priority: 'P1', status: 'active' },
                    { id: 'D2-04', name: '强力支撑穿透', definition: '击穿最大买单支撑所需的量。', purpose: '识别虚假支撑位。', formula: '成交量 / 最大挂单量', threshold: '小于 0.1', calculationCase: '1万个买单，结果100个就跌穿了。', riskInterpretation: '支撑位是虚假的“僵尸单”，毫无意义。', priority: 'P0', status: 'active' },
                    { id: 'D2-05', name: '波动熵值', definition: '价格跳动的无序程度。', purpose: '识别搅局机器人。', formula: '价格跳动次数', threshold: '大于 500 次/分', calculationCase: '价格每秒钟都在疯狂抖动。', riskInterpretation: '通过极高频跳动干扰量化系统。', priority: 'P2', status: 'active' }
                ]
            }
        ]
    }
];

// 导出数据切换函数
export const getInitialData = (mode?: 'basic' | 'full'): Category[] => {
  const targetMode = mode || getCurrentDataMode();
  return targetMode === 'full' ? INTEGRATED_INDICATORS : BASIC_DATA;
};

// 导出当前使用的模式
export const CURRENT_DATA_MODE = getCurrentDataMode();

// 为了向后兼容，保留INITIAL_DATA作为动态获取的常量
export const INITIAL_DATA = getInitialData();

export const TUTORIAL_CONTENT = `
# 加密货币现货风控本体生产白皮书 (40项)

本系统严格遵循 **MECE (Mutually Exclusive, Collectively Exhaustive)** 准则：

---

## 1. 账号与身份 (WHO)
- **重点**: 解决“你是谁”以及“你的环境是否纯净”。
- **公式示例**: \`注册存续 = 今日 - 注册日期\`。

## 2. 资产与资金 (WHERE)
- **重点**: 解决“钱从哪来”以及“钱去哪了”。
- **公式示例**: \`充提比 = 提现 / 充值\`。

## 3. 交易行为 (HOW)
- **重点**: 识别“交易逻辑是否真实”。
- **公式示例**: \`自成交率 = 关联成交 / 总量\`。

## 4. 市场冲击 (RESULT)
- **重点**: 评估“交易对盘面产生的宏观影响”。
- **公式示例**: \`滑点 = (成交 - 挂单) / 挂单\`。
`;