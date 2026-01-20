import React, { useState, useEffect } from 'react';
import { Indicator, Priority, Category } from '../types';
import { X, ChevronRight, Hash, ShieldCheck, Zap, Info, Binary, Target, Lightbulb } from 'lucide-react';

interface Props {
  initialData?: Indicator;
  categories: Category[];
  initialCatId?: string;
  initialSubId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Indicator, catId: string, subId: string) => void;
}

export const IndicatorForm: React.FC<Props> = ({ 
  initialData, categories, initialCatId = '', initialSubId = '', isOpen, onClose, onSave 
}) => {
  const [selectedCatId, setSelectedCatId] = useState(initialCatId);
  const [selectedSubId, setSelectedSubId] = useState(initialSubId);
  
  const [formData, setFormData] = useState<Indicator>({
    id: '', 
    name: '', 
    definition: '', 
    purpose: '',
    formula: '', 
    threshold: '',
    calculationCase: '',
    riskInterpretation: '',
    priority: 'P1', 
    status: 'active'
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setSelectedCatId(initialCatId);
        setSelectedSubId(initialSubId);
      } else {
        const defCat = initialCatId || categories[0]?.id || '';
        const defSub = initialSubId || categories.find(c => c.id === defCat)?.subcategories[0]?.id || '';
        setSelectedCatId(defCat);
        setSelectedSubId(defSub);
        setFormData({
            id: '', name: '', definition: '', purpose: '', formula: '', threshold: '', calculationCase: '', riskInterpretation: '', priority: 'P1', status: 'active'
        });
      }
    }
  }, [isOpen, initialData, initialCatId, initialSubId, categories]);

  useEffect(() => {
    if (isOpen && !initialData && selectedSubId) {
        const cat = categories.find(c => c.id === selectedCatId);
        const sub = cat?.subcategories.find(s => s.id === selectedSubId);
        const count = sub?.indicators.length || 0;
        const newId = `${selectedSubId}-${(count + 1).toString().padStart(2, '0')}`;
        setFormData(prev => ({ ...prev, id: newId }));
    }
  }, [selectedCatId, selectedSubId, isOpen, initialData, categories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
            <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="text-blue-500" /> 指标逻辑生产台
                </h2>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">
                    <span>{selectedCatId || '...'}</span> <ChevronRight size={10} /> <span>{selectedSubId || '...'}</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"><X size={20}/></button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-wider">本体归属 (维度/子类)</label>
                    <div className="flex flex-col gap-2">
                        <select value={selectedCatId} onChange={e => setSelectedCatId(e.target.value)} disabled={!!initialData} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-xs">
                            {categories.map(c => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
                        </select>
                        <select value={selectedSubId} onChange={e => setSelectedSubId(e.target.value)} disabled={!!initialData} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-xs">
                            {categories.find(c => c.id === selectedCatId)?.subcategories.map(s => <option key={s.id} value={s.id}>{s.id} - {s.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-wider">指标 UID</label>
                    <div className="relative">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={formData.id} readOnly className="w-full pl-9 pr-4 py-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl font-mono text-xs border border-slate-200 dark:border-slate-700 outline-none text-slate-500" />
                    </div>
                </div>
                <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-wider">风险等级</label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Priority})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-xs">
                        <option value="P0">P0 - 实时阻断 (Critical)</option>
                        <option value="P1 - 核心审计 (High)">P1 - 核心审计 (High)</option>
                        <option value="P2 - 观测记录 (Low)">P2 - 观测记录 (Low)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Core Definition */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase mb-2 flex items-center gap-1.5"><Info size={12}/> 指标名称</label>
                        <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" placeholder="输入简洁明了的指标名称..." />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase mb-2 flex items-center gap-1.5"><Info size={12}/> 指标定义</label>
                        <textarea value={formData.definition} onChange={e => setFormData({...formData, definition: e.target.value})} rows={3} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none text-sm leading-relaxed" placeholder="清晰描述该指标监控的业务对象或行为..." />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase mb-2 flex items-center gap-1.5"><Target size={12}/> 指标作用</label>
                        <textarea value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} rows={3} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none text-sm leading-relaxed" placeholder="为什么要监控这个指标？防范什么风险？" />
                    </div>
                </div>

                {/* Right Column: Logic & Cases */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-indigo-500 uppercase mb-2 flex items-center gap-1.5"><Binary size={12}/> 计算逻辑 (Formula)</label>
                        <textarea value={formData.formula} onChange={e => setFormData({...formData, formula: e.target.value})} rows={3} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-mono text-xs" placeholder="数学公式或逻辑伪代码..." />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-orange-500 uppercase mb-2 flex items-center gap-1.5"><Zap size={12}/> 风险阈值 (Threshold)</label>
                        <input value={formData.threshold} onChange={e => setFormData({...formData, threshold: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold" placeholder="触发报警的临界条件..." />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-green-500 uppercase mb-2 flex items-center gap-1.5"><Lightbulb size={12}/> 典型计算案例</label>
                        <textarea value={formData.calculationCase} onChange={e => setFormData({...formData, calculationCase: e.target.value})} rows={2} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none text-xs leading-relaxed" placeholder="提供一个易于理解的数值计算实例..." />
                    </div>
                </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                <label className="text-[10px] font-black text-red-500 uppercase mb-2 flex items-center gap-1.5"><ShieldCheck size={12}/> 风险案例解读</label>
                <textarea value={formData.riskInterpretation} onChange={e => setFormData({...formData, riskInterpretation: e.target.value})} rows={3} className="w-full p-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 outline-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic" placeholder="结合实战场景，解释触发此风险后的业务逻辑影响..." />
            </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/20 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-800 transition-colors">放弃修改</button>
            <button onClick={() => onSave(formData, selectedCatId, selectedSubId)} className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-black shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">发布至本体库</button>
        </div>
      </div>
    </div>
  );
};