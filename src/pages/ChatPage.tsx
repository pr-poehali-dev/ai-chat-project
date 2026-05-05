import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/lib/LangContext';
import OxLogo from '@/components/OxLogo';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const API_KEY = 'ypr_OBqnJxMDLkBWn3IztUOX6dcuW8hH3AfeUHrOAku7X3k';
const CHAT_URL = 'https://jpdwcpxlotztzrqcgfeg.supabase.co/functions/v1/v1-chat';
const DAILY_LIMIT = 256;
const STORAGE_KEY = 'oxiwis_requests';
const SESSIONS_KEY = 'oxiwis_sessions';

function getUsageToday(): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return 0;
  const data = JSON.parse(raw);
  const today = new Date().toDateString();
  if (data.date !== today) return 0;
  return data.count || 0;
}

function incrementUsage() {
  const today = new Date().toDateString();
  const count = getUsageToday() + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count }));
}

function getSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((s: ChatSession) => ({
      ...s,
      messages: s.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })),
      createdAt: new Date(s.createdAt),
    }));
  } catch { return []; }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export default function ChatPage() {
  const { tr } = useLang();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>(getSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const [usageCount, setUsageCount] = useState(getUsageToday());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const newChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  const saveSession = (msgs: Message[], sessionId: string | null) => {
    if (msgs.length < 2) return;
    const allSessions = getSessions();
    const title = msgs[0].content.slice(0, 40) + (msgs[0].content.length > 40 ? '...' : '');
    if (sessionId) {
      const updated = allSessions.map(s => s.id === sessionId ? { ...s, messages: msgs } : s);
      saveSessions(updated);
      setSessions(updated);
    } else {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title,
        messages: msgs,
        createdAt: new Date(),
      };
      const updated = [newSession, ...allSessions];
      saveSessions(updated);
      setSessions(updated);
      setCurrentSessionId(newSession.id);
      return newSession.id;
    }
    return sessionId;
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    setSessions(updated);
    if (currentSessionId === id) newChat();
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (usageCount >= DAILY_LIMIT) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    incrementUsage();
    setUsageCount(getUsageToday());

    try {
      const body = {
        model: 'oxiwis-ai',
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        stream: false,
      };

      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      let content = '';
      let thinking = '';

      if (data.choices?.[0]?.message) {
        content = data.choices[0].message.content || '';
        thinking = data.choices[0].message.thinking || '';
      } else if (data.content) {
        if (Array.isArray(data.content)) {
          for (const block of data.content) {
            if (block.type === 'thinking') thinking = block.thinking || '';
            if (block.type === 'text') content = block.text || '';
          }
        } else {
          content = data.content;
        }
      } else if (data.message) {
        content = data.message;
      } else {
        content = JSON.stringify(data);
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        thinking: thinking || undefined,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      const sid = saveSession(finalMessages, currentSessionId);
      if (sid && !currentSessionId) setCurrentSessionId(sid as string);
    } catch (err) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Ошибка соединения. Попробуйте ещё раз.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const remaining = DAILY_LIMIT - usageCount;

  return (
    <div className="flex h-screen" style={{ background: '#080808', paddingTop: 0 }}>
      {/* Sidebar */}
      <div
        className="transition-all duration-300 flex-shrink-0 flex flex-col"
        style={{
          width: sidebarOpen ? 260 : 0,
          overflow: 'hidden',
          background: '#0c0c0c',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ width: 260, padding: '72px 12px 12px' }} className="flex flex-col h-full">
          <button
            onClick={newChat}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl mb-4 text-sm font-medium transition-all ox-btn-primary"
          >
            <Icon name="Plus" size={16} />
            {tr('chat_new')}
          </button>

          <p className="text-xs mb-3 px-2" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'IBM Plex Mono' }}>
            {tr('chat_history')}
          </p>

          <div className="flex-1 overflow-y-auto space-y-1">
            {sessions.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {tr('history_empty')}
              </p>
            ) : sessions.map(s => (
              <div
                key={s.id}
                onClick={() => loadSession(s)}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: currentSessionId === s.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: currentSessionId === s.id ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                }}
              >
                <span className="text-xs truncate flex-1 mr-2" style={{ color: currentSessionId === s.id ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {s.title}
                </span>
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  <Icon name="Trash2" size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Usage counter */}
          <div className="mt-4 px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono' }}>Запросов сегодня</span>
              <span className="text-xs font-bold" style={{ color: remaining < 20 ? '#ff6b6b' : 'rgba(255,255,255,0.7)', fontFamily: 'IBM Plex Mono' }}>
                {usageCount}/{DAILY_LIMIT}
              </span>
            </div>
            <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-1 rounded-full transition-all"
                style={{ width: `${(usageCount / DAILY_LIMIT) * 100}%`, background: remaining < 20 ? '#ff6b6b' : 'white' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat topbar */}
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,8,0.9)', paddingTop: 72 }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg transition-all"
            style={{ color: sidebarOpen ? 'white' : 'rgba(255,255,255,0.45)', background: sidebarOpen ? 'rgba(255,255,255,0.08)' : 'transparent' }}
          >
            <Icon name="PanelLeft" size={18} />
          </button>

          <div className="flex items-center gap-2 flex-1">
            <OxLogo size={24} glow className="rounded-md" />
            <span className="font-semibold text-sm text-white">OxiwisAI</span>
            <span className="text-xs font-mono-ox" style={{ color: 'rgba(255,255,255,0.3)' }}>~1T params</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={newChat}
              className="p-2 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)' }}
              title={tr('chat_new')}
            >
              <Icon name="SquarePen" size={16} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in" style={{ minHeight: '50vh' }}>
              <div className="relative mb-6">
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, rgba(150,180,255,0.1) 0%, transparent 70%)', transform: 'scale(3)' }} />
                <OxLogo size={64} glow className="rounded-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{tr('chat_empty_title')}</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{tr('chat_empty_sub')}</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1">
                  <OxLogo size={28} glow className="rounded-lg" />
                </div>
              )}
              <div className={`max-w-[75%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Thinking block */}
                {msg.thinking && (
                  <div className="w-full">
                    <button
                      onClick={() => toggleThinking(msg.id)}
                      className="flex items-center gap-2 text-xs mb-1 transition-opacity hover:opacity-70"
                      style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'IBM Plex Mono' }}
                    >
                      <Icon name={expandedThinking[msg.id] ? 'ChevronUp' : 'ChevronDown'} size={12} />
                      {tr('chat_thinking_label')}
                    </button>
                    {expandedThinking[msg.id] && (
                      <div className="thinking-text rounded-xl px-4 py-3 mb-2 animate-fade-in" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        {msg.thinking}
                      </div>
                    )}
                  </div>
                )}
                {/* Message bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'ox-message-user' : 'ox-message-ai'}`}
                  style={msg.role === 'user' ? { color: 'rgba(255,255,255,0.9)' } : { color: 'rgba(255,255,255,0.85)' }}
                >
                  {msg.content}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 mt-1 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                  <Icon name="User" size={14} />
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <OxLogo size={28} glow className="rounded-lg flex-shrink-0 mt-1" />
              <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white inline-block"
                    style={{ animation: `typing 1.4s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-4 pb-4 pt-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {usageCount >= DAILY_LIMIT && (
            <div className="mb-3 px-4 py-2 rounded-xl text-center text-sm" style={{ background: 'rgba(255,50,50,0.08)', color: '#ff6b6b', border: '1px solid rgba(255,50,50,0.15)' }}>
              Лимит {DAILY_LIMIT} запросов в сутки исчерпан. Возвращайтесь завтра.
            </div>
          )}

          <div
            className="flex items-end gap-3 p-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tr('chat_placeholder')}
              rows={1}
              disabled={loading || usageCount >= DAILY_LIMIT}
              className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.9)', minHeight: 24, maxHeight: 160, caretColor: 'white' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || usageCount >= DAILY_LIMIT}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={input.trim() && !loading && usageCount < DAILY_LIMIT ? { background: 'white', color: '#080808' } : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}
            >
              <Icon name="ArrowUp" size={16} />
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono' }}>
            {remaining} / {DAILY_LIMIT} запросов осталось сегодня
          </p>
        </div>
      </div>
    </div>
  );
}