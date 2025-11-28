# ByteShorts - 现代化短视频创作管理系统
一个基于 React 18、TypeScript 和 Node.js 的全栈短视频管理平台。采用 Monorepo 架构理念，实现了从创作录制、内容管理到灵感发现的完整闭环。


## ✨ 核心特性 (Features)
### 🎬 沉浸式创作
- WebRTC 在线录制：调用浏览器摄像头与麦克风，实时捕获创意灵感。
- 大文件切片上传：支持流式上传视频文件，提供流畅的发布体验。
- 创作管理：支持自定义封面、话题标签选择。

### 🎨 现代化 UI/UX
- 极致美学：基于 Tailwind CSS 打造的 Glassmorphism (毛玻璃) 视觉风格。
- 骨架屏优化：内置 Skeleton Loading 技术，消除数据加载时的白屏焦虑。
- 全响应式布局：完美适配桌面端与移动设备。

### 💡 灵感发现流
- 瀑布流 (Masonry)：智能网格布局，高效展示海量创意视频。
- 多维筛选：支持按“最新”、“最热”、“话题”进行快速筛选与排序。
- 实时搜索：基于关键词的模糊搜索，毫秒级响应。

### 💬 实时互动与弹幕 (Highlight)
- 全屏弹幕播放器：内置沉浸式播放组件，支持评论内容实时转化为弹幕飘送。
- 数据持久化：支持点赞、评论实时交互，数据完整落库至后端文件系统。

### 📊 数据看板
- 可视化分析：集成 Recharts 图表库，动态展示播放量趋势与用户互动数据。
- Top 榜单：自动计算并展示热门视频 Top 7 数据对比。


## 🔧 技术栈 (Tech Stack)
### 前端 (Client)
| 模块       | 技术选型         | 说明                     |
|------------|------------------|--------------------------|
| 核心框架   | React 18 + Vite 5 | 高性能前端构建方案       |
| 开发语言   | TypeScript 5.x   | 强类型约束，提升代码质量 |
| 样式方案   | Tailwind CSS 3.4 | 原子化 CSS，快速构建 UI  |
| 图标库     | Lucide React     | 现代化轻量级图标集       |
| 图表库     | Recharts         | 声明式数据可视化组件     |
| 多媒体     | WebRTC API       | 浏览器原生音视频录制     |

### 后端 (Server)
| 模块       | 技术选型         | 说明                               |
|------------|------------------|------------------------------------|
| 运行环境   | Node.js (v18+)   | 服务端 JavaScript 运行时           |
| Web 框架   | Express.js       | 轻量级 Web 应用框架                |
| 文件处理   | Multer           | Node.js 中间件，用于处理 multipart/form-data |
| 数据库     | JSON-based DB    | 轻量级本地文件数据库 (模拟 NoSQL)  |
| 跨域处理   | CORS             | 解决前后端分离跨域问题             |


## 📂 项目结构 (Project Structure)
本项目采用类 Monorepo 结构进行管理：
```text
byte-shorts-demo/
├── client/          # [前端] React + Vite 工程
│   ├── src/
│   │   ├── components/  # 通用 UI 组件（弹幕播放器、骨架屏等）
│   │   ├── config/      # 全局配置（API地址、常量）
│   │   ├── types/       # TypeScript 类型定义（User，VideoData）
│   │   ├── views/       # 核心页面视图（创意流、创作中心、管理后台）
│   │   ├── App.tsx      # 应用主组件（路由与布局）
│   │   └── index.css    # 全局样式与 Tailwind 指令
│   ├── index.html       # 前端入口 HTML
│   └── tailwind.config.js # 样式配置文件
├── server/          # [后端] Node.js + Express 工程
│   ├── uploads/         # 视频/图片静态资源存储目录
│   ├── database.json    # 轻量级 JSON 数据库文件（模拟持久化）
│   └── server.js        # API 服务入口文件
├── .gitignore       # Git 忽略配置
└── README.md        # 项目说明文档