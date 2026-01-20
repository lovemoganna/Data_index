
import Dexie, { Table } from 'dexie';
import { Category, Indicator } from '../types';
import { INITIAL_DATA } from '../constants';
import { importService } from '../utils/importService';

// IndexedDB 数据库版本
const DB_VERSION = 1;
const DB_NAME = 'MECERiskOntologyDB';
const STORAGE_KEY = 'monitor_ontology_v2'; // 用于向后兼容的localStorage key

// 定义数据库表接口
interface DBCategory extends Category {
  id: string;
}

interface DBIndicator extends Indicator {
  id: string;
  categoryId: string;
  subcategoryId: string;
}

// 创建IndexedDB数据库实例
class MECERiskDB extends Dexie {
  categories!: Table<DBCategory>;
  indicators!: Table<DBIndicator>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      categories: 'id, name, color',
      indicators: 'id, categoryId, subcategoryId, priority, status, name'
    });
  }
}

// 创建数据库实例
const db = new MECERiskDB();

// 数据迁移函数：从localStorage迁移到IndexedDB
const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    // 检查是否已经迁移过
    const migrationKey = 'data_migration_completed';
    const alreadyMigrated = localStorage.getItem(migrationKey);

    if (alreadyMigrated) {
      console.log('数据已完成迁移');
      return;
    }

    // 尝试从localStorage读取数据
    const savedData = localStorage.getItem(STORAGE_KEY);
    let dataToMigrate: Category[] = INITIAL_DATA;

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dataToMigrate = parsed;
        }
      } catch (e) {
        console.warn('解析localStorage数据失败，使用默认数据', e);
      }
    }

    console.log('开始数据迁移到IndexedDB...', dataToMigrate.length, '个分类');

    // 清空现有数据
    await db.categories.clear();
    await db.indicators.clear();

    // 迁移分类和指标数据
    for (const category of dataToMigrate) {
      // 添加分类
      await db.categories.add({
        id: category.id,
        name: category.name,
        icon: category.icon,
        description: category.description,
        color: category.color,
        subcategories: category.subcategories
      });

      // 添加该分类下的所有指标
      for (const subcategory of category.subcategories) {
        for (const indicator of subcategory.indicators) {
          await db.indicators.add({
            ...indicator,
            categoryId: category.id,
            subcategoryId: subcategory.id
          });
        }
      }
    }

    // 标记迁移完成
    localStorage.setItem(migrationKey, 'true');
    console.log('✅ 数据迁移到IndexedDB完成');

  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    throw error;
  }
};

// 工具函数：从IndexedDB重建完整的数据结构
const rebuildDataFromDB = async (): Promise<Category[]> => {
  try {
    // 获取所有分类
    const categories = await db.categories.toArray();

    // 获取所有指标
    const indicators = await db.indicators.toArray();

    // 重建数据结构
    const result: Category[] = categories.map(category => {
      const categoryIndicators = indicators.filter(ind => ind.categoryId === category.id);

      // 按子类别分组指标
      const subcategoryMap = new Map<string, Indicator[]>();
      categoryIndicators.forEach(indicator => {
        const key = indicator.subcategoryId;
        if (!subcategoryMap.has(key)) {
          subcategoryMap.set(key, []);
        }
        subcategoryMap.get(key)!.push(indicator);
      });

      // 重建子类别结构
      const subcategories = category.subcategories.map(subcategory => ({
        ...subcategory,
        indicators: subcategoryMap.get(subcategory.id) || []
      }));

      return {
        ...category,
        subcategories
      };
    });

    return result.length > 0 ? result : INITIAL_DATA;
  } catch (error) {
    console.error('重建数据结构失败:', error);
    return INITIAL_DATA;
  }
};

export const dataService = {
  // 初始化数据库（在应用启动时调用）
  initialize: async (): Promise<void> => {
    try {
      await migrateFromLocalStorage();
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  },

  getAll: async (): Promise<Category[]> => {
    try {
      await dataService.initialize(); // 确保已初始化
      return await rebuildDataFromDB();
    } catch (e) {
      console.error("Failed to load data from IndexedDB", e);
      return INITIAL_DATA;
    }
  },

  saveAll: async (data: Category[]): Promise<void> => {
    try {
      await dataService.initialize();

      // 使用事务确保数据一致性
      await db.transaction('rw', db.categories, db.indicators, async () => {
        // 清空现有数据
        await db.categories.clear();
        await db.indicators.clear();

        // 保存新数据
        for (const category of data) {
          await db.categories.add({
            id: category.id,
            name: category.name,
            icon: category.icon,
            description: category.description,
            color: category.color,
            subcategories: category.subcategories
          });

          for (const subcategory of category.subcategories) {
            for (const indicator of subcategory.indicators) {
              await db.indicators.add({
                ...indicator,
                categoryId: category.id,
                subcategoryId: subcategory.id
              });
            }
          }
        }
      });

      console.log('✅ 数据保存到IndexedDB成功');
    } catch (e) {
      console.error("Failed to save data to IndexedDB", e);
      throw e;
    }
  },

  resetToDefault: async (): Promise<Category[]> => {
    try {
      await dataService.initialize();

      await db.transaction('rw', db.categories, db.indicators, async () => {
        await db.categories.clear();
        await db.indicators.clear();

        // 保存默认数据
        for (const category of INITIAL_DATA) {
          await db.categories.add({
            id: category.id,
            name: category.name,
            icon: category.icon,
            description: category.description,
            color: category.color,
            subcategories: category.subcategories
          });

          for (const subcategory of category.subcategories) {
            for (const indicator of subcategory.indicators) {
              await db.indicators.add({
                ...indicator,
                categoryId: category.id,
                subcategoryId: subcategory.id
              });
            }
          }
        }
      });

      return INITIAL_DATA;
    } catch (error) {
      console.error('重置默认数据失败:', error);
      throw error;
    }
  },

  clearAllIndicators: async (data: Category[]): Promise<Category[]> => {
    try {
      await dataService.initialize();

      // 只清空指标表，保留分类结构
      await db.indicators.clear();

      // 重建数据结构（指标为空）
      const newData = data.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          indicators: [] as Indicator[]
        }))
      }));

      return newData;
    } catch (error) {
      console.error('清空指标失败:', error);
      throw error;
    }
  },

  /**
   * 强化版验证并导入
   * 支持多格式解析
   */
  validateAndImport: async (content: string, fileName: string): Promise<Category[]> => {
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

      // 保存到IndexedDB
      await dataService.saveAll(imported);
      return imported;
    } catch (e: any) {
      console.error("Import failed", e);
      throw e;
    }
  },

  // 兼容性方法：同步版本（用于现有代码）
  getAllSync: (): Category[] => {
    // 这是一个临时的兼容性方法，会被逐步淘汰
    console.warn('使用同步方法 getAllSync，这可能会导致性能问题。请使用异步方法 getAll()');
    return INITIAL_DATA;
  },

  saveAllSync: (data: Category[]): void => {
    // 这是一个临时的兼容性方法，会被逐步淘汰
    console.warn('使用同步方法 saveAllSync，这可能会导致性能问题。请使用异步方法 saveAll()');
    // 异步保存，但不等待
    dataService.saveAll(data).catch(e => console.error('异步保存失败:', e));
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
