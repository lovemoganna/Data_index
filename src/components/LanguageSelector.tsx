/**
 * 语言选择器组件
 * 提供语言切换功能
 */

import React, { useState, useEffect } from 'react';
import i18n, { Language } from '../utils/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const languages = i18n.getSupportedLanguages();

  useEffect(() => {
    // 监听语言变化
    const unsubscribe = i18n.onLanguageChange((language) => {
      setCurrentLanguage(language);
    });

    // 监听主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      unsubscribe();
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const handleLanguageChange = (language: Language) => {
    i18n.setLanguage(language);
    setIsOpen(false);
  };

  const currentLangInfo = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm font-medium"
        aria-label="选择语言 / Select Language"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLangInfo?.nativeName}</span>
        <span className="sm:hidden">{currentLanguage.split('-')[1]}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* 点击外部关闭 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 下拉菜单 */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {language.name}
                    </span>
                  </div>
                  {currentLanguage === language.code && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {/* 分隔线 */}
            <div className="border-t border-slate-200 dark:border-slate-700" />

            {/* 底部提示 */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {i18n.t('common.refresh')} {i18n.t('common.save').toLowerCase()} {i18n.t('common.changes').toLowerCase()}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
