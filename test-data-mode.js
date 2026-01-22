// 测试数据模式切换功能
import { getCurrentDataMode, getInitialData } from './src/constants.ts';

console.log('🔍 测试数据模式切换功能');
console.log('========================');

// 测试当前模式
const currentMode = getCurrentDataMode();
console.log(`📊 当前数据模式: ${currentMode}`);

// 测试数据获取
const basicData = getInitialData('basic');
const fullData = getInitialData('full');

console.log(`📈 基础模式数据: ${basicData.length} 个分类`);
console.log(`📈 完整模式数据: ${fullData.length} 个分类`);

// 计算总指标数
const basicIndicators = basicData.reduce((sum, cat) =>
  sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0);

const fullIndicators = fullData.reduce((sum, cat) =>
  sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0);

console.log(`📊 基础模式指标: ${basicIndicators} 个`);
console.log(`📊 完整模式指标: ${fullIndicators} 个`);

console.log('\n✅ 测试完成！');
