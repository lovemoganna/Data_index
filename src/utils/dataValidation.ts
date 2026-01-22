/**
 * 增强版数据验证工具
 * 提供更严格的数据质量检查和版本控制
 */

import { Category, SubCategory, Indicator, Priority } from '../types';
import logger from './logger';

// 数据验证规则接口
export interface ValidationRule<T = any> {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  validate: (data: T, context?: any) => ValidationResult;
  fix?: (data: T, context?: any) => T;
  category: 'structure' | 'content' | 'consistency' | 'completeness';
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  suggestion?: string;
  fixable: boolean;
}

export interface ValidationReport {
  timestamp: Date;
  totalItems: number;
  validItems: number;
  invalidItems: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  infos: ValidationIssue[];
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface ValidationIssue {
  id: string;
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  location: {
    categoryId?: string;
    subcategoryId?: string;
    indicatorId?: string;
  };
  fixable: boolean;
  data?: any;
}

// 数据版本控制接口
export interface DataVersion {
  id: string;
  timestamp: Date;
  author: string;
  description: string;
  data: Category[];
  checksum: string;
  parentVersion?: string;
  changes: VersionChange[];
}

export interface VersionChange {
  type: 'create' | 'update' | 'delete';
  entityType: 'category' | 'subcategory' | 'indicator';
  entityId: string;
  oldValue?: any;
  newValue?: any;
  description: string;
}

// 数据迁移接口
export interface MigrationResult {
  success: boolean;
  migratedData: Category[];
  issues: MigrationIssue[];
  statistics: {
    categoriesMigrated: number;
    subcategoriesMigrated: number;
    indicatorsMigrated: number;
    dataLoss: boolean;
  };
}

export interface MigrationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
  suggestion?: string;
}

