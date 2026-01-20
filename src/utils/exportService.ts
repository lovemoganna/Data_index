import { Category, Indicator } from '../types';
import * as XLSX from 'xlsx';

const flattenData = (data: Category[]) => {
  const flat: any[] = [];
  data.forEach(cat => {
    cat.subcategories.forEach(sub => {
      sub.indicators.forEach(ind => {
        flat.push({
          CategoryID: cat.id,
          Category: cat.name,
          SubCategoryID: sub.id,
          SubCategory: sub.name,
          ID: ind.id,
          Name: ind.name,
          Priority: ind.priority,
          Status: ind.status,
          Definition: ind.definition,
          Purpose: ind.purpose,
          Formula: ind.formula,
          Threshold: ind.threshold,
          CalculationCase: ind.calculationCase,
          RiskInterpretation: ind.riskInterpretation
        });
      });
    });
  });
  return flat;
};

export const exportToJSON = (data: Category[]) => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, 'monitor_ontology_export.json', 'application/json');
};

export const exportToCSV = (data: Category[]) => {
  const flat = flattenData(data);
  if (flat.length === 0) return;
  
  const headers = Object.keys(flat[0]);
  const csvContent = [
    headers.join(','),
    ...flat.map(row => headers.map(fieldName => {
        const val = row[fieldName]?.toString().replace(/"/g, '""') || '';
        return `"${val}"`;
    }).join(','))
  ].join('\n');

  downloadFile('\uFEFF' + csvContent, 'monitor_ontology_export.csv', 'text/csv;charset=utf-8;');
};

export const exportToExcel = (data: Category[]) => {
  const flat = flattenData(data);
  if (flat.length === 0) return;

  // 创建工作簿
  const wb = XLSX.utils.book_new();

  // 创建主数据表
  const ws = XLSX.utils.json_to_sheet(flat);

  // 设置列宽
  const colWidths = [
    { wch: 10 }, // CategoryID
    { wch: 15 }, // Category
    { wch: 12 }, // SubCategoryID
    { wch: 15 }, // SubCategory
    { wch: 8 },  // ID
    { wch: 20 }, // Name
    { wch: 8 },  // Priority
    { wch: 8 },  // Status
    { wch: 25 }, // Definition
    { wch: 25 }, // Purpose
    { wch: 20 }, // Formula
    { wch: 15 }, // Threshold
    { wch: 20 }, // CalculationCase
    { wch: 30 }  // RiskInterpretation
  ];
  ws['!cols'] = colWidths;

  // 添加标题行样式（可选）
  const titleRow = [
    '分类ID', '分类名称', '子类ID', '子类名称', '指标ID', '指标名称',
    '优先级', '状态', '业务定义', '指标作用', '计算逻辑', '风险阈值',
    '计算案例', '风险解读'
  ];

  XLSX.utils.sheet_add_aoa(ws, [titleRow], { origin: 'A1' });

  // 将数据添加到第二行开始
  XLSX.utils.sheet_add_json(ws, flat, { origin: 'A2', skipHeader: true });

  XLSX.utils.book_append_sheet(wb, ws, '风险指标体系');

  // 生成Excel文件
  XLSX.writeFile(wb, 'monitor_ontology_export.xlsx');
};

export const exportToMarkdown = (data: Category[]) => {
  let content = `# 操纵行为监控指标体系报告\n\n导出于: ${new Date().toLocaleString()}\n\n`;

  data.forEach(cat => {
    content += `## [${cat.id}] ${cat.name}\n> ${cat.description}\n\n`;
    cat.subcategories.forEach(sub => {
      content += `### ${sub.id} ${sub.name}\n\n`;
      sub.indicators.forEach(ind => {
        content += `#### ${ind.id} ${ind.name} [${ind.priority}]\n`;
        content += `- **指标定义**: ${ind.definition}\n`;
        content += `- **指标作用**: ${ind.purpose}\n`;
        content += `- **计算逻辑**: \`${ind.formula}\`\n`;
        content += `- **风险阈值**: **${ind.threshold}**\n`;
        content += `- **典型案例**: *${ind.calculationCase}*\n`;
        content += `- **风险解读**: ${ind.riskInterpretation}\n\n`;
      });
    });
  });

  downloadFile(content, 'monitor_ontology_export.md', 'text/markdown');
};

const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};