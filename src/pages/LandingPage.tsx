import { useLang } from '@/lib/LangContext';
import OxLogo from '@/components/OxLogo';
import Icon from '@/components/ui/icon';

interface LandingPageProps {
  setPage: (p: string) => void;
}

const features = [
  { icon: 'Brain', key: 1 },
  { icon: 'Globe', key: 2 },
  { icon: 'Languages', key: 3 },
  { icon: 'Cpu', key: 4 },
];

export default function LandingPage({ setPage }: LandingPageProps) {
  const { tr } = useLang();

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(100,130,255,0.06) 0%, transparent 70%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-mono-ox"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow inline-block" />
            {tr('hero_badge')}
          </div>

          {/* Logo + Title */}
          <div className="flex flex-col items-center gap-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl animate-pulse-slow"
                style={{ background: 'radial-gradient(circle, rgba(150,180,255,0.15) 0%, transparent 70%)', transform: 'scale(2)' }} />
              <OxLogo size={88} glow className="rounded-2xl" />
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tight gradient-text" style={{ fontFamily: 'Golos Text', lineHeight: 1 }}>
              {tr('hero_title')}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}>
            {tr('hero_subtitle')}
          </p>

          {/* Meta tags */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="px-3 py-1 rounded-full text-xs font-mono-ox"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {tr('hero_param')}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono-ox"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {tr('hero_company')}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono-ox"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              256 req/day
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setPage('chat')}
              className="ox-btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold"
            >
              <Icon name="MessageSquare" size={18} />
              {tr('hero_cta')}
            </button>
            <button
              onClick={() => setPage('about')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Icon name="Info" size={18} />
              {tr('hero_cta2')}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: 'rgba(255,255,255,0.2)' }}>
          <Icon name="ChevronDown" size={20} />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.key}
              className="p-6 rounded-2xl transition-all duration-300 group animate-slide-up"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all"
                style={{ background: 'rgba(255,255,255,0.07)' }}>
                <Icon name={f.icon} size={20} style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">{tr(`feature${f.key}_title`)}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {tr(`feature${f.key}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="px-6 py-24 flex flex-col items-center text-center">
        <div className="max-w-2xl mx-auto p-12 rounded-3xl relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(100,130,255,0.05) 0%, transparent 70%)' }} />
          <OxLogo size={56} glow className="mx-auto mb-6 rounded-xl" />
          <h2 className="text-3xl font-black mb-4 gradient-text" style={{ fontFamily: 'Golos Text' }}>OxiwisAI</h2>
          <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>{tr('chat_empty_sub')}</p>
          <button
            onClick={() => setPage('chat')}
            className="ox-btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold"
          >
            <Icon name="Zap" size={18} />
            {tr('hero_cta')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
          © 2025 Oxiwis. OxiwisAI — {tr('hero_param')}
        </p>
      </footer>
    </div>
  );
}