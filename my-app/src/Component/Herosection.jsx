import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import slide1 from "../assets/all colection.png";
import slide2 from "../assets/second slide.png";
import slide3 from "../assets/3rd slide.png";

function Hero() {
  const navigate = useNavigate();
  const images = [slide1, slide2, slide3];
  const [current, setCurrent] = useState(0);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative min-h-screen w-full bg-white">
      {/* Simple Hero Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE - TEXT */}
          <div className="text-center md:text-left">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-blue-700">✨ Fresh Delivery</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4 leading-tight">
              Pure Water
              <span className="text-blue-600 block">
                Pure Life
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
              Crystal clean drinking water delivered to your doorstep. Fast, affordable, and always fresh.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
              <button
                onClick={() => navigate('/checkout')}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-200"
              >
                🚰 Order Now
              </button>
              <button
                onClick={scrollToProducts}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300"
              >
                View Products →
              </button>
            </div>

            {/* Simple Stats */}
            <div className="flex gap-8 justify-center md:justify-start">
              <div>
                <div className="text-2xl font-black text-gray-900">10k+</div>
                <div className="text-sm text-gray-500">Customers</div>
              </div>
              <div className="w-px bg-gray-300"></div>
              <div>
                <div className="text-2xl font-black text-gray-900">15min</div>
                <div className="text-sm text-gray-500">Delivery</div>
              </div>
              <div className="w-px bg-gray-300"></div>
              <div>
                <div className="text-2xl font-black text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500">Pure</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - IMAGE SLIDER */}
          <div className="relative">
            {/* Main Image Box */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-white p-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img
                  src={images[current]}
                  alt="Fresh Water"
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                />
                
                {/* Simple Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                
                {/* Slide Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === current ? "w-8 bg-white" : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements - Simple & Fun */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-3 animate-bounce delay-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="text-xs font-bold text-gray-400">SPEED</p>
                  <p className="text-sm font-bold text-gray-800">Fast Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs text-gray-400">Scroll</span>
        <div className="w-5 h-8 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-gray-400 rounded-full mt-1 animate-bounce"></div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}

export default Hero;