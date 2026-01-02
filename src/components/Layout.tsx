import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'referee':
        return 'Referee';
      case 'coach':
        return 'Coach';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile-first header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container-mobile">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo/Brand - Mobile: smaller, Desktop: larger */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl">🥋</span>
              <span className="font-bold text-base sm:text-lg lg:text-xl text-primary-600">
                KTMS
              </span>
            </Link>

            {/* User info and logout - Mobile: compact, Desktop: expanded */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs sm:text-sm text-gray-600">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {user && getRoleLabel(user.role)}
                </div>
              </div>
              <div className="text-right sm:hidden">
                <div className="text-xs text-gray-600">{user?.name}</div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary text-xs sm:text-sm px-2 sm:px-4"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Mobile: full width, Desktop: centered */}
      <main className="flex-1 container-mobile py-4 sm:py-6 lg:py-8">
        <Outlet />
      </main>

      {/* Footer - Mobile: compact, Desktop: standard */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container-mobile py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            Karate Tournament Management System - WKF Style
          </p>
        </div>
      </footer>
    </div>
  );
}

