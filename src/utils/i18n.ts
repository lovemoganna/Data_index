/**
 * 国际化工具类
 * 支持多语言切换和本地化
 */

import logger from './logger';

export type Language = 'zh-CN' | 'en-US' | 'zh-TW';

export interface TranslationKeys {
  // 通用
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    export: string;
    import: string;
    reset: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    finish: string;
    retry: string;
    refresh: string;
  };

  // 导航
  navigation: {
    monitor: string;
    realtime: string;
    analytics: string;
    alerts: string;
    manage: string;
    tutorial: string;
  };

  // 错误消息
  errors: {
    networkError: string;
    dataLoadError: string;
    saveError: string;
    validationError: string;
    unknownError: string;
    offlineMessage: string;
  };

  // 成功消息
  success: {
    dataSaved: string;
    dataImported: string;
    dataExported: string;
    indicatorAdded: string;
    indicatorUpdated: string;
    indicatorDeleted: string;
  };

  // 确认对话框
  confirmations: {
    deleteIndicator: string;
    clearAllData: string;
    resetToDefault: string;
    unsavedChanges: string;
  };

  // 表单标签
  forms: {
    indicatorName: string;
    indicatorId: string;
    definition: string;
    purpose: string;
    formula: string;
    threshold: string;
    calculationCase: string;
    riskInterpretation: string;
    priority: string;
    status: string;
    category: string;
    subcategory: string;
  };

  // 数据质量
  quality: {
    overallScore: string;
    issues: string;
    recommendations: string;
    grade: string;
    completeness: string;
    validity: string;
  };

  // 监控和性能
  monitoring: {
    performanceMetrics: string;
    userBehavior: string;
    healthCheck: string;
    pageLoadTime: string;
    memoryUsage: string;
    errorCount: string;
  };

  // PWA 相关
  pwa: {
    installPrompt: string;
    updateAvailable: string;
    offlineMode: string;
    syncCompleted: string;
    installApp: string;
    updateApp: string;
  };
}

export type TranslationKey = keyof TranslationKeys;
export type NestedKey<T> = T extends Record<string, any>
  ? { [K in keyof T]: T[K] extends Record<string, any> ? `${string & K}.${NestedKey<T[K]>}` : K }[keyof T]
  : never;

