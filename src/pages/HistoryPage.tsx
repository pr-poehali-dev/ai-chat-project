import { useState } from 'react';
import { useLang } from '@/lib/LangContext';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

function getSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem('oxiwis_sessions');
    if (!raw) return [];
    return JSON.parse(raw).map((s: ChatSession) => ({
      ...s,
      messages: s.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })),
      createdAt: new Date(s.createdAt),
    }));
  } catch { return []; }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem('oxiwis_sessions', JSON.stringify(sessions));
}

interface HistoryPageProps {
  setPage: (p: string) => void;
}

export default function HistoryPage({ setPage }: HistoryPageProps) {
  const { tr } = useLang();
  const [sessions, setSessions] = useState<ChatSession[]>(getSessions);
  const [selected, setSelected] = useState<ChatSession | null>(null);

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    setSessions(updated);
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#080808' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 animate-slide-up">
          <h1 className="text-4xl font-black mb-2 gradient-text" style={{ fontFamily: 'Golos Text' }}>
            {tr('history_title')}
          </h1>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Icon name="MessageSquare" size={28} style={{ color: 'rgba(255,255,255,0.25)' }} />
            </div>
            <p className="text-lg font-semibold text-white mb-2">{tr('history_empty')}</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>{tr('history_empty_sub')}</p>
            <button
              onClick={() => setPage('chat')}
              className="ox-btn-primary px-6 py-3 rounded-xl font-semibold text-sm"
            >
              {tr('history_open_chat')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sessions list */}
            <div className="md:col-span-1 space-y-2">
              {sessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="group flex items-start justify-between p-4 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: selected?.id === s.id ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                    border: selected?.id === s.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium truncate" style={{ color: selected?.id === s.id ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                      {s.title}
                    </p>
                    <p className="text-xs mt-1 font-mono-ox" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {new Date(s.createdAt).toLocaleDateString()} · {s.messages.length} {tr('history_messages')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
                    style={{ color: 'rgba(255,80,80,0.7)', background: 'rgba(255,50,50,0.08)' }}
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="md:col-span-2">
              {selected ? (
                <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="font-semibold text-white text-sm">{selected.title}</h3>
                    <button
                      onClick={() => setPage('chat')}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ox-btn-primary"
                    >
                      <Icon name="ExternalLink" size={12} />
                      {tr('history_open')}
                    </button>
                  </div>
                  <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {selected.messages.map(m => (
                      <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className="max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed"
                          style={m.role === 'user' ? {
                            background: 'rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.85)',
                          } : {
                            color: 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center rounded-2xl py-20"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>{tr('history_select')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}