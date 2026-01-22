import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 从markdown文件解析指标数据
 * @param {string} filePath - markdown文件路径
 * @returns {Array} 解析后的指标数组
 */
function parseMarkdownIndicators(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const indicators = [];
  let currentIndicator = null;

  // 跳过标题行（第一行）
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // 检查是否是指标行（以指标编号开头）
    const match = line.match(/^([A-Z]\d+-\d+)\t(.+)\t(.+)\t(.+)\t(.+)\t(.+)\t(.+)\t(.+)$/);
    if (match) {
      if (currentIndicator) {
        indicators.push(currentIndicator);
      }

      const [, id, name, definition, formula, calculationCase, calculationResult, purpose, threshold] = match;

      currentIndicator = {
        id,
        name,
        definition,
        purpose,
        formula,
        threshold,
        calculationCase,
        riskInterpretation: purpose, // 暂时使用purpose作为riskInterpretation
        priority: getPriorityFromThreshold(threshold),
        status: 'active'
      };
    }
  }

  // 添加最后一个指标
  if (currentIndicator) {
    indicators.push(currentIndicator);
  }

  return indicators;
}

/**
 * 根据阈值确定优先级
 * @param {string} threshold - 阈值字符串
 * @returns {string} 优先级
 */
function getPriorityFromThreshold(threshold) {
  if (threshold.includes('高风险')) return 'P0';
  if (threshold.includes('关注') || threshold.includes('可疑')) return 'P1';
  return 'P2';
}

/**
 * 获取分类信息
 * @param {string} categoryId - 分类ID
 * @returns {Object} 分类信息
 */
function getCategoryInfo(categoryId) {
  const categoryMap = {
    'A': { name: '用户画像指标', icon: 'Users', description: '用户基础特征、历史行为、特殊标记', color: 'blue' },
    'B': { name: '资金流向指标', icon: 'TrendingUp', description: '充值提币行为、资金闭环、利用率', color: 'green' },
    'C': { name: '交易行为指标', icon: 'Activity', description: '交易频率、持仓时间、盈利模式', color: 'orange' },
    'D': { name: '价格精准度指标', icon: 'Target', description: '买卖价偏离、分位数、命中率', color: 'purple' },
    'E': { name: '市场影响力指标', icon: 'BarChart3', description: '成交占比、价格冲击、订单簿影响', color: 'red' },
    'F': { name: '账户关联指标', icon: 'Network', description: '设备IP关联、交易同步、对敲配对', color: 'cyan' },
    'G': { name: '链上溯源指标', icon: 'Link', description: '链上关联、套利行为、跨平台关联', color: 'pink' },
    'H': { name: '外部行情指标', icon: 'Globe', description: '价格波动、成交量异动、跨平台相关性', color: 'yellow' }
  };

  return categoryMap[categoryId] || { name: '未知分类', icon: 'HelpCircle', description: '待定义', color: 'gray' };
}

/**
 * 获取子分类信息
 * @param {string} subcategoryId - 子分类ID
 * @returns {Object} 子分类信息
 */
function getSubcategoryInfo(subcategoryId) {
  const subcategoryMap = {
    'A1': '基础信息',
    'A2': '历史行为',
    'A3': '特殊标记',
    'A4': '认证与安全',
    'A5': '设备与环境',
    'B1': '充值行为',
    'B2': '提币行为',
    'B3': '资金闭环',
    'B4': '资金溯源',
    'B5': '资金分布',
    'C1': '交易频率',
    'C2': '持仓时间',
    'C3': '盈利模式',
    'C4': '杠杆使用',
    'C5': '策略分析',
    'C6': '风险度量',
    'D1': '买入精准度',
    'D2': '卖出精准度',
    'D3': '时序精准度',
    'D4': '预测准确性',
    'D5': '市场效率',
    'E1': '成交占比',
    'E2': '价格冲击',
    'E3': '订单簿影响',
    'E4': '时间影响',
    'E5': '市场结构影响',
    'F1': '设备关联',
    'F2': 'IP关联',
    'F3': '交易同步',
    'F4': '资金关联',
    'F5': '行为模式关联',
    'F6': '网络关联',
    'G1': '地址关联',
    'G2': '链上套利',
    'G3': '跨平台套利',
    'G4': '地址聚类',
    'G5': '跨链追踪',
    'H1': '价格波动',
    'H2': '成交量异动',
    'H3': '跨平台相关性',
    'H4': '市场同步',
    'H5': '预测分析'
  };

  return subcategoryMap[subcategoryId] || '未知子分类';
}

