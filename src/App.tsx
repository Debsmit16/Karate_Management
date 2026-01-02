import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import RefereeDashboard from './pages/RefereeDashboard';
import CoachDashboard from './pages/CoachDashboard';
import TournamentDetail from './pages/TournamentDetail';
import CategoryDetail from './pages/CategoryDetail';
import MatchScoring from './pages/MatchScoring';
import Layout from './components/Layout';

function App() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🥋</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {user ? (
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                user.role === 'admin' ? (
                  <AdminDashboard />
                ) : user.role === 'referee' ? (
                  <RefereeDashboard />
                ) : (
                  <CoachDashboard />
                )
              }
            />
            <Route path="/tournament/:id" element={<TournamentDetail />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/match/:id" element={<MatchScoring />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

