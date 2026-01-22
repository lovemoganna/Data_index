import fs from 'fs';
import path from 'path';

console.log('🔍 MECE风险本体系统问题诊断报告');
console.log('=====================================');
console.log('');

// 1. 检查数据文件结构
console.log('1️⃣ 数据文件结构检查');
console.log('-------------------');

try {
  const constantsPath = 'src/constants-integrated.ts';
  const content = fs.readFileSync(constantsPath, 'utf8');

  // 提取INTEGRATED_INDICATORS数据
  const match = content.match(/export const INTEGRATION_STATS = \{([\s\S]*?)\};/);
  if (match) {
    console.log('✅ INTEGRATION_STATS常量存在');
    console.log(match[1].trim());
  } else {
    console.log('❌ INTEGRATION_STATS常量未找到');
  }

  // 检查数据结构完整性
  const dataMatch = content.match(/export const INTEGRATED_INDICATORS: Category\[\] = (\[[\s\S]*?\]);/);
  if (dataMatch) {
    console.log('✅ INTEGRATED_INDICATORS数据结构存在');
    // 简单验证数据格式
    try {
      const data = eval(dataMatch[1]);
      console.log(`📊 数据包含 ${data.length} 个分类`);

      let totalSubcategories = 0;
      let totalIndicators = 0;

      data.forEach(category => {
        totalSubcategories += category.subcategories.length;
        category.subcategories.forEach(sub => {
          totalIndicators += sub.indicators.length;
        });
      });

      console.log(`📊 数据包含 ${totalSubcategories} 个子类`);
      console.log(`📊 数据包含 ${totalIndicators} 个指标`);

      if (totalIndicators === 173) {
        console.log('✅ 指标数量与承诺一致 (173个)');
      } else {
        console.log(`❌ 指标数量不匹配: 实际${totalIndicators}个, 承诺173个`);
      }

    } catch (e) {
      console.log('❌ 数据格式验证失败:', e.message);
    }
  } else {
    console.log('❌ INTEGRATED_INDICATORS数据结构不存在');
  }

} catch (error) {
  console.log('❌ 读取constants-integrated.ts失败:', error.message);
}

console.log('');

// 2. 检查DataModeSwitcher组件
console.log('2️⃣ DataModeSwitcher组件检查');
console.log('---------------------------');

try {
  const switcherPath = 'src/components/DataModeSwitcher.tsx';
  const content = fs.readFileSync(switcherPath, 'utf8');

  // 检查是否正确引用INTEGRATION_STATS
  if (content.includes("import { INTEGRATION_STATS } from '../constants-integrated'")) {
    console.log('✅ 正确导入INTEGRATION_STATS');
  } else {
    console.log('❌ 未正确导入INTEGRATION_STATS');
  }

  // 检查是否显示正确的统计信息
  const fullStatsMatch = content.match(/const fullStats = INTEGRATION_STATS;/);
  if (fullStatsMatch) {
    console.log('✅ 使用INTEGRATION_STATS作为完整模式统计');
  } else {
    console.log('❌ 未使用INTEGRATION_STATS作为完整模式统计');
  }

  // 检查界面显示文本
  if (content.includes('包含全部173个专业指标，覆盖8大维度42个子类')) {
    console.log('✅ 界面正确显示承诺的统计信息');
  } else {
    console.log('❌ 界面未显示承诺的统计信息');
  }

  // 检查模式切换逻辑
  if (content.includes('window.location.reload()')) {
    console.log('✅ 模式切换后会重新加载页面');
  } else {
    console.log('❌ 模式切换逻辑可能有问题');
  }

} catch (error) {
  console.log('❌ 读取DataModeSwitcher.tsx失败:', error.message);
}

console.log('');

// 3. 检查constants.ts数据模式逻辑
console.log('3️⃣ 数据模式切换逻辑检查');
console.log('------------------------');

