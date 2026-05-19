import { useState, useEffect, useCallback } from 'react';
import Navbar from '../Component/NavBar';
import Footer from '../Component/Footer';
import { FaBoxes, FaMoneyBillWave, FaClock, FaCheckCircle, FaUser, FaPhoneAlt, FaMapMarkerAlt, FaSync, FaLock, FaEnvelope, FaShieldAlt, FaCrown, FaPause, FaPlay, FaBan, FaCalendarAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

function AdminDashboard() {
  // Authentication states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jalzi_user');
      const userObj = savedUser ? JSON.parse(savedUser) : null;
      return userObj?.role === 'admin';
    } catch {
      return false;
    }
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Active Tab ('orders' or 'subscriptions')
  const [activeTab, setActiveTab] = useState('orders');

  // Orders and Subscriptions states
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubLoading, setIsSubLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedSubFilter, setSelectedSubFilter] = useState('All');
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Load Real-time Orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBase}/orders`);
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.warn('API down, loading resilient MOCK Orders for instant demo 🚀:', error);
      
      setOrders([
        {
          _id: 'mock1',
          orderId: 'JAL928371',
          customer: {
            fullName: 'Rahul Sharma',
            phone: '9876543210',
            address: 'Flat 402, Sector 62',
            city: 'Noida',
            zipCode: '201301'
          },
          items: [
            { name: '20L Jar', quantity: 2, price: 110, total: 220 },
            { name: '1L Bottle', quantity: 6, price: 20, total: 120 }
          ],
          totalAmount: 340,
          paymentMethod: 'Cash on Delivery',
          status: 'Pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          _id: 'mock2',
          orderId: 'JAL582910',
          customer: {
            fullName: 'Priya Verma',
            phone: '9123456789',
            address: 'H-12, Green Park Extension',
            city: 'New Delhi',
            zipCode: '110016'
          },
          items: [
            { name: '5L Can', quantity: 3, price: 40, total: 120 }
          ],
          totalAmount: 120,
          paymentMethod: 'Cash on Delivery',
          status: 'Out for Delivery',
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        },
        {
          _id: 'mock3',
          orderId: 'JAL391827',
          customer: {
            fullName: 'Vikram Singh',
            phone: '9888776655',
            address: 'B-45, Malviya Nagar',
            city: 'Jaipur',
            zipCode: '302017'
          },
          items: [
            { name: '20L Jar', quantity: 5, price: 110, total: 550 },
            { name: '500ml Bottle', quantity: 12, price: 10, total: 120 }
          ],
          totalAmount: 670,
          paymentMethod: 'Cash on Delivery',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [apiBase]);

  // Load Real-time Subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setIsSubLoading(true);
    try {
      const response = await fetch(`${apiBase}/subscriptions`);
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.warn('API down, loading resilient MOCK Subscriptions for instant demo 🚀:', error);
      
      setSubscriptions([
        {
          _id: 'mocksub1',
          subscriptionId: 'SUB918273',
          customer: {
            fullName: 'Aarav Mehta',
            phone: '9827381920',
            address: 'Penthouse B, Tower 3, Royal Residency',
            city: 'Noida',
            zipCode: '201301'
          },
          plan: 'Office Plan',
          price: '₹999/month',
          status: 'Active',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
        },
        {
          _id: 'mocksub2',
          subscriptionId: 'SUB392810',
          customer: {
            fullName: 'Karan Kapoor',
            phone: '9012938475',
            address: 'Flat 102, Shanti Kunj',
            city: 'New Delhi',
            zipCode: '110016'
          },
          plan: 'Student Plan',
          price: '₹299/month',
          status: 'Paused',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
        },
        {
          _id: 'mocksub3',
          subscriptionId: 'SUB582910',
          customer: {
            fullName: 'Neha Singhal',
            phone: '9283748291',
            address: 'Villa 45, Sector 4',
            city: 'Gurugram',
            zipCode: '122002'
          },
          plan: 'Event Plan',
          price: '₹2499/month',
          status: 'Cancelled',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString()
        }
      ]);
    } finally {
      setIsSubLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    const token = localStorage.getItem('jalzi_token');
    const savedUser = localStorage.getItem('jalzi_user');

    if (token && savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj.role === 'admin') {
          setTimeout(() => {
            fetchOrders();
            fetchSubscriptions();
          }, 0);
        }
      } catch (err) {
        console.error('Session verify error:', err);
      }
    }
  }, [fetchOrders, fetchSubscriptions]);

  const handleRefreshAll = () => {
    fetchOrders();
    fetchSubscriptions();
  };

  // Perform Admin Login Authentication
  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    try {
      const response = await fetch(`${apiBase}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Access denied. Unauthorized admin credentials.');
      }

      // Save admin session keys
      localStorage.setItem('jalzi_token', data.token);
      localStorage.setItem('jalzi_user', JSON.stringify(data.user));

      // Trigger global auth event
      window.dispatchEvent(new Event('auth-state-changed'));

      setIsAdminLoggedIn(true);
      fetchOrders();
      fetchSubscriptions();

    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Update order status in MongoDB API
  const handleUpdateStatus = async (orderId, orderMongoId, newStatus) => {
    setIsUpdating(true);
    try {
      if (orderMongoId.startsWith('mock')) {
        setOrders(prev => prev.map(o => o._id === orderMongoId ? { ...o, status: newStatus } : o));
        return;
      }

      const response = await fetch(`${apiBase}/orders/${orderMongoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update database status');
      
      const updatedOrder = await response.json();
      setOrders(prev => prev.map(o => o._id === orderMongoId ? updatedOrder : o));
    } catch (error) {
      alert('Error updating order status: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update subscription status in MongoDB API
  const handleUpdateSubscriptionStatus = async (subMongoId, newStatus) => {
    setIsUpdating(true);
    try {
      if (subMongoId.startsWith('mock')) {
        setSubscriptions(prev => prev.map(s => s._id === subMongoId ? { ...s, status: newStatus } : s));
        return;
      }

      const response = await fetch(`${apiBase}/subscriptions/${subMongoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update subscription status');

      const updatedSub = await response.json();
      setSubscriptions(prev => prev.map(s => s._id === subMongoId ? updatedSub : s));

    } catch (error) {
      alert('Error updating subscription status: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Orders KPI Calculations
  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const outForDeliveryCount = orders.filter(o => o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  const filteredOrders = orders.filter(o => {
    if (selectedFilter === 'All') return true;
    return o.status === selectedFilter;
  });

  // Subscriptions KPI Calculations
  const activeSubsCount = subscriptions.filter(s => s.status === 'Active').length;
  const pausedSubsCount = subscriptions.filter(s => s.status === 'Paused').length;
  const cancelledSubsCount = subscriptions.filter(s => s.status === 'Cancelled').length;

  // Monthly Run Rate calculation (sum of active subscriptions prices)
  const monthlyRunRate = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => {
      const match = s.price.match(/\d+/);
      return sum + (match ? parseInt(match[0], 10) : 0);
    }, 0);

  const filteredSubs = subscriptions.filter(s => {
    if (selectedSubFilter === 'All') return true;
    return s.status === selectedSubFilter;
  });

  // Render Secure Login Shield if not logged in
  if (!isAdminLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center pt-28 pb-16 px-4">
          <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-8">
            
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-lg shadow-amber-500/5 animate-pulse">
                <FaShieldAlt className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-white">
                Admin <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Verification</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">Authorized database administrators only.</p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl mb-6 text-center font-medium">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaEnvelope className="text-sm" />
                  </span>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@jalzi.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaLock className="text-sm" />
                  </span>
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white transition placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-amber-400 transition cursor-pointer"
                  >
                    {showAdminPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  💡 Hint: Use the seeded database default credentials to test: <br />
                  <span className="text-amber-400 font-mono">admin@jalzi.com</span> / <span className="text-amber-400 font-mono">Admin@Jalzi123</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isAuthLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </>
                ) : (
                  'Unlock Dashboard →'
                )}
              </button>
            </form>

          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                👑 Real-Time <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">Admin Board</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">Monitor water orders, billing, and recurring user subscriptions in real-time.</p>
            </div>
            
            <button
              onClick={handleRefreshAll}
              disabled={isLoading || isSubLoading}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-800 transition active:scale-95 disabled:opacity-50 font-bold"
            >
              <FaSync className={`${isLoading || isSubLoading ? 'animate-spin' : ''}`} />
              Refresh All Data
            </button>
          </div>

          {/* Premium Segmented Tab Control */}
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-2 w-full sm:w-auto mb-8 shadow-xl max-w-lg">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-5 py-3 rounded-xl font-extrabold text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📦 Live Orders Board
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex-1 px-5 py-3 rounded-xl font-extrabold text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'subscriptions'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💳 Active Subscriptions
            </button>
          </div>

          {/* ==================== TAB 1: ORDERS BOARD ==================== */}
          {activeTab === 'orders' && (
            <>
              {/* KPI Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Sales Revenue */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm font-semibold">Total Revenue</span>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <FaMoneyBillWave />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">₹{totalRevenue}</p>
                  <p className="text-xs text-slate-500 mt-1">From completed deliveries</p>
                </div>

                {/* Pending Orders */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm font-semibold">Pending Orders</span>
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <FaClock />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{pendingCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Waiting dispatch approval</p>
                </div>

                {/* Out for Delivery */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/30 rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm font-semibold">Out for Delivery</span>
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <FaBoxes />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{outForDeliveryCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Water in transit</p>
                </div>

                {/* Completed Deliveries */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm font-semibold">Delivered</span>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <FaCheckCircle />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{deliveredCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Satisfied doorstep deliveries</p>
                </div>
              </div>

              {/* Orders Board Section */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mb-12">
                {/* Filters Bar */}
                <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
                  <h2 className="text-lg font-bold text-white">Live Orders Board</h2>
                  <div className="flex gap-2">
                    {['All', 'Pending', 'Out for Delivery', 'Delivered'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          selectedFilter === filter
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List Body */}
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 text-sm font-semibold">Fetching real-time updates...</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                      <div className="text-5xl mb-4">📦</div>
                      <p className="font-semibold text-slate-400">No {selectedFilter !== 'All' ? selectedFilter.toLowerCase() : ''} orders found</p>
                      <p className="text-xs text-slate-605 mt-1">Incoming MERN database entries will render automatically here</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredOrders.map(order => (
                        <div
                          key={order._id}
                          className="bg-slate-950 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition"
                        >
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-900 mb-4">
                            <div className="flex items-center gap-3">
                              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold font-mono border border-emerald-500/20">
                                {order.orderId}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(order.createdAt).toLocaleString()}
                              </span>
                            </div>
                            
                            {/* Status Pills */}
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                order.status === 'Out for Delivery' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              }`}>
                                {order.status}
                              </span>

                              {/* Quick Admin Actions */}
                              {order.status !== 'Delivered' && (
                                <div className="flex gap-2">
                                  {order.status === 'Pending' && (
                                    <button
                                      onClick={() => handleUpdateStatus(order.orderId, order._id, 'Out for Delivery')}
                                      disabled={isUpdating}
                                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg transition active:scale-95 font-semibold cursor-pointer"
                                    >
                                      🚚 Out for Delivery
                                    </button>
                                  )}
                                  {(order.status === 'Pending' || order.status === 'Out for Delivery') && (
                                    <button
                                      onClick={() => handleUpdateStatus(order.orderId, order._id, 'Delivered')}
                                      disabled={isUpdating}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1 rounded-lg transition active:scale-95 font-semibold cursor-pointer"
                                    >
                                      ✓ Mark Delivered
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content Grid */}
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Customer Info */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</h4>
                              <div className="space-y-1.5 text-sm text-slate-300">
                                <p className="font-bold text-white flex items-center gap-2">
                                  <FaUser className="text-slate-500 text-xs" /> {order.customer.fullName}
                                </p>
                                <p className="flex items-center gap-2">
                                  <FaPhoneAlt className="text-slate-500 text-xs" /> {order.customer.phone}
                                </p>
                                <p className="flex items-start gap-2 leading-relaxed">
                                  <FaMapMarkerAlt className="text-slate-500 text-xs mt-1" />
                                  <span>{order.customer.address}, {order.customer.city} - {order.customer.zipCode}</span>
                                </p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ordered items</h4>
                              <div className="space-y-1.5">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300 font-medium">{item.name} <span className="text-slate-500 text-xs ml-1">x{item.quantity}</span></span>
                                    <span className="text-slate-400">₹{item.total}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Total Amount & Method */}
                            <div className="flex flex-col justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                              <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Payment</span>
                                <p className="text-sm font-semibold text-green-500 mt-1">💵 {order.paymentMethod}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-end">
                                <span className="text-sm font-semibold text-slate-400">Grand Total</span>
                                <span className="text-2xl font-black text-sky-400">₹{order.totalAmount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ==================== TAB 2: SUBSCRIPTIONS BOARD ==================== */}
          {activeTab === 'subscriptions' && (
            <>
              {/* KPI Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* MRR Monthly Run Rate */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/30 rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm font-semibold">Monthly MRR</span>
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <FaMoneyBillWave />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">₹{monthlyRunRate}</p>
                  <p className="text-xs text-slate-500 mt-1">Active subscriptions run-rate</p>
                </div>

                {/* Active Subscriptions */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm font-semibold">Active Plans</span>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <FaCheckCircle />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{activeSubsCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Currently receiving deliveries</p>
                </div>

                {/* Paused Plans */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm font-semibold">Paused Plans</span>
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <FaPause />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{pausedSubsCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Temporarily suspended</p>
                </div>

                {/* Cancelled Plans */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/30 rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm font-semibold">Cancelled</span>
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-450">
                      <FaBan />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{cancelledSubsCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Inactive subscriptions</p>
                </div>
              </div>

              {/* Subscriptions Grid Panel */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mb-12">
                {/* Filters Bar */}
                <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
                  <h2 className="text-lg font-bold text-white">Active Subscriber Logs</h2>
                  <div className="flex gap-2">
                    {['All', 'Active', 'Paused', 'Cancelled'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setSelectedSubFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          selectedSubFilter === filter
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subscriptions List Body */}
                <div className="p-6">
                  {isSubLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 text-sm font-semibold">Fetching active subscriptions...</p>
                    </div>
                  ) : filteredSubs.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                      <div className="text-5xl mb-4">💳</div>
                      <p className="font-semibold text-slate-400">No {selectedSubFilter !== 'All' ? selectedSubFilter.toLowerCase() : ''} subscriptions found</p>
                      <p className="text-xs text-slate-605 mt-1">Activated customer plans will appear automatically here</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredSubs.map(sub => (
                        <div
                          key={sub._id}
                          className="bg-slate-950 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition"
                        >
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-900 mb-4">
                            <div className="flex items-center gap-3">
                              <span className="bg-blue-550/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold font-mono border border-blue-500/20 flex items-center gap-1.5 shadow-sm">
                                <FaCalendarAlt className="text-[10px]" /> {sub.subscriptionId}
                              </span>
                              <span className="text-xs text-slate-500 font-semibold">
                                Started: {new Date(sub.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            {/* Actions / Status triggers */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                sub.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                sub.status === 'Paused' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                'bg-red-500/10 text-red-550 border border-red-500/20'
                              }`}>
                                {sub.status}
                              </span>

                              {/* Toggle management buttons */}
                              <div className="flex gap-2">
                                {sub.status === 'Active' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateSubscriptionStatus(sub._id, 'Paused')}
                                      disabled={isUpdating}
                                      className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-550/30 text-amber-400 text-xs px-3 py-1 rounded-lg transition active:scale-95 font-semibold cursor-pointer flex items-center gap-1"
                                    >
                                      <FaPause className="text-[8px]" /> Pause Plan
                                    </button>
                                    <button
                                      onClick={() => handleUpdateSubscriptionStatus(sub._id, 'Cancelled')}
                                      disabled={isUpdating}
                                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-550/30 text-red-400 text-xs px-3 py-1 rounded-lg transition active:scale-95 font-semibold cursor-pointer flex items-center gap-1"
                                    >
                                      <FaBan className="text-[8px]" /> Cancel Plan
                                    </button>
                                  </>
                                )}

                                {sub.status === 'Paused' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateSubscriptionStatus(sub._id, 'Active')}
                                      disabled={isUpdating}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1 rounded-lg transition active:scale-95 font-semibold cursor-pointer flex items-center gap-1"
                                    >
                                      <FaPlay className="text-[8px]" /> Resume Plan
                                    </button>
                                    <button
                                      onClick={() => handleUpdateSubscriptionStatus(sub._id, 'Cancelled')}
                                      disabled={isUpdating}
                                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-550/30 text-red-400 text-xs px-3 py-1 rounded-lg transition active:scale-95 font-semibold cursor-pointer flex items-center gap-1"
                                    >
                                      <FaBan className="text-[8px]" /> Cancel Plan
                                    </button>
                                  </>
                                )}

                                {sub.status === 'Cancelled' && (
                                  <button
                                    onClick={() => handleUpdateSubscriptionStatus(sub._id, 'Active')}
                                    disabled={isUpdating}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1 rounded-lg transition active:scale-95 font-semibold cursor-pointer flex items-center gap-1"
                                  >
                                    <FaPlay className="text-[8px]" /> Reactivate Plan
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Detail Grid */}
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Subscriber Info */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscriber Address</h4>
                              <div className="space-y-1.5 text-sm text-slate-300 font-semibold">
                                <p className="font-bold text-white flex items-center gap-2">
                                  <FaUser className="text-slate-500 text-xs" /> {sub.customer.fullName}
                                </p>
                                <p className="flex items-center gap-2">
                                  <FaPhoneAlt className="text-slate-500 text-xs" /> {sub.customer.phone}
                                </p>
                                <p className="flex items-start gap-2 leading-relaxed">
                                  <FaMapMarkerAlt className="text-slate-500 text-xs mt-1" />
                                  <span>{sub.customer.address}, {sub.customer.city} - {sub.customer.zipCode}</span>
                                </p>
                              </div>
                            </div>

                            {/* Plan Config */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan Activated</h4>
                              <div className="space-y-2 p-4 bg-slate-900/40 rounded-2xl border border-slate-850">
                                <p className="text-sm font-bold text-white flex items-center gap-2">
                                  <FaCrown className="text-amber-500 text-xs" /> {sub.plan}
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                                  {sub.plan === 'Student Plan' ? 'Daily 1L Premium Bottle doorstep deliveries.' :
                                   sub.plan === 'Office Plan' ? '3x Weekly 20L Premium Jars bulk cycle deliveries.' :
                                   'Unlimited Bulk Bottles & Cans event cycle.'}
                                </p>
                              </div>
                            </div>

                            {/* Price Billing details */}
                            <div className="flex flex-col justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                              <div>
                                <span className="text-xs text-slate-500 uppercase font-semibold">Billing Frequency</span>
                                <p className="text-sm font-bold text-blue-400 mt-1">💳 Automatic Monthly Billing</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-end font-semibold">
                                <span className="text-sm text-slate-400">Cycle Price</span>
                                <span className="text-2xl font-black text-sky-400">{sub.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
