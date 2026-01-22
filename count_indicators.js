// Script to count indicators in INTEGRATED_INDICATORS
import { INTEGRATED_INDICATORS, INTEGRATION_STATS } from './src/constants-integrated.js';

let totalIndicators = 0;
let totalSubcategories = 0;

console.log('=== INDICATOR COUNT ANALYSIS ===\n');

INTEGRATED_INDICATORS.forEach(category => {
  console.log(`${category.id}: ${category.name}`);
  let categoryIndicators = 0;
  category.subcategories.forEach(sub => {
    const count = sub.indicators.length;
    categoryIndicators += count;
    totalSubcategories++;
    console.log(`  ${sub.id}: ${count} indicators`);
  });
  console.log(`  Total: ${categoryIndicators} indicators`);
  totalIndicators += categoryIndicators;
  console.log('');
});

console.log(`Grand Total: ${totalIndicators} indicators`);
console.log(`Total Subcategories: ${totalSubcategories}`);
console.log(`Stats claim: ${INTEGRATION_STATS.totalIndicators} indicators, ${INTEGRATION_STATS.totalSubcategories} subcategories`);

const isValid = totalIndicators === INTEGRATION_STATS.totalIndicators &&
                totalSubcategories === INTEGRATION_STATS.totalSubcategories;

console.log(`\nValidation: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
if (!isValid) {
  console.log(`Expected: ${INTEGRATION_STATS.totalIndicators} indicators, ${INTEGRATION_STATS.totalSubcategories} subcategories`);
  console.log(`Actual: ${totalIndicators} indicators, ${totalSubcategories} subcategories`);
}
