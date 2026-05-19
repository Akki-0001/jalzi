import { FaCheckCircle } from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Place Order",
      desc: "Browse our products and add them to cart. Choose your preferred delivery time.",
    },
    {
      step: "2",
      title: "Confirmation",
      desc: "Get instant order confirmation. We prepare your water for delivery.",
    },
    {
      step: "3",
      title: "Fast Delivery",
      desc: "Our delivery partner brings pure water to your doorstep at scheduled time.",
    },
    {
      step: "4",
      title: "Enjoy Pure Water",
      desc: "Receive your water in safe, hygienic packaging. Enjoy premium hydration!",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 font-sans border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            How It <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-sm md:text-base text-slate-800 font-medium">Four simple steps to pure water delivered to your home</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-11 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transform translate-x-1/2 z-0"></div>
              )}

              {/* Card */}
              <div className="relative bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-xl transition duration-200 z-10 flex flex-col justify-start min-h-[190px]">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white text-base font-black mx-auto mb-4 shadow-md shadow-blue-500/10 transform group-hover:scale-105 group-hover:rotate-2 transition duration-200">
                  {item.step}
                </div>
                
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">{item.title}</h3>
                <p className="text-slate-800 leading-relaxed text-xs sm:text-sm font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
