import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage, Dashboard, TemplateGallery, EditorPage } from './pages';
import { useAppStore } from './store/useAppStore';
import { initializeDatabase } from './lib/db';
import { Toaster } from 'sonner';

function AppContent() {
  const { loadState, isLoading } = useAppStore();

  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
      await loadState();
    };
    init();
  }, [loadState]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/templates" element={<TemplateGallery />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
