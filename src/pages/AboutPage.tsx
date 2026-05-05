import { useLang } from '@/lib/LangContext';
import OxLogo from '@/components/OxLogo';
import Icon from '@/components/ui/icon';

interface AboutPageProps {
  setPage: (p: string) => void;
}

const caps = Array.from({ length: 6 }, (_, i) => i + 1);

export default function AboutPage({ setPage }: AboutPageProps) {
  const { tr } = useLang();

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#080808' }}>
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(150,180,255,0.15) 0%, transparent 60%)', transform: 'scale(3)' }} />
            <OxLogo size={80} glow className="rounded-2xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 gradient-text" style={{ fontFamily: 'Golos Text' }}>
            {tr('about_title')}
          </h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>{tr('about_sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Параметры */}
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Icon name="Cpu" size={18} style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <h2 className="font-bold text-white">{tr('about_params_title')}</h2>
            </div>
            <div className="text-4xl font-black gradient-text mb-1" style={{ fontFamily: 'Golos Text' }}>
              {tr('about_params')}
            </div>
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'IBM Plex Mono' }}>
              {tr('about_params_note')}
            </p>
          </div>

          {/* О компании */}
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Icon name="Building2" size={18} style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <h2 className="font-bold text-white">{tr('about_company')}</h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {tr('about_company_desc')}
            </p>
          </div>
        </div>

        {/* Capabilities */}
        <div className="p-6 rounded-2xl mb-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <Icon name="Sparkles" size={18} style={{ color: 'rgba(255,255,255,0.8)' }} />
            </div>
            <h2 className="font-bold text-white">{tr('about_caps_title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {caps.map(i => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Icon name="Check" size={10} style={{ color: 'white' }} />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {tr(`about_cap${i}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { icon: 'Zap', val: '~1T', label: 'Параметров' },
            { icon: 'Globe', val: '5+', label: 'Языков' },
            { icon: 'Clock', val: '256', label: 'Запросов/день' },
          ].map(s => (
            <div key={s.val} className="p-4 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Icon name={s.icon} size={20} style={{ color: 'rgba(255,255,255,0.5)', display: 'block', margin: '0 auto 8px' }} />
              <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Golos Text' }}>{s.val}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={() => setPage('chat')}
            className="ox-btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold"
          >
            <Icon name="MessageSquare" size={18} />
            Попробовать OxiwisAI
          </button>
        </div>
      </div>
    </div>
  );
}
