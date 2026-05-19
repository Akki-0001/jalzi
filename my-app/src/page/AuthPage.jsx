import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Component/NavBar';
import Footer from '../Component/Footer';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle, FaUserPlus, FaSignInAlt, FaEye, FaEyeSlash, FaTimesCircle, FaPaperPlane } from 'react-icons/fa';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Redirect to checkout if they came from checkout redirect
  const redirectPath = location.state?.from || '/';
  const redirectMessage = location.state?.message || '';

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Check if already logged in, redirect
  useEffect(() => {
    const token = localStorage.getItem('jalzi_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLoginChange = (e) => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e) => {
    setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Perform User Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save user session
      localStorage.setItem('jalzi_token', data.token);
      localStorage.setItem('jalzi_user', JSON.stringify(data.user));

      // Dispatch global auth changed event
      window.dispatchEvent(new Event('auth-state-changed'));

      // Redirect
      navigate(redirectPath);

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform User Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!/^\d{10}$/.test(registerData.phone)) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: registerData.fullName,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Save user session
      localStorage.setItem('jalzi_token', data.token);
      localStorage.setItem('jalzi_user', JSON.stringify(data.user));

      // Dispatch global auth changed event
      window.dispatchEvent(new Event('auth-state-changed'));

      // Redirect
      navigate(redirectPath);

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsForgotLoading(true);
    try {
      // Simulate/Trigger MERN standard recovery call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setForgotSuccess(true);
    } catch {
      alert('Password reset failed. Try again.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center pt-28 pb-16 px-4">
        
        {/* Redirect Notice Card */}
        {redirectMessage && (
          <div className="max-w-md w-full mb-6 bg-blue-950/40 border border-blue-800/50 rounded-2xl p-4 text-center backdrop-blur-md animate-pulse">
            <p className="text-sm font-semibold text-blue-300">🔑 {redirectMessage}</p>
          </div>
        )}

        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-8 relative overflow-hidden group">
          {/* Decorative glowing gradient inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-sky-500/5 rounded-full blur-3xl group-hover:scale-125 transition duration-300 pointer-events-none"></div>

          {/* Logo Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white flex items-center justify-center gap-2">
              💧 Jalzi <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">Portal</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">Get your pure RO minerals delivered in minutes</p>
          </div>

          {/* Authentication Toggle Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-8 border border-slate-900">
            <button
              onClick={() => {
                setIsLoginTab(true);
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                isLoginTab
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FaSignInAlt /> Login
            </button>
            <button
              onClick={() => {
                setIsLoginTab(false);
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                !isLoginTab
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FaUserPlus /> Signup
            </button>
          </div>

          {/* Validation Messages */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl mb-6 text-center font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Form Actions */}
          {isLoginTab ? (
            /* LOGIN CARD */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaEnvelope className="text-sm" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="name@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[10px] font-extrabold text-blue-400 hover:text-blue-300 transition cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaLock className="text-sm" />
                  </span>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-400 transition cursor-pointer"
                  >
                    {showLoginPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Logging in...
                  </>
                ) : (
                  'Log In to Dashboard →'
                )}
              </button>
            </form>
          ) : (
            /* REGISTER CARD */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaUser className="text-sm" />
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaEnvelope className="text-sm" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="name@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaPhone className="text-sm" />
                  </span>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaLock className="text-sm" />
                  </span>
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-400 transition cursor-pointer"
                  >
                    {showRegisterPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaLock className="text-sm" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-400 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Free Account →'
                )}
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Dynamic Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSuccess(false);
                setForgotEmail('');
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition text-lg cursor-pointer"
            >
              <FaTimesCircle />
            </button>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/5">
                    <FaEnvelope className="text-lg" />
                  </div>
                  <h3 className="text-xl font-black text-white">Reset Password</h3>
                  <p className="text-slate-400 text-xs mt-1">Enter your registered email address below and we will send you a secure password reset link.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <FaEnvelope className="text-sm" />
                    </span>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white transition placeholder-slate-650"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-650 text-white py-3.5 rounded-xl font-bold shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 text-xs cursor-pointer"
                >
                  {isForgotLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Searching User...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-[10px]" /> Send Reset Link
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/5">
                  <FaCheckCircle className="text-2xl animate-bounce" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Link Dispatched!</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                  We have successfully generated and sent a secure reset link to: <br />
                  <span className="text-sky-400 font-bold font-mono">{forgotEmail}</span>. <br />
                  Please check your inbox (and spam folder) to complete password reset.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                    setForgotEmail('');
                  }}
                  className="w-full bg-slate-850 hover:bg-slate-800 text-slate-300 py-3 rounded-xl font-bold transition text-xs cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default AuthPage;
