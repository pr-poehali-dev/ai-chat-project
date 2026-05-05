import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LangProvider } from '@/lib/LangContext';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import ChatPage from '@/pages/ChatPage';
import AboutPage from '@/pages/AboutPage';
import DocsPage from '@/pages/DocsPage';
import HistoryPage from '@/pages/HistoryPage';

const queryClient = new QueryClient();

function OxiwisApp() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'chat': return <ChatPage />;
      case 'about': return <AboutPage setPage={setPage} />;
      case 'docs': return <DocsPage />;
      case 'history': return <HistoryPage setPage={setPage} />;
      default: return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      {page !== 'chat' && <Navbar page={page} setPage={setPage} />}
      {page === 'chat' && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
          style={{ background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', height: 60 }}
        >
          <button onClick={() => setPage('home')} className="flex items-center gap-2">
            <img
              src="https://cdn.poehali.dev/projects/9cf785ba-1ef2-4065-96b9-eecf1d42ed04/bucket/45aae85e-4d2d-4d63-92af-83e395e5dcc8.jpg"
              alt="OxiwisAI"
              width={28}
              height={28}
              className="rounded-lg"
              style={{ filter: 'drop-shadow(0 0 8px rgba(150,180,255,0.4))' }}
            />
            <span className="font-bold text-white text-sm">OxiwisAI</span>
          </button>
          <div className="flex items-center gap-2">
            {['home', 'about', 'docs', 'history'].map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{ color: 'rgba(255,255,255,0.45)', background: 'transparent' }}
              >
                {p === 'home' ? '← Главная' : p === 'about' ? 'О модели' : p === 'docs' ? 'Docs' : 'История'}
              </button>
            ))}
          </div>
        </div>
      )}
      {renderPage()}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LangProvider>
        <Toaster />
        <Sonner />
        <OxiwisApp />
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
