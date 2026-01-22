import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: mode === 'production' ? '/data_index/' : '/',
      css: {
        postcss: './postcss.config.js'
      },
      build: {
        rollupOptions: {
          input: './index.html',
          output: {
            manualChunks: {
              // React 核心库
              'react-vendor': ['react', 'react-dom'],
              // UI 组件库
              'ui-vendor': ['@headlessui/react', '@heroicons/react', 'lucide-react', 'framer-motion'],
              // 数据处理库
              'data-vendor': ['dexie', 'xlsx', 'jspdf', 'html2canvas'],
              // 图表和可视化
              'chart-vendor': ['recharts'],
              // 文档处理
              'docs-vendor': ['react-markdown', 'react-syntax-highlighter', 'react-pdf']
            }
          }
        },
        // 代码分割配置
        chunkSizeWarningLimit: 600,
        // 启用压缩
        minify: 'esbuild',
        // 生成 source map
        sourcemap: mode === 'development'
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
