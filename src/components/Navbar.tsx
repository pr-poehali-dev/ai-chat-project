import { useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { LANGUAGES } from '@/lib/i18n';
import OxLogo from './OxLogo';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  page: string;
  setPage: (p: string) => void;
}

export default function Navbar({ page, setPage }: NavbarProps) {
  const { lang, setLang, tr } = useLang();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { key: 'home', label: tr('nav_home') },
    { key: 'chat', label: tr('nav_chat') },
    { key: 'about', label: tr('nav_about') },
    { key: 'docs', label: tr('nav_docs') },
    { key: 'history', label: tr('nav_history') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      
      {/* Logo */}
      <button
        onClick={() => setPage('home')}
        className="flex items-center gap-3 group"
      >
        <OxLogo size={34} glow />
        <div className="flex flex-col leading-none">
          <span className="font-bold text-white text-base tracking-wide" style={{ fontFamily: 'Golos Text' }}>OxiwisAI</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'IBM Plex Mono' }}>by Oxiwis</span>
        </div>
      </button>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
            style={{
              color: page === item.key ? '#fff' : 'rgba(255,255,255,0.5)',
              background: page === item.key ? 'rgba(255,255,255,0.08)' : 'transparent',
              fontWeight: page === item.key ? 600 : 400,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right: lang + CTA */}
      <div className="flex items-center gap-3">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-ox transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {lang.toUpperCase()}
            <Icon name="ChevronDown" size={12} />
          </button>
          {langOpen && (
            <div
              className="absolute right-0 top-full mt-2 py-1 rounded-xl z-50 animate-scale-in"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', minWidth: 120, boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}
            >
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors"
                  style={{ color: lang === l.code ? '#fff' : 'rgba(255,255,255,0.55)', background: lang === l.code ? 'rgba(255,255,255,0.06)' : 'transparent' }}
                >
                  <span className="text-xs font-mono-ox opacity-60">{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Open chat btn */}
        <button
          onClick={() => setPage('chat')}
          className="hidden md:flex ox-btn-primary items-center gap-2 px-4 py-2 rounded-xl text-sm"
        >
          <Icon name="MessageSquare" size={14} />
          {tr('nav_chat')}
        </button>

        {/* Mobile menu */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="absolute top-full left-0 right-0 py-2 animate-fade-in"
          style={{ background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setPage(item.key); setMobileOpen(false); }}
              className="w-full text-left px-6 py-3 text-sm transition-colors"
              style={{ color: page === item.key ? '#fff' : 'rgba(255,255,255,0.55)' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
