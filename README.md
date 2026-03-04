# u-wind

u-wind 是一个模仿 open-claw 的全栈项目，后端使用 Rust（axum + tokio），前端使用 React + TypeScript + Vite。

## 当前目录结构

```md
u-wind/
├── src/ # Rust 后端源码
│ ├── main.rs
│ ├── api/
│ │ └── mod.rs # 路由入口（/api/health）
│ ├── models/
│ │ ├── health.rs
│ │ └── mod.rs
│ ├── services/
│ │ ├── health_service.rs
│ │ └── mod.rs
│ └── utils/
│ ├── error.rs
│ └── mod.rs
├── frontend/ # React 前端工程（独立 package.json）
│ ├── package.json
│ ├── vite.config.ts
│ ├── tsconfig\*.json
│ ├── public/
│ └── src/
│ ├── main.tsx
│ ├── App.tsx
│ ├── App.css
│ ├── index.css
│ └── assets/
├── Cargo.toml
└── README.md
```

## 本地开发

### 1) 启动后端（Rust）

```bash
cargo run
```

默认监听地址：`http://127.0.0.1:3000`  
健康检查接口：`GET /api/health`

示例：

```bash
curl http://127.0.0.1:3000/api/health
```

### 2) 启动前端（React）

```bash
cd frontend
npm install
npm run dev
```

### 3) 前端常用命令

```bash
cd frontend
npm run build
npm run lint
npm run preview
```
