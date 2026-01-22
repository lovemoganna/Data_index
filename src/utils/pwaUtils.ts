/**
 * PWA 工具类
 * 处理 Service Worker 注册和离线功能
 */

import logger from './logger';

export interface PWARegistrationResult {
  success: boolean;
  message: string;
  registration?: ServiceWorkerRegistration;
}

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAStatus {
  isSupported: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  isOffline: boolean;
  installPrompt?: PWAInstallPrompt;
}

class PWAUtils {
  private registration: ServiceWorkerRegistration | null = null;
  private installPrompt: PWAInstallPrompt | null = null;
  private updateAvailable = false;

  /**
   * 注册 Service Worker
   */
  async registerServiceWorker(): Promise<PWARegistrationResult> {
    if (!('serviceWorker' in navigator)) {
      logger.warn('Service Worker not supported');
      return {
        success: false,
        message: '浏览器不支持 Service Worker'
      };
    }

    try {
      logger.info('Registering Service Worker...');

      // 对于GitHub Pages，使用相对路径
      const basePath = import.meta.env.PROD ? '/Data_index/' : '/';
      const registration = await navigator.serviceWorker.register(`${basePath}sw.js`, {
        scope: basePath
      });

      this.registration = registration;

      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true;
              this.notifyUpdateAvailable();
            }
          });
        }
      });

      // 监听消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });

      logger.info('Service Worker registered successfully', {
        scope: registration.scope,
        state: registration.active?.state
      });

      return {
        success: true,
        message: 'Service Worker 注册成功',
        registration
      };
    } catch (error) {
      logger.error('Service Worker registration failed', error as Error);
      return {
        success: false,
        message: `Service Worker 注册失败: ${(error as Error).message}`
      };
    }
  }

  /**
   * 监听 PWA 安装提示
   */
  setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPrompt = event as any;

      logger.info('PWA install prompt available');

      // 通知应用安装提示可用
      this.notifyInstallPromptAvailable();
    });

    // 监听安装成功
    window.addEventListener('appinstalled', () => {
      logger.info('PWA installed successfully');
      this.installPrompt = null;
      this.notifyInstallCompleted();
    });
  }

  /**
   * 触发 PWA 安装
   */
  async installPWA(): Promise<boolean> {
    if (!this.installPrompt) {
      logger.warn('No install prompt available');
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choice = await this.installPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        logger.info('User accepted PWA installation');
        return true;
      } else {
        logger.info('User dismissed PWA installation');
        return false;
      }
    } catch (error) {
      logger.error('PWA installation failed', error as Error);
      return false;
    }
  }

  /**
   * 检查 PWA 状态
   */
  getPWAStatus(): PWAStatus {
    const isSupported = 'serviceWorker' in navigator && 'caches' in window;
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    const isOffline = !navigator.onLine;

    return {
      isSupported,
      isInstalled,
      canInstall: !!this.installPrompt,
      isOffline,
      installPrompt: this.installPrompt || undefined
    };
  }

  /**
   * 更新 Service Worker
   */
  async updateServiceWorker(): Promise<boolean> {
    if (!this.registration) {
      logger.warn('No service worker registration available');
      return false;
    }

    try {
      await this.registration.update();
      logger.info('Service Worker update triggered');
      return true;
    } catch (error) {
      logger.error('Service Worker update failed', error as Error);
      return false;
    }
  }

  /**
   * 应用 Service Worker 更新
   */
  async applyUpdate(): Promise<void> {
    if (!this.registration?.waiting) {
      logger.warn('No waiting service worker available');
      return;
    }

    // 向等待中的 Service Worker 发送消息，让它跳过等待
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // 监听控制器变化
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  /**
   * 清理缓存
   */
  async clearCache(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      logger.info('Cache cleared successfully');
    } catch (error) {
      logger.error('Cache clear failed', error as Error);
    }
  }

  /**
   * 触发后台同步
   */
  async triggerBackgroundSync(tag: string = 'data-sync'): Promise<boolean> {
    if (!this.registration) {
      logger.warn('No service worker registration available');
      return false;
    }

    try {
      await this.registration.sync.register(tag);
      logger.info('Background sync registered', { tag });
      return true;
    } catch (error) {
      logger.error('Background sync registration failed', error as Error);
      return false;
    }
  }

  /**
   * 处理 Service Worker 消息
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'SYNC_COMPLETED':
        logger.info('Data synchronization completed', data);
        this.notifySyncCompleted(data);
        break;
      default:
        logger.debug('Service Worker message received', { type, data });
    }
  }

  // 事件通知方法
  private notifyInstallPromptAvailable(): void {
    const event = new CustomEvent('pwa-install-prompt-available', {
      detail: { installPrompt: this.installPrompt }
    });
    window.dispatchEvent(event);
  }

  private notifyInstallCompleted(): void {
    const event = new CustomEvent('pwa-installed');
    window.dispatchEvent(event);
  }

  private notifyUpdateAvailable(): void {
    const event = new CustomEvent('pwa-update-available', {
      detail: { registration: this.registration }
    });
    window.dispatchEvent(event);
  }

  private notifySyncCompleted(data: any): void {
    const event = new CustomEvent('pwa-sync-completed', {
      detail: data
    });
    window.dispatchEvent(event);
  }

  /**
   * 获取网络状态
   */
  getNetworkStatus(): {
    online: boolean;
    connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
    };
  } {
    const connection = (navigator as any).connection;

    return {
      online: navigator.onLine,
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      } : undefined
    };
  }

  /**
   * 监听网络状态变化
   */
  onNetworkChange(callback: (online: boolean) => void): () => void {
    const handler = () => callback(navigator.onLine);
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);

    // 返回清理函数
    return () => {
      window.removeEventListener('online', handler);
      window.removeEventListener('offline', handler);
    };
  }
}

// 创建全局实例
const pwaUtils = new PWAUtils();

export default pwaUtils;
export { PWAUtils };
