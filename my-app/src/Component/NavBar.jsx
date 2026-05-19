import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSignOutAlt, FaCrown } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const getCartCount = () => {
    try {
      const saved = localStorage.getItem('jalzi_cart');
      if (!saved) return 0;
      const cartObj = JSON.parse(saved);
      return Object.values(cartObj).reduce((sum, qty) => sum + qty, 0);
    } catch {
      return 0;
    }
  };

  const [cartCount, setCartCount] = useState(getCartCount());
  
  // Track Active Logged In User
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jalzi_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const checkAuth = () => {
    try {
      const savedUser = localStorage.getItem('jalzi_user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener('cart-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('auth-state-changed', checkAuth);

    // Close dropdown on outside click
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('cart-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('auth-state-changed', checkAuth);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jalzi_token');
    localStorage.removeItem('jalzi_user');
    setUser(null);
    setShowUserDropdown(false);
    window.dispatchEvent(new Event('auth-state-changed'));
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user || !user.fullName) return 'U';
    const parts = user.fullName.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 transform group-hover:scale-105 group-hover:rotate-3 transition duration-300">
            J
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition duration-300">
              Jalzi
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-600 font-extrabold -mt-1">Pure Hydration</p>
          </div>
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-gray-600 font-semibold text-base">
          <li>
            <Link to="/" className="hover:text-blue-600 transition duration-200 relative py-1.5 group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-blue-600 transition duration-200 relative py-1.5 group">
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </li>
          <li>
            <Link to="/subscription" className="hover:text-blue-600 transition duration-200 relative py-1.5 group">
              Subscription
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-600 transition duration-200 relative py-1.5 group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </li>
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Order Now CTA */}
          <Link to="/checkout">
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-650 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition transform duration-200 text-sm cursor-pointer">
              Order Now
            </button>
          </Link>

          {/* Desktop Cart Icon */}
          <Link
            to="/checkout"
            className="relative p-2.5 hover:bg-slate-100 rounded-xl transition duration-200 flex items-center justify-center text-gray-700 hover:text-blue-600"
          >
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Login Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition duration-200 cursor-pointer"
              >
                {getUserInitials()}
              </button>

              {/* Glowing User Dropdown Card */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 text-slate-200 animate-in fade-in slide-in-from-top-3 duration-200 z-50">
                  <div className="border-b border-slate-800 pb-3 mb-3">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Logged in as</p>
                    <p className="text-sm font-bold text-white mt-1 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2.5 w-full text-left text-xs font-semibold px-3 py-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition"
                    >
                      <FaUser className="text-xs" /> My Dashboard
                    </Link>

                    {/* Admin Link if role matches */}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 w-full text-left text-xs font-semibold px-3 py-2 text-amber-400 hover:bg-amber-400/10 rounded-xl transition"
                      >
                        <FaCrown className="text-sm" /> Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full text-left text-xs font-semibold px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-xl transition cursor-pointer"
                    >
                      <FaSignOutAlt className="text-sm" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition text-sm cursor-pointer border border-slate-200/50">
                Log In
              </button>
            </Link>
          )}

        </div>

        {/* Mobile Actions Container */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Cart Icon */}
          <Link
            to="/checkout"
            className="relative p-2 hover:bg-slate-100 rounded-xl transition duration-200 flex items-center justify-center text-gray-700 hover:text-blue-600"
          >
            <FaShoppingCart className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 text-xl hover:text-blue-600 transition cursor-pointer p-2 rounded-lg hover:bg-slate-100"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200">
          <ul className="flex flex-col items-center gap-3 py-6 text-gray-700 font-semibold text-base">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition py-2 px-6 rounded-xl hover:bg-blue-50/50 block text-center w-48">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition py-2 px-6 rounded-xl hover:bg-blue-50/50 block text-center w-48">
                Products
              </Link>
            </li>
            <li>
              <Link to="/subscription" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition py-2 px-6 rounded-xl hover:bg-blue-50/50 block text-center w-48">
                Subscription
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition py-2 px-6 rounded-xl hover:bg-blue-50/50 block text-center w-48">
                Contact
              </Link>
            </li>

            {/* Mobile Auth Controls */}
            {user ? (
              <>
                <li className="border-t border-slate-100 pt-3 w-full text-center">
                  <span className="text-xs text-slate-400 font-bold block">Logged in: {user.fullName}</span>
                </li>
                <li className="w-full px-8">
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-xl font-bold shadow-sm transition text-sm flex items-center justify-center gap-2">
                      <FaUser /> My Dashboard
                    </button>
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <li className="w-full px-8">
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block">
                      <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-bold shadow-sm transition text-sm flex items-center justify-center gap-2">
                        <FaCrown /> Admin Panel
                      </button>
                    </Link>
                  </li>
                )}
                <li className="w-full px-8">
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full bg-slate-100 hover:bg-slate-200 text-red-500 py-2.5 rounded-xl font-bold shadow-sm transition text-sm flex items-center justify-center gap-2">
                    <FaSignOutAlt /> Log Out
                  </button>
                </li>
              </>
            ) : (
              <li className="w-full px-8 mt-2">
                <Link to="/auth" onClick={() => setIsOpen(false)} className="block">
                  <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold shadow-sm transition">
                    Log In / Sign Up
                  </button>
                </Link>
              </li>
            )}

            <li className="w-full px-8 mt-2">
              <Link to="/checkout" onClick={() => setIsOpen(false)} className="block">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-650 text-white py-3 rounded-xl font-bold shadow-md transition cursor-pointer">
                  Order Now
                </button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;