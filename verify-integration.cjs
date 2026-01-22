// 验证集成数据完整性
const { INTEGRATED_INDICATORS, INTEGRATION_STATS } = require('./src/constants-integrated.ts');

console.log('=== INTEGRATION_STATS ===');
console.log(JSON.stringify(INTEGRATION_STATS, null, 2));

console.log('\n=== INTEGRATED_INDICATORS 统计 ===');
console.log(`总分类数: ${INTEGRATED_INDICATORS.length}`);

let totalSubcategories = 0;
let totalIndicators = 0;

INTEGRATED_INDICATORS.forEach((cat, catIndex) => {
  const subCount = cat.subcategories.length;
  const indCount = cat.subcategories.reduce((sum, sub) => sum + sub.indicators.length, 0);

  totalSubcategories += subCount;
  totalIndicators += indCount;

  console.log(`${cat.id}: ${subCount}子类, ${indCount}指标`);

  // 检查每个子类
  cat.subcategories.forEach((sub, subIndex) => {
    console.log(`  ${sub.id}: ${sub.indicators.length}指标`);
  });
});

console.log('\n=== 最终统计 ===');
console.log(`总分类数: ${INTEGRATED_INDICATORS.length}`);
console.log(`总子类数: ${totalSubcategories}`);
console.log(`总指标数: ${totalIndicators}`);

console.log('\n=== 验证结果 ===');
const statsMatch = (
  INTEGRATION_STATS.totalCategories === INTEGRATED_INDICATORS.length &&
  INTEGRATION_STATS.totalSubcategories === totalSubcategories &&
  INTEGRATION_STATS.totalIndicators === totalIndicators
);

console.log(`统计数据匹配: ${statsMatch ? '✅' : '❌'}`);

if (!statsMatch) {
  console.log('统计数据不匹配详情:');
  console.log(`- totalCategories: ${INTEGRATION_STATS.totalCategories} vs ${INTEGRATED_INDICATORS.length}`);
  console.log(`- totalSubcategories: ${INTEGRATION_STATS.totalSubcategories} vs ${totalSubcategories}`);
  console.log(`- totalIndicators: ${INTEGRATION_STATS.totalIndicators} vs ${totalIndicators}`);
}
