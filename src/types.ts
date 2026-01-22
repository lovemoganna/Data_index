export type Priority = 'P0' | 'P1' | 'P2';
export type Status = 'active' | 'inactive';
export type IndicatorType = 'base' | 'derived';
export type ReferenceType = 'depends_on' | 'used_by' | 'related_to' | 'calculated_from';

export interface IndicatorReference {
  targetId: string;        // 目标指标ID
  type: ReferenceType;     // 引用类型
  description?: string;    // 引用描述
}

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
  indicatorType: IndicatorType; // 指标性质：基础指标(base)或衍生指标(derived)
  references: IndicatorReference[]; // 双向链接：与其他指标的关系
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