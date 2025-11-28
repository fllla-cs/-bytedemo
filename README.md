# ByteShorts 短视频管理系统

这是一个基于 React 和 Node.js 的全栈短视频管理平台。
支持视频上传、在线录制、弹幕播放、数据看板等功能。

## 核心功能

1. **沉浸式创作**
   - 支持在线录制视频（WebRTC）
   - 支持本地视频上传

2. **灵感发现**
   - 瀑布流展示视频列表
   - 支持搜索和筛选

3. **互动体验**
   - 全屏弹幕播放器
   - 支持点赞和评论（数据已落库）

4. **数据看板**
   - 可视化展示播放量和点赞趋势

## 快速开始

### 1. 下载代码
```bash
git clone [https://github.com/fllla-cs/-bytedemo.git] 
cd byte-shorts-demo

### 第四块：技术栈 



```markdown
## 技术栈

### 前端
- **框架**: React 18 + Vite 5
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件**: Lucide React (图标), Recharts (图表)

### 后端
- **运行环境**: Node.js
- **框架**: Express.js
- **数据库**: 本地 JSON 文件 (模拟)
- **文件上传**: Multer