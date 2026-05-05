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
      case 'chat': return <ChatPage setPage={setPage} />;
      case 'about': return <AboutPage setPage={setPage} />;
      case 'docs': return <DocsPage />;
      case 'history': return <HistoryPage setPage={setPage} />;
      default: return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      {page !== 'chat' && <Navbar page={page} setPage={setPage} />}
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
