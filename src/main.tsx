import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import pwaUtils from './utils/pwaUtils';
import logger from './utils/logger';

// PWA 初始化
async function initializePWA() {
  try {
    // 注册 Service Worker
    const result = await pwaUtils.registerServiceWorker();
    if (result.success) {
      logger.info('PWA initialized successfully');
    } else {
      logger.warn('PWA initialization failed', result.message);
    }

    // 设置安装提示监听
    pwaUtils.setupInstallPrompt();

    // 监听更新
    window.addEventListener('pwa-update-available', () => {
      logger.info('PWA update available');
      // 可以在这里显示更新提示给用户
    });

    // 监听同步完成
    window.addEventListener('pwa-sync-completed', (event) => {
      logger.info('PWA sync completed', (event as CustomEvent).detail);
      // 可以在这里显示同步成功提示
    });

  } catch (error) {
    logger.error('PWA initialization error', error as Error);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// 初始化 PWA（在渲染完成后）
initializePWA().catch(console.error);