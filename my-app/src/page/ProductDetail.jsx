import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bottle500 from "../assets/500ml bottle.png";
import bottle1L from "../assets/1L bottle.png";
import bottle5L from "../assets/5L bottle.png";
import bottle20L from "../assets/20L bottle.png";
import Navbar from '../Component/NavBar';
import Footer from '../Component/Footer';
import WhatsAppButton from '../Component/WhatsAppButton';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [added, setAdded] = useState(false);

  const products = [
    {
      id: 0,
      name: "500ml Bottle",
      price: "₹10",
      image: bottle500,
      description: "Premium packaged drinking water in convenient 500ml bottles. Perfect for on-the-go hydration.",
      details: "Volume: 500ml | Pure and safe drinking water | BIS certified | Convenient size for personal use"
    },
    {
      id: 1,
      name: "1L Bottle",
      price: "₹20",
      image: bottle1L,
      description: "Clean and pure 1 liter drinking water bottle. Ideal for daily household use.",
      details: "Volume: 1L | Premium quality water | Hygienic packaging | Perfect for families"
    },
    {
      id: 2,
      name: "5L Can",
      price: "₹40",
      image: bottle5L,
      description: "Large 5 liter can of pure drinking water. Great value for regular consumption.",
      details: "Volume: 5L | Cost-effective | Pure and mineral-rich water | Refillable container"
    },
    {
      id: 3,
      name: "20L Jar",
      price: "₹110",
      image: bottle20L,
      description: "Bulk 20 liter water jar for offices and large households. Maximum value and convenience.",
      details: "Volume: 20L | Bulk option | Best for offices and large families | Home delivery available"
    },
  ];

  const product = products[id];

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-12 px-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-3 gap-8 p-8">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-slate-100 rounded-xl p-8">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              <p className="text-blue-600 text-4xl font-bold mb-6">
                {product.price}
              </p>

              <p className="text-gray-600 text-lg mb-6">
                {product.description}
              </p>

              <div className="bg-slate-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-gray-800 mb-2">Product Details:</h3>
                <p className="text-gray-600">{product.details}</p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => {
                    setCartCount(cartCount + 1);
                    setAdded(true);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition duration-300 cursor-pointer shadow-md"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition duration-300 cursor-pointer shadow-md"
                >
                  Order Now
                </button>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-semibold transition duration-300 cursor-pointer"
                >
                  Add to Wishlist
                </button>
              </div>

              {added && (
                <p className="mt-4 text-sm text-green-700 font-medium">
                  {product.name} added to cart! Total items: {cartCount}
                </p>
              )}
            </div>

            {/* Request a Call Sidebar */}
            <aside className="bg-blue-700 text-white rounded-3xl p-8 shadow-2xl md:sticky md:top-24 h-fit">
              <h2 className="text-3xl font-bold mb-4">Request a Call</h2>
              <p className="mb-6 text-blue-100">
                Want help choosing the right water option? Request a call and our team will reach out ASAP.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-800/80 rounded-2xl p-4">
                  <p className="text-sm uppercase tracking-wide text-blue-200">Phone</p>
                  <p className="text-xl font-semibold">+91 98765 43210</p>
                </div>
                <div className="bg-blue-800/80 rounded-2xl p-4">
                  <p className="text-sm uppercase tracking-wide text-blue-200">Support Hours</p>
                  <p className="text-xl font-semibold">9am - 9pm</p>
                </div>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-white text-blue-700 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-100 transition"
                >
                  Request a Call
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default ProductDetail;
