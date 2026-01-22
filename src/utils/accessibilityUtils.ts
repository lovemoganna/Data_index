/**
 * 无障碍访问工具类
 * 提供键盘导航、屏幕阅读器支持和辅助功能
 */

import { useCallback, useEffect, useRef } from 'react';

// 无障碍配置接口
export interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

// 焦点管理工具
export class FocusManager {
  private static focusStack: HTMLElement[] = [];
  private static focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  /**
   * 保存当前焦点
   */
  static saveFocus(): HTMLElement | null {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      this.focusStack.push(activeElement);
    }
    return activeElement;
  }

  /**
   * 恢复保存的焦点
   */
  static restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && document.contains(element)) {
      element.focus();
    }
  }

  /**
   * 聚焦到容器内的第一个可聚焦元素
   */
  static focusFirst(container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(this.focusableSelectors);
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  }

  /**
   * 聚焦到容器内的最后一个可聚焦元素
   */
  static focusLast(container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(this.focusableSelectors);
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (lastElement) {
      lastElement.focus();
    }
  }

  /**
   * 陷阱焦点（用于模态框等）
   */
  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(this.focusableSelectors);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // 返回清理函数
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  /**
   * 检查元素是否可见且可聚焦
   */
  static isFocusable(element: HTMLElement): boolean {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    const isVisible = style.display !== 'none' &&
                     style.visibility !== 'hidden' &&
                     style.opacity !== '0';

    const isEnabled = !element.hasAttribute('disabled') &&
                     element.getAttribute('aria-disabled') !== 'true';

    const tabIndex = element.getAttribute('tabindex');
    const isTabIndexValid = !tabIndex || parseInt(tabIndex) >= 0;

    return isVisible && isEnabled && isTabIndexValid;
  }
}

// 屏幕阅读器工具
export class ScreenReader {
  private static liveRegion: HTMLElement | null = null;

  /**
   * 初始化实时区域
   */
  static initialize(): void {
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.style.position = 'absolute';
      this.liveRegion.style.left = '-10000px';
      this.liveRegion.style.width = '1px';
      this.liveRegion.style.height = '1px';
      this.liveRegion.style.overflow = 'hidden';
      document.body.appendChild(this.liveRegion);
    }
  }

  /**
   * 宣布消息给屏幕阅读器
   */
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    this.initialize();

    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;

      // 清空消息，让屏幕阅读器重新宣布
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  /**
   * 宣布状态变化
   */
  static announceStatus(message: string): void {
    this.announce(message, 'polite');
  }

  /**
   * 宣布错误
   */
  static announceError(message: string): void {
    this.announce(`错误: ${message}`, 'assertive');
  }

  /**
   * 宣布成功
   */
  static announceSuccess(message: string): void {
    this.announce(`成功: ${message}`, 'polite');
  }
}

// 键盘导航工具
export class KeyboardNavigation {
  private static shortcuts: Map<string, (event: KeyboardEvent) => void> = new Map();

  /**
   * 注册键盘快捷键
   */
  static registerShortcut(
    key: string,
    callback: (event: KeyboardEvent) => void,
    description?: string
  ): () => void {
    // 标准化键名
    const normalizedKey = this.normalizeKey(key);

    if (this.shortcuts.has(normalizedKey)) {
      console.warn(`Keyboard shortcut "${key}" is already registered`);
      return () => {};
    }

    this.shortcuts.set(normalizedKey, callback);

    // 返回清理函数
    return () => {
      this.shortcuts.delete(normalizedKey);
    };
  }

  /**
   * 处理键盘事件
   */
  static handleKeyDown(event: KeyboardEvent): void {
    const key = this.normalizeKey(this.getKeyString(event));

    const callback = this.shortcuts.get(key);
    if (callback) {
      event.preventDefault();
      event.stopPropagation();
      callback(event);
    }
  }

  /**
   * 获取按键字符串
   */
  private static getKeyString(event: KeyboardEvent): string {
    const parts: string[] = [];

    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');

    parts.push(event.key.toLowerCase());

    return parts.join('+');
  }

