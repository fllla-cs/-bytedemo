import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Heart, MessageSquare, Upload, Video, Mic, 
  BarChart2, Settings, LogOut, Search, Filter, 
  MoreHorizontal, Edit, Trash2, Plus, LayoutGrid, 
  List, X, Loader2, PlayCircle, Eye, ThumbsUp,
  User as UserIcon, Calendar, ArrowUpDown, Sparkles, Zap, Send, Film
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend 
} from 'recharts';

// --- 1. Configuration & Styles ---
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

// --- 2. Types ---
interface User {
  id: string;
  username: string;
  avatar?: string;
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

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

type ViewState = 'login' | 'ideas' | 'studio' | 'manager' | 'dashboard';
type SortOption = 'time' | 'views' | 'likes';

const MOCK_TOPICS = ['生活', '科技', '游戏', '美食', '旅行', '知识', '搞笑', '时尚'];

// --- 3. Helper Components ---

const SkeletonCard = () => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-sm animate-pulse">
    <div className="h-48 bg-slate-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
      <div className="h-3 bg-slate-200 rounded-full w-1/2"></div>
    </div>
  </div>
);

const DanmakuPlayer = ({ src, comments, onPlay }: { src: string, comments: Comment[], onPlay?: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        if (onPlay) onPlay();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group aspect-[9/16] h-full max-h-[600px] flex items-center justify-center shadow-2xl">
      <video 
        ref={videoRef}
        src={src} 
        className="w-full h-full object-contain"
        loop
        onClick={togglePlay}
        playsInline
      />
      {!isPlaying && (
        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] group-hover:bg-black/30 transition-all">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
            <PlayCircle className="w-10 h-10 text-white fill-white/20" />
          </div>
        </button>
      )}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {(comments || []).slice(-5).map((c, i) => (
            <div 
              key={c.id} 
              className="absolute text-white text-sm font-medium shadow-lg whitespace-nowrap animate-slide-left px-3 py-1.5 bg-black/40 rounded-full backdrop-blur-md border border-white/10"
              style={{ 
                top: `${15 + (i * 12)}%`, 
                right: '-100%', 
                animationDuration: `${6 + Math.random() * 4}s`,
                animationDelay: `${i * 1.5}s`
              }}
            >
              {c.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 4. View Components ---

// A. Auth View
const AuthView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endpoint = isRegister ? '/register' : '/login';
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '操作失败');
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[100px] animate-float" style={{animationDelay: '2s'}}></div>

      <div className="glass-card p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <Video className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {isRegister ? '加入 ByteShorts' : '欢迎回来'}
          </h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="用户名"
            required
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="密码"
            required
          />
          {error && <div className="text-red-500 text-sm px-2">{error}</div>}
          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isRegister ? '注 册' : '登 录')}
          </button>
        </form>
        <button 
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-6 text-slate-500 text-sm hover:text-indigo-600 underline"
        >
          {isRegister ? '去登录' : '去注册'}
        </button>
      </div>
    </div>
  );
};

