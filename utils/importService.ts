
import { Category, SubCategory, Indicator, Priority, Status } from '../types';

/**
 * 全能导入解析引擎
 * 能够将扁平化或半结构化的文本恢复为嵌套的本体模型
 */
export const importService = {
  
  parseContent: (content: string, fileName: string): Category[] => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (ext === 'json') return JSON.parse(content);
    if (ext === 'csv') return parseCSV(content);
    if (ext === 'md' || ext === 'txt' || ext === 'org') return parseTextBased(content);
    
    throw new Error('不支持的文件格式');
  }
};

/**
 * 解析 CSV (Excel 兼容格式)
 */
function parseCSV(csv: string): Category[] {
  const lines = csv.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const categories: Category[] = [];

  for (let i = 1; i < lines.length; i++) {
    // 处理带引号的 CSV 列
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
    
    const row: any = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

    // 查找或创建维度
    let cat = categories.find(c => c.id === row.CategoryID);
    if (!cat && row.CategoryID) {
      cat = {
        id: row.CategoryID,
        name: row.Category || '未命名维度',
        icon: 'Activity',
        description: '',
        color: 'blue',
        subcategories: []
      };
      categories.push(cat);
    }

    if (cat) {
      // 查找或创建子类
      let sub = cat.subcategories.find(s => s.id === row.SubCategoryID);
      if (!sub && row.SubCategoryID) {
        sub = {
          id: row.SubCategoryID,
          name: row.SubCategory || '未命名子类',
          indicators: []
        };
        cat.subcategories.push(sub);
      }

      if (sub && row.ID) {
        const ind: Indicator = {
          id: row.ID,
          name: row.Name || '未知指标',
          definition: row.Definition || '',
          purpose: row.Purpose || '',
          formula: row.Formula || '',
          threshold: row.Threshold || '',
          calculationCase: row.CalculationCase || '',
          riskInterpretation: row.RiskInterpretation || '',
          priority: (row.Priority || 'P1') as Priority,
          status: (row.Status || 'active') as Status
        };
        sub.indicators.push(ind);
      }
    }
  }
  return categories;
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