try {
  const constantsPath = 'src/constants.ts';
  const content = fs.readFileSync(constantsPath, 'utf8');

  // 检查getCurrentDataMode函数
  if (content.includes("export const getCurrentDataMode")) {
    console.log('✅ getCurrentDataMode函数存在');
  } else {
    console.log('❌ getCurrentDataMode函数不存在');
  }

  // 检查getInitialData函数
  if (content.includes("export const getInitialData")) {
    console.log('✅ getInitialData函数存在');
  } else {
    console.log('❌ getInitialData函数不存在');
  }

  // 检查CURRENT_DATA_MODE导出
  if (content.includes("export const CURRENT_DATA_MODE")) {
    console.log('✅ CURRENT_DATA_MODE常量存在');
  } else {
    console.log('❌ CURRENT_DATA_MODE常量不存在');
  }

  // 检查数据模式优先级
  if (content.includes("localStorage.getItem('preferred_data_mode')")) {
    console.log('✅ 支持localStorage数据模式持久化');
  } else {
    console.log('❌ 不支持数据模式持久化');
  }

} catch (error) {
  console.log('❌ 读取constants.ts失败:', error.message);
}

console.log('');

// 4. 检查数据服务层
console.log('4️⃣ 数据服务层检查');
console.log('----------------');

try {
  const servicePath = 'src/services/dataService.ts';
  const content = fs.readFileSync(servicePath, 'utf8');

  // 检查是否使用getInitialData而不是INITIAL_DATA
  if (content.includes("import { getInitialData }")) {
    console.log('✅ 数据服务使用动态数据获取函数');
  } else {
    console.log('❌ 数据服务未使用动态数据获取函数');
  }

  // 检查数据迁移逻辑
  if (content.includes("migrateFromLocalStorage")) {
    console.log('✅ 包含数据迁移逻辑');
  } else {
    console.log('❌ 缺少数据迁移逻辑');
  }

  // 检查IndexedDB操作
  if (content.includes("rebuildDataFromDB")) {
    console.log('✅ 支持IndexedDB数据重建');
  } else {
    console.log('❌ 不支持IndexedDB数据重建');
  }

} catch (error) {
    console.log('❌ 读取dataService.ts失败:', error.message);
}

console.log('');

// 5. 检查App.tsx数据加载逻辑
console.log('5️⃣ 应用层数据加载检查');
console.log('---------------------');

try {
  const appPath = 'src/App.tsx';
  const content = fs.readFileSync(appPath, 'utf8');

  // 检查数据加载逻辑
  if (content.includes("await dataService.getAll()")) {
    console.log('✅ 使用异步数据服务加载数据');
  } else {
    console.log('❌ 未使用异步数据服务');
  }

  // 检查数据模式切换处理
  if (content.includes("window.location.reload()")) {
    console.log('✅ 支持页面重载更新数据模式');
  } else {
    console.log('❌ 不支持数据模式切换');
  }

} catch (error) {
  console.log('❌ 读取App.tsx失败:', error.message);
}

console.log('');

// 6. 运行时状态检查提示
console.log('6️⃣ 运行时状态检查建议');
console.log('--------------------');

console.log('🔍 需要在浏览器中检查的项目:');
console.log('  • localStorage中的preferred_data_mode值');
console.log('  • IndexedDB中的实际存储数据量');
console.log('  • 页面重载后的数据模式保持情况');
console.log('  • DataModeSwitcher的当前模式显示');

console.log('');

console.log('🛠️ 潜在问题排查步骤:');
console.log('  1. 清除localStorage和IndexedDB数据');
console.log('  2. 重新加载页面');
console.log('  3. 尝试切换到完整模式');
console.log('  4. 检查浏览器开发者工具的控制台和存储');

console.log('');

// 7. 总结
console.log('📋 诊断完成');
console.log('=============');
console.log('');
console.log('如果发现任何❌标记的项目，请检查相应文件并修复。');
console.log('系统承诺173个指标的功能是否正常，取决于数据加载链路的完整性。');
