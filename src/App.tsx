
import React, { useState, useEffect, useMemo } from 'react';
import { Category, SubCategory, Indicator, Stats } from './types';
import { dataService } from './services/dataService';
import RiskScoringEngine from './services/riskEngine'; 
import * as exportService from './utils/exportService';
import { IndicatorForm } from './components/IndicatorForm';
import { CategoryForm, SubCategoryForm } from './components/StructureForms';
import { TutorialView } from './components/TutorialView';
import { ManagementPanel } from './components/ManagementPanel';
import { DataAnalysisPanel } from './components/DataAnalysisPanel';
import { RealtimeMonitor } from './components/RealtimeMonitor';
import { AlertRulesEngine } from './components/AlertRulesEngine';
import {
  Search, Sun, Moon,
  Activity, Users, TrendingUp, BarChart3, Layers, Link, Clock,
  FileSpreadsheet, Shield, AlertTriangle, Eye, Cpu, BookOpen,
  Maximize2, Minimize2, ChevronRight, Hash, Filter, LayoutGrid, Bell,
  Download, ChevronDown
} from 'lucide-react';

const iconMap: any = { Users, TrendingUp, Activity, BarChart3, Layers, Link, Clock, Shield, AlertTriangle };

function App() {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [activeTab, setActiveTab] = useState<'monitor' | 'manage' | 'tutorial' | 'analytics' | 'realtime' | 'alerts'>('monitor');
  const [selectedCatId, setSelectedCatId] = useState<string>('A');
  const [selectedSubId, setSelectedSubId] = useState<string>('ALL');

  const [search, setSearch] = useState('');
  const [isCompact, setIsCompact] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  // 初始化数据加载
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const loadedData = await dataService.getAll();
        setData(loadedData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // 如果加载失败，使用默认数据
        const { INITIAL_DATA } = await import('./constants');
        setData(INITIAL_DATA);
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
              ind.purpose.includes(search)) {
            list.push({ cat, sub, ind });
          }
        });
      });
    });
    return list;
  }, [data, search, selectedCatId, selectedSubId]);

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
      const importedData = await dataService.validateAndImport(content, fileName);
      setData(importedData);
      alert(`✅ 体系导入成功！共加载 ${importedData.length} 个维度。`);
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

  // Loading 状态显示
  if (isLoading && data.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">正在加载风险本体数据...</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">首次使用可能需要数据迁移</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
        <div className="w-full max-w-none px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/20">
                <Shield size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase">MECE 风险本体生产力平台</h1>
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-[0.2em] leading-none opacity-80">High-Fidelity Risk Management Engine</p>
            </div>
          </div>

          <nav className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700/50">
            {[
              { id: 'monitor', label: '生产看板', icon: Eye },
              { id: 'realtime', label: '实时监控', icon: Activity },
              { id: 'analytics', label: '数据分析', icon: BarChart3 },
              { id: 'alerts', label: '告警规则', icon: Bell },
              { id: 'manage', label: '体系管理', icon: Cpu },
              { id: 'tutorial', label: '学习中心', icon: BookOpen }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
                <span className="text-[10px] font-black bg-red-600 px-2 py-0.5 rounded shadow-sm">P0: {stats.p0}</span>
                <span className="text-[10px] font-black bg-orange-600 px-2 py-0.5 rounded shadow-sm">P1: {stats.p1}</span>
            </div>
            <button onClick={toggleDarkMode} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="w-full min-h-screen px-2 py-1">
        {activeTab === 'monitor' && (
          <div className="flex flex-col h-[calc(100vh-80px)] animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                <button 
                    onClick={() => { setSelectedCatId('ALL'); setSelectedSubId('ALL'); }}
                    className={`flex flex-col items-center justify-center min-w-[100px] p-3 rounded-2xl border-2 transition-all ${selectedCatId === 'ALL' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-400'}`}
                >
                    <LayoutGrid size={24} className="mb-2" />
                    <span className="text-[11px] font-black uppercase">全部维度</span>
                </button>
                {data.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => { setSelectedCatId(cat.id); setSelectedSubId('ALL'); }}
                        className={`flex flex-col items-start justify-between min-w-[200px] p-4 rounded-2xl border-2 transition-all ${selectedCatId === cat.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-xl shadow-blue-500/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 opacity-60 hover:opacity-100'}`}
                    >
                        <div className="flex justify-between w-full mb-3">
                            <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${selectedCatId === cat.id ? 'text-blue-600' : 'text-slate-400'}`}>
                                {React.createElement(iconMap[cat.icon] || Activity, { size: 18 })}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400">0{cat.id}</span>
                        </div>
                        <span className={`text-[13px] font-black ${selectedCatId === cat.id ? 'text-blue-600' : 'text-slate-700 dark:text-slate-200'}`}>{cat.name}</span>
                        <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{cat.description}</span>
                    </button>
                ))}
            </div>

            {selectedCatId !== 'ALL' && activeCategory && (
                <div className="flex items-center gap-2 mb-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 px-3 pr-4 border-r border-slate-300 dark:border-slate-600 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <Filter size={12}/> 细分场景
                    </div>
                    <button 
                        onClick={() => setSelectedSubId('ALL')}
                        className={`px-4 py-1.5 rounded-xl text-[11px] font-black transition-all ${selectedSubId === 'ALL' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        全部子类
                    </button>
                    {activeCategory.subcategories.map(sub => (
                        <button 
                            key={sub.id}
                            onClick={() => setSelectedSubId(sub.id)}
                            className={`px-4 py-1.5 rounded-xl text-[11px] font-black transition-all ${selectedSubId === sub.id ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {sub.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-full max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="检索名称、定义、UID..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[11px] outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                        />
                    </div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        匹配到 <span className="text-slate-900 dark:text-white">{filteredIndicators.length}</span> 条风险逻辑节点
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsCompact(!isCompact)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                        {isCompact ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                    </button>

                    {/* 导出按钮组 */}
                    <div className="relative export-menu-container">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-[11px] font-black rounded-xl shadow-lg shadow-green-600/20 transition-all"
                        >
                            <Download size={14} />
                            导出报告
                            <ChevronDown size={12} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
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

            <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl relative custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed min-w-[2000px]">
                    <thead className="sticky top-0 z-40 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
                        <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                            <th className="w-24 px-6 py-5 border-r border-slate-200 dark:border-slate-700 sticky left-0 bg-slate-50 dark:bg-slate-800 z-50">UID</th>
                            <th className="w-56 px-6 py-5 border-r border-slate-200 dark:border-slate-700 sticky left-24 bg-slate-50 dark:bg-slate-800 z-50">指标核心名称</th>
                            <th className="w-24 px-6 py-5 border-r border-slate-200 dark:border-slate-700 text-center">风险分级</th>
                            <th className="w-72 px-6 py-5 border-r border-slate-200 dark:border-slate-700">业务本体定义</th>
                            <th className="w-72 px-6 py-5 border-r border-slate-200 dark:border-slate-700 bg-blue-50/40 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400">指标作用 (PURPOSE)</th>
                            <th className="w-64 px-6 py-5 border-r border-slate-200 dark:border-slate-700 font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10">计算逻辑 (FORMULA)</th>
                            <th className="w-48 px-6 py-5 border-r border-slate-200 dark:border-slate-700 text-orange-600 dark:text-orange-400">警报阈值</th>
                            <th className="w-64 px-6 py-5 border-r border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400">数值演算案例</th>
                            <th className="w-96 px-6 py-5 text-red-700 dark:text-red-400">风险全景解读</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredIndicators.map(({ cat, sub, ind }, idx) => (
                            <tr key={ind.id} className={`group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-slate-50/20 dark:bg-slate-800/10'}`}>
                                <td className="px-6 py-4 font-mono text-[10px] font-black text-slate-400 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-inherit z-10">{ind.id}</td>
                                <td className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 sticky left-24 bg-inherit z-10">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-900 dark:text-white text-[12px] truncate group-hover:text-blue-600 transition-colors" title={ind.name}>{ind.name}</span>
                                        {!isCompact && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className={`w-1.5 h-1.5 rounded-full ${ind.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></span>
                                                <span className="text-[9px] text-slate-400 font-mono uppercase font-black">{cat.id} / {sub.id}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black ${
                                        ind.priority === 'P0' ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 
                                        ind.priority === 'P1' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 
                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    }`}>
                                        {ind.priority}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed ${isCompact ? 'truncate' : ''}`}>{ind.definition}</td>
                                <td className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed bg-blue-50/10 dark:bg-transparent">{ind.purpose}</td>
                                <td className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 font-mono text-[11px] text-indigo-500 dark:text-indigo-300 bg-indigo-50/10 dark:bg-transparent font-bold">{ind.formula}</td>
                                <td className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-[11px] font-black text-orange-600 dark:text-orange-400">{ind.threshold}</td>
                                <td className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-[11px] text-green-600 dark:text-green-500 font-medium">{ind.calculationCase}</td>
                                <td className="px-6 py-4 text-[11px] text-red-800 dark:text-red-300 font-medium leading-relaxed bg-red-50/5 dark:bg-transparent">{ind.riskInterpretation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}

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

        {activeTab === 'tutorial' && <TutorialView />}
      </main>

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
    </div>
  );
}

export default App;
