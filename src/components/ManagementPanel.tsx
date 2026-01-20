
import React, { useState, useMemo, useRef } from 'react';
import { Category, Indicator, SubCategory } from '../types';
import { 
  Settings, Plus, Search, Trash2, RotateCcw, 
  ShieldAlert, Edit3, Filter, Database, ArrowRightLeft,
  LayoutTemplate, UploadCloud, Download, FileJson, FileText, Table
} from 'lucide-react';

interface Props {
  data: Category[];
  onEditIndicator: (catId: string, subId: string, indId: string) => void;
  onDeleteIndicator: (catId: string, subId: string, indId: string) => void;
  onAddIndicator: () => void;
  onAddCategory: () => void;
  onClearAll: () => void;
  onReset: () => void;
  onImport: (content: string, fileName: string) => void;
}

export const ManagementPanel: React.FC<Props> = ({ 
  data, onEditIndicator, onDeleteIndicator, onAddIndicator, onAddCategory, onClearAll, onReset, onImport 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const flatList = useMemo(() => {
    const list: any[] = [];
    data.forEach(c => c.subcategories.forEach(s => s.indicators.forEach(i => {
      list.push({ cat: c, sub: s, ind: i });
    })));
    return list.filter(item => 
      item.ind.name.includes(searchTerm) || item.ind.id.includes(searchTerm)
    );
  }, [data, searchTerm]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onImport(content, file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 顶部系统维护区 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="text-blue-500" size={24} /> 体系结构实验室
            </h2>
            <p className="text-sm text-slate-500 mt-1">在此管理风控本体结构、指标逻辑与系统级数据状态</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onReset}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} /> 恢复默认预设
            </button>
            <button 
              onClick={onClearAll}
              className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
            >
              <Trash2 size={16} /> 一键清空指标
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <button onClick={onAddCategory} className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group flex flex-col items-center text-center">
                <LayoutTemplate className="text-slate-400 group-hover:text-blue-500 mb-2" size={28} />
                <span className="font-bold text-slate-700 dark:text-slate-300">新增维度结构</span>
                <span className="text-[10px] text-slate-500">构建新的 MECE 本体顶层分类</span>
            </button>
            <button onClick={onAddIndicator} className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group flex flex-col items-center text-center">
                <Plus className="text-slate-400 group-hover:text-indigo-500 mb-2" size={28} />
                <span className="font-bold text-slate-700 dark:text-slate-300">新增监控指标</span>
                <span className="text-[10px] text-slate-500">在现有维度下挂载新的逻辑节点</span>
            </button>
            <button onClick={handleImportClick} className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group flex flex-col items-center text-center">
                <UploadCloud className="text-slate-400 group-hover:text-purple-500 mb-2" size={28} />
                <span className="font-bold text-slate-700 dark:text-slate-300">全能导入引擎</span>
                <span className="text-[10px] text-slate-500">支持 CSV, Markdown, Org, JSON</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json,.csv,.md,.txt,.org" 
                  onChange={handleFileChange} 
                />
                <div className="flex gap-1 mt-2">
                    <Table size={12} className="text-slate-400" />
                    <FileText size={12} className="text-slate-400" />
                    <FileJson size={12} className="text-slate-400" />
                </div>
            </button>
            <div className="p-4 bg-blue-600 rounded-2xl flex flex-col items-center text-center text-white justify-center shadow-lg shadow-blue-500/20">
                <ArrowRightLeft className="mb-2" size={28} />
                <span className="font-bold">数据同步状态</span>
                <span className="text-[10px] opacity-80">结构一致性: 100% (LOCAL)</span>
            </div>
        </div>
      </div>

      {/* 生产列表区 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
            <div className="relative w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="按名称或 ID 快速定位..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-tighter">Monitoring Node Capacity: <span className="text-blue-500 font-black">{flatList.length}</span></span>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">指标唯一识别码 (UID)</th>
                <th className="px-6 py-4">逻辑名称</th>
                <th className="px-6 py-4">所属本体路径</th>
                <th className="px-6 py-4">优先级</th>
                <th className="px-6 py-4 text-right">生产操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {flatList.map(({ cat, sub, ind }) => (
                <tr key={ind.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400">{ind.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{ind.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-bold">{cat.name}</span>
                        <ArrowRightLeft size={10} className="text-slate-300" />
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-bold">{sub.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${ind.priority === 'P0' ? 'text-red-500' : 'text-slate-500'}`}>{ind.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button onClick={() => onEditIndicator(cat.id, sub.id, ind.id)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"><Edit3 size={14}/></button>
                        <button onClick={() => onDeleteIndicator(cat.id, sub.id, ind.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {flatList.length === 0 && (
            <div className="py-20 flex flex-col items-center opacity-20 text-slate-500">
                <ShieldAlert size={64} />
                <span className="mt-4 font-bold text-xl uppercase tracking-tighter">System Empty</span>
                <p className="text-xs mt-2 italic">请点击上方按钮新增或导入指标</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
