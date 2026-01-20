export type Priority = 'P0' | 'P1' | 'P2';
export type Status = 'active' | 'inactive';

export interface Indicator {
  id: string;
  name: string;
  definition: string;         // 指标定义
  purpose: string;            // 指标作用
  formula: string;            // 指标计算公式
  threshold: string;          // 风险阈值
  calculationCase: string;    // 典型计算案例
  riskInterpretation: string; // 风险案例解读
  priority: Priority;
  status: Status;
}

export interface SubCategory {
  id: string;
  name: string;
  indicators: Indicator[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'cyan' | 'pink' | 'yellow';
  subcategories: SubCategory[];
}

export interface Stats {
  total: number;
  p0: number;
  p1: number;
  p2: number;
}

export type ExportFormat = 'json' | 'md' | 'csv' | 'org' | 'txt';