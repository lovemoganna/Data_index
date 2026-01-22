import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Database, Settings, RefreshCw, Trash2 } from 'lucide-react';
import { INTEGRATION_STATS } from '../constants-integrated';

interface DataModeSwitcherProps {
  currentMode: 'basic' | 'full';
  onModeChange: (mode: 'basic' | 'full') => void;
  onDataChange: (data: any[]) => void;
}

export const DataModeSwitcher: React.FC<DataModeSwitcherProps> = ({
  currentMode,
  onModeChange,
  onDataChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataValidation, setDataValidation] = useState<{
    isValid: boolean;
    actualCount: number;
    expectedCount: number;
  } | null>(null);

  const handleModeSwitch = async (newMode: 'basic' | 'full') => {
    if (newMode === currentMode) return;

    setIsLoading(true);
    try {
      // 保存用户选择到localStorage
      localStorage.setItem('preferred_data_mode', newMode);

      // 通知父组件模式改变
      onModeChange(newMode);

      // 强制重新加载数据（确保数据服务使用新模式）
      if (onDataChange) {
        // 导入动态数据获取函数
        const { getInitialData } = await import('../constants');
        const newData = getInitialData(newMode);

        // 验证数据完整性
        const actualCount = newData.reduce((sum, cat) =>
          sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0);

        const expectedCount = newMode === 'full' ? 173 : 40;
        const isValid = actualCount === expectedCount;

        setDataValidation({ isValid, actualCount, expectedCount });

        onDataChange(newData);

        // 显示验证结果
        if (isValid) {
          console.log(`✅ 数据模式切换成功: ${newMode === 'full' ? '完整模式' : '基础模式'} (${actualCount}个指标)`);
        } else {
          console.warn(`⚠️ 数据验证警告: 期望${expectedCount}个指标，实际${actualCount}个指标`);
        }
      }

    } catch (error) {
      console.error('切换数据模式失败:', error);
      alert('❌ 模式切换失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataReset = async () => {
    if (!confirm('⚠️ 这将清除所有本地数据并重置为默认状态，确定继续吗？')) return;

    setIsLoading(true);
    try {
      // 清除localStorage
      localStorage.removeItem('preferred_data_mode');
      localStorage.removeItem('data_migration_completed');

      // 清除IndexedDB
      const { dataService } = await import('../services/dataService');
      const db = (await import('dexie')).default;
      await db.delete('MECERiskOntologyDB');

      // 重新初始化数据服务
      await dataService.initialize();

      // 重新加载数据
      const { getInitialData } = await import('../constants');
      const resetData = getInitialData();

      if (onDataChange) {
        onDataChange(resetData);
      }

      // 重置验证状态
      setDataValidation(null);

      alert('✅ 数据已重置，请刷新页面以应用更改');
      window.location.reload();

    } catch (error) {
      console.error('数据重置失败:', error);
      alert('❌ 数据重置失败，请手动清除浏览器数据');
    } finally {
      setIsLoading(false);
    }
  };

  const basicStats = { totalCategories: 4, totalSubcategories: 8, totalIndicators: 40 };
  const fullStats = INTEGRATION_STATS;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Database className="w-6 h-6 text-blue-600" />
          指标体系模式切换
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          选择使用基础版本（40个指标）或完整版本（173个指标）的风险监控体系
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* 基础模式 */}
        <div
          className={`cursor-pointer transition-all border-2 rounded-lg p-6 ${
            currentMode === 'basic'
              ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              : 'border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          onClick={() => handleModeSwitch('basic')}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {currentMode === 'basic' && <CheckCircle className="w-4 h-4 text-green-500" />}
                基础模式 (Basic)
              </h3>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                推荐新用户
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              包含核心风险监控指标，系统稳定，易于理解
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">分类数量:</span>
              <span className="font-medium">{basicStats.totalCategories}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">子类数量:</span>
              <span className="font-medium">{basicStats.totalSubcategories}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">指标总数:</span>
              <span className="font-medium">{basicStats.totalIndicators}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                涵盖用户、资产、交易、市场四大核心维度
              </p>
            </div>
          </div>
        </div>

        {/* 完整模式 */}
        <div
          className={`cursor-pointer transition-all border-2 rounded-lg p-6 ${
            currentMode === 'full'
              ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20 border-green-500'
              : 'border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          onClick={() => handleModeSwitch('full')}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {currentMode === 'full' && <CheckCircle className="w-4 h-4 text-green-500" />}
                完整模式 (Full)
              </h3>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-xs rounded-full">
                高级用户
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              包含全部173个专业指标，覆盖8大维度42个子类
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">分类数量:</span>
              <span className="font-medium">{fullStats.totalCategories}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">子类数量:</span>
              <span className="font-medium">{fullStats.totalSubcategories}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">指标总数:</span>
              <span className="font-medium">{fullStats.totalIndicators}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                包含AI增强、链上溯源、跨平台分析等高级功能
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮组 */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleModeSwitch(currentMode === 'basic' ? 'full' : 'basic')}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isLoading
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              切换中...
            </span>
          ) : (
            `切换到${currentMode === 'basic' ? '完整' : '基础'}模式`
          )}
        </button>

        <button
          onClick={handleDataReset}
          disabled={isLoading}
          className="px-4 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          title="清除本地数据并重置"
        >
          <Trash2 size={16} />
          重置数据
        </button>
      </div>

      {/* 警告信息 */}
      {currentMode === 'full' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">完整模式说明</p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1 text-sm">
                完整模式包含大量专业指标，建议具有风险管理经验的用户使用。
                切换模式将重新加载应用以应用新的指标体系。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 数据验证状态 */}
      {dataValidation && (
        <div className={`text-center text-sm border-t border-gray-200 dark:border-gray-700 pt-4 ${
          dataValidation.isValid
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          <p>
            数据验证: {dataValidation.isValid ? '✅' : '❌'}
            实际{dataValidation.actualCount}个指标
            (期望{dataValidation.expectedCount}个指标)
          </p>
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
        <p>最后更新时间: {new Date(fullStats.lastUpdated).toLocaleString('zh-CN')}</p>
        <p>当前版本: MECE 第六轮指标体系增强</p>
      </div>
    </div>
  );
};
