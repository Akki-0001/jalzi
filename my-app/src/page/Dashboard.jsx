import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Component/NavBar';
import Footer from '../Component/Footer';
import WhatsAppButton from '../Component/WhatsAppButton';
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCrown, FaBoxes, FaLock, 
  FaSync, FaShoppingBag, FaCreditCard, FaChevronRight, FaTimesCircle,
  FaClock, FaCheckCircle, FaMapMarkerAlt, FaTruck
} from 'react-icons/fa';

function Dashboard() {
  const navigate = useNavigate();
  
  // Load Active Session
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jalzi_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('subscriptions');
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Guard: If not logged in, redirect to auth
  useEffect(() => {
    if (!user) {
      navigate('/auth', {
        state: {
          from: '/dashboard',
          message: 'Please log in to access your secure Customer Dashboard! 💧🔑'
        }
      });
    }
  }, [user, navigate]);

  // Load Real-time Data
  const loadDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    setIsError(false);

    try {
      // Fetch Orders & Subscriptions in parallel
      const [ordersRes, subsRes] = await Promise.all([
        fetch(`${apiBase}/orders`),
        fetch(`${apiBase}/subscriptions`)
      ]);

      let ordersData = [];
      let subsData = [];

      if (ordersRes.ok) {
        const allOrders = await ordersRes.json();
        // Filter orders by user's email or phone number
        ordersData = allOrders.filter(o => 
          (o.customer?.email && o.customer.email === user.email) || 
          (o.customer?.phone && o.customer.phone === user.phone) ||
          (o.customer?.fullName && o.customer.fullName === user.fullName)
        );
      }

      if (subsRes.ok) {
        const allSubs = await subsRes.json();
        // Filter subscriptions by user's email or phone number
        subsData = allSubs.filter(s => 
          (s.customer?.email && s.customer.email === user.email) || 
          (s.customer?.phone && s.customer.phone === user.phone) ||
          (s.customer?.fullName && s.customer.fullName === user.fullName)
        );
      }

      setOrders(ordersData);
      setSubscriptions(subsData);

    } catch (err) {
      console.warn('Backend server offline. Loading local simulation fallback for smooth interaction! 🚀', err);
      
      // Fallback localstorage mock checks or smart fallbacks
      const savedInvoice = localStorage.getItem('last_invoice');
      if (savedInvoice) {
        try {
          const invObj = JSON.parse(savedInvoice);
          setOrders([invObj]);
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  if (!user) return null;

  // Formatting date helper
  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  // Helper for Status Badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
      case 'Delivered':
        return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'Paused':
      case 'Out for Delivery':
        return 'bg-amber-500/10 border border-amber-500/20 text-amber-400';
      case 'Cancelled':
      case 'Pending':
      default:
        return 'bg-blue-500/10 border border-blue-500/20 text-blue-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
      case 'Delivered':
        return <FaCheckCircle className="text-xs" />;
      case 'Paused':
        return <FaClock className="text-xs animate-pulse" />;
      case 'Out for Delivery':
        return <FaTruck className="text-xs" />;
      case 'Cancelled':
        return <FaTimesCircle className="text-xs" />;
      case 'Pending':
      default:
        return <FaClock className="text-xs animate-spin" />;
    }
  };

  const userInitials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'JD';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">
        <div className="max-w-6xl mx-auto">
          
          {/* Top greeting panel */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3.5 py-1.5 rounded-full font-extrabold uppercase tracking-widest mb-3 shadow-lg shadow-blue-500/5">
                <FaCrown className="text-sm" /> Premium Club Member
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                Hello, <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">{user.fullName}</span>! 👋
              </h1>
              <p className="text-slate-400 text-xs mt-1">Manage your active water plans, replenishment cycles, and recent mineral deliveries.</p>
            </div>
            
            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-5 py-2.5 rounded-xl flex items-center gap-2 border border-slate-800 transition active:scale-95 disabled:opacity-50 font-bold text-xs cursor-pointer shadow-lg shadow-slate-950"
            >
              <FaSync className={`text-xs ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Dashboard
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 items-start">
            
            {/* LEFT PROFILE CARD */}
            <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-sky-600/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-300"></div>

              {/* Initials Avatar */}
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-sky-500 text-white border border-blue-400/20 rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 mx-auto mb-5">
                {userInitials}
              </div>

              <div className="text-center mb-6">
                <h3 className="text-base font-black text-white">{user.fullName}</h3>
                <span className="inline-block mt-1 text-[10px] bg-slate-950 px-3 py-1 border border-slate-850 text-slate-400 rounded-full font-bold uppercase tracking-wider">
                  {user.role === 'admin' ? '👑 Site Administrator' : '💧 Active Customer'}
                </span>
              </div>

              <div className="border-t border-slate-800/60 pt-5 space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500">
                    <FaEnvelope className="text-[10px]" />
                  </div>
                  <div className="truncate">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Email Address</p>
                    <p className="text-slate-300 truncate font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500">
                    <FaPhone className="text-[10px]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</p>
                    <p className="text-slate-300 font-semibold">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500">
                    <FaCalendarAlt className="text-[10px]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Member Since</p>
                    <p className="text-slate-300 font-semibold">Active</p>
                  </div>
                </div>
              </div>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-2xl text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-2 mt-8 shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  👑 Admin Panel Dashboard →
                </Link>
              )}
            </div>

            {/* RIGHT DASHBOARD CONTENT PANELS */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Segmented Controller Tab */}
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-2 w-full sm:w-auto shadow-xl max-w-md">
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`flex-1 px-4 py-3 rounded-xl font-black text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'subscriptions'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FaCreditCard className="text-xs" /> My Subscriptions ({subscriptions.length})
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 px-4 py-3 rounded-xl font-black text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FaShoppingBag className="text-xs" /> Order History ({orders.length})
                </button>
              </div>

              {/* Data loading spinner */}
              {isLoading ? (
                <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-16 text-center backdrop-blur-xl">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 text-xs font-semibold">Pulling secure MERN history...</p>
                </div>
              ) : (
                <>
                  {/* TAB 1: SUBSCRIPTIONS */}
                  {activeTab === 'subscriptions' && (
                    <div className="space-y-6">
                      {subscriptions.length === 0 ? (
                        <div className="bg-slate-900/20 border border-slate-800/80 rounded-3xl p-12 text-center backdrop-blur-md relative overflow-hidden group">
                          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/5">
                            <FaCrown className="text-xl animate-pulse" />
                          </div>
                          <h3 className="text-lg font-black text-white mb-2">No Active Replenishment Plans</h3>
                          <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed mb-6">
                            Set up daily, weekly or custom delivery frequencies and lock in maximum discounts with our premium RO mineral subscription plans!
                          </p>
                          <Link
                            to="/subscription"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold px-6 py-3 rounded-xl transition active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer"
                          >
                            Explore Subscription Plans <FaChevronRight className="text-[10px]" />
                          </Link>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-6">
                          {subscriptions.map((sub) => (
                            <div 
                              key={sub._id || sub.subscriptionId} 
                              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700/80 transition duration-200 shadow-xl"
                            >
                              {/* Top Details */}
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Subscription ID</span>
                                  <p className="text-white font-mono text-xs font-black">{sub.subscriptionId}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${getStatusBadgeClass(sub.status)}`}>
                                  {getStatusIcon(sub.status)} {sub.status}
                                </span>
                              </div>

                              <h4 className="text-xl font-black text-white flex items-center gap-2 mb-1">
                                💧 {sub.plan}
                              </h4>
                              <p className="text-blue-400 font-extrabold text-sm mb-4">{sub.price}</p>

                              <div className="border-t border-slate-800/80 pt-4 mt-4 space-y-3 text-xs">
                                <div className="flex items-start gap-2 text-slate-400">
                                  <FaMapMarkerAlt className="text-slate-500 text-[10px] mt-0.5" />
                                  <div className="text-[11px] leading-relaxed">
                                    <p className="font-bold text-slate-500 text-[9px] uppercase tracking-widest mb-0.5">Delivery Address</p>
                                    <p className="text-slate-300 font-semibold">{sub.customer?.address}</p>
                                    <p className="text-slate-400">{sub.customer?.city} - {sub.customer?.zipCode}</p>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800/60 pt-3 mt-3">
                                  <span>Activated: {formatDate(sub.createdAt)}</span>
                                  {sub.status === 'Active' && (
                                    <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                                      ● Delivery Cycle: Scheduled
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: ORDER HISTORY */}
                  {activeTab === 'orders' && (
                    <div className="space-y-6">
                      {orders.length === 0 ? (
                        <div className="bg-slate-900/20 border border-slate-800/80 rounded-3xl p-12 text-center backdrop-blur-md">
                          <div className="w-14 h-14 bg-slate-950 border border-slate-850 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FaShoppingBag className="text-lg" />
                          </div>
                          <h3 className="text-lg font-black text-white mb-2">No Past Orders Placed</h3>
                          <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed mb-6">
                            Looks like you haven't placed any standard RO water orders yet. Grab your mineral bottles or office jars today!
                          </p>
                          <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold px-6 py-3 rounded-xl transition active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer"
                          >
                            Browse RO Catalog <FaChevronRight className="text-[10px]" />
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div 
                              key={order._id || order.orderId}
                              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 transition duration-200 shadow-xl"
                            >
                              {/* Top row */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-800/60">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Order Number</span>
                                  <p className="text-white font-mono text-xs font-black">{order.orderId}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-slate-500 font-semibold">{formatDate(order.createdAt)}</span>
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${getStatusBadgeClass(order.status)}`}>
                                    {getStatusIcon(order.status)} {order.status}
                                  </span>
                                </div>
                              </div>

                              {/* Items list */}
                              <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Items Ordered</span>
                                  <div className="space-y-2">
                                    {order.items?.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-xs bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-850">
                                        <span className="text-slate-300 font-semibold">{item.name} <span className="text-slate-500 font-normal">x{item.quantity}</span></span>
                                        <span className="text-blue-400 font-bold">₹{item.total}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Total and delivery address */}
                                <div className="flex flex-col justify-between">
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Delivering To</span>
                                    <p className="text-xs text-slate-300 font-semibold leading-relaxed truncate">{order.customer?.address}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{order.customer?.city} - {order.customer?.zipCode}</p>
                                  </div>

                                  <div className="flex justify-between items-center bg-blue-950/20 border border-blue-900/30 p-3 rounded-2xl mt-4">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Total Paid</span>
                                    <span className="text-lg font-black text-white">₹{order.totalAmount || order.total}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>

        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </>
  );
}

export default Dashboard;
