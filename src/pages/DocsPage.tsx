import { useState } from 'react';
import { useLang } from '@/lib/LangContext';
import Icon from '@/components/ui/icon';

const BASE_URL = 'https://jpdwcpxlotztzrqcgfeg.supabase.co/functions/v1';

const requestExample = `fetch('${BASE_URL}/v1-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'oxiwis-ai',
    messages: [
      { role: 'user', content: 'Привет!' }
    ],
    stream: false,
    // Режим рассуждения:
    thinking: { type: 'enabled', budget_tokens: 8000 },
    // Поиск в сети:
    tools: [{ type: 'web_search' }]
  })
})`;

const responseExample = `{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Привет! Чем могу помочь?",
        "thinking": "Пользователь поздоровался..."
      }
    }
  ]
}`;

const params = [
  { name: 'model', type: 'string', req: true, desc: 'ID модели: oxiwis-ai' },
  { name: 'messages', type: 'array', req: true, desc: 'Массив сообщений [{role, content}]' },
  { name: 'stream', type: 'boolean', req: false, desc: 'Потоковый ответ (false по умолчанию)' },
  { name: 'thinking', type: 'object', req: false, desc: '{ type: "enabled", budget_tokens: N } — режим рассуждения' },
  { name: 'tools', type: 'array', req: false, desc: '[{ type: "web_search" }] — поиск в интернете' },
  { name: 'temperature', type: 'number', req: false, desc: 'Температура генерации 0.0–2.0' },
  { name: 'max_tokens', type: 'number', req: false, desc: 'Максимальное число токенов в ответе' },
];

function CodeBlock({ code, label, tr }: { code: string; label: string; tr: (k: string) => string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0c0c0c', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <span className="text-xs font-mono-ox" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs transition-all px-2 py-1 rounded"
          style={{ color: copied ? 'white' : 'rgba(255,255,255,0.35)', background: copied ? 'rgba(255,255,255,0.08)' : 'transparent' }}
        >
          <Icon name={copied ? 'Check' : 'Copy'} size={12} />
          {copied ? tr('docs_copied') : tr('docs_copy')}
        </button>
      </div>
      <pre className="p-4 text-xs overflow-x-auto font-mono-ox" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
        {code}
      </pre>
    </div>
  );
}

export default function DocsPage() {
  const { tr } = useLang();

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#080808' }}>
      <div className="max-w-3xl mx-auto">

        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl font-black mb-3 gradient-text" style={{ fontFamily: 'Golos Text' }}>
            {tr('docs_title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>{tr('docs_sub')}</p>
        </div>

        {/* Base URL */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Icon name="Link" size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            {tr('docs_base_url')}
          </h2>
          <CodeBlock code={BASE_URL} label="Base URL" tr={tr} />
        </section>

        {/* Auth */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Icon name="Key" size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            {tr('docs_auth')}
          </h2>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{tr('docs_auth_desc')}</p>
          <CodeBlock code={`Authorization: Bearer YOUR_API_KEY`} label="Header" tr={tr} />
        </section>

        {/* Endpoints */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="Waypoints" size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            {tr('docs_endpoints')}
          </h2>
          <div className="space-y-3">
            {[
              { method: 'GET', path: '/v1-models', label: tr('docs_models_ep') },
              { method: 'POST', path: '/v1-chat', label: tr('docs_chat_ep') },
            ].map(ep => (
              <div key={ep.path} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-xs font-bold font-mono-ox px-2 py-0.5 rounded"
                  style={{ background: ep.method === 'GET' ? 'rgba(100,200,100,0.1)' : 'rgba(100,150,255,0.1)', color: ep.method === 'GET' ? '#6ec97a' : '#7aaeff' }}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono-ox text-white">{ep.path}</code>
                <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>{ep.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Params table */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            {tr('docs_params')}
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="grid grid-cols-4 px-4 py-2 text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', gridTemplateColumns: '1fr 1fr auto 2fr' }}>
              <span>{tr('docs_col_param')}</span><span>{tr('docs_col_type')}</span><span>{tr('docs_col_req')}</span><span>{tr('docs_col_desc')}</span>
            </div>
            {params.map((p, i) => (
              <div
                key={p.name}
                className="grid px-4 py-3 text-sm items-center"
                style={{ gridTemplateColumns: '1fr 1fr auto 2fr', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
              >
                <code className="font-mono-ox text-xs text-white">{p.name}</code>
                <span className="text-xs font-mono-ox" style={{ color: '#7aaeff' }}>{p.type}</span>
                <span className="text-xs font-mono-ox ml-2" style={{ color: p.req ? '#6ec97a' : 'rgba(255,255,255,0.25)' }}>
                  {p.req ? tr('docs_yes') : tr('docs_no')}
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Example */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="Code2" size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            {tr('docs_example')}
          </h2>
          <CodeBlock code={requestExample} label="JavaScript / fetch" tr={tr} />
        </section>

        {/* Response */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="FileJson" size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            {tr('docs_response')}
          </h2>
          <CodeBlock code={responseExample} label="JSON Response" tr={tr} />
        </section>

        {/* Limits */}
        <section>
          <div className="p-5 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(255,200,50,0.05)', border: '1px solid rgba(255,200,50,0.12)' }}>
            <Icon name="AlertTriangle" size={18} style={{ color: 'rgba(255,200,50,0.7)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,200,50,0.8)' }}>{tr('docs_limits')}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}
                dangerouslySetInnerHTML={{ __html: tr('docs_limits_desc') }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}