// 翻译数据
const translations: Record<Language, TranslationKeys> = {
  'zh-CN': {
    common: {
      loading: '加载中...',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      search: '搜索',
      export: '导出',
      import: '导入',
      reset: '重置',
      confirm: '确认',
      close: '关闭',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      finish: '完成',
      retry: '重试',
      refresh: '刷新'
    },
    navigation: {
      monitor: '生产看板',
      realtime: '实时监控',
      analytics: '数据分析',
      alerts: '告警规则',
      manage: '体系管理',
      tutorial: '学习中心'
    },
    errors: {
      networkError: '网络连接失败',
      dataLoadError: '数据加载失败',
      saveError: '保存失败',
      validationError: '数据验证失败',
      unknownError: '未知错误',
      offlineMessage: '当前处于离线模式，某些功能可能不可用'
    },
    success: {
      dataSaved: '数据保存成功',
      dataImported: '数据导入成功',
      dataExported: '数据导出成功',
      indicatorAdded: '指标添加成功',
      indicatorUpdated: '指标更新成功',
      indicatorDeleted: '指标删除成功'
    },
    confirmations: {
      deleteIndicator: '确定要删除这个指标吗？',
      clearAllData: '确定要清空所有数据吗？此操作不可撤销。',
      resetToDefault: '确定要重置为默认配置吗？当前修改将被覆盖。',
      unsavedChanges: '有未保存的更改，确定要离开吗？'
    },
    forms: {
      indicatorName: '指标名称',
      indicatorId: '指标ID',
      definition: '业务定义',
      purpose: '指标目的',
      formula: '计算公式',
      threshold: '风险阈值',
      calculationCase: '计算示例',
      riskInterpretation: '风险解读',
      priority: '风险等级',
      status: '状态',
      category: '分类',
      subcategory: '子类'
    },
    quality: {
      overallScore: '总体评分',
      issues: '问题数量',
      recommendations: '改进建议',
      grade: '等级',
      completeness: '完整性',
      validity: '有效性'
    },
    monitoring: {
      performanceMetrics: '性能指标',
      userBehavior: '用户行为',
      healthCheck: '健康检查',
      pageLoadTime: '页面加载时间',
      memoryUsage: '内存使用',
      errorCount: '错误数量'
    },
    pwa: {
      installPrompt: '安装应用',
      updateAvailable: '新版本可用',
      offlineMode: '离线模式',
      syncCompleted: '数据同步完成',
      installApp: '安装应用以获得更好的体验',
      updateApp: '更新应用以使用最新功能'
    }
  },
  'en-US': {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      export: 'Export',
      import: 'Import',
      reset: 'Reset',
      confirm: 'Confirm',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      retry: 'Retry',
      refresh: 'Refresh'
    },
    navigation: {
      monitor: 'Production Dashboard',
      realtime: 'Real-time Monitor',
      analytics: 'Data Analytics',
      alerts: 'Alert Rules',
      manage: 'System Management',
      tutorial: 'Learning Center'
    },
    errors: {
      networkError: 'Network connection failed',
      dataLoadError: 'Data loading failed',
      saveError: 'Save failed',
      validationError: 'Data validation failed',
      unknownError: 'Unknown error',
      offlineMessage: 'Currently offline, some features may be unavailable'
    },
    success: {
      dataSaved: 'Data saved successfully',
      dataImported: 'Data imported successfully',
      dataExported: 'Data exported successfully',
      indicatorAdded: 'Indicator added successfully',
      indicatorUpdated: 'Indicator updated successfully',
      indicatorDeleted: 'Indicator deleted successfully'
    },
    confirmations: {
      deleteIndicator: 'Are you sure you want to delete this indicator?',
      clearAllData: 'Are you sure you want to clear all data? This action cannot be undone.',
      resetToDefault: 'Are you sure you want to reset to default configuration? Current changes will be overwritten.',
      unsavedChanges: 'There are unsaved changes. Are you sure you want to leave?'
    },
    forms: {
      indicatorName: 'Indicator Name',
      indicatorId: 'Indicator ID',
      definition: 'Business Definition',
      purpose: 'Indicator Purpose',
      formula: 'Calculation Formula',
      threshold: 'Risk Threshold',
      calculationCase: 'Calculation Example',
      riskInterpretation: 'Risk Interpretation',
      priority: 'Risk Priority',
      status: 'Status',
      category: 'Category',
      subcategory: 'Subcategory'
    },
    quality: {
      overallScore: 'Overall Score',
      issues: 'Issues',
      recommendations: 'Recommendations',
      grade: 'Grade',
      completeness: 'Completeness',
      validity: 'Validity'
    },
    monitoring: {
      performanceMetrics: 'Performance Metrics',
      userBehavior: 'User Behavior',
      healthCheck: 'Health Check',
      pageLoadTime: 'Page Load Time',
      memoryUsage: 'Memory Usage',
      errorCount: 'Error Count'
    },
    pwa: {
      installPrompt: 'Install App',
      updateAvailable: 'Update Available',
      offlineMode: 'Offline Mode',
      syncCompleted: 'Sync Completed',
      installApp: 'Install app for better experience',
      updateApp: 'Update app to use latest features'
    }
  },
  'zh-TW': {
    common: {
      loading: '載入中...',
      save: '儲存',
      cancel: '取消',
      delete: '刪除',
      edit: '編輯',
      add: '新增',
      search: '搜尋',
      export: '匯出',
      import: '匯入',
      reset: '重置',
      confirm: '確認',
      close: '關閉',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      finish: '完成',
      retry: '重試',
      refresh: '重新整理'
    },
    navigation: {
      monitor: '生產儀表板',
      realtime: '即時監控',
      analytics: '資料分析',
      alerts: '警報規則',
      manage: '系統管理',
      tutorial: '學習中心'
    },
    errors: {
      networkError: '網路連線失敗',
      dataLoadError: '資料載入失敗',
      saveError: '儲存失敗',
      validationError: '資料驗證失敗',
      unknownError: '未知錯誤',
      offlineMessage: '目前處於離線模式，某些功能可能不可用'
    },
    success: {
      dataSaved: '資料儲存成功',
      dataImported: '資料匯入成功',
      dataExported: '資料匯出成功',
      indicatorAdded: '指標新增成功',
      indicatorUpdated: '指標更新成功',
      indicatorDeleted: '指標刪除成功'
    },
    confirmations: {
      deleteIndicator: '確定要刪除這個指標嗎？',
      clearAllData: '確定要清除所有資料嗎？此操作不可復原。',
      resetToDefault: '確定要重置為預設配置嗎？目前修改將被覆蓋。',
      unsavedChanges: '有未儲存的變更，確定要離開嗎？'
    },
    forms: {
      indicatorName: '指標名稱',
      indicatorId: '指標ID',
      definition: '業務定義',
      purpose: '指標目的',
      formula: '計算公式',
      threshold: '風險閾值',
      calculationCase: '計算範例',
      riskInterpretation: '風險解讀',
      priority: '風險等級',
      status: '狀態',
      category: '分類',
      subcategory: '子類'
    },
    quality: {
      overallScore: '整體評分',
      issues: '問題數量',
      recommendations: '改進建議',
      grade: '等級',
      completeness: '完整性',
      validity: '有效性'
    },
    monitoring: {
      performanceMetrics: '效能指標',
      userBehavior: '使用者行為',
      healthCheck: '健康檢查',
      pageLoadTime: '頁面載入時間',
      memoryUsage: '記憶體使用',
      errorCount: '錯誤數量'
    },
    pwa: {
      installPrompt: '安裝應用',
      updateAvailable: '新版本可用',
      offlineMode: '離線模式',
      syncCompleted: '資料同步完成',
      installApp: '安裝應用以獲得更好的體驗',
      updateApp: '更新應用以使用最新功能'
    }
  }
};

