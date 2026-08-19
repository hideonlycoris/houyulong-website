---
title: "从 Gemini + NotebookLM 到 Claude Code + Obsidian"
description: ""
date: 2026-08-19
tags: []
category: "AI"
---

1. 下载安装 Node.js

Claude Code 通过 npm 安装，npm 随 Node.js 一起提供。

```bash
# 下载地址（国内镜像）：https://npmmirror.com/mirrors/node/
# 选择 v22.x.x 版本，下载 node-v22.x.x-x64.msi
# 安装时一路 Next，不要改任何设置
```

安装完成后验证：

```bash
node --version   # 显示 v22.x.x 即成功
npm --version    # 显示版本号即成功
```

> [!warning] 常见问题
> - 如果 `npm` 报权限错误，运行：`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
> - 如果 `npm-cli.js` 找不到，删除 `C:\Users\你的用户名\AppData\Roaming\npm` 文件夹后重装 Node.js
> - 详细踩坑记录见文末「新电脑安装踩坑记录」

---

## 2. 命令行安装 Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

**配置文件路径**：`用户目录/.claude/settings.json`（新建这个文件）

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "BASE_URL",
    "ANTHROPIC_AUTH_TOKEN": "API_KEY",
    "ANTHROPIC_MODEL": "模型名",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "模型名",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "模型名",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "模型名"
  }
}
```

再配置 `用户目录/.claude.json`：

```json
{ "hasCompletedOnboarding": true }
```

配置完成后，终端运行 `claude` 即可。

---

## 3. VS Code 插件（可视化）

在 VS Code 扩展市场搜索并安装 **Claude Code for VS Code** 插件。

打开 VS Code 设置，搜索 `Claude Code: Environment Variables`，在 `settings.json` 中配置：

```json
{
  "claudeCode.preferredLocation": "panel",
  "claudeCode.selectedModel": "模型名",
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_BASE_URL", "value": "BASE_URL" },
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "API_KEY" },
    { "name": "ANTHROPIC_DEFAULT_SONNET_MODEL", "value": "模型名" },
    { "name": "ANTHROPIC_DEFAULT_OPUS_MODEL", "value": "模型名" },
    { "name": "ANTHROPIC_DEFAULT_HAIKU_MODEL", "value": "模型名" }
  ]
}
```

---

## 4. 链接 Obsidian（Claudian 插件）

### 安装 BRAT 插件

先下载 Obsidian 的 **BRAT** 插件：

![[attachments/Pasted image 20260506164307.png]]

![[attachments/Pasted image 20260506164327.png]]

### 安装 Claudian

通过 BRAT 添加 GitHub 仓库地址：

```
https://github.com/YishenTu/claudian
```

> [!warning] 坑点
> 直接配置 GitHub 链接会报错 `limited 超限`，需要去自己的 GitHub 账号**生成 Personal Access Token** 填过来即可。
> （来源博主的仓库，具体区别待探索）

### 配置 CLI 路径

因为用的不是官方 Claude Code，需要手动配置路径和环境变量：

**CLI 路径**：
```
C:\Users\29196\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\bin\claude.exe
```

然后在环境变量中映射 `URL`、`Key`、`Model`：

### 替换汉化插件文件

最后还有一步：替换了 Obsidian 插件目录里的文件 `main.js`、`manifest.json`、`styles.css`

**插件目录路径**：
```
C:\Users\29196\Documents\Obsidian Vault\.obsidian\plugins\claudian
```

> [!tip] 汉化来源
> 文件来自 [charles-lpf/claudian-cn](https://github.com/charles-lpf/claudian-cn) 项目的中文汉化版。

配置完成，即可链接成功 🎉

---

## 5. 新电脑安装踩坑记录

> 在另一台全新电脑上重装时遇到的问题汇总。

### 问题 1：Node.js 下载失败

- **现象**：官网下载慢或中断
- **原因**：官网服务器在国外，网络不稳定
- **解决**：用国内镜像 [npmmirror.com/mirrors/node/](https://npmmirror.com/mirrors/node/) 下载V22版本的 `.msi` 安装包

### 问题 2：VS Code 插件市场打不开

- **现象**：Extension Marketplace 显示 `failed to fetch`
- **原因**：VS Code 连不上微软插件服务器
- **解决**：两种方案
  1. 命令行加代理启动：`code --proxy-server="https://mirrors.huaweicloud.com"`
  2. 手动下载 `.vsix` 文件离线安装（更稳）

### 问题 3：npm 命令无法识别

- **现象**：`npm` 提示"无法将该项识别为 cmdlet、函数..."
- **原因**：Node.js 没装成功，或没加到系统 PATH
- **解决**：
  1. 确认 Node.js 已安装（控制面板 → 程序和功能里查看）
  2. 重新安装时不要改任何设置，一路 Next
  3. 安装后重启 PowerShell

### 问题 4：PowerShell 禁止运行脚本

- **现象**：`npm` 命令报 `SecurityError`、`UnauthorizedAccess`
- **原因**：Windows 默认禁止 PowerShell 运行脚本
- **解决**：运行以下命令解除限制：
  ```
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

### 问题 5：npm-cli.js 找不到（反复出现）

- **现象**：`npm --version` 报错 `Cannot find module '...\npm\node_modules\npm\bin\npm-cli.js'`
- **原因**：旧的 npm 残留文件损坏，`AppData\Roaming\npm` 目录指向错误位置
- **解决**：
  1. 打开文件管理器，进入 `C:\Users\Administrator\AppData\Roaming`
  2. 删除 `npm` 文件夹（如果有）
  3. 重启电脑后重新安装 Node.js
  4. 如果还不行，用完整路径修复：
     ```
     node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" config set prefix "C:\Program Files\nodejs"
     ```

### 问题 6：Node.js 安装时 Chocolatey 报错

- **现象**：安装完成后弹出 PowerShell 窗口，显示 Chocolatey 安装失败
- **原因**：之前尝试安装 Chocolatey 残留的损坏文件
- **解决**：不用管，按 Enter 关掉即可，不影响 Node.js 和 npm 使用

也可以第二步完成后，vs code以及obsidian的安装全部让calude自行执行，一键搞定