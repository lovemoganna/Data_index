import fs from 'fs';

try {
  const content = fs.readFileSync('src/constants-integrated.ts', 'utf8');
  const dataMatch = content.match(/export const INTEGRATED_INDICATORS: Category\[\] = (\[[\s\S]*?\]);/);
  if (dataMatch) {
    const data = eval(dataMatch[1]);
    let totalIndicators = 0;
    let totalSubcategories = 0;

    data.forEach(category => {
      totalSubcategories += category.subcategories.length;
      category.subcategories.forEach(sub => {
        totalIndicators += sub.indicators.length;
      });
    });

    console.log('=== 实际统计结果 ===');
    console.log('大类数量 (Categories):', data.length);
    console.log('子类数量 (Subcategories):', totalSubcategories);
    console.log('指标总数 (Indicators):', totalIndicators);
    console.log('');
    console.log('=== 预期 vs 实际 ===');
    console.log('预期: 8 大类, 42 子类, 173 指标');
    console.log(`实际: ${data.length} 大类, ${totalSubcategories} 子类, ${totalIndicators} 指标`);

    if (data.length === 8 && totalSubcategories === 42 && totalIndicators === 173) {
      console.log('✅ 数据统计正确');
    } else {
      console.log('❌ 数据统计不匹配');
    }

    console.log('');
    console.log('=== 详细分类统计 ===');
    data.forEach(category => {
      let categoryIndicators = 0;
      category.subcategories.forEach(sub => {
        categoryIndicators += sub.indicators.length;
      });
      console.log(`${category.id}. ${category.name}: ${category.subcategories.length} 子类, ${categoryIndicators} 指标`);
    });
  } else {
    console.log('无法解析数据文件');
  }
} catch (error) {
  console.error('错误:', error.message);
}
