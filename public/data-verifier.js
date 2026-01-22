// 数据完整性验证工具 - 可在浏览器控制台中运行
// 使用方法: 在浏览器控制台中粘贴并执行此代码

window.verifyDataIntegrity = async function() {
  console.log('🔍 MECE系统数据完整性验证');
  console.log('==============================');

  try {
    // 1. 检查localStorage设置
    console.log('1️⃣ 检查localStorage设置:');
    const savedMode = localStorage.getItem('preferred_data_mode');
    console.log(`   数据模式: ${savedMode || '未设置'}`);

    // 2. 检查IndexedDB数据
    console.log('2️⃣ 检查IndexedDB数据:');
    if (!window.indexedDB) {
      console.log('   ❌ IndexedDB不支持');
      return;
    }

    const dbRequest = window.indexedDB.open('MECERiskOntologyDB', 1);
    dbRequest.onsuccess = function(event) {
      const db = event.target.result;

      // 检查数据库中实际存在的对象存储
      const objectStoreNames = Array.from(db.objectStoreNames);
      console.log(`   数据库中的对象存储: [${objectStoreNames.join(', ')}]`);

      let categories = [];
      let indicators = [];

      // 检查categories表
      if (objectStoreNames.includes('categories')) {
        try {
          const categoryTransaction = db.transaction(['categories'], 'readonly');
          const categoryStore = categoryTransaction.objectStore('categories');
          const categoryRequest = categoryStore.getAll();

          categoryRequest.onsuccess = function() {
            categories = categoryRequest.result;
            console.log(`   分类数量: ${categories.length}`);
            checkIndicators();
          };

          categoryRequest.onerror = function() {
            console.log('   ❌ 无法访问categories表');
            checkIndicators();
          };
        } catch (error) {
          console.log('   ❌ categories表访问失败:', error.message);
          checkIndicators();
        }
      } else {
        console.log('   ⚠️ categories对象存储不存在');
        checkIndicators();
      }

      function checkIndicators() {
        // 检查indicators表
        if (objectStoreNames.includes('indicators')) {
          try {
            const indicatorTransaction = db.transaction(['indicators'], 'readonly');
            const indicatorStore = indicatorTransaction.objectStore('indicators');
            const indicatorRequest = indicatorStore.getAll();

            indicatorRequest.onsuccess = function() {
              indicators = indicatorRequest.result;
              console.log(`   指标数量: ${indicators.length}`);
              validateData();
            };

            indicatorRequest.onerror = function() {
              console.log('   ❌ 无法访问indicators表');
              validateData();
            };
          } catch (error) {
            console.log('   ❌ indicators表访问失败:', error.message);
            validateData();
          }
        } else {
          console.log('   ⚠️ indicators对象存储不存在');
          validateData();
        }
      }

      function validateData() {
        // 验证数据完整性
        console.log('3️⃣ 数据完整性验证:');
        const expectedFull = 173;
        const expectedBasic = 40;

        if (indicators.length === 0) {
          console.log('   ⚠️ 没有找到任何指标数据');
        } else if (savedMode === 'full' && indicators.length !== expectedFull) {
          console.log(`   ❌ 完整模式数据不匹配: 期望${expectedFull}个，实际${indicators.length}个`);
        } else if (savedMode === 'basic' && indicators.length !== expectedBasic) {
          console.log(`   ❌ 基础模式数据不匹配: 期望${expectedBasic}个，实际${indicators.length}个`);
        } else if (!savedMode && indicators.length !== expectedBasic) {
          console.log(`   ❌ 默认数据不匹配: 期望${expectedBasic}个，实际${indicators.length}个`);
        } else {
          console.log(`   ✅ 数据数量正确 (${indicators.length}个指标)`);
        }

        // 检查数据结构
        console.log('4️⃣ 数据结构检查:');
        if (categories.length > 0) {
          const categoryIds = categories.map(c => c.id).sort();
          const expectedIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

          if (JSON.stringify(categoryIds) === JSON.stringify(expectedIds)) {
            console.log('   ✅ 分类结构完整');
          } else {
            console.log(`   ❌ 分类结构不完整: 期望[${expectedIds.join(',')}]，实际[${categoryIds.join(',')}]`);
          }
        } else {
          console.log('   ⚠️ 没有分类数据可以验证');
        }

        db.close();
      }
    };

    dbRequest.onerror = function() {
      console.log('   ❌ 无法打开IndexedDB数据库');
    };

    // 3. 检查内存中的数据
    console.log('5️⃣ 检查内存数据:');
    if (window.MECE_DATA) {
      const memCount = window.MECE_DATA.reduce((sum, cat) =>
        sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0);
      console.log(`   内存指标数量: ${memCount}`);
    } else {
      console.log('   内存数据未找到');
    }

    console.log('6️⃣ 验证完成建议:');
    if (savedMode === 'full') {
      console.log('   • 确保IndexedDB中有173个指标');
      console.log('   • 检查页面显示的指标数量');
      console.log('   • 验证所有8个分类都存在');
    } else {
      console.log('   • 确保IndexedDB中有40个指标');
      console.log('   • 验证基础功能正常');
    }

  } catch (error) {
    console.error('❌ 验证失败:', error);
  }
};

// 自动运行验证
console.log('💡 在控制台中运行: verifyDataIntegrity()');
console.log('💡 或直接调用: window.verifyDataIntegrity()');

// 导出到全局
window.verifyDataIntegrity();
