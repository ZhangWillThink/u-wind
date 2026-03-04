# Copilot Instructions — open-claw

## 项目概述

**u-wind** 是一个使用 **Rust**（后端）和 **React**（前端）构建的全栈项目(模仿open-claw)。

---

## 技术栈

### 后端（Rust）

- 语言：Rust（stable 版本）
- 遵循 Rust 官方编码规范（`rustfmt` + `clippy`）
- 错误处理使用 `Result<T, E>`，避免 `.unwrap()` / `.expect()` 出现在生产代码中
- 异步运行时优先使用 `tokio`
- 序列化/反序列化使用 `serde` + `serde_json`

### 前端（React）

- 语言：TypeScript（严格模式）
- 框架：React（函数式组件 + Hooks）
- 样式：根据项目实际配置（Tailwind CSS / CSS Modules）
- 组件库：使用 shadcn 提供的 UI 组件
- 状态管理：根据项目实际配置（Zustand / React Context）
- 网络请求：`fetch` API 或 `axios`

---

## 代码规范

### 通用原则

- 所有注释、文档、提交信息使用**中文**
- 变量/函数/类型命名使用**英文**，采用对应语言的命名惯例
- 不提交注释掉的无用代码
- 每个函数/组件只做一件事（单一职责）

### Rust 规范

- 结构体、枚举、Trait 使用 `PascalCase`
- 函数、变量、模块使用 `snake_case`
- 常量使用 `SCREAMING_SNAKE_CASE`
- 公共 API 必须添加文档注释 `///`
- 使用 `thiserror` 或 `anyhow` 统一管理错误类型

### React / TypeScript 规范

- 组件名使用 `PascalCase`
- Hook 名以 `use` 开头
- 工具函数使用 `camelCase`
- Props 类型使用 `interface` 定义，命名为 `XxxProps`
- 避免使用 `any`，尽量提供完整类型标注

---

## 目录结构约定

```
open-claw/
├── src/                  # Rust 后端源码
│   ├── main.rs
│   ├── api/              # 路由/接口层
│   ├── models/           # 数据模型
│   ├── services/         # 业务逻辑
│   └── utils/            # 工具函数
├── frontend/             # React 前端源码
│   ├── src/
│   │   ├── components/   # 通用组件
│   │   ├── pages/        # 页面组件
│   │   ├── hooks/        # 自定义 Hooks
│   │   ├── services/     # API 请求封装
│   │   └── types/        # 全局类型定义
│   └── public/
├── Cargo.toml
├── package.json
└── README.md
```

---

## Copilot 行为指引

1. **生成代码前**，先理解上下文中已有的类型定义和模块结构，保持风格一致
2. **Rust 代码**中，优先使用迭代器链式调用而非手写循环
3. **React 组件**中，优先使用函数式组件，不使用 Class Component
4. 涉及前后端交互时，接口类型需在前后端**保持同步**（字段名、类型）
5. 生成的代码需考虑**错误边界**：Rust 侧返回明确的错误类型，React 侧处理加载/错误状态
6. 不自动引入未在 `Cargo.toml` 或 `package.json` 中声明的依赖
7. 安全相关代码（鉴权、输入校验）需额外注释说明意图

---

## 提交规范（Conventional Commits）

```
feat: 新增功能
fix: 修复 Bug
refactor: 重构（不影响功能）
docs: 文档更新
style: 代码格式调整
test: 测试相关
chore: 构建/依赖/配置变更
```

---

> 本文件用于指导 GitHub Copilot 在 open-claw 项目中生成符合项目规范的代码。
