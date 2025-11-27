import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Heart, MessageSquare, Upload, Video, Mic, 
  BarChart2, Settings, LogOut, Search, Filter, 
  MoreHorizontal, Edit, Trash2, Plus, LayoutGrid, 
  List, X, Wand2, Loader2, PlayCircle, Eye, ThumbsUp,
  User as UserIcon, Calendar, ArrowUpDown, Sparkles, Zap, Send, Film
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend 
} from 'recharts';

// --- 1. 配置与样式 ---
const API_BASE = 'http://localhost:3001/api';

const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
  .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.6); }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
`;
if (!document.getElementById('dynamic-styles')) {
  styleTag.id = 'dynamic-styles';
  document.head.appendChild(styleTag);
}

// --- 2. 类型定义 ---
interface User {
  id: string;
  username: string;
  avatar?: string;
}
interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}
interface VideoData {
  id: string;
  title: string;
  topic: string;
  url: string;
  coverUrl?: string;
  authorId: string;
  authorName: string;
  views: number;
  likes: number;
  createdAt: number;
  status: 'published' | 'draft';
  comments: Comment[];
}

type ViewState = 'login' | 'ideas' | 'studio' | 'manager' | 'dashboard';
type SortOption = 'time' | 'views' | 'likes';
const MOCK_TOPICS = ['生活', '科技', '游戏', '美食', '旅行', '知识', '搞笑', '时尚'];

// --- 3. Mock 数据  ---
const MOCK_VIDEOS: VideoData[] = [
  {
    id: '1',
    title: '【Demo】第一周前端界面搭建成果展示',
    topic: '科技',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    coverUrl: '',
    authorId: 'u1',
    authorName: 'ByteStudent',
    views: 1024,
    likes: 88,
    createdAt: Date.now(),
    status: 'published',
    comments: [
      { id: 'c1', userId: 'u2', userName: '导师', text: '界面还原度很高！', timestamp: Date.now() },
      { id: 'c2', userId: 'u3', userName: '同学A', text: 'UI 很有质感', timestamp: Date.now() }
    ]
  },
  {
    id: '2',
    title: 'WebRTC 录制功能初步调研',
    topic: '知识',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    coverUrl: '',
    authorId: 'u1',
    authorName: 'ByteStudent',
    views: 560,
    likes: 23,
    createdAt: Date.now() - 100000,
    status: 'published',
    comments: []
  }
];

// --- 4. 组件 ---
const SkeletonCard = () => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-sm animate-pulse">
    <div className="h-48 bg-slate-200"></div>
    <div className="p-4 space-y-3"><div className="h-4 bg-slate-200 rounded-full w-3/4"></div><div className="h-3 bg-slate-200 rounded-full w-1/2"></div></div>
  </div>
);

const DanmakuPlayer = ({ src, comments }: { src: string, comments: Comment[] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const togglePlay = () => {
    if (videoRef.current) { isPlaying ? videoRef.current.pause() : videoRef.current.play(); setIsPlaying(!isPlaying); }
  };
  return (
    <div className="relative bg-black rounded-xl overflow-hidden group aspect-[9/16] h-full max-h-[600px] flex items-center justify-center shadow-2xl">
      <video ref={videoRef} src={src} className="w-full h-full object-contain" loop onClick={togglePlay} playsInline />
      {!isPlaying && <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30"><PlayCircle className="w-12 h-12 text-white opacity-80" /></button>}
      {isPlaying && <div className="absolute inset-0 pointer-events-none overflow-hidden">{comments.map((c,i)=><div key={c.id} className="absolute text-white text-sm bg-black/40 px-2 py-1 rounded-full animate-float" style={{top:`${10+i*10}%`,left:'10%'}}>{c.text}</div>)}</div>}
    </div>
  );
};

// --- 5. 视图 (Mock Logic) ---

// 登录页
const AuthView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [loading, setLoading] = useState(false);
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ id: '1', username: 'Admin', avatar: 'A' }); 
    }, 1000);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="glass-card p-10 rounded-3xl shadow-xl w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8"><h1 className="text-3xl font-black text-slate-800">加入 ByteShorts</h1></div>
        <form onSubmit={handleAuth} className="space-y-5">
          <input className="w-full px-5 py-3 bg-slate-50 border rounded-xl outline-none" placeholder="随便输入用户名 (Mock Mode)" required />
          <input className="w-full px-5 py-3 bg-slate-50 border rounded-xl outline-none" type="password" placeholder="随便输入密码" required />
          <button disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center">{loading ? <Loader2 className="animate-spin" /> : '登录 / 注册'}</button>
        </form>
      </div>
    </div>
  );
};

// 创意灵感页
const IdeaView = ({ user }: { user: User }) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setVideos(MOCK_VIDEOS);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-2">创意灵感 <Sparkles className="text-yellow-500" /></h2>
      {loading ? <div className="grid grid-cols-4 gap-6">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div> : (
        <div className="columns-1 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {videos.map(video => (
            <div key={video.id} onClick={() => setActiveVideo(video)} className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl cursor-pointer">
              <div className="relative aspect-[9/16] bg-slate-100"><video src={video.url} className="w-full h-full object-cover" /></div>
              <div className="p-4"><h3 className="font-bold mb-2">{video.title}</h3><div className="flex justify-between text-sm text-slate-500"><span>@{video.authorName}</span><span>❤️ {video.likes}</span></div></div>
            </div>
          ))}
        </div>
      )}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-10" onClick={() => setActiveVideo(null)}>
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[80vh] flex overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="w-full bg-black flex items-center justify-center"><DanmakuPlayer src={activeVideo.url} comments={activeVideo.comments} /></div>
          </div>
        </div>
      )}
    </div>
  );
};

// 创作中心 (UI 展示)
const StudioView = () => {
  const [uploading, setUploading] = useState(false);
  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert('这是演示版：后端接口正在开发中，视频暂未真实存储。');
    }, 2000);
  };
  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-black text-slate-800 mb-8">创作中心</h2>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
        <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
          <Upload className="w-12 h-12 mb-2" />
          <p>点击上传或拖拽视频文件</p>
        </div>
        <input className="w-full border p-3 rounded-xl outline-none" placeholder="输入视频标题" />
        <button onClick={handleUpload} disabled={uploading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center gap-2">
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />} 立即发布
        </button>
      </div>
    </div>
  );
};

// 管理与看板 (静态展示)
const ManagerView = () => <div className="p-10 text-center text-slate-500">管理后台表格 UI 已就绪，等待接入真实数据...</div>;
const DashboardView = () => <div className="p-10 text-center text-slate-500">数据看板图表 UI 已就绪，等待接入真实数据...</div>;

// --- App Shell ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('ideas');
  if (!user) return <AuthView onLogin={setUser} />;
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="w-64 bg-white border-r p-6 flex flex-col shadow-sm z-20">
        <div className="text-2xl font-black text-indigo-600 mb-12 flex items-center gap-3"><Video /> ByteShorts</div>
        <nav className="space-y-2 flex-1">
          {[{id:'ideas',l:'创意灵感',i:LayoutGrid},{id:'studio',l:'创作中心',i:Plus},{id:'manager',l:'内容管理',i:List},{id:'dashboard',l:'数据看板',i:BarChart2}].map(t=><button key={t.id} onClick={()=>setView(t.id as any)} className={`w-full flex gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view===t.id?'bg-indigo-600 text-white':'text-slate-500 hover:bg-slate-50'}`}><t.i size={20}/>{t.l}</button>)}
        </nav>
        <div className="border-t pt-6 flex items-center gap-3"><div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">{user.username[0]}</div><span className="font-bold">{user.username}</span></div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-slate-50">{view === 'ideas' && <IdeaView user={user} />}{view === 'studio' && <StudioView />}{view === 'manager' && <ManagerView />}{view === 'dashboard' && <DashboardView />}</main>
    </div>
  );
}