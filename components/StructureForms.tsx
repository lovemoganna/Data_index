import React, { useState, useEffect } from 'react';
import { Category, SubCategory } from '../types';
import { X, Save,  Activity, Users, TrendingUp, BarChart3, Layers, Link, Clock, Shield, AlertTriangle, Zap } from 'lucide-react';

// --- Category Form ---

interface CategoryFormProps {
  initialData?: Category;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Category) => void;
}

const ICONS = [
  { name: 'Users', icon: Users },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Activity', icon: Activity },
  { name: 'BarChart3', icon: BarChart3 },
  { name: 'Layers', icon: Layers },
  { name: 'Link', icon: Link },
  { name: 'Clock', icon: Clock },
  { name: 'Shield', icon: Shield },
  { name: 'AlertTriangle', icon: AlertTriangle },
  { name: 'Zap', icon: Zap },
];

const COLORS = [
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'purple', class: 'bg-purple-500' },
  { name: 'red', class: 'bg-red-500' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'cyan', class: 'bg-cyan-500' },
  { name: 'pink', class: 'bg-pink-500' },
  { name: 'yellow', class: 'bg-yellow-500' },
];

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Category>({
    id: '',
    name: '',
    icon: 'Activity',
    description: '',
    color: 'blue',
    subcategories: []
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          id: '',
          name: '',
          icon: 'Activity',
          description: '',
          color: 'blue',
          subcategories: []
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{initialData ? '编辑维度' : '新增维度'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-4 gap-4">
             <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ID</label>
                <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-blue-500" placeholder="如 G" />
             </div>
             <div className="col-span-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">维度名称</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-blue-500" placeholder="如 社交舆情维度" />
             </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">选择图标</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(i => (
                <button
                  key={i.name}
                  type="button"
                  onClick={() => setFormData({...formData, icon: i.name})}
                  className={`p-2 rounded-lg transition-all ${formData.icon === i.name ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-50 dark:bg-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                >
                  <i.icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">主题颜色</label>
             <div className="flex gap-2">
                {COLORS.map(c => (
                   <button
                    key={c.name}
                    type="button"
                    onClick={() => setFormData({...formData, color: c.name as any})}
                    className={`w-6 h-6 rounded-full ${c.class} transition-transform ${formData.color === c.name ? 'scale-125 ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-800' : 'hover:scale-110'}`}
                   />
                ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">描述</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-blue-500" placeholder="该维度的具体含义..." />
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">取消</button>
             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30">保存维度</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- SubCategory Form ---

interface SubCategoryFormProps {
  initialData?: SubCategory;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SubCategory) => void;
  parentId: string;
}

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({ initialData, isOpen, onClose, onSave, parentId }) => {
  const [formData, setFormData] = useState<SubCategory>({
    id: '',
    name: '',
    indicators: []
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                id: `${parentId}1`, // Simple suggestion logic could be improved
                name: '',
                indicators: []
            });
        }
    }
  }, [isOpen, initialData, parentId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{initialData ? '编辑子类' : '新增子类'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">子类编号</label>
            <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-blue-500" placeholder="如 A1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">子类名称</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-blue-500" placeholder="如 基础账户属性" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">取消</button>
             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30">保存子类</button>
          </div>
        </form>
      </div>
    </div>
  );
};
