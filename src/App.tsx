
import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Category, SubCategory, Indicator, Stats } from './types';
import { dataService } from './services/dataService';
import { CURRENT_DATA_MODE } from './constants';
import RiskScoringEngine from './services/riskEngine';
import * as exportService from './utils/exportService';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingOverlay, LoadingSpinner, StatusIndicator, TableSkeleton } from './components/LoadingSpinner';
import { LanguageSelector } from './components/LanguageSelector';
import { useResponsive } from './hooks/useResponsive';
import i18n from './utils/i18n';

// 懒加载组件以实现代码分割
const IndicatorForm = lazy(() => import('./components/IndicatorForm').then(module => ({ default: module.IndicatorForm })));
const CategoryForm = lazy(() => import('./components/StructureForms').then(module => ({ default: module.CategoryForm })));
const SubCategoryForm = lazy(() => import('./components/StructureForms').then(module => ({ default: module.SubCategoryForm })));
const TutorialView = lazy(() => import('./components/TutorialView').then(module => ({ default: module.TutorialView })));
const ManagementPanel = lazy(() => import('./components/ManagementPanel').then(module => ({ default: module.ManagementPanel })));
const DataAnalysisPanel = lazy(() => import('./components/DataAnalysisPanel').then(module => ({ default: module.DataAnalysisPanel })));
const RealtimeMonitor = lazy(() => import('./components/RealtimeMonitor').then(module => ({ default: module.RealtimeMonitor })));
const AlertRulesEngine = lazy(() => import('./components/AlertRulesEngine').then(module => ({ default: module.AlertRulesEngine })));
const VirtualizedTable = lazy(() => import('./components/VirtualizedList').then(module => ({ default: module.VirtualizedTable })));
const DataModeSwitcher = lazy(() => import('./components/DataModeSwitcher').then(module => ({ default: module.DataModeSwitcher })));
import {
  Search, Sun, Moon,
  Activity, Users, TrendingUp, BarChart3, Layers, Link, Clock,
  FileSpreadsheet, Shield, AlertTriangle, Eye, Cpu, BookOpen,
  Maximize2, Minimize2, ChevronRight, Hash, Filter, LayoutGrid, Bell,
  Download, ChevronDown, X
} from 'lucide-react';

const iconMap: any = { Users, TrendingUp, Activity, BarChart3, Layers, Link, Clock, Shield, AlertTriangle };

