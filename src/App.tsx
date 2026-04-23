/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MessageSquare, 
  Settings, 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Zap, 
  Send, 
  User, 
  Bot,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { askSEO, analyzeContent } from './services/geminiService';

type Tool = 'chat' | 'analyzer' | 'keywords' | 'checklist';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya adalah Asisten SEO pribadi Anda. Bagaimana saya bisa membantu Anda mengoptimalkan konten atau situs web Anda hari ini?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askSEO(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response || 'Maaf, saya tidak bisa memproses permintaan Anda saat ini.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [analyzerText, setAnalyzerText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Pastikan judul memiliki kata kunci utama', done: false },
    { id: 2, task: 'Gunakan URL yang ramah SEO (pendek dan deskriptif)', done: false },
    { id: 3, task: 'Optimalkan Meta Description (150-160 karakter)', done: false },
    { id: 4, task: 'Tambahkan atribut Alt pada semua gambar', done: false },
    { id: 5, task: 'Gunakan struktur heading (H1, H2, H3)', done: false },
    { id: 6, task: 'Pastikan konten memiliki 300+ kata', done: false },
    { id: 7, task: 'Gunakan link internal dan eksternal', done: false },
    { id: 8, task: 'Pastikan situs mobile-friendly', done: false },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAnalyze = async () => {
    if (!analyzerText.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeContent(analyzerText);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Same as before */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-bottom border-slate-100">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Zap size={20} />
          </div>
          <h1 className="font-bold text-lg tracking-tight">SEO Expert AI</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarItem 
            icon={<MessageSquare size={18} />} 
            label="Chat Asisten" 
            active={activeTool === 'chat'} 
            onClick={() => setActiveTool('chat')}
          />
          <SidebarItem 
            icon={<FileText size={18} />} 
            label="Analisis Konten" 
            active={activeTool === 'analyzer'} 
            onClick={() => setActiveTool('analyzer')}
          />
          <SidebarItem 
            icon={<CheckCircle2 size={18} />} 
            label="SEO Checklist" 
            active={activeTool === 'checklist'} 
            onClick={() => setActiveTool('checklist')}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Tips SEO Hari Ini</p>
            <p className="text-xs text-slate-600 italic">"Gunakan Schema Markup untuk membantu Google memahami konteks konten Anda."</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-white md:bg-transparent">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="md:hidden flex items-center gap-2 font-bold p-2 bg-indigo-600 rounded text-white mr-4">
              <Zap size={16} />
            </span>
            <div className="text-sm font-medium text-slate-500">
              {activeTool === 'chat' && 'AI Assistant Dashboard'}
              {activeTool === 'analyzer' && 'Content Optimization Engine'}
              {activeTool === 'checklist' && 'On-Page SEO Validator'}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
              <Sparkles size={12} />
              AI MODE ACTIVE
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs ring-2 ring-white">
              AZ
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            {activeTool === 'chat' && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto h-full flex flex-col"
              >
                <div className="flex-1 space-y-6 pb-24">
                  {messages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                  ))}
                  {isLoading && (
                    <div className="flex gap-4 items-start">
                      <div className="bg-slate-100 p-2 rounded-lg text-slate-400 animate-pulse">
                        <Bot size={20} />
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 text-slate-400 italic text-sm">
                        Sedang memikirkan solusi terbaik...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 md:px-8">
                  <form 
                    onSubmit={handleSendMessage}
                    className="bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl shadow-slate-200/50 flex items-center gap-2 focus-within:border-indigo-300 transition-all"
                  >
                    <input 
                      type="text" 
                      placeholder="Tanyakan apapun tentang SEO..." 
                      className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTool === 'analyzer' && (
              <motion.div 
                key="analyzer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Analisis Konten SEO</h2>
                      <p className="text-sm text-slate-500">Masukkan konten Anda untuk analisis optimasi mendalam.</p>
                    </div>
                  </div>
                  
                  <textarea 
                    className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 text-sm leading-relaxed"
                    placeholder="Tempel artikel atau paragraf Anda di sini..."
                    value={analyzerText}
                    onChange={(e) => setAnalyzerText(e.target.value)}
                  ></textarea>

                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !analyzerText}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 disabled:opacity-50"
                  >
                    {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles size={18} />}
                    {isAnalyzing ? 'Menganalisis Konten...' : 'Mulai Analisis AI'}
                  </button>
                </div>

                {analysisResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100"
                  >
                    <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                      <BarChart3 size={20} />
                      Hasil Analisis Asisten
                    </h3>
                    <div className="prose prose-indigo max-w-none text-slate-700 whitespace-pre-wrap">
                      {analysisResult}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTool === 'checklist' && (
              <motion.div 
                key="checklist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl mx-auto"
              >
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                  <div className="p-8 bg-indigo-600 text-white">
                    <h2 className="text-2xl font-bold mb-2">On-Page SEO Checklist</h2>
                    <p className="text-indigo-100 text-sm">Lengkapi semua langkah untuk skor optimasi maksimal.</p>
                  </div>
                  
                  <div className="p-6 divide-y divide-slate-100">
                    {checklist.map(item => (
                      <div 
                        key={item.id} 
                        className="py-4 flex items-center justify-between group cursor-pointer"
                        onClick={() => toggleChecklist(item.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                            ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 group-hover:border-indigo-400'}
                          `}>
                            {item.done && <CheckCircle2 size={14} />}
                          </div>
                          <span className={`text-sm font-medium transition-all ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {item.task}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      PROGRES: {Math.round((checklist.filter(i => i.done).length / checklist.length) * 100)}%
                    </div>
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(checklist.filter(i => i.done).length / checklist.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
        ${active 
          ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {active && <ChevronRight size={14} className="ml-auto" />}
    </button>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isAssistant = message.role === 'assistant';
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: isAssistant ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex gap-4 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center
        ${isAssistant ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-900 text-white'}
      `}>
        {isAssistant ? <Bot size={20} /> : <User size={20} />}
      </div>
      
      <div className={`
        max-w-[80%] rounded-3xl p-5 text-sm leading-relaxed
        ${isAssistant 
          ? 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none' 
          : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100'
        }
      `}>
        <div className="whitespace-pre-wrap prose prose-sm max-w-none">
          {message.content}
        </div>
        <div className={`text-[10px] mt-3 opacity-50 ${isAssistant ? 'text-slate-500' : 'text-indigo-100'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}

function StatsCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