/**
 * 主函数：集成所有指标数据
 */
function integrateIndicators() {
  const dataDir = path.join(__dirname, '..', 'data');
  const categories = {};

  // 读取所有markdown文件
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.md'));

  console.log('🔄 开始集成指标数据...');
  console.log(`📁 发现 ${files.length} 个指标文件`);

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const categoryId = file.charAt(0); // 文件名第一个字符是分类ID

    console.log(`📄 处理文件: ${file}`);

    try {
      const indicators = parseMarkdownIndicators(filePath);
      console.log(`   ✅ 解析出 ${indicators.length} 个指标`);

      // 按子分类分组指标
      const subcategoryMap = {};
      indicators.forEach(indicator => {
        const subcategoryId = indicator.id.split('-')[0]; // 如 A1-01 -> A1
        if (!subcategoryMap[subcategoryId]) {
          subcategoryMap[subcategoryId] = [];
        }
        subcategoryMap[subcategoryId].push(indicator);
      });

      // 创建或更新分类
      if (!categories[categoryId]) {
        const categoryInfo = getCategoryInfo(categoryId);
        categories[categoryId] = {
          id: categoryId,
          name: categoryInfo.name,
          icon: categoryInfo.icon,
          description: categoryInfo.description,
          color: categoryInfo.color,
          subcategories: []
        };
      }

      // 添加子分类
      for (const [subcategoryId, subcategoryIndicators] of Object.entries(subcategoryMap)) {
        categories[categoryId].subcategories.push({
          id: subcategoryId,
          name: getSubcategoryInfo(subcategoryId),
          indicators: subcategoryIndicators
        });
      }

    } catch (error) {
      console.error(`❌ 处理文件 ${file} 时出错:`, error.message);
    }
  }

  // 转换为数组格式
  const result = Object.values(categories);

  console.log('✅ 指标集成完成！');
  console.log(`📊 总计 ${result.length} 个分类，${result.reduce((sum, cat) => sum + cat.subcategories.length, 0)} 个子分类，${result.reduce((sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0)} 个指标`);

  return result;
}

// 直接执行脚本
console.log('🚀 开始执行指标集成脚本...');

const integratedData = integrateIndicators();

console.log('📊 集成结果:', {
  categories: integratedData.length,
  subcategories: integratedData.reduce((sum, cat) => sum + cat.subcategories.length, 0),
  indicators: integratedData.reduce((sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0)
});

// 保存到文件
const outputPath = path.join(__dirname, '..', 'src', 'constants-integrated.ts');
console.log(`📁 输出路径: ${outputPath}`);

const output = `import { Category } from './types';

export const INTEGRATED_INDICATORS: Category[] = ${JSON.stringify(integratedData, null, 2)};

export const INTEGRATION_STATS = {
  totalCategories: ${integratedData.length},
  totalSubcategories: ${integratedData.reduce((sum, cat) => sum + cat.subcategories.length, 0)},
  totalIndicators: ${integratedData.reduce((sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0)},
  lastUpdated: '${new Date().toISOString()}'
};
`;

fs.writeFileSync(outputPath, output);
console.log(`✅ 集成数据已保存到: ${outputPath}`);

export { integrateIndicators, parseMarkdownIndicators };