class DataValidationService {
  private static readonly VALIDATION_RULES: ValidationRule[] = [
    // 结构验证规则
    {
      id: 'category_required_fields',
      name: '分类必填字段检查',
      description: '检查分类是否包含所有必需的字段',
      severity: 'error',
      category: 'structure',
      validate: (category: Category) => {
        const required = ['id', 'name', 'description', 'icon'];
        const missing = required.filter(field => !category[field as keyof Category]);

        if (missing.length > 0) {
          return {
            isValid: false,
            message: `分类缺少必需字段: ${missing.join(', ')}`,
            suggestion: '请填写所有必需的分类信息',
            fixable: true
          };
        }

        return { isValid: true, message: '分类结构完整', fixable: false };
      },
      fix: (category: Category) => ({
        ...category,
        name: category.name || '未命名分类',
        description: category.description || '暂无描述',
        icon: category.icon || 'Activity'
      })
    },

    {
      id: 'subcategory_required_fields',
      name: '子类必填字段检查',
      description: '检查子类是否包含所有必需的字段',
      severity: 'error',
      category: 'structure',
      validate: (subcategory: SubCategory, context?: { categoryId: string }) => {
        if (!subcategory.name || subcategory.name.trim().length === 0) {
          return {
            isValid: false,
            message: '子类名称不能为空',
            suggestion: '请为子类提供一个有意义的名称',
            fixable: true
          };
        }

        if (subcategory.indicators.length === 0) {
          return {
            isValid: false,
            message: '子类下没有指标',
            suggestion: '请为子类添加至少一个风险指标',
            fixable: false
          };
        }

        return { isValid: true, message: '子类结构完整', fixable: false };
      },
      fix: (subcategory: SubCategory) => ({
        ...subcategory,
        name: subcategory.name || '未命名子类'
      })
    },

    {
      id: 'indicator_required_fields',
      name: '指标必填字段检查',
      description: '检查指标是否包含所有必需的字段',
      severity: 'error',
      category: 'structure',
      validate: (indicator: Indicator) => {
        const required = ['id', 'name', 'definition', 'purpose'];
        const missing = required.filter(field => !indicator[field as keyof Indicator]);

        if (missing.length > 0) {
          return {
            isValid: false,
            message: `指标缺少必需字段: ${missing.join(', ')}`,
            suggestion: '请填写所有必需的指标信息',
            fixable: true
          };
        }

        return { isValid: true, message: '指标结构完整', fixable: false };
      },
      fix: (indicator: Indicator) => ({
        ...indicator,
        name: indicator.name || '未命名指标',
        definition: indicator.definition || '暂无定义',
        purpose: indicator.purpose || '暂无目的说明'
      })
    },

    // 内容质量验证规则
    {
      id: 'indicator_definition_quality',
      name: '指标定义质量检查',
      description: '检查指标定义的详细程度和清晰度',
      severity: 'warning',
      category: 'content',
      validate: (indicator: Indicator) => {
        const definition = indicator.definition || '';

        if (definition.length < 10) {
          return {
            isValid: false,
            message: '指标定义过于简短',
            suggestion: '请提供更详细的指标定义，至少包含业务含义和计算方式',
            fixable: true
          };
        }

        if (definition.length > 500) {
          return {
            isValid: false,
            message: '指标定义过长',
            suggestion: '请精简指标定义，保持在500字符以内',
            fixable: true
          };
        }

        return { isValid: true, message: '指标定义质量良好', fixable: false };
      },
      fix: (indicator: Indicator) => ({
        ...indicator,
        definition: indicator.definition?.length || 0 > 500
          ? indicator.definition!.substring(0, 500) + '...'
          : indicator.definition
      })
    },

    {
      id: 'formula_validity',
      name: '计算公式有效性检查',
      description: '检查指标的计算公式是否有效',
      severity: 'error',
      category: 'content',
      validate: (indicator: Indicator) => {
        const formula = indicator.formula || '';

        if (!formula || formula.trim().length === 0) {
          return {
            isValid: false,
            message: '缺少计算公式',
            suggestion: '请提供具体的计算公式或逻辑表达式',
            fixable: false
          };
        }

        // 检查是否包含基本的数学运算符
        const hasOperators = /[\+\-\*\/=<>!]/.test(formula);
        const hasNumbers = /\d/.test(formula);

        if (!hasOperators && !hasNumbers) {
          return {
            isValid: false,
            message: '计算公式格式不正确',
            suggestion: '请使用有效的数学表达式或逻辑公式',
            fixable: false
          };
        }

        return { isValid: true, message: '计算公式有效', fixable: false };
      }
    },

    {
      id: 'threshold_reasonableness',
      name: '阈值合理性检查',
      description: '检查风险阈值是否合理',
      severity: 'warning',
      category: 'content',
      validate: (indicator: Indicator) => {
        const threshold = indicator.threshold || '';

        if (!threshold || threshold.trim().length === 0) {
          return {
            isValid: false,
            message: '缺少风险阈值',
            suggestion: '请设定具体的风险阈值或范围',
            fixable: false
          };
        }

        // 检查是否包含数值
        if (!/\d/.test(threshold)) {
          return {
            isValid: false,
            message: '阈值应包含具体的数值',
            suggestion: '请在阈值中包含具体的数字或范围',
            fixable: false
          };
        }

        return { isValid: true, message: '阈值设置合理', fixable: false };
      }
    },

    // 一致性验证规则
    {
      id: 'id_uniqueness',
      name: 'ID唯一性检查',
      description: '检查所有实体的ID是否唯一',
      severity: 'error',
      category: 'consistency',
      validate: (data: Category[]) => {
        const allIds = new Set<string>();

        for (const category of data) {
          if (allIds.has(category.id)) {
            return {
              isValid: false,
              message: `分类ID重复: ${category.id}`,
              suggestion: '请确保所有分类ID唯一',
              fixable: true
            };
          }
          allIds.add(category.id);

          for (const subcategory of category.subcategories) {
            if (allIds.has(subcategory.id)) {
              return {
                isValid: false,
                message: `子类ID重复: ${subcategory.id}`,
                suggestion: '请确保所有子类ID唯一',
                fixable: true
              };
            }
            allIds.add(subcategory.id);

            for (const indicator of subcategory.indicators) {
              if (allIds.has(indicator.id)) {
                return {
                  isValid: false,
                  message: `指标ID重复: ${indicator.id}`,
                  suggestion: '请确保所有指标ID唯一',
                  fixable: true
                };
              }
              allIds.add(indicator.id);
            }
          }
        }

        return { isValid: true, message: '所有ID唯一', fixable: false };
      }
    },

    {
      id: 'priority_distribution',
      name: '优先级分布合理性检查',
      description: '检查不同优先级指标的分布是否合理',
      severity: 'info',
      category: 'consistency',
      validate: (data: Category[]) => {
        const priorities = { P0: 0, P1: 0, P2: 0 };

        data.forEach(category =>
          category.subcategories.forEach(subcategory =>
            subcategory.indicators.forEach(indicator =>
              priorities[indicator.priority]++
            )
          )
        );

        const total = priorities.P0 + priorities.P1 + priorities.P2;

        if (total === 0) return { isValid: true, message: '无指标数据', fixable: false };

        const p0Ratio = priorities.P0 / total;
        const p1Ratio = priorities.P1 / total;

        if (p0Ratio > 0.3) {
          return {
            isValid: false,
            message: `P0级指标占比过高 (${Math.round(p0Ratio * 100)}%)`,
            suggestion: '建议控制P0级指标在30%以内，适当调整优先级',
            fixable: false
          };
        }

        if (p0Ratio + p1Ratio < 0.1) {
          return {
            isValid: false,
            message: '高优先级指标过少',
            suggestion: '建议增加高优先级风险指标的覆盖',
            fixable: false
          };
        }

        return { isValid: true, message: '优先级分布合理', fixable: false };
      }
    },

    // 完整性验证规则
    {
      id: 'data_completeness',
      name: '数据完整性检查',
      description: '检查数据的整体完整性',
      severity: 'warning',
      category: 'completeness',
      validate: (data: Category[]) => {
        if (!data || data.length === 0) {
          return {
            isValid: false,
            message: '没有风险分类数据',
            suggestion: '请添加至少一个风险分类',
            fixable: false
          };
        }

        let totalIndicators = 0;
        data.forEach(category => {
          if (category.subcategories.length === 0) {
            return {
              isValid: false,
              message: `分类 "${category.name}" 下没有子类`,
              suggestion: '请为每个分类添加至少一个子类',
              fixable: false
            };
          }

          category.subcategories.forEach(subcategory => {
            totalIndicators += subcategory.indicators.length;
          });
        });

        if (totalIndicators === 0) {
          return {
            isValid: false,
            message: '系统中没有风险指标',
            suggestion: '请添加风险指标来构建完整的数据体系',
            fixable: false
          };
        }

        return { isValid: true, message: '数据结构完整', fixable: false };
      }
    }
  ];

