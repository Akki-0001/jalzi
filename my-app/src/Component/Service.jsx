import { FaShippingFast, FaTint, FaHeadset, FaCertificate } from "react-icons/fa";

function Services() {
  const services = [
    {
      icon: <FaShippingFast size={22} />,
      title: "Lightning Fast Delivery",
      desc: "Same-day delivery to homes, offices, hostels and events. Order before 9 PM, get delivered by morning.",
      accent: "bg-blue-50 border-blue-100 text-blue-600 shadow-blue-500/5"
    },
    {
      icon: <FaTint size={22} />,
      title: "100% Pure Water",
      desc: "Advanced RO & UV purification. Every drop is tested for safety. Mineral-balanced for perfect taste.",
      accent: "bg-cyan-50 border-cyan-100 text-cyan-600 shadow-cyan-500/5"
    },
    
    {
      icon: <FaCertificate size={22} />,
      title: "BIS Certified Quality",
      desc: "ISO certified facility. Follows all government standards. Trusted by thousands across the city.",
      accent: "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-500/5"
    },
    {
      icon: <FaHeadset size={22} />,
      title: "24/7 Expert Support",
      desc: "Always available for queries. Quick resolution. Friendly customer service team ready to help.",
      accent: "bg-indigo-50 border-indigo-100 text-indigo-600 shadow-indigo-500/5"
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-white to-slate-50 font-sans border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Jalzi</span>?
          </h2>
          <p className="text-sm md:text-base text-slate-800 max-w-xl mx-auto font-medium">
            We're not just a water delivery service. We're your trusted partner for pure, safe, and premium hydration.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-200 group relative flex flex-col justify-start"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border shadow-sm ${item.accent} transform group-hover:scale-105 group-hover:rotate-2 transition duration-200`}>
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors duration-150">
                {item.title}
              </h3>
              <p className="text-slate-800 leading-relaxed text-xs sm:text-sm font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;