  /**
   * 标准化键名
   */
  private static normalizeKey(key: string): string {
    return key.toLowerCase().replace(/\s+/g, '');
  }

  /**
   * 获取所有注册的快捷键
   */
  static getRegisteredShortcuts(): Array<{ key: string, description?: string }> {
    return Array.from(this.shortcuts.keys()).map(key => ({
      key,
      description: undefined // 可以后续扩展添加描述
    }));
  }
}

// 无障碍 React Hooks
export function useAccessibility() {
  const elementRef = useRef<HTMLElement>(null);

  // 设置 ARIA 属性
  const setAriaLabel = useCallback((label: string) => {
    if (elementRef.current) {
      elementRef.current.setAttribute('aria-label', label);
    }
  }, []);

  const setAriaDescribedBy = useCallback((id: string) => {
    if (elementRef.current) {
      elementRef.current.setAttribute('aria-describedby', id);
    }
  }, []);

  const setRole = useCallback((role: string) => {
    if (elementRef.current) {
      elementRef.current.setAttribute('role', role);
    }
  }, []);

  return {
    elementRef,
    setAriaLabel,
    setAriaDescribedBy,
    setRole
  };
}

// 焦点陷阱 Hook
export function useFocusTrap(active: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const cleanup = FocusManager.trapFocus(containerRef.current);

    return cleanup;
  }, [active]);

  return containerRef;
}

// 屏幕阅读器公告 Hook
export function useScreenReaderAnnouncement() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    ScreenReader.announce(message, priority);
  }, []);

  const announceError = useCallback((message: string) => {
    ScreenReader.announceError(message);
  }, []);

  const announceSuccess = useCallback((message: string) => {
    ScreenReader.announceSuccess(message);
  }, []);

  const announceStatus = useCallback((message: string) => {
    ScreenReader.announceStatus(message);
  }, []);

  return {
    announce,
    announceError,
    announceSuccess,
    announceStatus
  };
}

// 键盘快捷键 Hook
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const cleanup = KeyboardNavigation.registerShortcut(key, callback);
    return cleanup;
  }, deps);
}

// 无障碍配置 Hook
export function useAccessibilityConfig(): AccessibilityConfig {
  const [config, setConfig] = React.useState<AccessibilityConfig>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true
  });

  useEffect(() => {
    // 检查用户的无障碍偏好
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    setConfig(prev => ({
      ...prev,
      reducedMotion: mediaQuery.matches,
      highContrast: highContrastQuery.matches
    }));

    // 监听变化
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, highContrast: e.matches }));
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    highContrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      highContrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  return config;
}

// 初始化全局无障碍功能
export function initializeAccessibility(): void {
  // 初始化屏幕阅读器支持
  ScreenReader.initialize();

  // 设置全局键盘事件监听
  document.addEventListener('keydown', KeyboardNavigation.handleKeyDown);

  // 设置焦点可见性
  const style = document.createElement('style');
  style.textContent = `
    .focus-visible:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// 无障碍按钮组件的属性生成器
export function getButtonAccessibilityProps(
  disabled?: boolean,
  loading?: boolean,
  ariaLabel?: string
) {
  return {
    'aria-disabled': disabled || loading,
    'aria-label': ariaLabel,
    tabIndex: disabled ? -1 : 0
  };
}

// 无障碍输入组件的属性生成器
export function getInputAccessibilityProps(
  label: string,
  error?: string,
  required?: boolean,
  describedBy?: string
) {
  const props: Record<string, any> = {
    'aria-label': label,
    'aria-required': required,
    'aria-invalid': !!error
  };

  if (describedBy) {
    props['aria-describedby'] = describedBy;
  }

  if (error) {
    props['aria-describedby'] = `${describedBy ? describedBy + ' ' : ''}error-${label.replace(/\s+/g, '-').toLowerCase()}`;
  }

  return props;
}

// 无障碍模态框属性
export function getModalAccessibilityProps(
  title: string,
  describedBy?: string
) {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`,
    'aria-describedby': describedBy
  };
}