  /**
   * 验证整个数据集
   */
  static validateData(data: Category[]): ValidationReport {
    const issues: ValidationIssue[] = [];
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const infos: ValidationIssue[] = [];

    let totalItems = 0;

    // 验证全局规则
    this.VALIDATION_RULES
      .filter(rule => rule.category === 'consistency' || rule.category === 'completeness')
      .forEach(rule => {
        const result = rule.validate(data);
        if (!result.isValid) {
          const issue: ValidationIssue = {
            id: `global-${rule.id}`,
            ruleId: rule.id,
            severity: rule.severity,
            message: result.message,
            suggestion: result.suggestion,
            location: {},
            fixable: result.fixable
          };
          issues.push(issue);
        }
      });

    // 验证每个分类
    data.forEach(category => {
      const categoryRules = this.VALIDATION_RULES.filter(rule =>
        rule.category === 'structure' && rule.id.includes('category')
      );

      categoryRules.forEach(rule => {
        const result = rule.validate(category);
        if (!result.isValid) {
          issues.push({
            id: `${category.id}-${rule.id}`,
            ruleId: rule.id,
            severity: rule.severity,
            message: result.message,
            suggestion: result.suggestion,
            location: { categoryId: category.id },
            fixable: result.fixable,
            data: category
          });
        }
      });

      // 验证每个子类
      category.subcategories.forEach(subcategory => {
        const subcategoryRules = this.VALIDATION_RULES.filter(rule =>
          rule.category === 'structure' && rule.id.includes('subcategory')
        );

        subcategoryRules.forEach(rule => {
          const result = rule.validate(subcategory, { categoryId: category.id });
          if (!result.isValid) {
            issues.push({
              id: `${subcategory.id}-${rule.id}`,
              ruleId: rule.id,
              severity: rule.severity,
              message: result.message,
              suggestion: result.suggestion,
              location: { categoryId: category.id, subcategoryId: subcategory.id },
              fixable: result.fixable,
              data: subcategory
            });
          }
        });

        // 验证每个指标
        subcategory.indicators.forEach(indicator => {
          totalItems++;

          const indicatorRules = this.VALIDATION_RULES.filter(rule =>
            rule.category !== 'consistency' && rule.category !== 'completeness'
          );

          indicatorRules.forEach(rule => {
            const result = rule.validate(indicator);
            if (!result.isValid) {
              issues.push({
                id: `${indicator.id}-${rule.id}`,
                ruleId: rule.id,
                severity: rule.severity,
                message: result.message,
                suggestion: result.suggestion,
                location: {
                  categoryId: category.id,
                  subcategoryId: subcategory.id,
                  indicatorId: indicator.id
                },
                fixable: result.fixable,
                data: indicator
              });
            }
          });
        });
      });
    });

    // 分类问题
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'error': errors.push(issue); break;
        case 'warning': warnings.push(issue); break;
        case 'info': infos.push(issue); break;
      }
    });

    const validItems = totalItems - errors.length;
    const score = totalItems > 0 ? Math.round((validItems / totalItems) * 100) : 0;

    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    return {
      timestamp: new Date(),
      totalItems,
      validItems,
      invalidItems: errors.length,
      errors,
      warnings,
      infos,
      score,
      grade
    };
  }

  /**
   * 自动修复可修复的问题
   */
  static autoFixData(data: Category[], issues: ValidationIssue[]): Category[] {
    let fixedData = [...data];

    issues.forEach(issue => {
      if (!issue.fixable) return;

      const rule = this.VALIDATION_RULES.find(r => r.id === issue.ruleId);
      if (!rule?.fix) return;

      const { categoryId, subcategoryId, indicatorId } = issue.location;

      if (indicatorId) {
        // 修复指标
        fixedData = fixedData.map(category => ({
          ...category,
          subcategories: category.subcategories.map(subcategory => ({
            ...subcategory,
            indicators: subcategory.indicators.map(indicator =>
              indicator.id === indicatorId ? rule.fix!(indicator) : indicator
            )
          }))
        }));
      } else if (subcategoryId) {
        // 修复子类
        fixedData = fixedData.map(category => ({
          ...category,
          subcategories: category.subcategories.map(subcategory =>
            subcategory.id === subcategoryId ? rule.fix!(subcategory) : subcategory
          )
        }));
      } else if (categoryId) {
        // 修复分类
        fixedData = fixedData.map(category =>
          category.id === categoryId ? rule.fix!(category) : category
        );
      }
    });

    return fixedData;
  }

  /**
   * 获取验证规则列表
   */
  static getValidationRules(): ValidationRule[] {
    return [...this.VALIDATION_RULES];
  }

  /**
   * 添加自定义验证规则
   */
  static addValidationRule(rule: ValidationRule): void {
    this.VALIDATION_RULES.push(rule);
  }
}

