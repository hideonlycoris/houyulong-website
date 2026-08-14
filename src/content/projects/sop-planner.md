---
title: "跨境供应链 S&OP 计划系统"
description: "全链路销售与运营计划管理平台，集成需求预测、库存优化、自动补货"
tech: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker"]
github: "https://github.com/hideonlycoris/sop-planner"
order: 2
---

## 项目简介

一个面向跨境电商业务的 S&OP（Sales & Operations Planning）管理系统，实现从需求预测到供应计划的全流程数字化管理。

## 核心功能

### 📊 决策看板
- ECharts 可视化仪表盘
- 关键指标实时监控（库存周转率、缺货率、滞销率）
- 多维度数据分析

### 📦 主数据管理
- SKU 信息维护
- 供应商管理
- 仓库与渠道配置

### 🔮 需求预测
- Prophet 时间序列预测
- ARIMA 模型支持
- 季节性分析与趋势识别

### 🔄 自动补货
- 基于安全库存的自动补货建议
- 采购订单自动生成
- 交期跟踪与预警

### 📈 S&OP 协作
- 需求评审流程
- 供应可行性分析
- 会议纪要与决策记录

## 技术架构

```
┌─────────────────────────────────────┐
│           React + TypeScript         │
│      Ant Design + ECharts           │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│          FastAPI + Python            │
│    SQLAlchemy + Alembic             │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│           PostgreSQL                 │
└─────────────────────────────────────┘
```

## 部署方式

使用 Docker Compose 一键部署：

```bash
git clone https://github.com/hideonlycoris/sop-planner.git
cd sop-planner
docker-compose up -d
```

## 业务价值

- **库存优化**: 库存周转率提升 30%
- **缺货降低**: 缺货率从 15% 降至 5%
- **效率提升**: 计划制定时间从 2 天缩短至 2 小时
