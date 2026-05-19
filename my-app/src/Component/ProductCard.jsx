import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bottle500 from "../assets/500ml bottle.png";
import bottle1L from "../assets/1L bottle.png";
import bottle5L from "../assets/5L bottle.png";
import bottle20L from "../assets/20L bottle.png";

function Products() {
  const navigate = useNavigate();
  const products = [
    {
      name: "500ml",
      price: "₹10",
      image: bottle500,
      badge: "🔥 Popular",
      features: ["✓ Pure RO", "✓ BPA Free", "✓ Mineral Rich"]
    },
    
    {
      name: "1L",
      price: "₹20",
      image: bottle1L,
      badge: "⭐ Best Value",
      features: ["✓ Pure RO", "✓ BPA Free", "✓ Balanced pH"]
    },
    {
      name: "5L",
      price: "₹40",
      image: bottle5L,
      badge: "🏠 Family Pack",
      features: ["✓ Pure RO", "✓ Easy Pour", "✓ Eco Friendly"]
    },
    {
      name: "20L",
      price: "₹110",
      image: bottle20L,
      badge: "💼 Office Special",
      features: ["✓ Pure RO", "✓ Jar Compatible", "✓ Best Price"]
    },
  ];

  const [quantities, setQuantities] = useState(products.map(() => 1));
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('jalzi_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [notification, setNotification] = useState('');

  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const updateQuantity = (index, delta) => {
    setQuantities((prev) => {
      const next = [...prev];
      next[index] = Math.max(1, next[index] + delta);
      return next;
    });
  };

  const addToCart = (index) => {
    const quantity = quantities[index];
    const productName = products[index].name;

    setCart((prev) => {
      const next = {
        ...prev,
        [productName]: (prev[productName] || 0) + quantity,
      };
      localStorage.setItem('jalzi_cart', JSON.stringify(next));
      window.dispatchEvent(new Event('cart-updated'));
      return next;
    });

    setNotification(`✨ ${quantity} × ${productName} added to cart!`);
  };

  const handleOrderNow = (index) => {
    const quantity = quantities[index];
    const productName = products[index].name;

    setCart((prev) => {
      const next = {
        ...prev,
        [productName]: (prev[productName] || 0) + quantity,
      };
      localStorage.setItem('jalzi_cart', JSON.stringify(next));
      window.dispatchEvent(new Event('cart-updated'));
      return next;
    });

    navigate('/checkout');
  };

  return (
    <section id="products" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Our <span className="text-blue-600">Products</span>
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Pure, safe, and delicious drinking water for every need
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((item, index) => (
            <div
               key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 h-48 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
                {/* Badge */}
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <p className="text-2xl font-bold text-blue-600">{item.price}</p>
                </div>


                {/* Quantity */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2 mb-3">
                  <span className="text-sm font-medium text-gray-600">Qty</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="w-8 h-8 bg-white rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900">
                      {quantities[index]}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="w-8 h-8 bg-white rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => addToCart(index)}
                    className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={() => handleOrderNow(index)}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50">
            {notification}
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;