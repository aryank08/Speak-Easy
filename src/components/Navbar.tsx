import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wand2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#0A0A0A] border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Wand2 className="h-8 w-8 text-[#08F7FE]" />
              <span className="text-2xl font-bold text-white">SpeakEasy</span>
            </Link>
          </div>

          <div className="flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/converter"
                  className="text-[#8A8F98] hover:text-white transition-colors"
                >
                  Converter
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-[#8A8F98]">Hello, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[#8A8F98] hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-[#4B3CFF] to-[#08F7FE] text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;