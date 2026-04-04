# Capacitor 安卓打包完整指南

## 概述

本项目已成功配置 Capacitor，可以将 uni-app x 项目的 web 包打包到安卓平台。本指南整合了所有 Capacitor 相关文档，提供完整的配置和使用说明。

---

## 🚀 快速开始

### 前置要求

- Node.js 16+
- Java 11+
- Android Studio (用于构建和调试)

### 快速构建流程

```bash

# 1. 构建并同步到安卓项目
npm run sync:android

# 2. 打开 Android Studio 进行构建和调试
npm run open:android
```

### 开发环境构建
```bash
npm run build:android:dev
npx cap sync android
```

---

## 📋 配置完成状态

✅ **所有配置任务已完成！**

### 已完成的工作

#### 1. Capacitor 基础配置
- ✅ 安装 Capacitor 核心依赖 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)
- ✅ 创建 `capacitor.config.ts` 配置文件
- ✅ 配置安卓平台 (`npx cap add android`)
- ✅ 验证安卓项目结构

#### 2. API 路径适配
- ✅ 创建 `.env.android` 环境文件，配置安卓专用 API 地址
- ✅ 修改 `api/request.uts` 使用环境变量自动适配
- ✅ 移除复杂的运行环境检测逻辑，简化配置

#### 3. 构建脚本优化
- ✅ 添加安卓环境构建命令：
  - `npm run build:android` - 生产环境构建
  - `npm run build:android:dev` - 开发环境构建
  - `npm run sync:android` - 构建并同步到安卓项目
  - `npm run open:android` - 打开 Android Studio

#### 4. 环境管理
- ✅ 实现环境文件自动备份和恢复机制
- ✅ 确保构建过程不影响其他环境的配置

---

## 🔧 详细使用方法

### 可用命令

- `npm run build` - 仅构建 web 包
- `npm run build:android` - 构建 web 包并同步到安卓
- `npm run build:android:dev` - 开发环境构建
- `npm run sync:android` - 构建并同步到安卓项目
- `npm run open:android` - 在 Android Studio 中打开安卓项目

### 安卓项目构建

在 Android Studio 中：
1. 等待 Gradle 同步完成
2. 连接安卓设备或启动模拟器
3. 点击运行按钮构建并安装应用

---

## 📁 项目结构

```
ai-gen/
├── android/                    # Capacitor 安卓项目
├── unpackage/dist/build/web/   # Web 构建输出目录
├── capacitor.config.json       # Capacitor 配置文件
├── package.json               # 包含 Capacitor 脚本命令
├── .env.android              # 安卓环境配置 (API: https://test.aigamers.win/api/)
├── .env.production           # 生产环境配置 (API: /api/)
├── .env.development          # 开发环境配置
└── android/app/src/main/assets/  # Web 资源复制位置
```

---

## 🔧 技术实现要点

### API 适配原理

在 `api/request.uts` 中，API 基础路径通过环境变量自动配置：

```typescript
export const config = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
};
```

- **Web 环境**: 使用相对路径 `/api/`（通过代理转发）
- **安卓环境**: 使用绝对路径 `https://test.aigamers.win/api/`（直接访问）

### 构建流程
1. 备份当前环境文件
2. 使用安卓环境配置构建
3. 恢复原始环境文件
4. 同步到安卓项目

---

## ⚠️ 注意事项

### 权限配置
如果应用需要特殊权限（如相机、存储等），需要在 `android/app/src/main/AndroidManifest.xml` 中添加相应权限。

### 原生功能
如需使用原生功能，需要安装相应的 Capacitor 插件。

### 调试
可以在 Chrome 中通过 `chrome://inspect` 调试应用。

### 发布
构建发布版本时，需要在 Android Studio 中配置签名。

---

## 🎯 优势对比

### 直接编译到安卓 vs Capacitor

| 特性 | 直接编译 | Capacitor |
|------|----------|-----------|
| 开发效率 | 高 | 高 |
| 跨平台一致性 | 中等 | 高 |
| 原生功能访问 | 直接 | 通过插件 |
| 调试便利性 | 中等 | 高 |
| 发布流程 | 复杂 | 标准 Android 流程 |

---

## 🔍 常见问题

### WebView 白屏
检查 web 资源是否正确同步到 `android/app/src/main/assets/public/` 目录。

### 权限问题
确保在 `AndroidManifest.xml` 中声明了所需权限。

### 构建失败
检查 Java 和 Android SDK 版本是否兼容。

### API 访问问题
- 检查安卓环境 API 地址是否正确
- 确认网络权限已配置
- 验证 API 服务器是否可访问

---

## 🛠️ 故障排除

如果遇到问题，请检查：

1. **环境文件配置**：确保 `.env.android` 文件中的 API 地址正确
2. **Capacitor 配置**：检查 `capacitor.config.json` 中的 webDir 路径是否正确
3. **网络权限**：确认安卓项目的网络权限配置
4. **构建警告**：构建过程中的类型警告不影响功能，可后续逐步修复

---

## 📞 后续维护

### 修改安卓 API 地址
如需修改安卓 API 地址，请更新 `.env.android` 文件：
```bash
VITE_API_BASE_URL=https://your-new-api-domain/api/
```

### 添加新环境变量
如需添加新的环境变量，请同步更新所有环境文件。

### 版本更新
定期检查 Capacitor 版本更新，保持与最新版本的兼容性。

---

## 🎊 完成状态

**项目已成功从直接编译到安卓平台改为使用 Capacitor 将编译成功的 web 包打包到安卓平台！**

现在可以使用 Android Studio 打开 `android/` 目录进行安卓应用的构建和调试。

---

## 📚 相关文档

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Android Studio 使用指南](https://developer.android.com/studio)
- [uni-app x 文档](https://doc.dcloud.net.cn/uni-app-x/)

---

*最后更新：2025年9月24日*
