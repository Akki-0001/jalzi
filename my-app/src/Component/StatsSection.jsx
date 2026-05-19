import { useState, useEffect, useRef } from 'react';

function Counter({ target, suffix = "", shouldStart = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let currentValue = 0;
    const duration = 1200;
    const intervalTime = 30;
    const steps = Math.ceil(duration / intervalTime);
    const increment = target / steps;
    const isFloatTarget = !Number.isInteger(target);

    const interval = setInterval(() => {
      currentValue += increment;
      const nextValue = Math.min(currentValue, target);
      setCount(isFloatTarget ? Number(nextValue.toFixed(1)) : Math.floor(nextValue));
      if (nextValue >= target) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [target, shouldStart]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function StatsSection() {
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const stats = [
    { target: 10000, label: "Happy Customers", suffix: "+" },
    { target: 5000, label: "Daily Deliveries", suffix: "+" },
    { target: 99.8, label: "Purity Rate", suffix: "%" },
    { target: 24, label: "Customer Support", suffix: "/7" },
  ];

  return (
    <section ref={sectionRef} className="relative py-16 px-6 md:px-12 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Our Impact</h2>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto font-medium">Trusted by thousands across the city for pure, timely hydration</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition duration-200 shadow-lg shadow-slate-950/20 flex flex-col justify-center items-center group">
              <h3 className="text-3xl font-black text-sky-400 mb-1.5 tracking-tight group-hover:scale-105 transition-transform duration-200">
                <Counter target={stat.target} suffix={stat.suffix} shouldStart={hasStarted} />
              </h3>
              <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
