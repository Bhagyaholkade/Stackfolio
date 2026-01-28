import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import NewRepository from '@/pages/NewRepository';
import Repository from '@/pages/Repository';
import Profile from '@/pages/Profile';
import RepositorySettings from '@/pages/Settings';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppContent() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={isAuthenticated ? <Dashboard /> : <Home />} />
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="new"
          element={
            <PrivateRoute>
              <NewRepository />
            </PrivateRoute>
          }
        />

        {/* Repository settings - must be before :owner/:repo */}
        <Route
          path=":owner/:repo/settings"
          element={
            <PrivateRoute>
              <RepositorySettings />
            </PrivateRoute>
          }
        />

        {/* Repository routes */}
        <Route path=":owner/:repo/tree/:branch/*" element={<Repository />} />
        <Route path=":owner/:repo/tree/:branch" element={<Repository />} />
        <Route path=":owner/:repo/blob/:branch/*" element={<Repository />} />
        <Route path=":owner/:repo" element={<Repository />} />

        {/* User profile - must be last as it catches all single-segment paths */}
        <Route path=":username" element={<Profile />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="container py-12 text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-muted-foreground">Page not found</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="dark min-h-screen bg-background text-foreground antialiased">
          <AppContent />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
