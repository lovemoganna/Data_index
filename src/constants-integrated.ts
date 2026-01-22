import { Category } from './types';

export const INTEGRATED_INDICATORS: Category[] = [
  {
    "id": "A",
    "name": "用户画像指标",
    "icon": "Users",
    "description": "用户基础特征、历史行为、特殊标记",
    "color": "blue",
    "subcategories": [
      {
        "id": "A1",
        "name": "基础信息",
        "indicators": [
          {
            "id": "A1-01",
            "name": "账龄",
            "definition": "用户注册至今的时间",
            "purpose": "新账户（<30天）更易涉及一次性套利行为",
            "formula": "当前日期 - 注册日期",
            "threshold": "<30天 高风险",
            "calculationCase": "注册2024-01-15，当前2025-01-13",
            "riskInterpretation": "新账户（<30天）更易涉及一次性套利行为",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A1-02",
            "name": "KYC等级",
            "definition": "用户身份认证级别",
            "purpose": "低KYC等级账户更易被用于违规操作",
            "formula": "平台KYC等级定义（L0-L3）",
            "threshold": "L0/L1 高风险",
            "calculationCase": "已完成身份证+人脸认证",
            "riskInterpretation": "低KYC等级账户更易被用于违规操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": [
                {"targetId": "身份验证模块", "type": "used_by", "description": "身份验证模块使用此指标"},
                {"targetId": "风险评估引擎", "type": "used_by", "description": "风险评估引擎使用此指标"},
                {"targetId": "合规审查系统", "type": "used_by", "description": "合规审查系统使用此指标"},
                {"targetId": "账龄", "type": "depends_on", "description": "依赖账龄指标进行计算"}
            ]
          },
          {
            "id": "A1-03",
            "name": "账户类型",
            "definition": "账户的业务分类",
            "purpose": "区分正常量化交易与异常程序化操纵",
            "formula": "平台标记（普通/机构/做市商/API）",
            "threshold": "—",
            "calculationCase": "账户开通API交易权限",
            "riskInterpretation": "区分正常量化交易与异常程序化操纵",
            "priority": "P2",
            "status": "active"
          }
        ]
      },
      {
        "id": "A2",
        "name": "历史行为",
        "indicators": [
          {
            "id": "A2-01",
            "name": "历史违规次数",
            "definition": "账户历史被限制/警告的次数",
            "purpose": "累犯用户风险更高，需从重处置",
            "formula": "count(历史限制记录)",
            "threshold": "≥1次 高风险",
            "calculationCase": "过去1年被限制2次",
            "riskInterpretation": "累犯用户风险更高，需从重处置",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A2-02",
            "name": "历史交易币种数",
            "definition": "账户历史交易过的不同币种数量",
            "purpose": "仅交易单一小币种的账户更可疑",
            "formula": "count(distinct 交易币种)",
            "threshold": "=1且为小币种 高风险",
            "calculationCase": "过去1年交易过BTC/ETH/DOGE共3个币种",
            "riskInterpretation": "仅交易单一小币种的账户更可疑",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A2-03",
            "name": "历史平均持仓时间",
            "definition": "账户历史交易的平均持仓时长",
            "purpose": "与当前交易对比，突然缩短提示异常",
            "formula": "avg(各笔交易持仓时间)",
            "threshold": "当前<历史10% 高风险",
            "calculationCase": "历史100笔交易平均持仓2.5小时",
            "riskInterpretation": "与当前交易对比，突然缩短提示异常",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A2-04",
            "name": "历史平均收益率",
            "definition": "账户历史交易的平均收益率",
            "purpose": "与当前交易对比，突然飙升提示异常",
            "formula": "avg(各笔交易收益率)",
            "threshold": "当前>历史5倍 高风险",
            "calculationCase": "历史100笔交易平均收益率3.2%",
            "riskInterpretation": "与当前交易对比，突然飙升提示异常",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A2-05",
            "name": "历史胜率",
            "definition": "账户历史盈利交易占比",
            "purpose": "与当前对比，突然飙升提示异常",
            "formula": "历史盈利次数 ÷ 历史总交易次数 × 100%",
            "threshold": "当前>历史+20% 高风险",
            "calculationCase": "历史100笔交易60笔盈利",
            "riskInterpretation": "与当前对比，突然飙升提示异常",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "A3",
        "name": "特殊标记",
        "indicators": [
          {
            "id": "A3-01",
            "name": "做市商标记",
            "definition": "是否为平台认证做市商",
            "purpose": "做市商高频交易属于合规行为，需豁免",
            "formula": "布尔值（是/否）",
            "threshold": "—",
            "calculationCase": "账户有做市商白名单标记",
            "riskInterpretation": "做市商高频交易属于合规行为，需豁免",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "A3-02",
            "name": "量化团队标记",
            "definition": "是否为已报备量化团队",
            "purpose": "已报备团队的策略交易属于可解释行为",
            "formula": "布尔值（是/否）",
            "threshold": "—",
            "calculationCase": "账户备注\"量化团队-已报备\"",
            "riskInterpretation": "已报备团队的策略交易属于可解释行为",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "A3-03",
            "name": "VIP等级",
            "definition": "用户的VIP层级",
            "purpose": "高VIP用户误判成本更高，需谨慎处置",
            "formula": "平台VIP等级定义（V0-V9）",
            "threshold": "—",
            "calculationCase": "30日交易量500万USDT",
            "riskInterpretation": "高VIP用户误判成本更高，需谨慎处置",
            "priority": "P2",
            "status": "active"
          }
        ]
      },
      {
        "id": "A4",
        "name": "认证与安全",
        "indicators": [
          {
            "id": "A4-01",
            "name": "认证额度",
            "definition": "用户完成认证后的交易额度上限",
            "purpose": "低认证等级下大额交易提示风险",
            "formula": "平台认证等级对应额度",
            "threshold": "额度<交易额 高风险",
            "calculationCase": "完成L3认证，额度500万USDT",
            "riskInterpretation": "低认证等级下大额交易提示风险",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A4-02",
            "name": "安全绑定强度",
            "definition": "账户绑定的安全要素数量",
            "purpose": "安全绑定越完整，越不容易被盗用",
            "formula": "count(绑定手机/邮箱/GA/人脸等)",
            "threshold": "<3个 高风险",
            "calculationCase": "绑定手机+邮箱+GA+人脸",
            "riskInterpretation": "安全绑定越完整，越不容易被盗用",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A4-03",
            "name": "二次验证频率",
            "definition": "使用2FA验证的交易比例",
            "purpose": "不使用2FA的高频交易风险极高",
            "formula": "启用2FA交易次数 ÷ 总交易次数 × 100%",
            "threshold": "<90% 高风险",
            "calculationCase": "100笔交易中98笔使用2FA",
            "riskInterpretation": "不使用2FA的高频交易风险极高",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A4-04",
            "name": "登录异常次数",
            "definition": "非正常登录的尝试次数",
            "purpose": "频繁异常登录提示账户可能被盗用",
            "formula": "count(异地/异常设备登录)",
            "threshold": "≥2次 高风险",
            "calculationCase": "过去7天异地登录3次",
            "riskInterpretation": "频繁异常登录提示账户可能被盗用",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "A5",
        "name": "设备与环境",
        "indicators": [
          {
            "id": "A5-01",
            "name": "设备指纹一致性",
            "definition": "账户使用的设备指纹是否稳定",
            "purpose": "频繁更换设备提示异常行为",
            "formula": "设备指纹变更次数",
            "threshold": ">2次/月 高风险",
            "calculationCase": "注册设备与当前设备指纹相同",
            "riskInterpretation": "频繁更换设备提示异常行为",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A5-02",
            "name": "IP地址稳定性",
            "definition": "账户登录IP的稳定性程度",
            "purpose": "IP频繁变化提示使用代理或多地操作",
            "formula": "唯一IP数量 ÷ 总登录次数",
            "threshold": "<0.3 高风险",
            "calculationCase": "10次登录使用5个不同IP",
            "riskInterpretation": "IP频繁变化提示使用代理或多地操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A5-03",
            "name": "时区一致性",
            "definition": "账户操作时区的稳定性",
            "purpose": "跨时区操作提示国际化团队或异常行为",
            "formula": "操作时区变更频率",
            "threshold": "跨3个以上时区 高风险",
            "calculationCase": "所有操作在北京时区",
            "riskInterpretation": "跨时区操作提示国际化团队或异常行为",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A5-04",
            "name": "行为模式相似度",
            "definition": "当前行为与历史模式的相似程度",
            "purpose": "行为模式突变提示账户被接管",
            "formula": "当前行为向量与历史向量的余弦相似度",
            "threshold": "<0.6 高风险",
            "calculationCase": "相似度0.85",
            "riskInterpretation": "行为模式突变提示账户被接管",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "A5-05",
            "name": "操作时间偏好",
            "definition": "用户偏好的操作时间段分布",
            "purpose": "突然改变操作时间提示异常",
            "formula": "24小时操作分布熵值",
            "threshold": "偏离历史>2σ 高风险",
            "calculationCase": "主要在9:00-18:00操作",
            "riskInterpretation": "突然改变操作时间提示异常",
            "priority": "P0",
            "status": "active"
          }
        ]
      }
    ]
  },
  {
    "id": "B",
    "name": "资金流向指标",
    "icon": "TrendingUp",
    "description": "充值提币行为、资金闭环、利用率",
    "color": "green",
    "subcategories": [
      {
        "id": "B1",
        "name": "充值行为",
        "indicators": [
          {
            "id": "B1-01",
            "name": "单笔充值金额",
            "definition": "单次充值的USDT金额",
            "purpose": "大额单笔充值后立即交易提示定向套利",
            "formula": "直接读取",
            "threshold": ">10,000 USDT 关注",
            "calculationCase": "单笔充值50,000 USDT",
            "riskInterpretation": "大额单笔充值后立即交易提示定向套利",
            "priority": "P1",
            "status": "active",
            "indicatorType": "base",
            "references": [
              {"targetId": "B2-01", "type": "used_by", "description": "资金流向分析使用充值金额数据"}
            ]
          },
          {
            "id": "B1-02",
            "name": "充值笔数",
            "definition": "指定时段内的充值次数",
            "purpose": "多笔拆分充值可能规避大额监控",
            "formula": "count(充值记录)",
            "threshold": "1小时内>3笔 关注",
            "calculationCase": "1小时内充值5笔",
            "riskInterpretation": "多笔拆分充值可能规避大额监控",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "B1-03",
            "name": "充值总额",
            "definition": "指定时段内的充值总金额",
            "purpose": "衡量用户本次操作的资金规模",
            "formula": "sum(充值金额)",
            "threshold": "—",
            "calculationCase": "1小时内5笔共充值80,000 USDT",
            "riskInterpretation": "衡量用户本次操作的资金规模",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "B1-04",
            "name": "充值到交易时差",
            "definition": "充值完成到首笔交易的时间差",
            "purpose": "充值后立即交易（<5分钟）提示预谋行为",
            "formula": "首笔交易时间 - 充值到账时间",
            "threshold": "<5分钟 高风险",
            "calculationCase": "充值到账14:00:00，首笔交易14:02:30",
            "riskInterpretation": "充值后立即交易（<5分钟）提示预谋行为",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "B1-05",
            "name": "入金异常倍数",
            "definition": "本次入金与历史月均的比值",
            "purpose": "衡量入金是否异于历史习惯",
            "formula": "本次入金金额 ÷ 历史月均入金金额",
            "threshold": ">5倍 关注",
            "calculationCase": "本次50,000 USDT，月均5,000 USDT",
            "riskInterpretation": "衡量入金是否异于历史习惯",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "B2",
        "name": "提币行为",
        "indicators": [
          {
            "id": "B2-01",
            "name": "单笔提币金额",
            "definition": "单次提币的金额",
            "purpose": "大额单笔提币提示资金快速离场",
            "formula": "直接读取",
            "threshold": ">充值总额 关注",
            "calculationCase": "单笔提币65,000 USDT",
            "riskInterpretation": "大额单笔提币提示资金快速离场",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "B2-02",
            "name": "提币笔数",
            "definition": "指定时段内的提币次数",
            "purpose": "多笔拆分提币可能规避大额监控",
            "formula": "count(提币记录)",
            "threshold": "—",
            "calculationCase": "交易完成后1小时内提币2笔",
            "riskInterpretation": "多笔拆分提币可能规避大额监控",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "B2-03",
            "name": "提币总额",
            "definition": "指定时段内的提币总金额",
            "purpose": "衡量用户离场资金规模",
            "formula": "sum(提币金额)",
            "threshold": "—",
            "calculationCase": "2笔共提币65,000 USDT",
            "riskInterpretation": "衡量用户离场资金规模",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "B2-04",
            "name": "交易到提币时差",
            "definition": "最后一笔卖出到发起提币的时间差",
            "purpose": "交易后立即提币（<10分钟）是套利闭环特征",
            "formula": "提币发起时间 - 最后卖出时间",
            "threshold": "<10分钟 高风险",
            "calculationCase": "卖出15:00:00，提币15:03:22",
            "riskInterpretation": "交易后立即提币（<10分钟）是套利闭环特征",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "B2-05",
            "name": "提币清空率",
            "definition": "提币后账户余额占提币前余额的比例",
            "purpose": "接近0%说明\"全额提币离场\"",
            "formula": "提币后余额 ÷ 提币前余额 × 100%",
            "threshold": "<1% 高风险",
            "calculationCase": "提币前65,000，提币后50",
            "riskInterpretation": "接近0%说明\"全额提币离场\"",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "B3",
        "name": "资金闭环",
        "indicators": [
          {
            "id": "B3-01",
            "name": "充提比",
            "definition": "提币总额与充值总额的比值",
            "purpose": ">1说明有盈利离场，配合短周期高度可疑",
            "formula": "提币总额 ÷ 充值总额",
            "threshold": ">1.2且周期<24h 高风险",
            "calculationCase": "充值50,000，提币65,000",
            "riskInterpretation": ">1说明有盈利离场，配合短周期高度可疑",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "B3-02",
            "name": "资金闭环指数",
            "definition": "充值来源与提币目标的关联程度",
            "purpose": "=1说明资金原路返回，典型套利闭环",
            "formula": "存在共同上游=1，间接关联=0.5，无关联=0",
            "threshold": "=1 高风险",
            "calculationCase": "充值来源与提币目标有共同上游",
            "riskInterpretation": "=1说明资金原路返回，典型套利闭环",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "B3-03",
            "name": "资金停留时间",
            "definition": "资金从充值到提币的总时长",
            "purpose": "时间极短（<6小时）提示\"快进快出\"套利",
            "formula": "提币时间 - 充值时间",
            "threshold": "<6小时 高风险",
            "calculationCase": "充值13:00，提币16:30",
            "riskInterpretation": "时间极短（<6小时）提示\"快进快出\"套利",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "B3-04",
            "name": "账户净留存",
            "definition": "交易完成后账户剩余资金",
            "purpose": "接近0说明无意长期使用平台",
            "formula": "账户当前余额",
            "threshold": "<100 USDT 关注",
            "calculationCase": "交易提币后余额50 USDT",
            "riskInterpretation": "接近0说明无意长期使用平台",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "B3-05",
            "name": "入金利用率",
            "definition": "用于交易的金额占入金的比例",
            "purpose": "接近100%说明是定向使用资金",
            "formula": "用于交易的金额 ÷ 入金总额 × 100%",
            "threshold": ">90% 结合其他指标",
            "calculationCase": "交易用48,000 USDT，入金50,000 USDT",
            "riskInterpretation": "接近100%说明是定向使用资金",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "B3-06",
            "name": "出金转化率",
            "definition": "出金金额占（入金+盈利）的比例",
            "purpose": "=100%说明\"全额离场\"",
            "formula": "出金金额 ÷ (入金 + 盈利) × 100%",
            "threshold": "=100% 关注",
            "calculationCase": "出金62,000，入金50,000+盈利12,000",
            "riskInterpretation": "=100%说明\"全额离场\"",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "B4",
        "name": "资金溯源",
        "indicators": [
          {
            "id": "B4-01",
            "name": "资金来源集中度\t入金来源地址的数量分布",
            "definition": "前三大来源占比总入金的比例",
            "purpose": "高度集中提示资金来自特定渠道",
            "formula": "sum(top3来源金额) ÷ 总入金 × 100%",
            "threshold": ">80% 关注",
            "calculationCase": "三大来源占比85%",
            "riskInterpretation": "高度集中提示资金来自特定渠道",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "B4-02",
            "name": "链上资金新鲜度",
            "definition": "入金资金的链上历史活跃程度",
            "purpose": "<7天的新鲜资金高度可疑",
            "formula": "资金来源地址的首次交易距今时间",
            "threshold": "<30天 高风险",
            "calculationCase": "来源地址1年前首次交易",
            "riskInterpretation": "<7天的新鲜资金高度可疑",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "B4-03",
            "name": "资金流向复杂度",
            "definition": "提币目标地址的关联网络规模",
            "purpose": "关联网络越大，越可能是机构资金",
            "formula": "提币目标的关联地址数量",
            "threshold": ">100个 关注",
            "calculationCase": "目标地址关联50个地址",
            "riskInterpretation": "关联网络越大，越可能是机构资金",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "B4-04",
            "name": "跨平台资金同步",
            "definition": "同一地址在多平台的操作同步性",
            "purpose": "完全同步提示协同操纵",
            "formula": "多平台操作的时间差绝对值",
            "threshold": "<60秒 高风险",
            "calculationCase": "本平台与另一平台同时操作",
            "riskInterpretation": "完全同步提示协同操纵",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "B5",
        "name": "资金分布",
        "indicators": [
          {
            "id": "B5-01",
            "name": "金额分布均匀性",
            "definition": "各笔资金的金额分布熵值",
            "purpose": "金额过于均匀提示自动化操作",
            "formula": "基于金额区间的分布熵",
            "threshold": "熵值<0.5 高风险",
            "calculationCase": "多笔小额+少量大额",
            "riskInterpretation": "金额过于均匀提示自动化操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "B5-02",
            "name": "时间分布规律性",
            "definition": "资金操作的时间分布规律程度",
            "purpose": "时间规律提示程序化操作",
            "formula": "时间间隔的标准差系数",
            "threshold": "<0.3 高风险",
            "calculationCase": "间隔时间高度规律",
            "riskInterpretation": "时间规律提示程序化操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "B5-03",
            "name": "额度频率相关性",
            "definition": "金额大小与操作频率的相关系数",
            "purpose": "金额与频率正相关提示策略性操作",
            "formula": "Pearson相关系数",
            "threshold": ">0.7 关注",
            "calculationCase": "大额操作频率更高",
            "riskInterpretation": "金额与频率正相关提示策略性操作",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "B5-04",
            "name": "资金循环周期",
            "definition": "资金从入金到出金的平均周期",
            "purpose": "周期极短提示\"快进快出\"策略",
            "formula": "avg(资金停留时间)",
            "threshold": "<4小时 高风险",
            "calculationCase": "平均3.2小时",
            "riskInterpretation": "周期极短提示\"快进快出\"策略",
            "priority": "P0",
            "status": "active"
          }
        ]
      }
    ]
  },
  {
    "id": "C",
    "name": "交易行为指标",
    "icon": "Activity",
    "description": "交易频率、持仓时间、盈利模式",
    "color": "orange",
    "subcategories": [
      {
        "id": "C1",
        "name": "交易频率",
        "indicators": [
          {
            "id": "C1-01",
            "name": "交易次数",
            "definition": "指定时段内的交易笔数",
            "purpose": "高频交易需区分正常量化与异常刷单",
            "formula": "count(交易记录)",
            "threshold": "—",
            "calculationCase": "1小时内交易12笔",
            "riskInterpretation": "高频交易需区分正常量化与异常刷单",
            "priority": "P2",
            "status": "active",
            "indicatorType": "derived",
            "references": [
              {"targetId": "B1-01", "type": "depends_on", "description": "交易次数计算依赖充值行为数据"}
            ]
          },
          {
            "id": "C1-02",
            "name": "交易频率",
            "definition": "单位时间内的交易笔数",
            "purpose": "频率异常高提示程序化操作",
            "formula": "交易次数 ÷ 时间跨度(小时)",
            "threshold": ">10笔/小时 关注",
            "calculationCase": "1小时内12笔",
            "riskInterpretation": "频率异常高提示程序化操作",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "C1-03",
            "name": "平均交易间隔",
            "definition": "相邻两笔交易的平均时间间隔",
            "purpose": "间隔极短且规律提示自动化交易",
            "formula": "总时间跨度 ÷ (交易次数-1)",
            "threshold": "<1分钟且规律 高风险",
            "calculationCase": "1小时内12笔 → 60÷11",
            "riskInterpretation": "间隔极短且规律提示自动化交易",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C1-04",
            "name": "交易时段集中度",
            "definition": "交易集中在特定时段的程度",
            "purpose": "高度集中提示针对特定行情窗口操作",
            "formula": "最高小时交易数 ÷ 总交易数 × 100%",
            "threshold": ">70% 关注",
            "calculationCase": "24笔交易中18笔集中在1小时内",
            "riskInterpretation": "高度集中提示针对特定行情窗口操作",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "C2",
        "name": "持仓时间",
        "indicators": [
          {
            "id": "C2-01",
            "name": "单笔持仓时间",
            "definition": "单次交易从买入到卖出的时长",
            "purpose": "<60秒属于\"极短线\"高风险特征",
            "formula": "卖出时间 - 买入时间",
            "threshold": "<60秒 高风险",
            "calculationCase": "买入14:32:15，卖出14:32:58",
            "riskInterpretation": "<60秒属于\"极短线\"高风险特征",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C2-02",
            "name": "平均持仓时间",
            "definition": "多笔交易的平均持仓时长",
            "purpose": "持续极短持仓提示系统性套利",
            "formula": "avg(各笔持仓时间)",
            "threshold": "平均<60秒 高风险",
            "calculationCase": "5笔持仓：43s/51s/38s/55s/47s",
            "riskInterpretation": "持续极短持仓提示系统性套利",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C2-03",
            "name": "最长持仓时间",
            "definition": "多笔交易中的最长持仓时长",
            "purpose": "最长仍<60秒说明全部为极短线",
            "formula": "max(各笔持仓时间)",
            "threshold": "最长<60秒 高风险",
            "calculationCase": "5笔交易最长55秒",
            "riskInterpretation": "最长仍<60秒说明全部为极短线",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C2-04",
            "name": "持仓集中度",
            "definition": "单一币种持仓占总持仓的比例",
            "purpose": "=100%说明\"全仓单币\"操作",
            "formula": "单币种持仓市值 ÷ 总持仓市值 × 100%",
            "threshold": "=100%且为小币种 高风险",
            "calculationCase": "仅持有XXX币种价值10,000U",
            "riskInterpretation": "=100%说明\"全仓单币\"操作",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "C3",
        "name": "盈利模式",
        "indicators": [
          {
            "id": "C3-01",
            "name": "单笔盈利金额",
            "definition": "单次交易的盈利USDT金额",
            "purpose": "绝对盈利金额衡量套利规模",
            "formula": "卖出金额 - 买入金额",
            "threshold": "—",
            "calculationCase": "买入1,000，卖出1,085",
            "riskInterpretation": "绝对盈利金额衡量套利规模",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "C3-02",
            "name": "累计盈利金额",
            "definition": "多笔交易的总盈利USDT金额",
            "purpose": "累计盈利衡量总套利规模",
            "formula": "sum(各笔盈利金额)",
            "threshold": "—",
            "calculationCase": "5笔盈利：85/92/78/88/82",
            "riskInterpretation": "累计盈利衡量总套利规模",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "C3-03",
            "name": "单笔收益率",
            "definition": "单次交易的收益率",
            "purpose": "单笔收益率过高（>10%短周期）提示异常",
            "formula": "(卖出金额-买入金额) ÷ 买入金额 × 100%",
            "threshold": ">10%且持仓<1h 高风险",
            "calculationCase": "买入1,000，卖出1,085",
            "riskInterpretation": "单笔收益率过高（>10%短周期）提示异常",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C3-04",
            "name": "累计收益率",
            "definition": "多笔交易的累计收益率",
            "purpose": "衡量整体套利效率",
            "formula": "累计盈利 ÷ 总投入本金 × 100%",
            "threshold": "—",
            "calculationCase": "投入5,000，累计盈利425",
            "riskInterpretation": "衡量整体套利效率",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "C3-05",
            "name": "分钟收益率",
            "definition": "每分钟的平均收益率",
            "purpose": "衡量盈利效率，越高越异常",
            "formula": "收益率 ÷ 持仓时间(分钟)",
            "threshold": ">1%/分钟 高度可疑",
            "calculationCase": "收益率30%，持仓13分钟",
            "riskInterpretation": "衡量盈利效率，越高越异常",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "C3-06",
            "name": "交易胜率",
            "definition": "盈利交易次数占总交易的比例",
            "purpose": "胜率持续>70%统计上异常",
            "formula": "盈利次数 ÷ 总交易次数 × 100%",
            "threshold": ">70%持续3次以上 高风险",
            "calculationCase": "10次交易8次盈利",
            "riskInterpretation": "胜率持续>70%统计上异常",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C3-07",
            "name": "盈亏比",
            "definition": "平均盈利与平均亏损的比值",
            "purpose": "盈亏比异常高提示\"只赢不亏\"特征",
            "formula": "avg(盈利金额) ÷ avg(亏损金额)",
            "threshold": ">3.0 关注",
            "calculationCase": "平均盈利100，平均亏损20",
            "riskInterpretation": "盈亏比异常高提示\"只赢不亏\"特征",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "C3-08",
            "name": "最大单笔亏损",
            "definition": "多笔交易中的最大亏损金额",
            "purpose": "无亏损或亏损极小提示异常精准",
            "formula": "max(亏损金额)",
            "threshold": "=0 高风险",
            "calculationCase": "10笔交易最大亏损15 USDT",
            "riskInterpretation": "无亏损或亏损极小提示异常精准",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "C4",
        "name": "杠杆使用",
        "indicators": [
          {
            "id": "C4-01",
            "name": "杠杆倍数",
            "definition": "用户使用的杠杆倍数",
            "purpose": "高杠杆（>20倍）配合极短持仓为刷单特征",
            "formula": "直接读取",
            "threshold": ">20倍且持仓<5分钟 高风险",
            "calculationCase": "用户开仓使用50倍杠杆",
            "riskInterpretation": "高杠杆（>20倍）配合极短持仓为刷单特征",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C4-02",
            "name": "杠杆使用率",
            "definition": "实际杠杆占最大可用杠杆的比例",
            "purpose": "持续使用高杠杆提示激进套利",
            "formula": "实际杠杆 ÷ 最大杠杆 × 100%",
            "threshold": ">30%持续 高风险",
            "calculationCase": "使用50倍，最大125倍",
            "riskInterpretation": "持续使用高杠杆提示激进套利",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C4-03",
            "name": "保证金使用率",
            "definition": "已用保证金占账户权益的比例",
            "purpose": "接近100%提示满仓高风险操作",
            "formula": "已用保证金 ÷ 账户权益 × 100%",
            "threshold": ">80% 关注",
            "calculationCase": "已用8,000，权益10,000",
            "riskInterpretation": "接近100%提示满仓高风险操作",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "C5",
        "name": "策略分析",
        "indicators": [
          {
            "id": "C5-01",
            "name": "策略一致性",
            "definition": "交易策略的稳定性程度",
            "purpose": "策略过于一致提示程序化交易",
            "formula": "连续交易的相关系数",
            "threshold": ">0.9持续 高风险",
            "calculationCase": "网格策略相关系数0.95",
            "riskInterpretation": "策略过于一致提示程序化交易",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C5-02",
            "name": "价量配合度",
            "definition": "成交价格与成交量的相关程度",
            "purpose": "异常配合提示操纵行为",
            "formula": "Pearson相关系数",
            "threshold": ">0.8或<-0.8 高风险",
            "calculationCase": "价格上涨时成交量放大",
            "riskInterpretation": "异常配合提示操纵行为",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C5-03",
            "name": "订单簿影响度",
            "definition": "单笔交易对订单簿的扰动程度",
            "purpose": "影响度过高提示\"砸盘\"或\"拉盘\"",
            "formula": "交易量 ÷ (买卖深度总和) × 100%",
            "threshold": ">30% 关注",
            "calculationCase": "交易100U，深度总和500U",
            "riskInterpretation": "影响度过高提示\"砸盘\"或\"拉盘\"",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "C5-04",
            "name": "滑点成本",
            "definition": "实际成交价偏离期望价的程度",
            "purpose": "滑点过高提示成交不畅或操纵",
            "formula": "(期望价 - 实际价) ÷ 期望价 × 100%",
            "threshold": ">2% 关注",
            "calculationCase": "期望价100，实际成交99.5",
            "riskInterpretation": "滑点过高提示成交不畅或操纵",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "C5-05",
            "name": "成交率",
            "definition": "成功成交订单占总委托的比例",
            "purpose": "成交率过低提示订单异常",
            "formula": "成交订单数 ÷ 总委托数 × 100%",
            "threshold": "<80% 关注",
            "calculationCase": "100单委托95单成交",
            "riskInterpretation": "成交率过低提示订单异常",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "C6",
        "name": "风险度量",
        "indicators": [
          {
            "id": "C6-01",
            "name": "风险价值(VaR)",
            "definition": "持有期内可能的最大亏损",
            "purpose": "衡量组合风险敞口",
            "formula": "历史数据计算95%置信区间",
            "threshold": ">10% 高风险",
            "calculationCase": "1天持有VaR为5%",
            "riskInterpretation": "衡量组合风险敞口",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C6-02",
            "name": "夏普比率",
            "definition": "风险调整后的收益率",
            "purpose": "过高的夏普提示风险收益不匹配",
            "formula": "(收益率 - 无风险利率) ÷ 收益率标准差",
            "threshold": ">2.0 高度可疑",
            "calculationCase": "年化收益率15%，波动率20%",
            "riskInterpretation": "过高的夏普提示风险收益不匹配",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "C6-03",
            "name": "最大回撤",
            "definition": "历史最大亏损幅度",
            "purpose": "回撤过大提示激进策略",
            "formula": "max(峰值 - 谷值) ÷ 峰值 × 100%",
            "threshold": ">30% 高风险",
            "calculationCase": "账户最高10万，最低8万",
            "riskInterpretation": "回撤过大提示激进策略",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C6-04",
            "name": "波动率",
            "definition": "收益率的标准差",
            "purpose": "波动异常高提示高风险操作",
            "formula": "收益率标准差计算",
            "threshold": ">25% 高风险",
            "calculationCase": "日收益率波动15%",
            "riskInterpretation": "波动异常高提示高风险操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "C6-05",
            "name": "贝塔系数",
            "definition": "资产相对市场的敏感度",
            "purpose": "贝塔显著偏离1提示异常策略",
            "formula": "与市场收益率协方差 ÷ 市场方差",
            "threshold": ">2.0或<0.1 高风险",
            "calculationCase": "组合贝塔1.2",
            "riskInterpretation": "贝塔显著偏离1提示异常策略",
            "priority": "P0",
            "status": "active"
          }
        ]
      }
    ]
  },
  {
    "id": "D",
    "name": "价格精准度指标",
    "icon": "Target",
    "description": "买卖价偏离、分位数、命中率",
    "color": "purple",
    "subcategories": [
      {
        "id": "D1",
        "name": "买入精准度",
        "indicators": [
          {
            "id": "D1-01",
            "name": "买入价偏离率",
            "definition": "买入价与时段最低价的偏差",
            "purpose": "<1%说明精准买在最低点附近",
            "formula": "(买入均价-时段最低价) ÷ 时段最低价 × 100%",
            "threshold": "<1% 高风险；<2% 可疑",
            "calculationCase": "最低价1.000，买入价1.002",
            "riskInterpretation": "<1%说明精准买在最低点附近",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D1-02",
            "name": "买入价分位数",
            "definition": "买入价在时段价格分布中的位置",
            "purpose": "<20%说明买在价格分布底部",
            "formula": "(买入价-最低价) ÷ (最高价-最低价) × 100%",
            "threshold": "<20% 高风险",
            "calculationCase": "最低1.000，最高1.100，买入1.015",
            "riskInterpretation": "<20%说明买在价格分布底部",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D1-03",
            "name": "买入精准命中次数",
            "definition": "买入价位于极值区间的次数",
            "purpose": "多次命中极值说明系统性精准",
            "formula": "count(买入价偏离率<1%的交易)",
            "threshold": "≥3次 高风险",
            "calculationCase": "5笔交易中4笔买入偏离率<1%",
            "riskInterpretation": "多次命中极值说明系统性精准",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "D2",
        "name": "卖出精准度",
        "indicators": [
          {
            "id": "D2-01",
            "name": "卖出价偏离率",
            "definition": "卖出价与时段最高价的偏差",
            "purpose": "<1%说明精准卖在最高点附近",
            "formula": "(时段最高价-卖出均价) ÷ 时段最高价 × 100%",
            "threshold": "<1% 高风险；<2% 可疑",
            "calculationCase": "最高价1.100，卖出价1.097",
            "riskInterpretation": "<1%说明精准卖在最高点附近",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D2-02",
            "name": "卖出价分位数",
            "definition": "卖出价在时段价格分布中的位置",
            "purpose": ">80%说明卖在价格分布顶部",
            "formula": "(卖出价-最低价) ÷ (最高价-最低价) × 100%",
            "threshold": ">80% 高风险",
            "calculationCase": "最低1.000，最高1.100，卖出1.097",
            "riskInterpretation": ">80%说明卖在价格分布顶部",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D2-03",
            "name": "卖出精准命中次数",
            "definition": "卖出价位于极值区间的次数",
            "purpose": "多次命中极值说明系统性精准",
            "formula": "count(卖出价偏离率<1%的交易)",
            "threshold": "≥3次 高风险",
            "calculationCase": "5笔交易中4笔卖出偏离率<1%",
            "riskInterpretation": "多次命中极值说明系统性精准",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "D3",
        "name": "时序精准度",
        "indicators": [
          {
            "id": "D3-01",
            "name": "拉升前买入时间窗",
            "definition": "买入时点距拉升启动的时间差",
            "purpose": "<10分钟属于\"精准埋伏\"特征",
            "formula": "拉升启动时间 - 买入时间",
            "threshold": "<10分钟 高风险",
            "calculationCase": "买入14:55，拉升启动15:00",
            "riskInterpretation": "<10分钟属于\"精准埋伏\"特征",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D3-02",
            "name": "拉升后卖出时间窗",
            "definition": "卖出时点距拉升启动的时间差",
            "purpose": "<15分钟属于\"精准逃顶\"特征",
            "formula": "卖出时间 - 拉升启动时间",
            "threshold": "<15分钟 高风险",
            "calculationCase": "拉升启动15:00，卖出15:08",
            "riskInterpretation": "<15分钟属于\"精准逃顶\"特征",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D3-03",
            "name": "价格反转前卖出时间窗",
            "definition": "卖出时点距价格见顶回落的时间差",
            "purpose": "<5分钟说明提前知晓顶部位置",
            "formula": "价格见顶时间 - 卖出时间",
            "threshold": "<5分钟 高风险",
            "calculationCase": "卖出15:08，价格见顶15:10",
            "riskInterpretation": "<5分钟说明提前知晓顶部位置",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D3-04",
            "name": "极值命中率",
            "definition": "买卖价同时位于极值区间的交易占比",
            "purpose": ">50%说明\"买最低卖最高\"成为模式",
            "formula": "双向极值命中交易数 ÷ 总交易数 × 100%",
            "threshold": ">50% 高风险",
            "calculationCase": "5笔交易中3笔双向命中",
            "riskInterpretation": ">50%说明\"买最低卖最高\"成为模式",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D3-05",
            "name": "卖出后跌幅",
            "definition": "用户卖出后价格下跌幅度",
            "purpose": "大跌说明\"成功逃顶\"",
            "formula": "(用户卖出均价 - 当前价格) ÷ 用户卖出均价 × 100%",
            "threshold": ">15%（需结合时间） 可疑",
            "calculationCase": "卖出价0.3250，现价0.2530",
            "riskInterpretation": "大跌说明\"成功逃顶\"",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "D3-06",
            "name": "买入后涨幅",
            "definition": "用户买入后价格上涨幅度",
            "purpose": "衡量持仓期间价格上涨幅度",
            "formula": "(用户卖出时价格 - 用户买入均价) ÷ 用户买入均价 × 100%",
            "threshold": "短时间内>20% 关注",
            "calculationCase": "卖出价0.3250，买入价0.2500",
            "riskInterpretation": "衡量持仓期间价格上涨幅度",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "D4",
        "name": "预测准确性",
        "indicators": [
          {
            "id": "D4-01",
            "name": "价格预测准确率",
            "definition": "用户交易方向与后续价格走势的吻合度",
            "purpose": "准确率过高提示内幕信息",
            "formula": "预测正确次数 ÷ 总预测次数 × 100%",
            "threshold": ">75% 高风险",
            "calculationCase": "10次交易8次方向正确",
            "riskInterpretation": "准确率过高提示内幕信息",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D4-02",
            "name": "时机把握度",
            "definition": "交易时机与最佳时机的偏离程度",
            "purpose": "偏离过小说明精准时机把握",
            "formula": "(实际时机 - 最佳时机) ÷ 总时长 × 100%",
            "threshold": "<5% 高风险",
            "calculationCase": "最佳时机15:00，实际15:02",
            "riskInterpretation": "偏离过小说明精准时机把握",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D4-03",
            "name": "市场时机系数",
            "definition": "交易时点与市场转折点的重合程度",
            "purpose": "重合度过高说明市场预测能力异常",
            "formula": "时点重合交易数 ÷ 总交易数 × 100%",
            "threshold": ">50% 可疑",
            "calculationCase": "10笔交易中6笔踩准转折点",
            "riskInterpretation": "重合度过高说明市场预测能力异常",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "D4-04",
            "name": "反向操作成功率",
            "definition": "在市场反转点进行反向操作的成功率",
            "purpose": "成功率过高提示操纵行为",
            "formula": "反向操作盈利次数 ÷ 反向操作总数 × 100%",
            "threshold": ">70% 高风险",
            "calculationCase": "5次反向操作4次盈利",
            "riskInterpretation": "成功率过高提示操纵行为",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "D5",
        "name": "市场效率",
        "indicators": [
          {
            "id": "D5-01",
            "name": "滑点异常率",
            "definition": "滑点超过正常范围的交易占比",
            "purpose": "滑点异常提示订单簿操纵",
            "formula": "异常滑点交易数 ÷ 总交易数 × 100%",
            "threshold": ">20% 关注",
            "calculationCase": "100笔交易中15笔滑点>2%",
            "riskInterpretation": "滑点异常提示订单簿操纵",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "D5-02",
            "name": "成交速度指数",
            "definition": "订单从委托到成交的平均耗时",
            "purpose": "速度过快提示优先成交权",
            "formula": "avg(委托到成交时间差)",
            "threshold": "<1秒 高风险",
            "calculationCase": "平均成交耗时0.5秒",
            "riskInterpretation": "速度过快提示优先成交权",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "D5-03",
            "name": "订单簿深度影响",
            "definition": "单笔订单对订单簿深度的影响程度",
            "purpose": "影响过大提示深度不足或操纵",
            "formula": "订单量 ÷ 订单簿深度 × 100%",
            "threshold": ">50% 关注",
            "calculationCase": "订单100，深度300",
            "riskInterpretation": "影响过大提示深度不足或操纵",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "D5-04",
            "name": "市场效率系数",
            "definition": "价格偏离基本价值的程度",
            "purpose": "持续偏离提示市场低效或操纵",
            "formula": "(市场价 - 理论价) ÷ 理论价 × 100%",
            "threshold": ">10%持续 可疑",
            "calculationCase": "市场价偏离理论价5%",
            "riskInterpretation": "持续偏离提示市场低效或操纵",
            "priority": "P1",
            "status": "active"
          }
        ]
      }
    ]
  },
  {
    "id": "E",
    "name": "市场影响力指标",
    "icon": "BarChart3",
    "description": "成交占比、价格冲击、订单簿影响",
    "color": "red",
    "subcategories": [
      {
        "id": "E1",
        "name": "成交占比",
        "indicators": [
          {
            "id": "E1-01",
            "name": "成交额占比",
            "definition": "用户成交额占时段总成交额的比例",
            "purpose": ">20%说明对行情有显著影响力",
            "formula": "用户成交额 ÷ 时段总成交额 × 100%",
            "threshold": ">20% 高风险",
            "calculationCase": "用户成交5,000，时段总成交20,000",
            "riskInterpretation": ">20%说明对行情有显著影响力",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "E1-02",
            "name": "买入额占比",
            "definition": "用户买入额占时段买盘的比例",
            "purpose": ">30%说明主导买盘",
            "formula": "用户买入额 ÷ 时段总买盘 × 100%",
            "threshold": ">30% 高风险",
            "calculationCase": "用户买入3,000，时段买盘10,000",
            "riskInterpretation": ">30%说明主导买盘",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "E1-03",
            "name": "卖出额占比",
            "definition": "用户卖出额占时段卖盘的比例",
            "purpose": ">30%说明主导卖盘",
            "formula": "用户卖出额 ÷ 时段总卖盘 × 100%",
            "threshold": ">30% 高风险",
            "calculationCase": "用户卖出3,200，时段卖盘12,000",
            "riskInterpretation": ">30%说明主导卖盘",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "E1-04",
            "name": "总交易占比",
            "definition": "用户整体交易对市场的影响程度",
            "purpose": "衡量用户整体交易影响程度",
            "formula": "(用户买入 + 用户卖出) ÷ (时段总成交 × 2) × 100%",
            "threshold": ">30% 关注",
            "calculationCase": "用户买卖合计28,750，时段总成交38,000",
            "riskInterpretation": "衡量用户整体交易影响程度",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "E1-05",
            "name": "自成交比例",
            "definition": "用户自买自卖的比例",
            "purpose": "衡量自买自卖比例，高比例是刷量",
            "formula": "自成交金额 ÷ 用户总成交金额 × 100%",
            "threshold": ">30% 高度可疑",
            "calculationCase": "自成交30,000，总成交100,000",
            "riskInterpretation": "衡量自买自卖比例，高比例是刷量",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "E2",
        "name": "价格冲击",
        "indicators": [
          {
            "id": "E2-01",
            "name": "价格冲击度",
            "definition": "用户成交导致的价格变动幅度",
            "purpose": ">1%说明单笔成交即引发价格波动",
            "formula": "abs(成交后价格-成交前价格) ÷ 成交前价格 × 100%",
            "threshold": ">1% 高风险",
            "calculationCase": "成交前1.000，成交后1.015",
            "riskInterpretation": ">1%说明单笔成交即引发价格波动",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "E2-02",
            "name": "买入价格冲击",
            "definition": "用户买入导致的价格上涨幅度",
            "purpose": "买入即涨是\"行情跟随\"特征",
            "formula": "(买入后价格-买入前价格) ÷ 买入前价格 × 100%",
            "threshold": ">2% 高风险",
            "calculationCase": "买入前1.000，买入后1.020",
            "riskInterpretation": "买入即涨是\"行情跟随\"特征",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "E2-03",
            "name": "卖出价格冲击",
            "definition": "用户卖出导致的价格下跌幅度",
            "purpose": "卖出即跌说明抛压影响显著",
            "formula": "(卖出前价格-卖出后价格) ÷ 卖出前价格 × 100%",
            "threshold": ">2% 高风险",
            "calculationCase": "卖出前1.100，卖出后1.080",
            "riskInterpretation": "卖出即跌说明抛压影响显著",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "E3",
        "name": "订单簿影响",
        "indicators": [
          {
            "id": "E3-01",
            "name": "订单簿穿透深度",
            "definition": "用户订单吃掉的订单簿层数",
            "purpose": "穿透深度大说明流动性差或订单量大",
            "formula": "count(被吃掉的价格档位)",
            "threshold": ">3档 关注",
            "calculationCase": "用户市价单吃掉5个价格档位",
            "riskInterpretation": "穿透深度大说明流动性差或订单量大",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "E3-02",
            "name": "流动性消耗比",
            "definition": "用户成交额占订单簿深度的比例",
            "purpose": ">50%说明显著消耗流动性",
            "formula": "用户成交额 ÷ 订单簿前N档深度 × 100%",
            "threshold": ">50% 高风险",
            "calculationCase": "成交5,000，前5档深度8,000",
            "riskInterpretation": ">50%说明显著消耗流动性",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "E4",
        "name": "时间影响",
        "indicators": [
          {
            "id": "E4-01",
            "name": "时间集中度",
            "definition": "用户交易集中在特定时间段的程度",
            "purpose": "高度集中提示时间窗口操纵",
            "formula": "最高小时成交占比 ÷ 总成交 × 100%",
            "threshold": ">70% 高风险",
            "calculationCase": "2小时内成交80%",
            "riskInterpretation": "高度集中提示时间窗口操纵",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "E4-02",
            "name": "价格波动放大",
            "definition": "用户交易前后价格波动的放大程度",
            "purpose": "波动放大提示市场不稳定",
            "formula": "(交易后波动率 - 交易前波动率) ÷ 交易前波动率 × 100%",
            "threshold": ">50% 关注",
            "calculationCase": "交易前波动1%，交易后2%",
            "riskInterpretation": "波动放大提示市场不稳定",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "E4-03",
            "name": "成交量脉冲",
            "definition": "用户交易导致的成交量异常放大",
            "purpose": "成交量脉冲提示异常活跃",
            "formula": "(交易后成交量 - 交易前均量) ÷ 交易前均量 × 100%",
            "threshold": ">200% 高风险",
            "calculationCase": "交易后成交量放大300%",
            "riskInterpretation": "成交量脉冲提示异常活跃",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "E4-04",
            "name": "市场深度影响",
            "definition": "用户订单对市场深度的长期影响",
            "purpose": "影响持久说明深度不足",
            "formula": "订单簿深度变化持续时间",
            "threshold": ">10分钟 关注",
            "calculationCase": "影响持续15分钟",
            "riskInterpretation": "影响持久说明深度不足",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "E5",
        "name": "市场结构影响",
        "indicators": [
          {
            "id": "E5-01",
            "name": "买一卖一价差影响",
            "definition": "用户交易对买卖价差的改变程度",
            "purpose": "价差扩大提示流动性恶化",
            "formula": "(交易后价差 - 交易前价差) ÷ 交易前价差 × 100%",
            "threshold": ">100% 高风险",
            "calculationCase": "价差从0.1%扩大到0.3%",
            "riskInterpretation": "价差扩大提示流动性恶化",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "E5-02",
            "name": "市场效率影响",
            "definition": "用户交易对市场定价效率的影响",
            "purpose": "效率下降提示定价扭曲",
            "formula": "(理论价偏离度变化) ÷ 交易前偏离度 × 100%",
            "threshold": "<-15% 可疑",
            "calculationCase": "效率降低20%",
            "riskInterpretation": "效率下降提示定价扭曲",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "E5-03",
            "name": "订单簿倾斜度",
            "definition": "用户订单导致的买卖深度不平衡",
            "purpose": "倾斜度过高提示单边操纵",
            "formula": "abs(买深度 - 卖深度) ÷ (买深度 + 卖深度) × 100%",
            "threshold": ">40% 关注",
            "calculationCase": "买深度100，卖深度50",
            "riskInterpretation": "倾斜度过高提示单边操纵",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "E5-04",
            "name": "市场恢复时间",
            "definition": "市场从用户交易影响中恢复的时间",
            "purpose": "恢复时间长说明影响深远",
            "formula": "价格回到正常水平所需时间",
            "threshold": ">20分钟 高风险",
            "calculationCase": "15分钟恢复",
            "riskInterpretation": "恢复时间长说明影响深远",
            "priority": "P0",
            "status": "active"
          }
        ]
      }
    ]
  },
  {
    "id": "F",
    "name": "账户关联指标",
    "icon": "Network",
    "description": "设备IP关联、交易同步、对敲配对",
    "color": "cyan",
    "subcategories": [
      {
        "id": "F1",
        "name": "设备关联",
        "indicators": [
          {
            "id": "F1-01",
            "name": "设备指纹重合度",
            "definition": "两账户使用相同设备的比例",
            "purpose": ">30%提示同一人控制多账户",
            "formula": "相同设备登录次数 ÷ 总登录次数 × 100%",
            "threshold": ">30% 高风险",
            "calculationCase": "相同设备登录40次，总登录100次",
            "riskInterpretation": ">30%提示同一人控制多账户",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F1-02",
            "name": "设备切换频率",
            "definition": "账户在不同设备间切换的频率",
            "purpose": "频繁切换可能使用模拟器或多设备",
            "formula": "设备切换次数 ÷ 登录次数",
            "threshold": ">0.5 关注",
            "calculationCase": "登录50次，设备切换30次",
            "riskInterpretation": "频繁切换可能使用模拟器或多设备",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "F2",
        "name": "IP关联",
        "indicators": [
          {
            "id": "F2-01",
            "name": "IP重叠率",
            "definition": "两账户使用相同IP的比例",
            "purpose": ">30%提示账户关联",
            "formula": "相同IP登录次数 ÷ 总登录次数 × 100%",
            "threshold": ">30% 高风险",
            "calculationCase": "相同IP登录35次，总登录90次",
            "riskInterpretation": ">30%提示账户关联",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F2-02",
            "name": "IP段重合度",
            "definition": "两账户使用相同IP段(/24)的比例",
            "purpose": "IP段相同可能为同一网络环境",
            "formula": "相同IP段登录次数 ÷ 总登录次数 × 100%",
            "threshold": ">50% 关注",
            "calculationCase": "相同IP段登录55次，总登录90次",
            "riskInterpretation": "IP段相同可能为同一网络环境",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "F2-03",
            "name": "登录时间重合度",
            "definition": "两账户同时在线的时间占比",
            "purpose": "持续同时在线提示协同操作",
            "formula": "同时在线时长 ÷ max(A在线,B在线) × 100%",
            "threshold": ">50% 关注",
            "calculationCase": "A在线5h，B在线4h，同时1h",
            "riskInterpretation": "持续同时在线提示协同操作",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "F3",
        "name": "交易同步",
        "indicators": [
          {
            "id": "F3-01",
            "name": "交易时点差",
            "definition": "两账户下单时间的差值（毫秒级）",
            "purpose": "<100毫秒提示程序化协同下单",
            "formula": "abs(A下单时间戳 - B下单时间戳)",
            "threshold": "<100毫秒 高风险",
            "calculationCase": "A下单1705123456789ms，B下单1705123456812ms",
            "riskInterpretation": "<100毫秒提示程序化协同下单",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F3-02",
            "name": "交易方向同步率",
            "definition": "两账户同时同向交易的比例",
            "purpose": ">70%提示协同操作",
            "formula": "同向交易次数 ÷ min(A交易数,B交易数) × 100%",
            "threshold": ">70% 高风险",
            "calculationCase": "A交易20次，B交易18次，同向15次",
            "riskInterpretation": ">70%提示协同操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F3-03",
            "name": "对敲配对率",
            "definition": "两账户互为对手方的成交比例",
            "purpose": ">50%属于异常高频对敲",
            "formula": "互为对手方次数 ÷ min(A成交数,B成交数) × 100%",
            "threshold": ">50% 高风险",
            "calculationCase": "A成交20次，B成交18次，互为对手15次",
            "riskInterpretation": ">50%属于异常高频对敲",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F3-04",
            "name": "盈亏互抵率",
            "definition": "账户组盈亏相互抵消的程度",
            "purpose": ">90%说明盈亏完美对冲",
            "formula": "1 - abs(盈利-亏损) ÷ max(盈利,亏损) × 100%",
            "threshold": ">90% 高风险",
            "calculationCase": "A亏损500，B盈利520 → 1-20÷520",
            "riskInterpretation": ">90%说明盈亏完美对冲",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F3-05",
            "name": "交易币种重合度",
            "definition": "两账户交易相同币种的比例",
            "purpose": "高重合度+高时间同步提示关联",
            "formula": "交集币种数 ÷ 并集币种数 × 100%",
            "threshold": ">80% 关注",
            "calculationCase": "A交易BTC/ETH/XXX，B交易ETH/XXX",
            "riskInterpretation": "高重合度+高时间同步提示关联",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "F3-06",
            "name": "时点吻合度",
            "definition": "两账户交易时点的同步程度",
            "purpose": "越高越可能是协同",
            "formula": "1 - (两账户成交时间差 ÷ 基准时间窗口)",
            "threshold": ">90% 关注；>95% 高度可疑",
            "calculationCase": "时间差2秒，基准窗口60秒",
            "riskInterpretation": "越高越可能是协同",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "F3-07",
            "name": "对手方命中率",
            "definition": "两账户互为对手方的频率",
            "purpose": "高频率说明是对敲",
            "formula": "互为对手方次数 ÷ 任一方总交易次数 × 100%",
            "threshold": ">50% 关注；>70% 高度可疑",
            "calculationCase": "互为对手8次，A总交易10次",
            "riskInterpretation": "高频率说明是对敲",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "F3-08",
            "name": "关联账户数",
            "definition": "与目标账户存在关联的账户数量",
            "purpose": "衡量账户的关联网络规模",
            "formula": "count(distinct 关联账户)",
            "threshold": "≥2个 需排查",
            "calculationCase": "同IP 2个+同设备1个+同充值地址1个（去重后）",
            "riskInterpretation": "衡量账户的关联网络规模",
            "priority": "P2",
            "status": "active"
          }
        ]
      },
      {
        "id": "F4",
        "name": "资金关联",
        "indicators": [
          {
            "id": "F4-01",
            "name": "资金来源重合度",
            "definition": "两账户充值来源地址的重合程度",
            "purpose": ">50%提示资金来源相同",
            "formula": "相同来源地址数 ÷ 总来源地址数 × 100%",
            "threshold": ">50% 高风险",
            "calculationCase": "A有3个来源，B有2个来源，重合2个",
            "riskInterpretation": ">50%提示资金来源相同",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F4-02",
            "name": "资金去向重合度",
            "definition": "两账户提币目标地址的重合程度",
            "purpose": ">30%提示资金去向相同",
            "formula": "相同目标地址数 ÷ 总目标地址数 × 100%",
            "threshold": ">30% 高风险",
            "calculationCase": "A提到2个地址，B提到2个地址，重合1个",
            "riskInterpretation": ">30%提示资金去向相同",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F4-03",
            "name": "注册时间差",
            "definition": "两账户注册时间的差值",
            "purpose": "<1小时提示批量注册",
            "formula": "abs(A注册时间 - B注册时间)",
            "threshold": "<1小时 高风险",
            "calculationCase": "A注册2024-01-15 10:00，B注册2024-01-15 10:03",
            "riskInterpretation": "<1小时提示批量注册",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "F5",
        "name": "行为模式关联",
        "indicators": [
          {
            "id": "F5-01",
            "name": "行为模式相似度",
            "definition": "两账户交易行为的相似程度",
            "purpose": ">0.8提示同一人操作",
            "formula": "行为向量余弦相似度",
            "threshold": ">0.8 高风险",
            "calculationCase": "相似度0.85",
            "riskInterpretation": ">0.8提示同一人操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F5-02",
            "name": "策略重合度",
            "definition": "两账户使用相同交易策略的比例",
            "purpose": "高重合度提示协同策略",
            "formula": "相同策略交易占比 × 100%",
            "threshold": ">70% 关注",
            "calculationCase": "80%交易使用相同策略",
            "riskInterpretation": "高重合度提示协同策略",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "F5-03",
            "name": "时段偏好重合",
            "definition": "两账户活跃时段的重合程度",
            "purpose": "高重合提示相同作息规律",
            "formula": "重合时段占比 ÷ 总活跃时段 × 100%",
            "threshold": ">80% 关注",
            "calculationCase": "重合12小时，总活跃16小时",
            "riskInterpretation": "高重合提示相同作息规律",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "F5-04",
            "name": "币种偏好同步",
            "definition": "两账户币种选择的同步程度",
            "purpose": "同步度高提示信息共享",
            "formula": "同时选择相同币种的频率",
            "threshold": ">70% 可疑",
            "calculationCase": "10次选择中8次相同",
            "riskInterpretation": "同步度高提示信息共享",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "F6",
        "name": "网络关联",
        "indicators": [
          {
            "id": "F6-01",
            "name": "网络位置相似度",
            "definition": "两账户地理位置的相似程度",
            "purpose": "距离过近提示同一物理位置",
            "formula": "IP地理位置距离计算",
            "threshold": "<50km 高风险",
            "calculationCase": "距离<10km",
            "riskInterpretation": "距离过近提示同一物理位置",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F6-02",
            "name": "ISP重合率",
            "definition": "两账户使用相同ISP的比例",
            "purpose": "高重合提示同一网络供应商",
            "formula": "相同ISP使用次数 ÷ 总登录次数 × 100%",
            "threshold": ">60% 关注",
            "calculationCase": "相同ISP登录80次，总登录100次",
            "riskInterpretation": "高重合提示同一网络供应商",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "F6-03",
            "name": "关联网络规模",
            "definition": "账户关联网络的总节点数量",
            "purpose": "网络规模大提示组织化操作",
            "formula": "count(直接+间接关联账户)",
            "threshold": ">5个 高风险",
            "calculationCase": "直接关联3个，间接关联8个",
            "riskInterpretation": "网络规模大提示组织化操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "F6-04",
            "name": "控制中心度",
            "definition": "账户在关联网络中的中心程度",
            "purpose": "中心度高说明是核心控制账户",
            "formula": "(关联账户数 × 关联强度) ÷ 网络总节点",
            "threshold": ">0.3 高度可疑",
            "calculationCase": "关联5个账户，强度0.8，网络20节点",
            "riskInterpretation": "中心度高说明是核心控制账户",
            "priority": "P1",
            "status": "active"
          }
        ]
      }
    ]
  },
  {
    "id": "G",
    "name": "链上溯源指标",
    "icon": "Link",
    "description": "链上关联、套利行为、跨平台关联",
    "color": "pink",
    "subcategories": [
      {
        "id": "G1",
        "name": "地址关联",
        "indicators": [
          {
            "id": "G1-01",
            "name": "链上跳数",
            "definition": "用户地址与目标地址的转账层数",
            "purpose": "≤3跳通常认为存在直接关联",
            "formula": "追溯路径中的地址数 - 1",
            "threshold": "≤3跳 高风险",
            "calculationCase": "用户→A→B→项目方",
            "riskInterpretation": "≤3跳通常认为存在直接关联",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "G1-02",
            "name": "项目方关联度",
            "definition": "用户地址与项目方地址的关联评分",
            "purpose": ">0.5提示与项目方有关联",
            "formula": "直接转账=1，≤3跳=0.7，≤5跳=0.3，>5跳=0",
            "threshold": ">0.5 高风险",
            "calculationCase": "用户与项目方存在2跳关联",
            "riskInterpretation": ">0.5提示与项目方有关联",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "G1-03",
            "name": "交易所热钱包关联",
            "definition": "用户地址与其他交易所的转账关联",
            "purpose": "有关联可追溯资金完整路径",
            "formula": "布尔值（有/无）",
            "threshold": "—",
            "calculationCase": "用户充值来源曾从币安提出",
            "riskInterpretation": "有关联可追溯资金完整路径",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "G1-04",
            "name": "混币器使用标记",
            "definition": "用户地址是否经过混币器",
            "purpose": "使用混币器提示隐藏资金来源意图",
            "formula": "布尔值（是/否）",
            "threshold": "是=高风险",
            "calculationCase": "充值来源经过Tornado Cash",
            "riskInterpretation": "使用混币器提示隐藏资金来源意图",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "G2",
        "name": "链上套利",
        "indicators": [
          {
            "id": "G2-01",
            "name": "链上卖出时间窗",
            "definition": "提币后在DEX卖出的时间差",
            "purpose": "<6小时提示快速链上套利",
            "formula": "DEX卖出时间 - 平台提币时间",
            "threshold": "<6小时 关注",
            "calculationCase": "提币16:00，DEX卖出18:30",
            "riskInterpretation": "<6小时提示快速链上套利",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "G2-02",
            "name": "链上套利收益",
            "definition": "提币后在链上卖出的实际盈利",
            "purpose": "衡量\"买入-提币-外部拉升\"的真实收益",
            "formula": "DEX卖出额 - 平台买入额 - Gas费",
            "threshold": "—",
            "calculationCase": "平台买入1,000，DEX卖出1,450，Gas 10",
            "riskInterpretation": "衡量\"买入-提币-外部拉升\"的真实收益",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "G2-03",
            "name": "DEX卖出价与平台买入价比",
            "definition": "链上卖出价与平台买入价的比值",
            "purpose": ">1.3说明链上套利显著",
            "formula": "DEX卖出均价 ÷ 平台买入均价",
            "threshold": ">1.3 高风险",
            "calculationCase": "平台买入价1.0，DEX卖出价1.45",
            "riskInterpretation": ">1.3说明链上套利显著",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "G3",
        "name": "跨平台套利",
        "indicators": [
          {
            "id": "G3-01",
            "name": "跨平台套利标记",
            "definition": "是否存在跨平台价差套利行为",
            "purpose": "需区分正常套利与操纵套利",
            "formula": "布尔值（是/否）",
            "threshold": "—",
            "calculationCase": "同时在本平台买入、币安卖出",
            "riskInterpretation": "需区分正常套利与操纵套利",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "G3-02",
            "name": "跨平台价差",
            "definition": "同一币种在不同平台的价格差异",
            "purpose": ">2%存在套利空间",
            "formula": "(高价平台价格-低价平台价格) ÷ 低价平台价格 × 100%",
            "threshold": ">2% 关注",
            "calculationCase": "本平台1.00，币安1.03",
            "riskInterpretation": ">2%存在套利空间",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "G4",
        "name": "地址聚类",
        "indicators": [
          {
            "id": "G4-01",
            "name": "地址聚类规模",
            "definition": "与用户地址在同一聚类的地址数量",
            "purpose": "聚类规模大提示组织化资金",
            "formula": "count(同一聚类中的地址)",
            "threshold": ">20个 关注",
            "calculationCase": "同一聚类包含50个地址",
            "riskInterpretation": "聚类规模大提示组织化资金",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "G4-02",
            "name": "聚类活跃度",
            "definition": "地址聚类整体的活跃程度",
            "purpose": "活跃度异常提示大规模操作",
            "formula": "聚类内地址月均交易次数",
            "threshold": ">500次/月 高风险",
            "calculationCase": "聚类内平均每月交易1000次",
            "riskInterpretation": "活跃度异常提示大规模操作",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "G4-03",
            "name": "聚类资金集中度",
            "definition": "聚类内资金流向的集中程度",
            "purpose": "集中度高说明资金控制集中",
            "formula": "前三大地址占比总资金流",
            "threshold": ">70% 关注",
            "calculationCase": "三大地址占90%",
            "riskInterpretation": "集中度高说明资金控制集中",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "G4-04",
            "name": "混币器流量占比",
            "definition": "通过混币器的资金占比",
            "purpose": "高占比提示资金清洗行为",
            "formula": "混币器出入金 ÷ 总资金流 × 100%",
            "threshold": ">30% 高风险",
            "calculationCase": "50万USDT通过混币器",
            "riskInterpretation": "高占比提示资金清洗行为",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "G5",
        "name": "跨链追踪",
        "indicators": [
          {
            "id": "G5-01",
            "name": "跨链桥使用频率",
            "definition": "使用跨链桥的交易次数",
            "purpose": "频繁跨链提示资产转移",
            "formula": "count(跨链桥交易)",
            "threshold": ">3次/月 关注",
            "calculationCase": "一个月使用5次跨链桥",
            "riskInterpretation": "频繁跨链提示资产转移",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "G5-02",
            "name": "跨链资产一致性",
            "definition": "跨链前后资产种类的变化程度",
            "purpose": "不一致提示资产转换或清洗",
            "formula": "转移前后资产种类相似度",
            "threshold": "<70% 可疑",
            "calculationCase": "转移前BTC/ETH，转移后BTC/ETH/wBTC",
            "riskInterpretation": "不一致提示资产转换或清洗",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "G5-03",
            "name": "桥接资金规模",
            "definition": "通过跨链桥转移的资金规模",
            "purpose": "大规模桥接提示资金调动",
            "formula": "sum(跨链转移金额)",
            "threshold": ">50万/月 高风险",
            "calculationCase": "累计转移100万USDT",
            "riskInterpretation": "大规模桥接提示资金调动",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "G5-04",
            "name": "链间套利效率",
            "definition": "跨链价差套利的盈利效率",
            "purpose": "效率过高提示操纵行为",
            "formula": "(跨链收益 - 桥接成本) ÷ 桥接成本 × 100%",
            "threshold": ">200% 高度可疑",
            "calculationCase": "收益5000，成本1000",
            "riskInterpretation": "效率过高提示操纵行为",
            "priority": "P1",
            "status": "active"
          }
        ]
      }
    ]
  },
  {
    "id": "H",
    "name": "外部行情指标",
    "icon": "Globe",
    "description": "价格波动、成交量异动、跨平台相关性",
    "color": "yellow",
    "subcategories": [
      {
        "id": "H1",
        "name": "价格波动",
        "indicators": [
          {
            "id": "H1-01",
            "name": "时段涨跌幅",
            "definition": "指定时段内的价格变动幅度",
            "purpose": "衡量行情波动幅度",
            "formula": "(收盘价-开盘价) ÷ 开盘价 × 100%",
            "threshold": "—",
            "calculationCase": "开盘1.00，收盘1.08",
            "riskInterpretation": "衡量行情波动幅度",
            "priority": "P2",
            "status": "active"
          },
          {
            "id": "H1-02",
            "name": "分钟级最大涨幅",
            "definition": "1分钟K线的最大涨幅",
            "purpose": "极端分钟涨幅提示可能存在拉盘",
            "formula": "max(各分钟涨幅)",
            "threshold": ">5% 关注",
            "calculationCase": "某分钟涨幅5.2%为最大",
            "riskInterpretation": "极端分钟涨幅提示可能存在拉盘",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "H1-03",
            "name": "拉升幅度",
            "definition": "从启动点到最高点的涨幅",
            "purpose": "衡量拉升行情的力度",
            "formula": "(最高价-启动价) ÷ 启动价 × 100%",
            "threshold": ">20% 关注",
            "calculationCase": "启动价1.00，最高价1.25",
            "riskInterpretation": "衡量拉升行情的力度",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "H1-04",
            "name": "拉升持续时间",
            "definition": "从启动到见顶的时长",
            "purpose": "短时间大幅拉升更可疑",
            "formula": "见顶时间 - 启动时间",
            "threshold": "<15分钟且涨幅>20% 高风险",
            "calculationCase": "启动15:00，见顶15:12",
            "riskInterpretation": "短时间大幅拉升更可疑",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "H1-05",
            "name": "交易时段涨跌幅",
            "definition": "用户交易期间的价格波动幅度",
            "purpose": "大幅波动+精准买卖=可疑",
            "formula": "(时段最高价-时段最低价) ÷ 时段最低价 × 100%",
            "threshold": ">20% 需结合其他指标",
            "calculationCase": "最高0.3280，最低0.2480",
            "riskInterpretation": "大幅波动+精准买卖=可疑",
            "priority": "P2",
            "status": "active"
          }
        ]
      },
      {
        "id": "H2",
        "name": "成交量异动",
        "indicators": [
          {
            "id": "H2-01",
            "name": "成交量异动倍数",
            "definition": "异常时段成交量与平均值的比值",
            "purpose": ">3倍属于异常放量",
            "formula": "异常时段成交量 ÷ 历史平均成交量",
            "threshold": ">3倍 高风险",
            "calculationCase": "异常时段500万，平均100万",
            "riskInterpretation": ">3倍属于异常放量",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "H2-02",
            "name": "买卖盘比",
            "definition": "买盘成交额与卖盘成交额的比值",
            "purpose": ">2说明买盘主导，可能有资金拉升",
            "formula": "买盘成交额 ÷ 卖盘成交额",
            "threshold": ">2或<0.5 关注",
            "calculationCase": "买盘80万，卖盘40万",
            "riskInterpretation": ">2说明买盘主导，可能有资金拉升",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "H2-03",
            "name": "大单占比",
            "definition": "大额订单成交额占总成交的比例",
            "purpose": ">50%说明大资金主导行情",
            "formula": "大单成交额 ÷ 总成交额 × 100%",
            "threshold": ">50% 关注",
            "calculationCase": "大单（>1万U）成交60万，总成交100万",
            "riskInterpretation": ">50%说明大资金主导行情",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "H3",
        "name": "跨平台相关性",
        "indicators": [
          {
            "id": "H3-01",
            "name": "跨平台价格相关性",
            "definition": "本平台与外部平台价格的相关系数",
            "purpose": "<0.8说明价格走势异常脱钩",
            "formula": "corr(本平台价格序列, 外部价格序列)",
            "threshold": "<0.8 关注",
            "calculationCase": "相关系数0.95",
            "riskInterpretation": "<0.8说明价格走势异常脱钩",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "H3-02",
            "name": "跨平台成交量相关性",
            "definition": "本平台与外部平台成交量的相关系数",
            "purpose": "低相关性配合本平台异动提示本地操纵",
            "formula": "corr(本平台成交量序列, 外部成交量序列)",
            "threshold": "<0.5 关注",
            "calculationCase": "相关系数0.3",
            "riskInterpretation": "低相关性配合本平台异动提示本地操纵",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "H3-03",
            "name": "外部放量时点差",
            "definition": "外部交易所放量时点与用户交易时点的差值",
            "purpose": "<10秒提示跨平台协同操纵",
            "formula": "abs(外部放量时间 - 用户交易时间)",
            "threshold": "<10秒 高风险",
            "calculationCase": "外部放量15:00:05，用户交易15:00:02",
            "riskInterpretation": "<10秒提示跨平台协同操纵",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "H3-04",
            "name": "公开信息时间窗",
            "definition": "公开利好发布时间与用户买入时间的差值",
            "purpose": "公告后买入属于合法，公告前买入可疑",
            "formula": "用户买入时间 - 公开信息发布时间",
            "threshold": "公告前买入 高风险",
            "calculationCase": "公告发布14:50，用户买入14:55",
            "riskInterpretation": "公告后买入属于合法，公告前买入可疑",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "H3-05",
            "name": "外部放量倍数",
            "definition": "事件时段成交量与历史平均的比值",
            "purpose": "衡量外部交易所是否配合放量",
            "formula": "事件时段成交量 ÷ 该时段历史平均成交量",
            "threshold": ">3倍 关注",
            "calculationCase": "事件时段300万，历史均值100万",
            "riskInterpretation": "衡量外部交易所是否配合放量",
            "priority": "P1",
            "status": "active"
          }
        ]
      },
      {
        "id": "H4",
        "name": "市场同步",
        "indicators": [
          {
            "id": "H4-01",
            "name": "市场同步延迟",
            "definition": "本平台价格跟随外部市场的延迟时间",
            "purpose": "延迟过短提示操纵同步",
            "formula": "外部价格变动到本平台响应的时间差",
            "threshold": "<10秒 高风险",
            "calculationCase": "外部上涨后5秒本平台响应",
            "riskInterpretation": "延迟过短提示操纵同步",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "H4-02",
            "name": "价格领先指数",
            "definition": "本平台价格领先外部市场的程度",
            "purpose": "过高领先提示本地操纵",
            "formula": "领先交易次数 ÷ 总交易次数 × 100%",
            "threshold": ">60% 可疑",
            "calculationCase": "80次领先，100次总交易",
            "riskInterpretation": "过高领先提示本地操纵",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "H4-03",
            "name": "流动性同步度",
            "definition": "本平台与外部平台流动性的同步程度",
            "purpose": "同步度低提示本地流动性异常",
            "formula": "流动性变动相关系数",
            "threshold": "<0.6 关注",
            "calculationCase": "相关系数0.75",
            "riskInterpretation": "同步度低提示本地流动性异常",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "H4-04",
            "name": "订单簿深度比",
            "definition": "本平台与外部平台订单簿深度的比值",
            "purpose": "深度过浅配合异动提示操纵",
            "formula": "本平台深度 ÷ 外部平台深度",
            "threshold": "<0.3 高风险",
            "calculationCase": "本平台深度50万，外部200万",
            "riskInterpretation": "深度过浅配合异动提示操纵",
            "priority": "P0",
            "status": "active"
          }
        ]
      },
      {
        "id": "H5",
        "name": "预测分析",
        "indicators": [
          {
            "id": "H5-01",
            "name": "预测准确率领先",
            "definition": "价格预测准确率超过市场平均的程度",
            "purpose": "准确率显著领先提示内幕信息",
            "formula": "(用户准确率 - 市场平均准确率) ÷ 市场平均准确率 × 100%",
            "threshold": ">25% 高风险",
            "calculationCase": "用户80%，市场平均60%",
            "riskInterpretation": "准确率显著领先提示内幕信息",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "H5-02",
            "name": "异常收益持续期",
            "definition": "用户获得异常收益的持续时间长度",
            "purpose": "持续过长提示系统性优势",
            "formula": "max(连续盈利天数)",
            "threshold": ">14天 高度可疑",
            "calculationCase": "连续盈利30天",
            "riskInterpretation": "持续过长提示系统性优势",
            "priority": "P1",
            "status": "active"
          },
          {
            "id": "H5-03",
            "name": "市场操纵信号强度",
            "definition": "各类操纵信号的综合强度评分",
            "purpose": "强度过高提示严重操纵",
            "formula": "∑(各信号权重 × 信号强度)",
            "threshold": ">70分 高风险",
            "calculationCase": "综合评分85分",
            "riskInterpretation": "强度过高提示严重操纵",
            "priority": "P0",
            "status": "active",
            "indicatorType": "base",
            "references": []
          },
          {
            "id": "H5-04",
            "name": "信息不对称指数",
            "definition": "用户获取信息的优势程度",
            "purpose": "优势过大提示内幕交易",
            "formula": "(信息获取时间 - 市场平均时间) ÷ 市场平均时间 × 100%",
            "threshold": "提前>50% 高风险",
            "calculationCase": "提前2分钟获取信息",
            "riskInterpretation": "优势过大提示内幕交易",
            "priority": "P0",
            "status": "active"
          }
        ]
      }
    ]
  }
];

export const INTEGRATION_STATS = {
  totalCategories: 8,
  totalSubcategories: 42,
  totalIndicators: 173,
  lastUpdated: '2026-01-21T15:01:14.270Z'
};
