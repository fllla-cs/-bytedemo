🎬 ByteShorts - 现代化短视频创作管理系统

一个基于 React 18、TypeScript 和 Node.js 的全栈短视频管理平台。
采用 Monorepo 架构理念，实现了从创作录制、内容管理到灵感发现的完整闭环。

✨ 核心特性 (Features)

🎥 沉浸式创作：

支持 WebRTC 在线录制，调用摄像头实时捕获创意。

支持 大文件切片上传 (模拟)，流畅的本地视频发布体验。

🎨 现代化 UI/UX：

基于 Tailwind CSS 的高颜值界面，全响应式布局。

内置 骨架屏 (Skeleton) 加载技术，提升首屏体验。

Glassmorphism (毛玻璃) 视觉风格，极致美感。

💡 灵感发现流：

瀑布流 (Masonry) 布局展示创意视频。

支持多维度 筛选 (Search) 与 排序 (Sort)。

💬 实时互动：

支持 点赞实时交互，数据持久化落库。

内置 弹幕播放器，评论内容实时上屏。

📊 数据看板：

集成 Recharts 图表库，可视化展示播放量、点赞趋势与热门内容。

🛠️ 技术栈 (Tech Stack)

前端 (Client)

框架：React 18 + Vite 5

语言：TypeScript 5.x

样式：Tailwind CSS 3.4 + Lucide Icons

图表：Recharts

状态管理：React Hooks (useState, useEffect, useMemo)

后端 (Server)

运行时：Node.js (v18+)

框架：Express.js

文件处理：Multer (流式上传)

数据库：JSON-based DB (轻量级模拟数据库，易于迁移至 MongoDB/MySQL)

跨域处理：CORS

📂 项目结构 (Project Structure)

本项目采用类 Monorepo 结构进行管理：

byte-shorts-demo/
├── client/                 # 前端工程
│   ├── src/
│   │   ├── components/     # 通用组件 (播放器、骨架屏等)
│   │   ├── views/          # 页面视图 (创作、管理、看板)
│   │   ├── types/          # TypeScript 类型定义
│   │   └── config/         # 全局配置
│   └── tailwind.config.js  # 样式配置
├── server/                 # 后端工程
│   ├── uploads/            # 视频/图片静态资源存储
│   ├── database.json       # 轻量级数据库文件
│   └── server.js           # API 服务入口
└── README.md               # 项目说明文档


🚀 快速开始 (Quick Start)

1. 克隆项目

git clone [https://github.com/fllla-cs/-bytedemo.git]
cd -bytedemo


2. 启动后端服务 (Server)

后端运行在 http://localhost:3001，负责数据存储与文件托管。

cd server
npm install    # 安装后端依赖
node server.js # 启动服务


看到 Server running at http://localhost:3001 即表示成功。

3. 启动前端应用 (Client)

前端运行在 http://localhost:5173，提供用户界面。

打开一个新的终端窗口：

cd client
npm install    # 安装前端依赖
npm run dev    # 启动开发服务器


按住 Ctrl 点击终端里的链接即可访问。

📝 接口文档 (API Docs)

方法

路径

描述

POST

/api/login

用户登录

GET

/api/videos

获取视频列表 (支持筛选/排序)

POST

/api/videos

上传发布视频 (支持文件流)

POST

/api/videos/:id/comments

发表评论

DELETE

/api/videos/:id

删除视频

🤝 贡献与致谢

感谢字节跳动工程训练营导师的指导。