function App() {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 使用响应式 Hook
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();

  const [activeTab, setActiveTab] = useState<'monitor' | 'manage' | 'tutorial' | 'analytics' | 'realtime' | 'alerts' | 'settings'>('monitor');
  const [selectedCatId, setSelectedCatId] = useState<string>('A');
  const [selectedSubId, setSelectedSubId] = useState<string>('ALL');

  const [search, setSearch] = useState('');
  const [isCompact, setIsCompact] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [linkedIndicatorId, setLinkedIndicatorId] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<{catId: string, subId: string, search: string}[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  // 点击外部关闭导出菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu && !(event.target as Element).closest('.export-menu-container')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const [isIndModalOpen, setIsIndModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingInd, setEditingInd] = useState<{catId: string, subId: string, indId?: string} | null>(null);

  // 初始化数据加载 - 强制使用完整数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // 强制清除所有缓存，确保加载完整数据
        try {
          await dataService.clearAllIndicators([]);
          localStorage.removeItem('data_migration_completed');
          localStorage.setItem('preferred_data_mode', 'full');
        } catch (e) {
          console.warn('清除缓存失败:', e);
        }

        // 直接使用完整数据，避免缓存问题
        const { INTEGRATED_INDICATORS } = await import('./constants-integrated');
        console.log(`🔥 强制加载完整数据: ${INTEGRATED_INDICATORS.length} 分类`);

        // 统计实际指标数量
        let totalIndicators = 0;
        INTEGRATED_INDICATORS.forEach(cat => {
          cat.subcategories.forEach(sub => {
            totalIndicators += sub.indicators.length;
          });
        });
        console.log(`🔥 完整指标数量: ${totalIndicators}`);

        setData(INTEGRATED_INDICATORS);

        // 异步保存到缓存，确保下次也能加载
        try {
          await dataService.saveAll(INTEGRATED_INDICATORS);
        } catch (e) {
          console.warn('保存数据失败:', e);
        }

      } catch (error) {
        console.error('Failed to load complete data:', error);
        // 最后的fallback
        const { getInitialData } = await import('./constants');
        setData(getInitialData());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 自动保存数据变化
  useEffect(() => {
    if (data.length > 0 && !isLoading) {
      const saveData = async () => {
        try {
          await dataService.saveAll(data);
        } catch (error) {
          console.error('Failed to save data:', error);
        }
      };

      // 防抖保存，避免频繁写入
      const timeoutId = setTimeout(saveData, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const activeCategory = useMemo(() => data.find(c => c.id === selectedCatId), [data, selectedCatId]);

  const stats = useMemo(() => {
    let s = { total: 0, p0: 0, p1: 0, p2: 0 };
    data.forEach(c => c.subcategories.forEach(sub => sub.indicators.forEach(i => {
      s.total++;
      if (i.priority === 'P0') s.p0++; else if (i.priority === 'P1') s.p1++; else s.p2++;
    })));
    return s;
  }, [data]);

  // 创建指标ID到名称的映射，用于显示引用
  const indicatorNameMap = useMemo(() => {
    const map = new Map<string, string>();
    data.forEach(cat =>
      cat.subcategories.forEach(sub =>
        sub.indicators.forEach(ind =>
          map.set(ind.id, ind.name)
        )
      )
    );
    return map;
  }, [data]);

  const filteredIndicators = useMemo(() => {
    const list: any[] = [];
    data.forEach(cat => {
      if (selectedCatId !== 'ALL' && cat.id !== selectedCatId) return;
      cat.subcategories.forEach(sub => {
        if (selectedSubId !== 'ALL' && sub.id !== selectedSubId) return;
        sub.indicators.forEach(ind => {
          if (!search || 
              ind.name.includes(search) || 
              ind.id.includes(search) || 
              ind.definition.includes(search) ||
              ind.purpose.includes(search) ||
              (ind.references && ind.references.some(ref =>
                indicatorNameMap.get(ref.targetId)?.includes(search) ||
                ref.description?.includes(search)
              ))) {
            list.push({ cat, sub, ind });
          }
        });
      });
    });
    return list;
  }, [data, search, selectedCatId, selectedSubId, indicatorNameMap]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleClearAll = async () => {
    if(confirm('⚠️ 确定要清空所有指标内容吗？维度本体结构将保留。')) {
      try {
        setIsLoading(true);
        const cleared = await dataService.clearAllIndicators(data);
        setData(cleared);
        alert('已成功清空所有监控指标。');
      } catch (error) {
        console.error('清空指标失败:', error);
        alert('❌ 清空指标失败，请重试。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImport = async (content: string, fileName: string) => {
    try {
      setIsLoading(true);

      // 使用增强版导入服务
      const { importService } = await import('./utils/importService');
      const result = importService.parseContent(content, fileName, {
        validateData: true,
        skipInvalidRows: true,
        autoGenerateIds: true,
        onProgress: (progress, message) => {
          console.log(`导入进度: ${progress}% - ${message}`);
        }
      });

      if (!result.success) {
        const errorMessages = result.errors.map(e => `第${e.row}行: ${e.message}`).join('\n');
        alert(`❌ 导入失败:\n${errorMessages}`);
        return;
      }

      // 显示警告信息
      if (result.warnings.length > 0) {
        const warningMessages = result.warnings.map(w => `第${w.row}行: ${w.message}`).join('\n');
        console.warn('导入警告:', warningMessages);
      }

      // 保存导入的数据
      await dataService.saveAll(result.data);
      setData(result.data);

      alert(`✅ 体系导入成功！
共加载 ${result.stats.categoriesImported} 个维度，${result.stats.subcategoriesImported} 个子类，${result.stats.indicatorsImported} 个指标。
${result.warnings.length > 0 ? `⚠️ 有 ${result.warnings.length} 个警告，请查看控制台。` : ''}`);

    } catch (e: any) {
      alert(`❌ 导入失败: ${e.message}\n请检查文件内容是否符合导出规范。`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if(confirm('🔄 确定重置为专家预设体系吗？当前所有修改将被覆盖。')) {
      try {
        setIsLoading(true);
        const reset = await dataService.resetToDefault();
        setData(reset);
      } catch (error) {
        console.error('重置数据失败:', error);
        alert('❌ 重置数据失败，请重试。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 处理双向链接点击
  const handleReferenceClick = (targetId: string) => {
    // 保存当前导航状态到历史记录
    setNavigationHistory(prev => [...prev, {
      catId: selectedCatId,
      subId: selectedSubId,
      search: search
    }]);
    setCanGoBack(true);

    // 查找目标指标
    const foundIndicator = data.flatMap(cat =>
      cat.subcategories.flatMap(sub =>
        sub.indicators.find(ind => ind.id === targetId)
          ? { cat, sub, ind: sub.indicators.find(ind => ind.id === targetId)! }
          : []
      )
    ).find(item => item);

    if (foundIndicator) {
      // 跳转到目标指标
      setSelectedCatId(foundIndicator.cat.id);
      setSelectedSubId(foundIndicator.sub.id);
      setLinkedIndicatorId(foundIndicator.ind.id);

      // 清除搜索
      setSearch('');

      // 短暂高亮效果
      setTimeout(() => setLinkedIndicatorId(null), 3000);
    } else {
      console.warn(`Referenced indicator ${targetId} not found`);
    }
  };

  // 返回上一个导航状态
  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const lastState = navigationHistory[navigationHistory.length - 1];
      setSelectedCatId(lastState.catId);
      setSelectedSubId(lastState.subId);
      setSearch(lastState.search);
      setNavigationHistory(prev => prev.slice(0, -1));
      setCanGoBack(navigationHistory.length > 1);
      setLinkedIndicatorId(null);
    }
  };

  // Loading 状态显示
  if (isLoading && data.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <LoadingOverlay
            isVisible={true}
            message="正在加载风险本体数据..."
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 text-center">
              <LoadingSpinner size="xl" className="mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                正在加载风险本体数据...
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                首次使用可能需要数据迁移
              </p>
            </div>
          </LoadingOverlay>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
        <div className="w-full max-w-none px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="bg-blue-600 p-1 sm:p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
                <Shield size={isMobile ? 16 : 22} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-lg font-black tracking-tighter uppercase truncate">MECE 风险本体生产力平台</h1>
              <p className="text-[8px] sm:text-[9px] text-slate-400 font-mono uppercase tracking-[0.2em] leading-none opacity-80 hidden sm:block">High-Fidelity Risk Management Engine</p>
            </div>
          </div>

          {/* 移动端导航菜单 */}
          {isMobile ? (
            <div className="flex items-center gap-1">
              <nav className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700/50">
                {[
                  { id: 'monitor', icon: Eye },
                  { id: 'realtime', icon: Activity },
                  { id: 'analytics', icon: BarChart3 },
                  { id: 'alerts', icon: Bell },
                  { id: 'manage', icon: Cpu }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`p-2 rounded-md text-xs font-black transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    title={tab.id}
                  >
                    <tab.icon size={12} />
                  </button>
                ))}
              </nav>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                    <span className="text-[8px] font-black bg-red-600 px-1 py-0.5 rounded shadow-sm">P0: {stats.p0}</span>
                    <span className="text-[8px] font-black bg-orange-600 px-1 py-0.5 rounded shadow-sm">P1: {stats.p1}</span>
                </div>
                <LanguageSelector />
                <button onClick={toggleDarkMode} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
                  {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
            </div>
          ) : (
            <>
          <nav className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700/50">
            {[
              { id: 'monitor', label: i18n.t('navigation.monitor'), icon: Eye },
              { id: 'realtime', label: i18n.t('navigation.realtime'), icon: Activity },
              { id: 'analytics', label: i18n.t('navigation.analytics'), icon: BarChart3 },
              { id: 'alerts', label: i18n.t('navigation.alerts'), icon: Bell },
              { id: 'manage', label: i18n.t('navigation.manage'), icon: Cpu },
              { id: 'settings', label: '设置', icon: Shield },
              { id: 'tutorial', label: i18n.t('navigation.tutorial'), icon: BookOpen }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 lg:px-5 py-2 rounded-lg text-xs font-black transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                    <tab.icon size={14} /> <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

              <div className="flex items-center gap-2 lg:gap-4">
                <div className="flex items-center gap-2 pr-2 lg:pr-4 border-r border-slate-800">
                <span className="text-[10px] font-black bg-red-600 px-2 py-0.5 rounded shadow-sm">P0: {stats.p0}</span>
                <span className="text-[10px] font-black bg-orange-600 px-2 py-0.5 rounded shadow-sm">P1: {stats.p1}</span>
            </div>
            <LanguageSelector />
            <button onClick={toggleDarkMode} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
            </>
          )}
        </div>
      </header>

      <main className="w-full min-h-screen px-1 py-0.5">
        {activeTab === 'monitor' && (
          <div className={`flex flex-col h-[calc(100vh-80px)] animate-in slide-in-from-bottom-2 duration-500`}>
            <LoadingOverlay isVisible={isLoading} message="正在加载数据...">
              <div className={`flex gap-1 md:gap-1.5 mb-3 overflow-x-auto pb-2 custom-scrollbar ${isMobile ? 'flex-wrap justify-center' : ''}`}>
                  <button
                      onClick={() => { setSelectedCatId('ALL'); setSelectedSubId('ALL'); }}
                      className={`flex flex-col items-center justify-center ${isMobile ? 'min-w-[70px] p-1.5' : isTablet ? 'min-w-[90px] p-2' : 'min-w-[100px] p-2'} rounded-xl md:rounded-2xl border-2 transition-all flex-shrink-0 ${selectedCatId === 'ALL' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-400'}`}
                  >
                      <LayoutGrid size={isMobile ? 18 : isTablet ? 22 : 24} className="mb-1" />
                      <span className={`font-black uppercase ${isMobile ? 'text-[8px]' : 'text-[10px] md:text-[11px]'}`}>全部维度</span>
                  </button>
                  {data.map(cat => (
                      <button
                          key={cat.id}
                          onClick={() => { setSelectedCatId(cat.id); setSelectedSubId('ALL'); }}
                          className={`flex flex-col items-start justify-between ${isMobile ? 'min-w-[140px] p-2' : isTablet ? 'min-w-[170px] p-2.5' : 'min-w-[200px] p-3'} rounded-xl md:rounded-2xl border-2 transition-all flex-shrink-0 ${selectedCatId === cat.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-xl shadow-blue-500/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 opacity-60 hover:opacity-100'}`}
                      >
                          <div className="flex justify-between w-full mb-1 md:mb-2">
                              <div className={`p-1 md:p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${selectedCatId === cat.id ? 'text-blue-600' : 'text-slate-400'}`}>
                                  {React.createElement(iconMap[cat.icon] || Activity, { size: isMobile ? 12 : isTablet ? 16 : 18 })}
                              </div>
                              <span className={`font-mono font-bold text-slate-400 ${isMobile ? 'text-[7px]' : 'text-[9px] md:text-[10px]'}`}>0{cat.id}</span>
                          </div>
                          <span className={`font-black ${selectedCatId === cat.id ? 'text-blue-600' : 'text-slate-700 dark:text-slate-200'} ${isMobile ? 'text-[10px]' : isTablet ? 'text-[12px]' : 'text-[13px]'} leading-tight`}>{cat.name}</span>
                          {!isMobile && (
                            <span className="text-[8px] md:text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider truncate w-full" title={cat.description}>
                              {cat.description}
                            </span>
                          )}
                      </button>
                  ))}
              </div>
            </LoadingOverlay>

            {selectedCatId !== 'ALL' && activeCategory && (
                <div className={`flex items-center gap-1 md:gap-1.5 mb-3 p-1 md:p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl w-full md:w-fit border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar ${isMobile ? 'flex-wrap' : ''}`}>
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 pr-3 md:pr-4 border-r border-slate-300 dark:border-slate-600 text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest flex-shrink-0">
                        <Filter size={isMobile ? 10 : 12}/> 细分场景
                    </div>
                    <div className="flex gap-1 md:gap-2 flex-shrink-0">
                    <button 
                        onClick={() => setSelectedSubId('ALL')}
                            className={`px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[10px] md:text-[11px] font-black transition-all whitespace-nowrap ${selectedSubId === 'ALL' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        全部子类
                    </button>
                    {activeCategory.subcategories.map(sub => (
                        <button 
                            key={sub.id}
                            onClick={() => setSelectedSubId(sub.id)}
                                className={`px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[10px] md:text-[11px] font-black transition-all whitespace-nowrap ${selectedSubId === sub.id ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {sub.name}
                        </button>
                    ))}
                    </div>
                </div>
            )}

            <div className={`flex items-center justify-between mb-1 md:mb-1.5 px-0.5 md:px-1 ${isMobile ? 'flex-col gap-3' : ''}`}>
                <div className={`flex items-center gap-2 md:gap-4 flex-1 ${isMobile ? 'w-full' : ''}`}>
                    <div className={`relative ${isMobile ? 'w-full' : 'w-full max-w-sm'}`}>
                        <Search size={isMobile ? 12 : 14} className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={isMobile ? "搜索指标..." : "检索名称、定义、UID..."}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-7 md:pl-9 pr-8 md:pr-9 py-2 md:py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg md:rounded-xl text-[11px] md:text-[11px] outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                                title="清除搜索"
                            >
                                <X size={12} className="text-slate-400" />
                            </button>
                        )}
                    </div>
                    <div className={`text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 md:gap-2 ${isMobile ? 'justify-center' : ''}`}>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="hidden sm:inline">匹配到</span> <span className="text-slate-900 dark:text-white">{filteredIndicators.length}</span> <span className="hidden sm:inline">条风险逻辑节点</span>
                    </div>
                </div>
                <div className={`flex items-center gap-1 md:gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
                    {canGoBack && (
                        <button
                            onClick={handleGoBack}
                            className="p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400 rounded-lg md:rounded-xl transition-all"
                            title="返回上一个视图"
                        >
                            <ChevronRight size={14} className="md:w-4 md:h-4 rotate-180" />
                        </button>
                    )}
                    <button onClick={() => setIsCompact(!isCompact)} className="p-1.5 md:p-2 bg-slate-50 dark:bg-slate-800 rounded-lg md:rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                        {isCompact ? <Minimize2 size={14} className="md:w-4 md:h-4"/> : <Maximize2 size={14} className="md:w-4 md:h-4"/>}
                    </button>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="p-1.5 md:p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-800/30 text-red-600 dark:text-red-400 rounded-lg md:rounded-xl transition-all"
                            title="清除搜索"
                        >
                            <X size={14} className="md:w-4 md:h-4" />
                        </button>
                    )}

                    {/* 导出按钮组 */}
                    <div className="relative export-menu-container">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-green-600 hover:bg-green-700 text-white text-[10px] md:text-[11px] font-black rounded-lg md:rounded-xl shadow-lg shadow-green-600/20 transition-all ${isMobile ? 'flex-1 justify-center' : ''}`}
                        >
                            <Download size={12} className="md:w-3.5 md:h-3.5" />
                            <span className="hidden sm:inline">导出报告</span>
                            <span className="sm:hidden">导出</span>
                            <ChevronDown size={10} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''} md:w-3 md:h-3`} />
                        </button>

                        {/* 导出格式菜单 */}
                        {showExportMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            exportService.exportToExcel(data);
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 transition-all"
                                    >
                                        <FileSpreadsheet size={14} className="text-green-600" />
                                        Excel (.xlsx)
                                    </button>

                                    <button
                                        onClick={() => {
                                            exportService.exportToCSV(data);
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 transition-all"
                                    >
                                        <FileSpreadsheet size={14} className="text-blue-600" />
                                        CSV (.csv)
                                    </button>

                                    <button
                                        onClick={() => {
                                            exportService.exportToJSON(data);
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 transition-all"
                                    >
                                        <FileSpreadsheet size={14} className="text-purple-600" />
                                        JSON (.json)
                                    </button>

                                    <button
                                        onClick={() => {
                                            exportService.exportToMarkdown(data);
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 transition-all"
                                    >
                                        <FileSpreadsheet size={14} className="text-orange-600" />
                                        Markdown (.md)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 移动端卡片视图 */}
            {isMobile ? (
              <div className="flex-1 overflow-auto space-y-3 pb-4">
                {filteredIndicators.map(({ cat, sub, ind }, idx) => (
                  <div key={ind.id} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg transition-all ${linkedIndicatorId === ind.id ? 'ring-2 ring-cyan-400 bg-cyan-50/20 dark:bg-cyan-900/10' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{ind.id}</span>
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                            ind.priority === 'P0' ? 'bg-red-600 text-white' :
                            ind.priority === 'P1' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          }`}>
                            {ind.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                            ind.indicatorType === 'base' ? 'bg-purple-600 text-white' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                          }`}>
                            {ind.indicatorType === 'base' ? '基础' : '衍生'}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 dark:text-white text-sm">{ind.name}</h3>
                        <p className="text-[11px] text-slate-400 font-mono uppercase font-black mt-1">{cat.id} / {sub.id}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${ind.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></div>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div>
                        <span className="font-bold text-slate-600 dark:text-slate-400">定义：</span>
                        <span className="text-slate-700 dark:text-slate-300">{ind.definition}</span>
                      </div>
                      <div>
                        <span className="font-bold text-blue-600 dark:text-blue-400">作用：</span>
                        <span className="text-slate-700 dark:text-slate-300">{ind.purpose}</span>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">公式：</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{ind.formula}</span>
                      </div>
                      {ind.references && ind.references.length > 0 && (
                        <div>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">双向链接：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ind.references.map((ref, i) => {
                              const targetName = indicatorNameMap.get(ref.targetId) || ref.targetId;
                              return (
                                <button
                                  key={i}
                                  onClick={() => handleReferenceClick(ref.targetId)}
                                  className={`inline-block px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/40 hover:bg-cyan-200 dark:hover:bg-cyan-800/60 text-cyan-700 dark:text-cyan-300 rounded text-[9px] font-bold transition-all cursor-pointer hover:shadow-sm active:scale-95 ${linkedIndicatorId === ind.id ? 'ring-2 ring-cyan-400' : ''}`}
                                  title={`点击跳转到指标: ${targetName}`}
                                >
                                  🔗 {targetName}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl relative custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed min-w-[1800px] xl:min-w-[2200px] 2xl:min-w-[2600px]">
                    <thead className="sticky top-0 z-40 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
                        <tr className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                            <th className="w-16 sm:w-20 md:w-24 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 sticky left-0 bg-slate-50 dark:bg-slate-800 z-50 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)]">UID</th>
                            <th className="w-32 sm:w-40 md:w-48 lg:w-56 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 sticky left-16 sm:left-20 md:left-24 bg-slate-50 dark:bg-slate-800 z-50 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)]">指标核心名称</th>
                            <th className="w-16 sm:w-20 md:w-24 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 text-center">风险分级</th>
                            <th className="w-20 sm:w-24 md:w-28 lg:w-32 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 text-center bg-purple-50/40 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 hidden md:table-cell lg:table-cell">指标性质</th>
                            <th className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700">业务本体定义</th>
                            <th className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 bg-blue-50/40 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400">指标作用 (PURPOSE)</th>
                            <th className="w-36 sm:w-44 md:w-52 lg:w-60 xl:w-64 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10">计算逻辑 (FORMULA)</th>
                            <th className="w-28 sm:w-32 md:w-36 lg:w-40 xl:w-48 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 text-orange-600 dark:text-orange-400">警报阈值</th>
                            <th className="w-36 sm:w-44 md:w-52 lg:w-60 xl:w-64 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400">数值演算案例</th>
                            <th className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 2xl:w-80 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 border-r border-slate-200 dark:border-slate-700 bg-cyan-50/40 dark:bg-cyan-900/10 text-cyan-600 dark:text-cyan-400 hidden lg:table-cell xl:table-cell" title="双向链接：点击跳转到相关指标">🔗 双向链接</th>
                            <th className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 2xl:w-96 px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 text-red-700 dark:text-red-400">风险全景解读</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredIndicators.map(({ cat, sub, ind }, idx) => (
                            <tr key={ind.id} className={`group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-slate-50/20 dark:bg-slate-800/10'} ${linkedIndicatorId === ind.id ? 'ring-2 ring-cyan-400 bg-cyan-50/20 dark:bg-cyan-900/10' : ''}`}>
                                <td className={`px-1 sm:px-2 py-1.5 sm:py-2 font-mono text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-400 border-r border-slate-100 dark:border-slate-800 sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)] ${linkedIndicatorId === ind.id ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-white dark:bg-slate-900 group-hover:bg-blue-50/40 dark:group-hover:bg-blue-900/10'}`} title={ind.id}>
                                    <div className="truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px]">
                                        {ind.id}
                                    </div>
                                </td>
                                <td className={`px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 sticky left-16 sm:left-20 md:left-24 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)] ${linkedIndicatorId === ind.id ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-white dark:bg-slate-900 group-hover:bg-blue-50/40 dark:group-hover:bg-blue-900/10'}`}>
                                    <div className="flex flex-col min-w-0">
                                        <div className={`font-black text-slate-900 dark:text-white text-[10px] sm:text-[11px] md:text-[12px] truncate group-hover:text-blue-600 transition-colors ${isCompact ? 'max-w-[120px] sm:max-w-[160px] md:max-w-[200px]' : 'max-w-[200px] sm:max-w-[240px] md:max-w-[280px]'}`} title={ind.name}>
                                            {ind.name}
                                        </div>
                                        {!isCompact && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className={`w-1.5 h-1.5 rounded-full ${ind.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></span>
                                                <span className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-400 font-mono uppercase font-black truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px]" title={`${cat.id} / ${sub.id}`}>{cat.id} / {sub.id}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 text-center">
                                    <span className={`inline-block px-1 sm:px-1.5 md:px-2 py-0.5 rounded-lg text-[8px] sm:text-[9px] md:text-[10px] font-black ${
                                        ind.priority === 'P0' ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 
                                        ind.priority === 'P1' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 
                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    }`}>
                                        {ind.priority}
                                    </span>
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 text-center bg-purple-50/10 dark:bg-transparent hidden md:table-cell lg:table-cell">
                                    <span className={`inline-block px-1.5 sm:px-2 py-0.5 rounded-lg text-[8px] sm:text-[9px] md:text-[10px] font-black ${
                                        ind.indicatorType === 'base' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' :
                                        'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                    }`}>
                                        {ind.indicatorType === 'base' ? '基础' : '衍生'}
                                    </span>
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <div className={`truncate ${isCompact ? 'max-w-[120px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px]' : 'max-w-[200px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-[440px]'}`} title={ind.definition}>
                                        {ind.definition}
                                    </div>
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed bg-blue-50/10 dark:bg-transparent">
                                    <div className={`truncate ${isCompact ? 'max-w-[120px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px]' : 'max-w-[200px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-[440px]'}`} title={ind.purpose}>
                                        {ind.purpose}
                                    </div>
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 font-mono text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] text-indigo-500 dark:text-indigo-300 bg-indigo-50/10 dark:bg-transparent font-bold">
                                    <div className={`truncate ${isCompact ? 'max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px]' : 'max-w-[160px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[340px]'}`} title={ind.formula}>
                                        {ind.formula}
                                    </div>
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-black text-orange-600 dark:text-orange-400">
                                    <div className={`truncate ${isCompact ? 'max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]' : 'max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px]'}`} title={ind.threshold}>
                                        {ind.threshold}
                                    </div>
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] text-green-600 dark:text-green-500 font-medium">
                                    <div className={`truncate ${isCompact ? 'max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px]' : 'max-w-[160px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[340px]'}`} title={ind.calculationCase}>
                                        {ind.calculationCase}
                                    </div>
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 border-r border-slate-100 dark:border-slate-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] text-cyan-600 dark:text-cyan-400 font-medium bg-cyan-50/10 dark:bg-transparent hidden lg:table-cell xl:table-cell">
                                    {ind.references && ind.references.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px]">
                                            {ind.references.slice(0, 2).map((ref, i) => {
                                                const targetName = indicatorNameMap.get(ref.targetId) || ref.targetId;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleReferenceClick(ref.targetId)}
                                                        className={`inline-block px-1 sm:px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/40 hover:bg-cyan-200 dark:hover:bg-cyan-800/60 text-cyan-700 dark:text-cyan-300 rounded text-[7px] sm:text-[8px] md:text-[9px] font-bold truncate max-w-[50px] sm:max-w-[60px] md:max-w-[70px] transition-all cursor-pointer hover:shadow-sm active:scale-95 ${linkedIndicatorId === ind.id ? 'ring-2 ring-cyan-400' : ''}`}
                                                        title={`点击跳转到指标: ${targetName} (${ref.type})`}
                                                    >
                                                        🔗 {targetName}
                                                    </button>
                                                );
                                            })}
                                            {ind.references.length > 2 && (
                                                <span className="inline-block px-1 sm:px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-[7px] sm:text-[8px] md:text-[9px] font-bold" title={`还有 ${ind.references.length - 2} 个引用`}>
                                                    +{ind.references.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px]">暂无引用</span>
                                    )}
                                </td>
                                <td className="px-1 sm:px-2 py-1.5 sm:py-2 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] text-red-800 dark:text-red-300 font-medium leading-relaxed bg-red-50/5 dark:bg-transparent">
                                    <div className={`truncate ${isCompact ? 'max-w-[180px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-[360px]' : 'max-w-[280px] sm:max-w-[360px] md:max-w-[440px] lg:max-w-[520px]'}`} title={ind.riskInterpretation}>
                                        {ind.riskInterpretation}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
          </div>
        )}

        <Suspense fallback={
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <LoadingOverlay isVisible={true} message="正在加载模块...">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 text-center">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  正在加载模块...
                </p>
              </div>
            </LoadingOverlay>
          </div>
        }>
          {activeTab === 'manage' && (
            <ManagementPanel
              data={data}
              onEditIndicator={(catId, subId, indId) => { setEditingInd({catId, subId, indId}); setIsIndModalOpen(true); }}
              onDeleteIndicator={(catId, subId, indId) => setData(dataService.deleteIndicator(data, catId, subId, indId))}
              onAddIndicator={() => { setEditingInd({catId: selectedCatId === 'ALL' ? 'A' : selectedCatId, subId: selectedSubId === 'ALL' ? '' : selectedSubId}); setIsIndModalOpen(true); }}
              onAddCategory={() => setIsCatModalOpen(true)}
              onClearAll={handleClearAll}
              onReset={handleReset}
              onImport={handleImport}
            />
          )}

          {activeTab === 'realtime' && <RealtimeMonitor data={data} />}

          {activeTab === 'analytics' && <DataAnalysisPanel data={data} />}

          {activeTab === 'alerts' && (
            <AlertRulesEngine
              data={data}
              riskScore={(() => RiskScoringEngine.calculateRiskScore(data))()}
            />
          )}

          {activeTab === 'settings' && (
            <DataModeSwitcher
              currentMode={CURRENT_DATA_MODE}
              onModeChange={(mode) => {
                // 设置环境变量并重新加载
                localStorage.setItem('preferred_data_mode', mode);
                window.location.reload();
              }}
              onDataChange={setData}
            />
          )}

          {activeTab === 'tutorial' && <TutorialView />}
        </Suspense>
      </main>

      <Suspense fallback={<div></div>}>
        <IndicatorForm
          isOpen={isIndModalOpen}
          onClose={() => setIsIndModalOpen(false)}
          initialData={editingInd?.indId ? data.find(c => c.id === editingInd.catId)?.subcategories.find(s => s.id === editingInd.subId)?.indicators.find(i => i.id === editingInd.indId) : undefined}
          categories={data}
          initialCatId={editingInd?.catId}
          initialSubId={editingInd?.subId}
          onSave={(ind, cId, sId) => { setData(dataService.upsertIndicator(data, ind, cId, sId, !editingInd?.indId)); setIsIndModalOpen(false); }}
        />

        <CategoryForm
          isOpen={isCatModalOpen}
          onClose={() => setIsCatModalOpen(false)}
          onSave={(cat) => { setData([...data, cat]); setIsCatModalOpen(false); }}
        />
      </Suspense>
    </div>
  );
}

export default App;