class I18nUtils {
  private currentLanguage: Language;
  private listeners: Set<(language: Language) => void> = new Set();

  constructor() {
    // 从 localStorage 获取语言设置，默认使用中文
    const savedLanguage = localStorage.getItem('mece-language') as Language;
    this.currentLanguage = savedLanguage && savedLanguage in translations ? savedLanguage : 'zh-CN';

    // 监听系统语言变化
    if ('language' in navigator) {
      const systemLang = (navigator as any).language || navigator.language;
      if (systemLang.startsWith('zh-TW') || systemLang.startsWith('zh-HK')) {
        this.currentLanguage = 'zh-TW';
      } else if (systemLang.startsWith('zh')) {
        this.currentLanguage = 'zh-CN';
      } else if (systemLang.startsWith('en')) {
        this.currentLanguage = 'en-US';
      }
    }

    logger.info('I18n initialized', { language: this.currentLanguage });
  }

  /**
   * 获取当前语言
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * 设置语言
   */
  setLanguage(language: Language): void {
    if (!(language in translations)) {
      logger.warn('Unsupported language', { language });
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem('mece-language', language);

    // 更新文档语言
    document.documentElement.lang = language;

    // 通知所有监听器
    this.listeners.forEach(listener => listener(language));

    logger.info('Language changed', { language });
  }

  /**
   * 获取翻译文本
   */
  t<K extends TranslationKey>(key: K): TranslationKeys[K] | string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      value = value?.[k];
    }

    if (value === undefined) {
      logger.warn('Translation key not found', { key, language: this.currentLanguage });
      return key; // 返回键作为后备
    }

    return value;
  }

  /**
   * 获取所有支持的语言
   */
  getSupportedLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
      { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
      { code: 'en-US', name: 'English', nativeName: 'English' }
    ];
  }

  /**
   * 监听语言变化
   */
  onLanguageChange(callback: (language: Language) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * 格式化数字（根据语言习惯）
   */
  formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(this.currentLanguage, options).format(num);
    } catch (error) {
      logger.warn('Number formatting failed, using default', error);
      return num.toString();
    }
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    try {
      return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
    } catch (error) {
      logger.warn('Date formatting failed, using default', error);
      return date.toISOString();
    }
  }

  /**
   * 格式化货币
   */
  formatCurrency(amount: number, currency: string = 'CNY'): string {
    try {
      return new Intl.NumberFormat(this.currentLanguage, {
        style: 'currency',
        currency
      }).format(amount);
    } catch (error) {
      logger.warn('Currency formatting failed, using default', error);
      return `${currency} ${amount}`;
    }
  }

  /**
   * 获取方向性（RTL/LTR）
   */
  getDirection(): 'ltr' | 'rtl' {
    // 当前支持的语言都是 LTR
    return 'ltr';
  }

  /**
   * 导出当前语言的翻译数据（用于调试）
   */
  exportTranslations(): TranslationKeys {
    return translations[this.currentLanguage];
  }
}

// 创建全局实例
const i18n = new I18nUtils();

export default i18n;
export { I18nUtils };
