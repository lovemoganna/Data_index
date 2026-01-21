<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MECE 风险本体生产力平台

[![Deploy to GitHub Pages](https://github.com/lovemoganna/Data_index/actions/workflows/deploy.yml/badge.svg)](https://github.com/lovemoganna/Data_index/actions/workflows/deploy.yml)

基于MECE原则构建的加密货币现货风控风险本体系统，包含173个专业指标，覆盖8大维度42个子类。

## 🚀 在线体验

**GitHub Pages**: https://lovemoganna.github.io/Data_index/

## 🔧 本地运行

**环境要求:** Node.js 18+

1. 安装依赖:
   ```bash
   npm install
   ```

2. 设置环境变量:
   ```bash
   # 创建 .env.local 文件
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
   ```

3. 启动开发服务器:
   ```bash
   npm run dev
   ```

## 📦 构建和部署

### 本地构建
```bash
npm run build
npm run preview
```

### GitHub Pages 自动部署

本项目已配置自动部署到GitHub Pages：

1. **推送代码到main分支**后自动触发部署
2. **访问地址**: `https://[username].github.io/[repository-name]/`
3. **部署状态**: 查看 [Actions](https://github.com/lovemoganna/Data_index/actions)

### 手动启用GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择 "GitHub Actions"
3. 保存设置

## 🎯 核心特性

- ✅ **173个专业指标**: 覆盖用户画像、资金流向、交易行为等8大维度
- ✅ **MECE原则**: 完全遵循互斥性和穷尽性原则
- ✅ **实时监控**: 支持实时风险检测和自动化告警
- ✅ **数据导出**: 支持Excel、CSV、JSON等多种格式导出
- ✅ **响应式设计**: 完美适配桌面和移动设备

## 📁 项目结构

```
src/
├── components/     # React组件
├── services/       # 数据服务和风险引擎
├── utils/         # 工具函数
├── constants.ts   # 基础数据配置
└── constants-integrated.ts  # 完整指标数据
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License
