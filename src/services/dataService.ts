
import { Category, Indicator } from '../types';
import { INITIAL_DATA } from '../constants';
import { importService } from '../utils/importService';

const STORAGE_KEY = 'monitor_ontology_v2';

export const dataService = {
  getAll: (): Category[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return INITIAL_DATA;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DATA;
    } catch (e) {
      console.error("Failed to load data from storage", e);
      return INITIAL_DATA;
    }
  },

  saveAll: (data: Category[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save data to storage", e);
    }
  },

  resetToDefault: (): Category[] => {
    const data = [...INITIAL_DATA];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  clearAllIndicators: (data: Category[]): Category[] => {
    const newData = data.map(cat => ({
      ...cat,
      subcategories: cat.subcategories.map(sub => ({
        ...sub,
        indicators: [] as Indicator[]
      }))
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  },

  /**
   * 强化版验证并导入
   * 支持多格式解析
   */
  validateAndImport: (content: string, fileName: string): Category[] => {
    try {
      const imported = importService.parseContent(content, fileName);
      
      if (!Array.isArray(imported) || imported.length === 0) {
        throw new Error("解析后的数据为空或格式不正确");
      }
      
      // 深度校验结构合法性
      const isValid = imported.every(cat => 
        cat.id && cat.name && Array.isArray(cat.subcategories)
      );

      if (!isValid) throw new Error("本体结构校验未通过，请检查维度与子类层级");
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
      return imported;
    } catch (e: any) {
      console.error("Import failed", e);
      throw e;
    }
  },

  deleteIndicator: (data: Category[], catId: string, subId: string, indId: string): Category[] => {
    return data.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            indicators: sub.indicators.filter(ind => ind.id !== indId)
          };
        })
      };
    });
  },

  upsertIndicator: (data: Category[], indicator: Indicator, catId: string, subId: string, isNew: boolean): Category[] => {
    return data.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.id !== subId) return sub;
          let newIndicators;
          if (isNew) {
            newIndicators = [...sub.indicators, indicator];
          } else {
            newIndicators = sub.indicators.map(ind => ind.id === indicator.id ? indicator : ind);
          }
          return {
            ...sub,
            indicators: newIndicators
          };
        })
      };
    });
  }
};