// 数据版本控制服务
export class DataVersionControl {
  private static readonly STORAGE_KEY = 'mece-data-versions';
  private static readonly MAX_VERSIONS = 50;

  /**
   * 创建新版本
   */
  static createVersion(
    data: Category[],
    author: string = 'System',
    description: string = '自动保存'
  ): DataVersion {
    const version: DataVersion = {
      id: this.generateVersionId(),
      timestamp: new Date(),
      author,
      description,
      data: JSON.parse(JSON.stringify(data)), // 深拷贝
      checksum: this.calculateChecksum(data),
      changes: []
    };

    this.saveVersion(version);
    return version;
  }

  /**
   * 获取版本历史
   */
  static getVersionHistory(): DataVersion[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const versions = JSON.parse(stored) as DataVersion[];
      return versions
        .map(v => ({ ...v, timestamp: new Date(v.timestamp) }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      logger.error('Failed to load version history', error);
      return [];
    }
  }

  /**
   * 恢复到指定版本
   */
  static restoreVersion(versionId: string): Category[] | null {
    const versions = this.getVersionHistory();
    const version = versions.find(v => v.id === versionId);

    if (!version) return null;

    // 验证数据完整性
    const checksum = this.calculateChecksum(version.data);
    if (checksum !== version.checksum) {
      logger.warn('Version data integrity check failed', { versionId });
      return null;
    }

    return version.data;
  }

  /**
   * 比较两个版本的差异
   */
  static compareVersions(versionId1: string, versionId2: string): VersionChange[] {
    const versions = this.getVersionHistory();
    const v1 = versions.find(v => v.id === versionId1);
    const v2 = versions.find(v => v.id === versionId2);

    if (!v1 || !v2) return [];

    const changes: VersionChange[] = [];

    // 简化比较逻辑 - 实际实现会更复杂
    // 这里只是示例实现

    return changes;
  }

  /**
   * 清理旧版本
   */
  static cleanupOldVersions(): void {
    const versions = this.getVersionHistory();

    if (versions.length > this.MAX_VERSIONS) {
      const toKeep = versions.slice(0, this.MAX_VERSIONS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toKeep));
    }
  }

