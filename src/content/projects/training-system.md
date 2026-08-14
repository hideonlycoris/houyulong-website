---
title: "驭长风 — 供应链新员工培训系统"
description: "基于 AI 的智能培训系统，支持自动评分、证书生成、课程管理"
tech: ["Python", "Streamlit", "Google Gemini", "SQLite"]
demo: "https://train-sys.streamlit.app"
github: "https://github.com/hideonlycoris/training-sys"
order: 1
---

## 项目简介

驭长风供应链新员工培训系统是一个基于 AI 的智能化培训平台，旨在帮助供应链团队快速掌握业务知识和操作技能。

## 核心功能

### 🎓 课程管理
- 支持 Word、PPT、Excel 课件自动解析
- 章节化课程结构，学习进度跟踪
- 课件内容智能提取与展示

### 🤖 AI 智能评分
- 集成 Google Gemini API
- 主观题智能评分与反馈
- 多维度评估学员掌握程度

### 📊 考试系统
- 随机组卷、限时考试
- 自动批改与成绩统计
- 错题回顾与知识点分析

### 📜 证书生成
- 考试通过后自动生成 PDF 证书
- 自定义证书模板
- 证书编号与验证

### 📈 管理后台
- 学员学习数据统计
- 课程完成率分析
- 考试成绩分布图表

## 技术实现

- **前端**: Streamlit (Python)
- **AI**: Google Gemini API (主观题评分)
- **数据库**: SQLite (轻量级，易于部署)
- **文档解析**: mammoth (Word), python-pptx (PPT), openpyxl (Excel)
- **PDF 生成**: fpdf2

## 供应链知识体系

系统涵盖以下供应链核心知识点：

1. **滚动计划管理** — 月度/周度滚动计划的制定与执行
2. **FBA/AGL 物流** — 亚马逊物流体系的操作规范
3. **仓储管理** — 易仓系统操作与库存管理
4. **产品分级** — 爆品/利润品/新品/清尾品的分类策略
