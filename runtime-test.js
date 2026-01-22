// 运行时数据加载测试
import { getCurrentDataMode, getInitialData } from './src/constants.ts';

console.log('🚀 运行时数据加载测试');
console.log('=======================');

// 模拟localStorage
global.localStorage = {
  getItem: (key) => {
    if (key === 'preferred_data_mode') {
      return 'full'; // 模拟用户选择了完整模式
    }
    return null;
  },
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

console.log('1️⃣ 测试数据模式获取');
console.log('-------------------');

const currentMode = getCurrentDataMode();
console.log(`当前数据模式: ${currentMode}`);

console.log('');
console.log('2️⃣ 测试数据加载');
console.log('---------------');

const basicData = getInitialData('basic');
const fullData = getInitialData('full');

console.log(`基础模式数据: ${basicData.length} 个分类`);
console.log(`完整模式数据: ${fullData.length} 个分类`);

// 计算指标数量
const basicIndicators = basicData.reduce((sum, cat) =>
  sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0);

const fullIndicators = fullData.reduce((sum, cat) =>
  sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0);

console.log(`基础模式指标: ${basicIndicators} 个`);
console.log(`完整模式指标: ${fullIndicators} 个`);

console.log('');
console.log('3️⃣ 验证数据完整性');
console.log('-----------------');

// 检查完整模式数据结构
const expectedCategories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const actualCategories = fullData.map(cat => cat.id);

console.log(`预期分类: [${expectedCategories.join(', ')}]`);
console.log(`实际分类: [${actualCategories.join(', ')}]`);

const categoriesMatch = expectedCategories.every(id => actualCategories.includes(id));
console.log(`分类匹配: ${categoriesMatch ? '✅' : '❌'}`);

console.log('');
console.log('4️⃣ 检查关键指标');
console.log('---------------');

// 检查一些关键指标是否存在
const keyIndicators = [
  'A1-01', // 账龄
  'B1-01', // 单笔充值金额
  'C1-01', // 交易次数
  'D1-01', // 买入价偏离率
  'E1-01', // 成交额占比
  'F1-01', // 设备指纹重合度
  'G1-01', // 链上跳数
  'H1-01'  // 时段涨跌幅
];

console.log('检查关键指标存在性:');
keyIndicators.forEach(indicatorId => {
  let found = false;
  for (const category of fullData) {
    for (const subcategory of category.subcategories) {
      if (subcategory.indicators.some(ind => ind.id === indicatorId)) {
        found = true;
        break;
      }
    }
    if (found) break;
  }
  console.log(`  ${indicatorId}: ${found ? '✅' : '❌'}`);
});

console.log('');
console.log('5️⃣ 性能评估');
console.log('-----------');

console.log(`完整模式数据大小: ~${JSON.stringify(fullData).length} 字符`);
console.log(`预计加载时间: <100ms (现代浏览器)`);

console.log('');
console.log('📋 测试完成');
console.log('============');
console.log('');
console.log('如果所有检查都通过，说明数据层面的问题是：');
console.log('1. 浏览器缓存问题');
console.log('2. IndexedDB数据污染');
console.log('3. 运行时JavaScript错误');
console.log('4. UI状态不同步');
