import { Category, Indicator } from '../types';

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