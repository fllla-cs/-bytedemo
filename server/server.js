const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001;

// 1. 中间件配置
app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// 2. 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 简单处理文件名编码
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 3. 数据库文件路径
const DB_FILE = './database.json';

// 初始化数据库
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    users: [],
    videos: [
      {
        id: 'v1',
        title: '欢迎来到 ByteShorts',
        topic: '生活',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        authorId: 'u1',
        authorName: 'Admin',
        views: 1203,
        likes: 56,
        createdAt: Date.now(),
        comments: [] // 确保有 comments 字段
      }
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE));
  } catch (e) {
    return { users: [], videos: [] };
  }
};
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// --- API 路由 ---

// 注册
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ message: '用户已存在' });
  }
  const newUser = { id: 'u' + Date.now(), username, password };
  db.users.push(newUser);
  writeDB(db);
  res.json({ message: '注册成功', user: { id: newUser.id, username: newUser.username } });
});

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: '登录成功', user: { id: user.id, username: user.username } });
  } else {
    res.status(401).json({ message: '用户名或密码错误' });
  }
});

// 获取视频列表
app.get('/api/videos', (req, res) => {
  const db = readDB();
  const videos = db.videos.map(v => ({
    ...v,
    // 确保旧数据也有 comments 数组
    comments: v.comments || [], 
    url: v.url.startsWith('http') ? v.url : `http://localhost:${PORT}/uploads/${v.url}`
  }));
  res.json(videos);
});

// 上传视频
app.post('/api/videos', upload.single('video'), (req, res) => {
  const { title, topic, authorId, authorName, videoUrl } = req.body;
  const db = readDB();
  const newVideo = {
    id: 'v' + Date.now(),
    title,
    topic,
    url: req.file ? req.file.filename : videoUrl, 
    authorId,
    authorName,
    views: 0,
    likes: 0,
    createdAt: Date.now(),
    comments: []
  };
  db.videos.push(newVideo);
  writeDB(db);
  res.json(newVideo);
});

// 点赞
app.post('/api/videos/:id/like', (req, res) => {
  const db = readDB();
  const video = db.videos.find(v => v.id === req.params.id);
  if (video) {
    video.likes = (video.likes || 0) + 1;
    writeDB(db);
    res.json({ likes: video.likes });
  } else {
    res.status(404).json({ message: '视频不存在' });
  }
});

// 播放统计
app.post('/api/videos/:id/view', (req, res) => {
  const db = readDB();
  const video = db.videos.find(v => v.id === req.params.id);
  if (video) {
    video.views = (video.views || 0) + 1;
    writeDB(db);
    res.json({ views: video.views });
  } else {
    res.status(404).json({ message: '视频不存在' });
  }
});

// ★★★ 关键修复：评论接口 ★★★
app.post('/api/videos/:id/comments', (req, res) => {
  const db = readDB();
  const video = db.videos.find(v => v.id === req.params.id);
  const { userId, userName, text } = req.body;

  if (video) {
    // 确保 comments 数组存在
    if (!video.comments) video.comments = [];
    
    const newComment = {
      id: 'c' + Date.now(),
      userId,
      userName,
      text,
      timestamp: Date.now()
    };
    // 新评论插在最前面
    video.comments.unshift(newComment);
    writeDB(db);
    res.json(newComment);
  } else {
    res.status(404).json({ message: '视频ID未找到，无法评论' });
  }
});

// 删除视频
app.delete('/api/videos/:id', (req, res) => {
  const db = readDB();
  const newVideos = db.videos.filter(v => v.id !== req.params.id);
  db.videos = newVideos;
  writeDB(db);
  res.json({ message: '删除成功' });
});

// 编辑视频
app.put('/api/videos/:id', (req, res) => {
  const db = readDB();
  const video = db.videos.find(v => v.id === req.params.id);
  if (video) {
    if(req.body.title) video.title = req.body.title;
    if(req.body.topic) video.topic = req.body.topic;
    writeDB(db);
    res.json(video);
  } else {
    res.status(404).json({ message: '视频不存在' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});