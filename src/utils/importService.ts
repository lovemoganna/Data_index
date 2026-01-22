
import { Category, SubCategory, Indicator, Priority, Status } from '../types';

// 导入配置接口
export interface ImportConfig {
  validateData?: boolean;
  skipInvalidRows?: boolean;
  autoGenerateIds?: boolean;
  preserveExistingData?: boolean;
  onProgress?: (progress: number, message: string) => void;
}

// 导入结果接口
export interface ImportResult {
  success: boolean;
  data: Category[];
  errors: ImportError[];
  warnings: ImportWarning[];
  stats: {
    categoriesImported: number;
    subcategoriesImported: number;
    indicatorsImported: number;
    totalRows: number;
    skippedRows: number;
  };
}

// 导入错误接口
export interface ImportError {
  row: number;
  column?: string;
  message: string;
  severity: 'error' | 'warning';
}

// 导入警告接口
export interface ImportWarning {
  row: number;
  message: string;
  suggestion?: string;
}

/**
 * 全能导入解析引擎
 * 能够将扁平化或半结构化的文本恢复为嵌套的本体模型
 */
export const importService = {

  /**
   * 增强版解析内容，支持配置和进度回调
   */
  parseContent: (content: string, fileName: string, config: ImportConfig = {}): ImportResult => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    try {
      let data: Category[];

      config.onProgress?.(10, '开始解析文件...');

      switch (ext) {
        case 'json':
          data = parseJSON(content, config);
          break;
        case 'csv':
          data = parseCSV(content, config);
          break;
        case 'xlsx':
        case 'xls':
          data = parseExcel(content, config);
          break;
        case 'md':
        case 'txt':
        case 'org':
          data = parseTextBased(content, config);
          break;
        default:
          throw new Error(`不支持的文件格式: ${ext}`);
      }

      config.onProgress?.(80, '验证数据结构...');

      // 数据验证
      const result = validateAndProcessData(data, config);
      config.onProgress?.(100, '导入完成');

      return result;

    } catch (error: any) {
      return {
        success: false,
        data: [],
        errors: [{
          row: 0,
          message: error.message || '解析失败',
          severity: 'error'
        }],
        warnings: [],
        stats: {
          categoriesImported: 0,
          subcategoriesImported: 0,
          indicatorsImported: 0,
          totalRows: 0,
          skippedRows: 0
        }
      };
    }
  },

  /**
   * 导出数据为多种格式
   */
  exportData: (data: Category[], format: 'json' | 'csv' | 'xlsx' | 'md' | 'txt', options: any = {}): string | Blob => {
    switch (format) {
      case 'json':
        return exportToJSON(data, options);
      case 'csv':
        return exportToCSV(data, options);
      case 'xlsx':
        return exportToExcel(data, options);
      case 'md':
        return exportToMarkdown(data, options);
      case 'txt':
        return exportToText(data, options);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  },

  /**
   * 验证导入数据的质量
   */
  validateImportData: (data: Category[]): { isValid: boolean; errors: string[]; warnings: string[] } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查基本结构
    if (!Array.isArray(data)) {
      errors.push('数据必须是数组格式');
      return { isValid: false, errors, warnings };
    }

    data.forEach((category, catIndex) => {
      // 验证分类
      if (!category.id || !category.name) {
        errors.push(`分类 ${catIndex + 1}: 缺少必需的 id 或 name 字段`);
      }

      if (!Array.isArray(category.subcategories)) {
        errors.push(`分类 ${category.id}: subcategories 必须是数组`);
      } else {
        category.subcategories.forEach((subcategory, subIndex) => {
          // 验证子类
          if (!subcategory.id || !subcategory.name) {
            errors.push(`子类 ${subcategory.id || subIndex + 1}: 缺少必需的 id 或 name 字段`);
          }

          if (!Array.isArray(subcategory.indicators)) {
            errors.push(`子类 ${subcategory.id}: indicators 必须是数组`);
          } else {
            subcategory.indicators.forEach((indicator, indIndex) => {
              // 验证指标
              if (!indicator.id || !indicator.name) {
                errors.push(`指标 ${indicator.id || indIndex + 1}: 缺少必需的 id 或 name 字段`);
              }

              // 检查优先级
              if (!['P0', 'P1', 'P2'].includes(indicator.priority)) {
                warnings.push(`指标 ${indicator.id}: 优先级 ${indicator.priority} 无效，使用默认值 P1`);
              }
            });
          }
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
};

/**
 * 解析 JSON 格式
 */
function parseJSON(json: string, config: ImportConfig): Category[] {
  try {
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    throw new Error('JSON 格式错误，请检查文件内容');
  }
}

/**
 * 解析 CSV (Excel 兼容格式)
 */
function parseCSV(csv: string, config: ImportConfig): Category[] {
  const lines = csv.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV 文件至少需要表头和一行数据');
  }

  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const categories: Category[] = [];
  const errors: ImportError[] = [];
  const warnings: ImportWarning[] = [];

  config.onProgress?.(20, '解析 CSV 数据...');

  for (let i = 1; i < lines.length; i++) {
    try {
      // 处理带引号的 CSV 列
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(v =>
        v.replace(/^"|"$/g, '').replace(/""/g, '"')
      ) || [];

      if (values.length === 0) continue;

      const row: any = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

      // 数据验证
      if (!row.ID && !row.Name) {
        if (config.skipInvalidRows) {
          warnings.push({
            row: i + 1,
            message: '跳过空行或无效数据行'
          });
          continue;
        } else {
          errors.push({
            row: i + 1,
            message: '缺少指标 ID 或名称',
            severity: 'error'
          });
          continue;
        }
      }

      // 查找或创建维度
      let cat = categories.find(c => c.id === row.CategoryID || c.id === row.Category);
      if (!cat && (row.CategoryID || row.Category)) {
        cat = {
          id: row.CategoryID || row.Category || `CAT_${categories.length + 1}`,
          name: row.CategoryName || row.Category || '未命名维度',
          icon: row.Icon || 'Activity',
          description: row.CategoryDescription || '',
          color: (row.Color || 'blue') as any,
          subcategories: []
        };
        categories.push(cat);
      }

      if (cat) {
        // 查找或创建子类
        let sub = cat.subcategories.find(s => s.id === row.SubCategoryID || s.id === row.SubCategory);
        if (!sub && (row.SubCategoryID || row.SubCategory)) {
          sub = {
            id: row.SubCategoryID || row.SubCategory || `SUB_${cat.subcategories.length + 1}`,
            name: row.SubCategoryName || row.SubCategory || '未命名子类',
            indicators: []
          };
          cat.subcategories.push(sub);
        }

        if (sub) {
          const indicatorId = row.ID || row.IndicatorID || (config.autoGenerateIds ? `IND_${sub.indicators.length + 1}` : '');

          if (indicatorId) {
            const ind: Indicator = {
              id: indicatorId,
              name: row.Name || row.IndicatorName || '未知指标',
              definition: row.Definition || row.Description || '',
              purpose: row.Purpose || row.Objective || '',
              formula: row.Formula || row.Calculation || '',
              threshold: row.Threshold || row.Limit || '',
              calculationCase: row.CalculationCase || row.Example || '',
              riskInterpretation: row.RiskInterpretation || row.Interpretation || '',
              priority: (row.Priority || 'P1') as Priority,
              status: (row.Status || 'active') as Status
            };
            sub.indicators.push(ind);
          }
        }
      }

      // 进度更新
      if (i % 100 === 0) {
        config.onProgress?.(20 + (i / lines.length) * 50, `已处理 ${i}/${lines.length - 1} 行数据`);
      }

    } catch (error: any) {
      errors.push({
        row: i + 1,
        message: `解析失败: ${error.message}`,
        severity: 'error'
      });
    }
  }

  if (errors.length > 0 && !config.skipInvalidRows) {
    throw new Error(`CSV 解析失败: ${errors.map(e => `第${e.row}行: ${e.message}`).join('; ')}`);
  }

  return categories;
}

/**
 * 解析 Excel 文件 (简化版，实际需要 xlsx 库)
 */
function parseExcel(content: string, config: ImportConfig): Category[] {
  // 这里需要实际的 Excel 解析库
  // 暂时抛出错误，提示用户使用 CSV 格式
  throw new Error('Excel 文件解析需要额外依赖，请使用 CSV 格式或联系开发团队');
}

/**
 * 解析基于文本的结构 (Markdown, Org-mode, Plain Text)
 */
function parseTextBased(text: string): Category[] {
  const lines = text.split('\n');
  const categories: Category[] = [];
  let currentCat: Category | null = null;
  let currentSub: SubCategory | null = null;
  let currentInd: Indicator | null = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // 维度识别: ## [A] 账号维度 或 * [A] 账号维度
    const catMatch = trimmed.match(/^(?:##\s*\[|#\s*\[|\*\s*\[)([^\]]+)\]\s*(.*)/) || trimmed.match(/^(?:##|#|\*)\s*([A-Z])\s+(.*)/);
    if (catMatch) {
      currentCat = {
        id: catMatch[1],
        name: catMatch[2],
        icon: 'Activity',
        description: '',
        color: 'blue',
        subcategories: []
      };
      categories.push(currentCat);
      currentSub = null;
      currentInd = null;
      return;
    }

    // 子类识别: ### A1 账户成熟度 或 ** A1 账户成熟度
    const subMatch = trimmed.match(/^(?:###\s*|\*\*\s*)([A-Z][0-9])\s+(.*)/);
    if (subMatch && currentCat) {
      currentSub = {
        id: subMatch[1],
        name: subMatch[2],
        indicators: []
      };
      currentCat.subcategories.push(currentSub);
      currentInd = null;
      return;
    }

    // 指标识别: #### A1-01 名称 [P0] 或 *** A1-01 名称
    const indMatch = trimmed.match(/^(?:####\s*|\*\*\*\s*)([A-Z0-9-]{4,})\s+(.*?)(?:\s+\[(P[0-2])\])?$/);
    if (indMatch && currentSub) {
      currentInd = {
        id: indMatch[1],
        name: indMatch[2],
        definition: '',
        purpose: '',
        formula: '',
        threshold: '',
        calculationCase: '',
        riskInterpretation: '',
        priority: (indMatch[3] || 'P1') as Priority,
        status: 'active'
      };
      currentSub.indicators.push(currentInd);
      return;
    }

    // 属性识别: - **指标定义**: 内容
    if (currentInd) {
      const attrMatch = trimmed.match(/^[-*]\s*\*\*(.*?)\*\*[:：]\s*(.*)/) || trimmed.match(/^[-*]\s*(.*?)\s*[:：]\s*(.*)/);
      if (attrMatch) {
        const key = attrMatch[1].trim();
        const val = attrMatch[2].trim();
        if (key.includes('定义')) currentInd.definition = val;
        else if (key.includes('作用')) currentInd.purpose = val;
        else if (key.includes('逻辑') || key.includes('计算')) currentInd.formula = val;
        else if (key.includes('阈值')) currentInd.threshold = val;
        else if (key.includes('案例')) currentInd.calculationCase = val;
        else if (key.includes('解读')) currentInd.riskInterpretation = val;
      }
    }
  });

  return categories;
}

/**
 * 数据验证和处理
 */
function validateAndProcessData(data: Category[], config: ImportConfig): ImportResult {
  const errors: ImportError[] = [];
  const warnings: ImportWarning[] = [];
  let categoriesImported = 0;
  let subcategoriesImported = 0;
  let indicatorsImported = 0;
  let totalRows = 0;
  let skippedRows = 0;

  // 基本结构验证
  if (!Array.isArray(data)) {
    errors.push({
      row: 0,
      message: '数据必须是数组格式',
      severity: 'error'
    });
    return {
      success: false,
      data: [],
      errors,
      warnings,
      stats: { categoriesImported: 0, subcategoriesImported: 0, indicatorsImported: 0, totalRows: 0, skippedRows: 0 }
    };
  }

  data.forEach((category, catIndex) => {
    totalRows++;

    // 验证分类
    if (!category.id) {
      if (config.autoGenerateIds) {
        category.id = `CAT_${catIndex + 1}`;
        warnings.push({
          row: catIndex + 1,
          message: '自动生成分类 ID',
          suggestion: '建议手动设置有意义的 ID'
        });
      } else {
        errors.push({
          row: catIndex + 1,
          column: 'id',
          message: '分类缺少必需的 id 字段',
          severity: 'error'
        });
        if (config.skipInvalidRows) {
          skippedRows++;
          return;
        }
      }
    }

    if (!category.name) {
      category.name = `未命名分类 ${category.id}`;
      warnings.push({
        row: catIndex + 1,
        message: '自动填充分类名称',
        suggestion: '建议设置有意义的分类名称'
      });
    }

    // 设置默认值
    category.icon = category.icon || 'Activity';
    category.description = category.description || '';
    category.color = category.color || 'blue';
    category.subcategories = category.subcategories || [];

    categoriesImported++;

    // 验证子类
    category.subcategories.forEach((subcategory, subIndex) => {
      if (!subcategory.id) {
        if (config.autoGenerateIds) {
          subcategory.id = `${category.id}_${subIndex + 1}`;
          warnings.push({
            row: catIndex + 1,
            message: `自动生成子类 ID: ${subcategory.id}`,
            suggestion: '建议手动设置有意义的子类 ID'
          });
        } else {
          errors.push({
            row: catIndex + 1,
            column: `subcategories[${subIndex}].id`,
            message: '子类缺少必需的 id 字段',
            severity: 'error'
          });
          return;
        }
      }

      if (!subcategory.name) {
        subcategory.name = `未命名子类 ${subcategory.id}`;
        warnings.push({
          row: catIndex + 1,
          message: '自动填充子类名称',
          suggestion: '建议设置有意义的子类名称'
        });
      }

      subcategory.indicators = subcategory.indicators || [];
      subcategoriesImported++;

      // 验证指标
      subcategory.indicators.forEach((indicator, indIndex) => {
        if (!indicator.id) {
          if (config.autoGenerateIds) {
            indicator.id = `${subcategory.id}_${indIndex + 1}`;
            warnings.push({
              row: catIndex + 1,
              message: `自动生成指标 ID: ${indicator.id}`,
              suggestion: '建议手动设置有意义的指标 ID'
            });
          } else {
            errors.push({
              row: catIndex + 1,
              column: `subcategories[${subIndex}].indicators[${indIndex}].id`,
              message: '指标缺少必需的 id 字段',
              severity: 'error'
            });
            return;
          }
        }

        if (!indicator.name) {
          indicator.name = `未命名指标 ${indicator.id}`;
          warnings.push({
            row: catIndex + 1,
            message: '自动填充指标名称',
            suggestion: '建议设置有意义的指标名称'
          });
        }

        // 设置默认值
        indicator.definition = indicator.definition || '';
        indicator.purpose = indicator.purpose || '';
        indicator.formula = indicator.formula || '';
        indicator.threshold = indicator.threshold || '';
        indicator.calculationCase = indicator.calculationCase || '';
        indicator.riskInterpretation = indicator.riskInterpretation || '';
        indicator.priority = indicator.priority || 'P1';
        indicator.status = indicator.status || 'active';

        // 验证优先级
        if (!['P0', 'P1', 'P2'].includes(indicator.priority)) {
          warnings.push({
            row: catIndex + 1,
            message: `指标 ${indicator.id} 的优先级 ${indicator.priority} 无效，已重置为 P1`,
            suggestion: '优先级应为 P0、P1 或 P2'
          });
          indicator.priority = 'P1';
        }

        indicatorsImported++;
      });
    });
  });

  const success = errors.length === 0 || config.skipInvalidRows;

  return {
    success,
    data: success ? data : [],
    errors,
    warnings,
    stats: {
      categoriesImported,
      subcategoriesImported,
      indicatorsImported,
      totalRows,
      skippedRows
    }
  };
}

/**
 * 导出为 JSON 格式
 */
function exportToJSON(data: Category[], options: any = {}): string {
  return JSON.stringify(data, null, options.pretty ? 2 : 0);
}

/**
 * 导出为 CSV 格式
 */
function exportToCSV(data: Category[], options: any = {}): string {
  const headers = [
    'CategoryID', 'CategoryName', 'CategoryDescription', 'Icon', 'Color',
    'SubCategoryID', 'SubCategoryName',
    'ID', 'Name', 'Definition', 'Purpose', 'Formula', 'Threshold', 'CalculationCase', 'RiskInterpretation', 'Priority', 'Status'
  ];

  const rows: string[] = [headers.join(',')];

  data.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.indicators.forEach(indicator => {
        const row = [
          category.id,
          `"${category.name.replace(/"/g, '""')}"`,
          `"${category.description.replace(/"/g, '""')}"`,
          category.icon,
          category.color,
          subcategory.id,
          `"${subcategory.name.replace(/"/g, '""')}"`,
          indicator.id,
          `"${indicator.name.replace(/"/g, '""')}"`,
          `"${indicator.definition.replace(/"/g, '""')}"`,
          `"${indicator.purpose.replace(/"/g, '""')}"`,
          `"${indicator.formula.replace(/"/g, '""')}"`,
          `"${indicator.threshold.replace(/"/g, '""')}"`,
          `"${indicator.calculationCase.replace(/"/g, '""')}"`,
          `"${indicator.riskInterpretation.replace(/"/g, '""')}"`,
          indicator.priority,
          indicator.status
        ];
        rows.push(row.join(','));
      });
    });
  });

  return rows.join('\n');
}

/**
 * 导出为 Excel 格式 (简化版)
 */
function exportToExcel(data: Category[], options: any = {}): Blob {
  // 这里需要实际的 Excel 生成库
  // 暂时返回 CSV 作为 Blob
  const csvContent = exportToCSV(data, options);
  return new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * 导出为 Markdown 格式
 */
function exportToMarkdown(data: Category[], options: any = {}): string {
  let content = '# MECE 风险本体体系\n\n';

  data.forEach(category => {
    content += `## [${category.id}] ${category.name}\n\n`;
    if (category.description) {
      content += `${category.description}\n\n`;
    }

    category.subcategories.forEach(subcategory => {
      content += `### ${subcategory.id} ${subcategory.name}\n\n`;

      subcategory.indicators.forEach(indicator => {
        content += `#### ${indicator.id} ${indicator.name} [${indicator.priority}]\n\n`;

        if (indicator.definition) content += `- **指标定义**: ${indicator.definition}\n`;
        if (indicator.purpose) content += `- **指标作用**: ${indicator.purpose}\n`;
        if (indicator.formula) content += `- **计算逻辑**: ${indicator.formula}\n`;
        if (indicator.threshold) content += `- **风险阈值**: ${indicator.threshold}\n`;
        if (indicator.calculationCase) content += `- **数值案例**: ${indicator.calculationCase}\n`;
        if (indicator.riskInterpretation) content += `- **风险解读**: ${indicator.riskInterpretation}\n`;

        content += `- **状态**: ${indicator.status}\n\n`;
      });
    });
  });

  return content;
}

/**
 * 导出为纯文本格式
 */
function exportToText(data: Category[], options: any = {}): string {
  let content = 'MECE 风险本体体系\n\n';

  data.forEach(category => {
    content += `[${category.id}] ${category.name}\n`;
    if (category.description) {
      content += `描述: ${category.description}\n`;
    }
    content += '\n';

    category.subcategories.forEach(subcategory => {
      content += `  ${subcategory.id} ${subcategory.name}\n\n`;

      subcategory.indicators.forEach(indicator => {
        content += `    ${indicator.id} ${indicator.name} [${indicator.priority}]\n`;

        if (indicator.definition) content += `    定义: ${indicator.definition}\n`;
        if (indicator.purpose) content += `    作用: ${indicator.purpose}\n`;
        if (indicator.formula) content += `    计算: ${indicator.formula}\n`;
        if (indicator.threshold) content += `    阈值: ${indicator.threshold}\n`;
        if (indicator.calculationCase) content += `    案例: ${indicator.calculationCase}\n`;
        if (indicator.riskInterpretation) content += `    解读: ${indicator.riskInterpretation}\n`;
        content += `    状态: ${indicator.status}\n\n`;
      });
    });
  });

  return content;
}