  private static generateVersionId(): string {
    return `v${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private static calculateChecksum(data: Category[]): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return hash.toString();
  }

  private static saveVersion(version: DataVersion): void {
    try {
      const versions = this.getVersionHistory();
      versions.unshift(version);

      // 限制版本数量
      if (versions.length > this.MAX_VERSIONS) {
        versions.splice(this.MAX_VERSIONS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(versions));
    } catch (error) {
      logger.error('Failed to save version', error);
    }
  }
}

// 数据迁移服务
export class DataMigrationService {
  /**
   * 从旧格式迁移数据
   */
  static migrateFromLegacy(data: any): MigrationResult {
    const issues: MigrationIssue[] = [];
    const migratedData: Category[] = [];

    try {
      // 处理旧格式的数据迁移逻辑
      // 这里是示例实现，实际需要根据旧格式调整

      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          try {
            const category = this.migrateCategory(item, index);
            migratedData.push(category);
          } catch (error) {
            issues.push({
              severity: 'error',
              message: `迁移分类失败: ${error instanceof Error ? error.message : '未知错误'}`,
              location: `index ${index}`,
              suggestion: '检查数据格式是否正确'
            });
          }
        });
      } else {
        issues.push({
          severity: 'error',
          message: '数据格式不正确，期望数组格式',
          suggestion: '请提供正确的分类数组数据'
        });
      }

      const statistics = {
        categoriesMigrated: migratedData.length,
        subcategoriesMigrated: migratedData.reduce((sum, cat) => sum + cat.subcategories.length, 0),
        indicatorsMigrated: migratedData.reduce((sum, cat) =>
          sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.indicators.length, 0), 0
        ),
        dataLoss: issues.some(issue => issue.severity === 'error')
      };

      return {
        success: !statistics.dataLoss,
        migratedData,
        issues,
        statistics
      };
    } catch (error) {
      return {
        success: false,
        migratedData: [],
        issues: [{
          severity: 'error',
          message: `迁移过程出错: ${error instanceof Error ? error.message : '未知错误'}`,
          suggestion: '请检查数据文件格式'
        }],
        statistics: {
          categoriesMigrated: 0,
          subcategoriesMigrated: 0,
          indicatorsMigrated: 0,
          dataLoss: true
        }
      };
    }
  }

  private static migrateCategory(legacyCategory: any, index: number): Category {
    // 迁移分类数据的逻辑
    return {
      id: legacyCategory.id || `C${index + 1}`,
      name: legacyCategory.name || '未命名分类',
      description: legacyCategory.description || '暂无描述',
      icon: legacyCategory.icon || 'Activity',
      subcategories: legacyCategory.subcategories?.map((sub: any, subIndex: number) =>
        this.migrateSubcategory(sub, subIndex)
      ) || []
    };
  }

  private static migrateSubcategory(legacySubcategory: any, index: number): SubCategory {
    return {
      id: legacySubcategory.id || `S${index + 1}`,
      name: legacySubcategory.name || '未命名子类',
      indicators: legacySubcategory.indicators?.map((ind: any, indIndex: number) =>
        this.migrateIndicator(ind, indIndex)
      ) || []
    };
  }

  private static migrateIndicator(legacyIndicator: any, index: number): Indicator {
    return {
      id: legacyIndicator.id || `I${index + 1}`,
      name: legacyIndicator.name || '未命名指标',
      definition: legacyIndicator.definition || '',
      purpose: legacyIndicator.purpose || '',
      formula: legacyIndicator.formula || '',
      threshold: legacyIndicator.threshold || '',
      calculationCase: legacyIndicator.calculationCase || '',
      riskInterpretation: legacyIndicator.riskInterpretation || '',
      priority: legacyIndicator.priority || 'P2',
      status: legacyIndicator.status || 'active'
    };
  }
}

// 导出便捷函数
export const validateData = DataValidationService.validateData.bind(DataValidationService);
export const autoFixData = DataValidationService.autoFixData.bind(DataValidationService);
export const getValidationRules = DataValidationService.getValidationRules.bind(DataValidationService);
export const addValidationRule = DataValidationService.addValidationRule.bind(DataValidationService);

export const createVersion = DataVersionControl.createVersion.bind(DataVersionControl);
export const getVersionHistory = DataVersionControl.getVersionHistory.bind(DataVersionControl);
export const restoreVersion = DataVersionControl.restoreVersion.bind(DataVersionControl);
export const compareVersions = DataVersionControl.compareVersions.bind(DataVersionControl);

export const migrateFromLegacy = DataMigrationService.migrateFromLegacy.bind(DataMigrationService);
