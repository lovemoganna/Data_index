/**
 * 安全工具模块
 * 提供输入验证、数据清理和安全防护功能
 */

// HTML 转义
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
}

// 清理用户输入，防止 XSS
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  // 移除危险的 HTML 标签
  let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 移除事件处理器
  clean = clean.replace(/on\w+="[^"]*"/gi, '');
  clean = clean.replace(/on\w+='[^']*'/gi, '');
  clean = clean.replace(/javascript:/gi, '');

  return clean.trim();
}

// 验证文件名安全性
export function validateFileName(fileName: string): { isValid: boolean; error?: string } {
  if (!fileName || typeof fileName !== 'string') {
    return { isValid: false, error: '文件名不能为空' };
  }

  // 检查长度
  if (fileName.length > 255) {
    return { isValid: false, error: '文件名过长' };
  }

  // 检查危险字符
  const dangerousChars = /[<>:"|?*\x00-\x1f]/;
  if (dangerousChars.test(fileName)) {
    return { isValid: false, error: '文件名包含非法字符' };
  }

  // 检查路径遍历攻击
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { isValid: false, error: '文件名包含非法路径' };
  }

  return { isValid: true };
}

// 验证文件大小
export function validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): { isValid: boolean; error?: string } {
  if (size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { isValid: false, error: `文件大小超过 ${maxSizeMB}MB 限制` };
  }

  return { isValid: true };
}

// 验证文件类型
export function validateFileType(fileName: string, allowedTypes: string[]): { isValid: boolean; error?: string } {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext || !allowedTypes.includes(ext)) {
    return { isValid: false, error: `不支持的文件类型。允许的类型: ${allowedTypes.join(', ')}` };
  }

  return { isValid: true };
}

// 生成安全的随机字符串
export function generateSecureId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 验证和清理对象属性
export function sanitizeObject<T extends Record<string, any>>(obj: T, allowedKeys: (keyof T)[]): Partial<T> {
  const sanitized: Partial<T> = {};

  allowedKeys.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value) as T[keyof T];
      } else if (typeof value === 'object' && value !== null) {
        // 递归清理嵌套对象（简化处理）
        sanitized[key] = value;
      } else {
        sanitized[key] = value;
      }
    }
  });

  return sanitized;
}

// 密码强度验证
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('密码长度至少8位');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('密码应包含小写字母');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('密码应包含大写字母');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push('密码应包含数字');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('密码应包含特殊字符');
  } else {
    score += 1;
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  };
}

// 验证邮箱格式
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证URL安全性
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  try {
    const parsedUrl = new URL(url);

    // 只允许 HTTP 和 HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isValid: false, error: '只允许 HTTP 和 HTTPS 协议' };
    }

    // 检查危险的域名
    const dangerousDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (dangerousDomains.includes(parsedUrl.hostname)) {
      return { isValid: false, error: '不允许访问本地地址' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: '无效的 URL 格式' };
  }
}

// 加密存储数据（使用 Web Crypto API）
export async function encryptData(data: string, key?: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // 生成密钥（或使用提供的密钥）
    let cryptoKey: CryptoKey;
    if (key) {
      const keyData = encoder.encode(key);
      const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
      cryptoKey = await crypto.subtle.importKey(
        'raw',
        hashBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
    } else {
      cryptoKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );

    // 组合 IV 和加密数据
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('数据加密失败:', error);
    return data; // 如果加密失败，返回原文
  }
}

// 解密数据
export async function decryptData(encryptedData: string, key: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('数据解密失败:', error);
    return encryptedData; // 如果解密失败，返回原文
  }
}

// 安全的本地存储
export class SecureStorage {
  private static readonly STORAGE_PREFIX = 'secure_';

  static async setItem(key: string, value: string, encrypt: boolean = true): Promise<void> {
    try {
      const fullKey = this.STORAGE_PREFIX + key;
      const dataToStore = encrypt ? await encryptData(value) : value;
      localStorage.setItem(fullKey, dataToStore);
    } catch (error) {
      console.error('存储数据失败:', error);
      throw error;
    }
  }

