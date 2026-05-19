import { useNavigate } from 'react-router-dom';

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 md:px-12 bg-slate-950 relative overflow-hidden font-sans">
      {/* Decorative backdrop blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-cyan-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-black/45">
        
        {/* Glow accent bar at the top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
            Ready for <span className="text-sky-400">Pure Water</span>?
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl mx-auto font-medium">
            Join thousands of healthy families today. Order your pure, mineral-balanced water now and experience premium hydration instantly!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-95 transition transform duration-150 cursor-pointer"
            >
              Order Now - Start ₹10
            </button>

            <button
              onClick={() => navigate('/subscription')}
              className="w-full sm:w-auto bg-white/5 border border-white/15 text-white hover:bg-white hover:text-slate-950 px-8 py-2.5 rounded-lg font-bold text-sm hover:scale-[1.02] active:scale-95 transition transform duration-150 cursor-pointer"
            >
              View Subscription Plans
            </button>
          </div>

          <p className="pt-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 flex-wrap">
            <span>🚚 Free doorstep delivery</span>
            <span className="text-slate-600">•</span>
            <span>⏰ 24/7 Priority support</span>
            <span className="text-slate-600">•</span>
            <span>✨ 100% Satisfaction guarantee</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