// B. Idea View
const IdeaView = ({ user }: { user: User }) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('time');
  
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_BASE}/videos`);
      const data = await res.json();
      setVideos(data);
      if (activeVideo) {
        const updatedActive = data.find((v: VideoData) => v.id === activeVideo.id);
        if (updatedActive) setActiveVideo(updatedActive);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchVideos(); }, []);

  const processedVideos = useMemo(() => {
    let res = videos.filter(v => {
      const matchText = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.topic.includes(searchQuery);
      const matchTopic = selectedTopic === 'All' || v.topic === selectedTopic;
      return matchText && matchTopic;
    });
    res.sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'likes') return b.likes - a.likes;
      return b.createdAt - a.createdAt;
    });
    return res;
  }, [videos, searchQuery, selectedTopic, sortBy]);

  const handleLike = async (e: React.MouseEvent, video: VideoData) => {
    e.stopPropagation();
    const newVideos = videos.map(v => v.id === video.id ? { ...v, likes: v.likes + 1 } : v);
    setVideos(newVideos);
    if (activeVideo && activeVideo.id === video.id) {
      setActiveVideo({ ...activeVideo, likes: activeVideo.likes + 1 });
    }
    await fetch(`${API_BASE}/videos/${video.id}/like`, { method: 'POST' });
  };

  const handleView = async () => {
    if (!activeVideo) return;
    const newVideos = videos.map(v => v.id === activeVideo.id ? { ...v, views: v.views + 1 } : v);
    setVideos(newVideos);
    await fetch(`${API_BASE}/videos/${activeVideo.id}/view`, { method: 'POST' });
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      alert("请输入评论内容");
      return;
    }
    if (!activeVideo) return;
    
    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE}/videos/${activeVideo.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userName: user.username, text: commentText })
      });
      
      if (res.ok) {
        const newComment = await res.json();
        const updatedVideo = { 
          ...activeVideo, 
          comments: [newComment, ...(activeVideo.comments || [])] 
        };
        setActiveVideo(updatedVideo);
        setVideos(prevVideos => prevVideos.map(v => v.id === updatedVideo.id ? updatedVideo : v));
        setCommentText('');
      } else {
        const err = await res.json();
        alert(`发送失败: ${err.message}`);
      }
    } catch (err) { 
      console.error(err);
      alert('网络错误，请检查后端是否启动'); 
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            创意灵感 <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" />
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 outline-none cursor-pointer"
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
          >
            <option value="All">全部分类</option>
            {MOCK_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select 
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 outline-none cursor-pointer"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
          >
            <option value="time">最新</option>
            <option value="views">播放</option>
            <option value="likes">点赞</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {processedVideos.map(video => (
            <div key={video.id} onClick={() => setActiveVideo(video)} className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="relative aspect-[9/16] bg-slate-100 overflow-hidden">
                <video src={video.url} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 text-white flex items-center gap-3 text-xs font-medium">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full"><Play className="w-3 h-3 fill-current" /> {video.views}</span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">#{video.topic}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">{video.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center text-[10px] text-white font-bold">{video.authorName[0].toUpperCase()}</div>
                    <span className="text-xs text-slate-500 font-medium truncate max-w-[80px]">{video.authorName}</span>
                  </div>
                  <button onClick={(e) => handleLike(e, video)} className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors group/like">
                    <Heart className={`w-4 h-4 group-active/like:scale-125 transition-transform ${video.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} /> {video.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-10" onClick={() => setActiveVideo(null)}>
          <div className="bg-white rounded-3xl w-full max-w-6xl h-[85vh] flex overflow-hidden shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative">
              <DanmakuPlayer src={activeVideo.url} comments={activeVideo.comments || []} onPlay={handleView} />
            </div>
            <div className="hidden md:flex flex-col w-2/5 border-l border-slate-100 bg-white">
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">{activeVideo.authorName[0]}</div>
                    <div><div className="font-bold text-slate-800">{activeVideo.authorName}</div><div className="text-xs text-slate-400">发布于 {new Date(activeVideo.createdAt).toLocaleDateString()}</div></div>
                  </div>
                  <button onClick={() => setActiveVideo(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{activeVideo.title}</h2>
                <div className="flex gap-3 mt-4">
                   <div className="flex items-center gap-1 text-slate-500 text-sm"><Eye className="w-4 h-4"/> {activeVideo.views}</div>
                   <button onClick={(e) => handleLike(e, activeVideo)} className="flex items-center gap-1 text-rose-500 text-sm font-bold hover:scale-105 transition-transform"><Heart className={`w-4 h-4 ${activeVideo.likes > 0 ? 'fill-rose-500' : ''}`}/> {activeVideo.likes}</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <h4 className="font-bold text-sm text-slate-800">评论区 ({activeVideo.comments?.length || 0})</h4>
                {(!activeVideo.comments || activeVideo.comments.length === 0) && <div className="text-center text-slate-400 text-sm mt-10">暂无评论，快来发布第一条吧！</div>}
                {(activeVideo.comments || []).map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">{c.userName[0]}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline"><span className="font-bold text-slate-700 text-xs">{c.userName}</span><span className="text-[10px] text-slate-400">{new Date(c.timestamp).toLocaleTimeString()}</span></div>
                      <p className="text-slate-600 text-sm mt-1 bg-slate-50 p-2 rounded-lg rounded-tl-none">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100">
                 <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                   <input 
                     type="text" 
                     placeholder="发送一条友善的评论..." 
                     className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none text-slate-700"
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendComment()}
                     disabled={isSending}
                   />
                   <button 
                     onClick={handleSendComment}
                     className={`bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors shadow-md ${isSending ? 'opacity-50' : ''}`}
                     disabled={isSending}
                   >
                     {isSending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// C. Studio View (Removed AIGC)
const StudioView = ({ user }: { user: User }) => {
  const [mode, setMode] = useState<'upload' | 'record'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('生活');
  const [uploading, setUploading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const chunks = useRef<Blob[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunks.current = [];
      mr.ondataavailable = e => chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        setFile(new File([blob], "rec.webm", { type: 'video/webm' })); setPreview(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(); setIsRecording(true);
    } catch (e) { alert('无法访问摄像头'); }
  };

  const handleUpload = async () => {
    if (!title) return;
    setUploading(true);
    
    const formData = new FormData();
    if (file) formData.append('video', file);
    formData.append('title', title); formData.append('topic', topic);
    formData.append('authorId', user.id); formData.append('authorName', user.username);
    try {
      const res = await fetch(`${API_BASE}/videos`, { method: 'POST', body: formData });
      if (res.ok) { alert('发布成功！'); setFile(null); setPreview(null); setTitle(''); }
    } catch (e) { alert('网络错误'); } finally { setUploading(false); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-2">创作中心 <Zap className="text-yellow-500 fill-yellow-500" /></h2>
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 inline-flex gap-1 mb-8">
        {[{ id: 'upload', label: '本地上传', icon: Upload }, { id: 'record', label: '在线录制', icon: Video }].map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id as any)} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${mode === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><tab.icon className="w-4 h-4" /> {tab.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden shadow-2xl border border-slate-800 group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          {preview ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black z-10">
              <video src={preview} controls className="max-h-[500px] max-w-full rounded-lg shadow-2xl" />
              <button onClick={() => { setPreview(null); setFile(null); }} className="absolute top-6 right-6 bg-white/10 backdrop-blur hover:bg-white/20 p-3 rounded-full text-white transition-all"><X className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="z-10 w-full h-full flex items-center justify-center">
              {mode === 'upload' && <label className="cursor-pointer flex flex-col items-center p-10 border-2 border-dashed border-slate-700 rounded-3xl hover:border-indigo-500 hover:bg-slate-800/50 transition-all group-hover:scale-105 duration-300"><div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mb-6 shadow-lg shadow-indigo-500/10"><Upload className="w-10 h-10" /></div><span className="text-white font-bold text-lg">点击选择视频文件</span><input type="file" hidden accept="video/*" onChange={handleFile} /></label>}
              {mode === 'record' && <div className="flex flex-col items-center w-full max-w-lg"><div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 mb-6"><video ref={videoRef} autoPlay muted className="w-full h-full object-cover" /></div>{!isRecording ? <button onClick={startRecording} className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-lg shadow-red-500/30 transition-all flex items-center gap-2">开始录制</button> : <button onClick={() => {mediaRecorderRef.current?.stop(); setIsRecording(false)}} className="px-8 py-3 bg-white text-red-500 rounded-full font-bold shadow-lg transition-all flex items-center gap-2">停止录制</button>}</div>}
            </div>
          )}
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl h-fit relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
          <h3 className="font-bold text-xl text-slate-800 mb-6">发布设置</h3>
          <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none mb-6" value={title} onChange={e => setTitle(e.target.value)} placeholder="取个好标题" />
          <div className="flex flex-wrap gap-2 mb-6">{MOCK_TOPICS.map(t => <button key={t} onClick={() => setTopic(t)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${topic === t ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border-slate-200'}`}>#{t}</button>)}</div>
          <button onClick={handleUpload} disabled={uploading || (!file && !preview)} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold disabled:bg-slate-300 flex items-center justify-center gap-2">{uploading ? <Loader2 className="animate-spin" /> : <Upload />} 发布</button>
        </div>
      </div>
    </div>
  );
};

// D. Manager View
const ManagerView = ({ user }: { user: User }) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', topic: '' });

  const fetchMyVideos = async () => {
    const res = await fetch(`${API_BASE}/videos`);
    const all: VideoData[] = await res.json();
    setVideos(all.filter(v => v.authorId === user.id));
  };

  useEffect(() => { fetchMyVideos(); }, [user]);

  const processedVideos = useMemo(() => {
    let res = videos.filter(v => v.title.toLowerCase().includes(filterText.toLowerCase()) || v.topic.includes(filterText));
    res.sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'likes') return b.likes - a.likes;
      return b.createdAt - a.createdAt;
    });
    return res;
  }, [videos, filterText, sortBy]);

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除？')) return;
    await fetch(`${API_BASE}/videos/${id}`, { method: 'DELETE' });
    fetchMyVideos();
  };

  const handleSave = async (id: string) => {
    await fetch(`${API_BASE}/videos/${id}`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(editForm) 
    });
    setEditingId(null); fetchMyVideos();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div><h2 className="text-3xl font-black text-slate-800">内容管理</h2><p className="text-slate-500 mt-1">管理你发布的 {videos.length} 个作品</p></div>
        <div className="flex gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
          <input className="px-4 py-2 bg-slate-50 rounded-lg text-sm outline-none w-64" placeholder="搜索..." value={filterText} onChange={e => setFilterText(e.target.value)} />
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none" value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}><option value="time">按时间</option><option value="views">按播放</option><option value="likes">按点赞</option></select>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr><th className="p-5">视频内容</th><th className="p-5">所属话题</th><th className="p-5">数据表现</th><th className="p-5">发布时间</th><th className="p-5 text-right">操作</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processedVideos.map(v => (
              <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-28 rounded-lg overflow-hidden shadow-md relative"><video src={v.url} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div></div>
                    {editingId === v.id ? <input className="border-b-2 border-indigo-500 bg-transparent py-1 outline-none font-bold text-slate-800 w-full" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} autoFocus /> : <span className="font-bold text-slate-800 line-clamp-2">{v.title}</span>}
                  </div>
                </td>
                <td className="p-5">{editingId === v.id ? <select value={editForm.topic} onChange={e => setEditForm({...editForm, topic: e.target.value})} className="bg-slate-100 rounded px-2 py-1 text-sm">{MOCK_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}</select> : <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">#{v.topic}</span>}</td>
                <td className="p-5"><div className="flex gap-4"><div className="flex flex-col"><span className="text-xs text-slate-400">播放</span><span className="font-bold text-slate-700">{v.views}</span></div><div className="flex flex-col"><span className="text-xs text-slate-400">点赞</span><span className="font-bold text-pink-500">{v.likes}</span></div></div></td>
                <td className="p-5 text-sm text-slate-500 font-medium">{new Date(v.createdAt).toLocaleDateString()}</td>
                <td className="p-5 text-right">
                  {editingId === v.id ? 
                    <div className="flex flex-col gap-2 items-end"><button onClick={() => handleSave(v.id)} className="text-white bg-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold">保存修改</button><button onClick={() => setEditingId(null)} className="text-slate-400 text-xs">取消</button></div> : 
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => {setEditingId(v.id); setEditForm({title: v.title, topic: v.topic})}} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4"/></button><button onClick={() => handleDelete(v.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button></div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {processedVideos.length === 0 && <div className="p-12 text-center text-slate-400">暂无相关视频</div>}
      </div>
    </div>
  );
};

// E. Dashboard
const DashboardView = () => {
  const [stats, setStats] = useState({ views: 0, likes: 0, comments: 0, count: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/videos`)
      .then(res => res.json())
      .then((videos: VideoData[]) => {
        const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
        const totalLikes = videos.reduce((acc, v) => acc + (v.likes || 0), 0);
        const totalComments = videos.reduce((acc, v) => acc + (v.comments?.length || 0), 0);
        setStats({ views: totalViews, likes: totalLikes, comments: totalComments, count: videos.length });

        const topVideos = [...videos]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 7)
          .map(v => ({
            name: v.title.length > 6 ? v.title.slice(0, 6) + '..' : v.title,
            views: v.views || 0,
            likes: v.likes || 0
          }));
        setChartData(topVideos);
      });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-black text-slate-800 mb-8">数据看板</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[{ l: '总播放量', v: stats.views.toLocaleString(), i: PlayCircle, c: 'from-blue-500 to-cyan-400' }, { l: '获赞总数', v: stats.likes.toLocaleString(), i: Heart, c: 'from-pink-500 to-rose-400' }, { l: '发布作品', v: stats.count, i: Film, c: 'from-indigo-500 to-purple-400' }, { l: '评论互动', v: stats.comments.toLocaleString(), i: MessageSquare, c: 'from-green-500 to-emerald-400' }].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
            <div><div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{item.l}</div><div className="text-3xl font-black text-slate-800">{item.v}</div></div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.c} text-white shadow-lg shadow-indigo-100`}><item.i className="w-6 h-6" /></div>
          </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl h-[500px]">
        <h3 className="font-bold text-lg text-slate-700 mb-6 flex items-center gap-2"><div className="w-2 h-6 bg-indigo-500 rounded-full"></div>热门视频数据对比 (Top 7)</h3>
        <ResponsiveContainer width="100%" height="85%">
          {chartData.length > 0 ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <ChartTooltip contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'}} cursor={{fill: '#f8fafc'}}/>
              <Legend verticalAlign="top" height={36}/>
              <Bar name="播放量" dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar name="点赞数" dataKey="likes" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          ) : (<div className="flex items-center justify-center h-full text-slate-400">暂无数据</div>)}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- 5. App Shell ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('ideas');
  if (!user) return <AuthView onLogin={setUser} />;
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <aside className="w-20 md:w-72 bg-white border-r border-slate-100 p-6 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-12 flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"><Video className="w-6 h-6" /></div><span className="hidden md:block tracking-tight">ByteShorts</span>
        </div>
        <nav className="space-y-2 flex-1">
          {[{ id: 'ideas', label: '创意灵感', icon: LayoutGrid }, { id: 'studio', label: '创作中心', icon: Plus }, { id: 'manager', label: '内容管理', icon: List }, { id: 'dashboard', label: '数据看板', icon: BarChart2 }].map(item => (
            <button key={item.id} onClick={() => setView(item.id as ViewState)} className={`w-full flex items-center gap-4 px-2 md:px-5 py-4 rounded-2xl font-bold transition-all duration-300 justify-center md:justify-start group relative overflow-hidden ${view === item.id ? 'text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}>
              {view === item.id && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>}
              <item.icon className={`w-5 h-5 relative z-10 ${view === item.id ? 'text-white' : ''}`} /> <span className="hidden md:block relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer mb-2 justify-center md:justify-start">
            <div className="w-10 h-10 bg-gradient-to-tr from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">{user.username[0].toUpperCase()}</div>
            <div className="hidden md:block"><div className="text-sm font-bold text-slate-800">{user.username}</div><div className="text-xs text-slate-400">Pro Creator</div></div>
          </div>
          <button onClick={() => setUser(null)} className="w-full flex items-center gap-3 px-2 md:px-4 py-2 text-slate-400 hover:text-red-500 text-xs font-bold justify-center md:justify-start transition-colors"><LogOut className="w-4 h-4" /> <span className="hidden md:block">退出登录</span></button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <div className="sticky top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-50 to-transparent z-10 pointer-events-none"></div>
        {view === 'ideas' && <IdeaView user={user} />}
        {view === 'studio' && <StudioView user={user} />}
        {view === 'manager' && <ManagerView user={user} />}
        {view === 'dashboard' && <DashboardView />}
      </main>
    </div>
  );
}