  static async getItem(key: string, decrypt: boolean = true): Promise<string | null> {
    try {
      const fullKey = this.STORAGE_PREFIX + key;
      const storedData = localStorage.getItem(fullKey);
      if (!storedData) return null;

      return decrypt ? await decryptData(storedData, key) : storedData;
    } catch (error) {
      console.error('读取数据失败:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    const fullKey = this.STORAGE_PREFIX + key;
    localStorage.removeItem(fullKey);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// 速率限制器
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxAttempts: number;

  constructor(windowMs: number = 60000, maxAttempts: number = 5) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // 过滤出时间窗口内的尝试
    const validAttempts = attempts.filter(time => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(key, validAttempts);

    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key);
    if (!attempts || attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const timeLeft = this.windowMs - (Date.now() - oldestAttempt);

    return Math.max(0, timeLeft);
  }
}

// 全局速率限制器实例
export const globalRateLimiter = new RateLimiter();

// 内容安全策略工具
export class ContentSecurityPolicy {
  static generateCSP(): string {
    const policies = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ];

    return policies.join('; ');
  }

  static injectCSP(): void {
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = 'Content-Security-Policy';
    metaTag.content = this.generateCSP();

    const head = document.head || document.getElementsByTagName('head')[0];
    head.insertBefore(metaTag, head.firstChild);
  }
}

// 安全头验证
export function validateSecurityHeaders(): {
  isSecure: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let isSecure = true;

  // 检查 HTTPS
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    issues.push('未使用 HTTPS 协议');
    recommendations.push('启用 HTTPS 以保护数据传输安全');
    isSecure = false;
  }

  // 检查内容安全策略
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspMeta) {
    issues.push('缺少内容安全策略 (CSP)');
    recommendations.push('添加 CSP 头以防止 XSS 攻击');
    isSecure = false;
  }

  // 检查 X-Frame-Options
  const xFrameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (!xFrameOptions) {
    issues.push('缺少 X-Frame-Options 头');
    recommendations.push('添加 X-Frame-Options 头以防止点击劫持');
  }

  // 检查 Referrer Policy
  const referrerPolicy = document.querySelector('meta[name="referrer"]');
  if (!referrerPolicy) {
    issues.push('缺少 Referrer Policy');
    recommendations.push('添加 referrer policy 以控制引用信息泄露');
  }

  return { isSecure, issues, recommendations };
}

// SQL 注入防护（虽然前端主要是处理用户输入）
export function sanitizeSQLInput(input: string): string {
  if (typeof input !== 'string') return '';

  // 移除危险的 SQL 关键字和字符
  return input
    .replace(/'/g, "''")  // 转义单引号
    .replace(/;/g, '')    // 移除分号
    .replace(/--/g, '')   // 移除 SQL 注释
    .replace(/\/\*/g, '') // 移除多行注释开始
    .replace(/\*\//g, '') // 移除多行注释结束
    .trim();
}

// 防止原型污染
export function isPrototypePollution(key: string): boolean {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

// 深度冻结对象，防止意外修改
export function deepFreeze<T extends Record<string, any>>(obj: T): T {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null && !isPrototypePollution(key)) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}

// 安全地解析 JSON
export function safeJSONParse(jsonString: string): { success: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(jsonString);

    // 检查原型污染
    const checkPrototypePollution = (obj: any, path: string[] = []): boolean => {
      if (typeof obj !== 'object' || obj === null) return false;

      for (const key in obj) {
        if (isPrototypePollution(key)) {
          return true;
        }
        if (typeof obj[key] === 'object' && checkPrototypePollution(obj[key], [...path, key])) {
          return true;
        }
      }
      return false;
    };

    if (checkPrototypePollution(data)) {
      return { success: false, error: '检测到原型污染攻击' };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'JSON 解析失败'
    };
  }
}

// 随机数生成器（密码学安全）
export function generateSecureRandom(length: number = 32): Uint8Array {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
}

// 生成密码学安全的随机字符串
export function generateSecureToken(length: number = 32): string {
  const array = generateSecureRandom(length);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }

  return result;
}