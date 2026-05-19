import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Component/NavBar';
import Footer from '../Component/Footer';
import WhatsAppButton from '../Component/WhatsAppButton';

function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Protect Checkout Route & Auto-fill Profile
  useEffect(() => {
    const token = localStorage.getItem('jalzi_token');
    if (!token) {
      navigate('/auth', {
        state: {
          from: '/checkout',
          message: 'Please log in or sign up to complete your mineral water delivery order! 💧🛒'
        }
      });
    }
  }, [navigate]);

  const [formData, setFormData] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jalzi_user');
      const userObj = savedUser ? JSON.parse(savedUser) : null;
      return {
        fullName: userObj ? userObj.fullName : '',
        email: userObj ? userObj.email : '',
        phone: userObj ? userObj.phone : '',
        address: '',
        city: '',
        zipCode: '',
      };
    } catch {
      return {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
      };
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Cash on Delivery');
  const [paymentError, setPaymentError] = useState('');

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('jalzi_cart');
      if (saved && saved !== '{}') {
        return JSON.parse(saved);
      }
      return {};
    } catch {
      return {};
    }
  });

  const products = [
    { name: '500ml', displayName: '500ml Bottle', price: 10 },
    { name: '1L', displayName: '1L Bottle', price: 20 },
    { name: '5L', displayName: '5L Can', price: 40 },
    { name: '20L', displayName: '20L Jar', price: 110 },
  ];

  // Fix NaN issue by properly calculating prices
  const cartEntries = Object.entries(cart).filter(([_, qty]) => qty > 0);
  const totalPrice = cartEntries.reduce((sum, [name, qty]) => {
    const product = products.find(p => p.name === name);
    const price = product ? product.price : 0;
    return sum + (price * qty);
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout script.'));
    document.body.appendChild(script);
  });

  const createRazorpayOrder = async (amountInPaise) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiBase}/payments/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: amountInPaise, currency: 'INR' })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment order');
    }

    return response.json();
  };

  const submitOrderToServer = async (paymentMethod, paymentDetails = {}) => {
    const orderPayload = {
      customer: formData,
      items: cartEntries.map(([name, qty]) => {
        const product = products.find(p => p.name === name);
        return {
          name: product ? product.displayName : name,
          quantity: qty,
          price: product ? product.price : 0,
          total: (product ? product.price : 0) * qty
        };
      }),
      totalAmount: totalPrice,
      paymentMethod,
      paymentDetails
    };

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error('Server returned an error while placing the order');
      }

      const savedOrder = await response.json();

      const invoice = {
        orderId: savedOrder.orderId,
        date: new Date(savedOrder.createdAt).toLocaleString(),
        customer: savedOrder.customer,
        items: savedOrder.items,
        total: savedOrder.totalAmount,
        paymentMethod: savedOrder.paymentMethod
      };

      setOrderId(savedOrder.orderId);
      localStorage.setItem('last_invoice', JSON.stringify(invoice));
      setShowInvoice(true);
      localStorage.removeItem('jalzi_cart');
      setCart({});
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.warn('Order save failed, generating offline invoice instead:', error);
      const invoice = generateInvoice();
      setShowInvoice(true);
      localStorage.removeItem('jalzi_cart');
      setCart({});
      window.dispatchEvent(new Event('cart-updated'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRazorpayCheckout = async (orderData) => {
    if (!window.Razorpay) {
      throw new Error('Razorpay checkout is not available');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'Jalzi',
        description: 'Water delivery order',
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#2563eb'
        },
        handler: async function (paymentResult) {
          try {
            await submitOrderToServer(selectedPayment, {
              razorpayOrderId: paymentResult.razorpay_order_id,
              razorpayPaymentId: paymentResult.razorpay_payment_id,
              razorpaySignature: paymentResult.razorpay_signature
            });
            resolve(true);
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            reject(new Error('Payment was cancelled'));
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  };

  const updateQuantity = (name, delta) => {
    const newCart = { ...cart };
    const currentQty = newCart[name] || 0;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      delete newCart[name];
    } else {
      newCart[name] = newQty;
    }

    setCart(newCart);
    localStorage.setItem('jalzi_cart', JSON.stringify(newCart));

    // If cart becomes empty, redirect to home
    if (Object.keys(newCart).length === 0) {
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      alert('Please fill all delivery details');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setStep(2);
  };

  const generateInvoice = () => {
    const newOrderId = 'JAL' + Date.now() + Math.floor(Math.random() * 1000);
    setOrderId(newOrderId);
    
    const invoice = {
      orderId: newOrderId,
      date: new Date().toLocaleString(),
      customer: formData,
      items: cartEntries.map(([name, qty]) => {
        const product = products.find(p => p.name === name);
        return {
          name: product ? product.displayName : name,
          quantity: qty,
          price: product ? product.price : 0,
          total: (product ? product.price : 0) * qty
        };
      }),
      total: totalPrice,
      paymentMethod: 'Cash on Delivery'
    };
    
    localStorage.setItem('last_invoice', JSON.stringify(invoice));
    return invoice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    setIsSubmitting(true);

    if (selectedPayment !== 'Cash on Delivery') {
      try {
        await loadRazorpayScript();
        const orderData = await createRazorpayOrder(totalPrice * 100);
        await openRazorpayCheckout(orderData);
      } catch (error) {
        setPaymentError(error.message || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      }
      return;
    }

    await submitOrderToServer('Cash on Delivery');
  };

  const closeInvoice = () => {
    setShowInvoice(false);
    navigate('/');
  };

  if (cartEntries.length === 0 && !showInvoice) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some refreshing water bottles to continue</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
            >
              Browse Products →
            </button>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </>
    );
  }

  // Invoice Modal
  if (showInvoice) {
    const invoice = JSON.parse(localStorage.getItem('last_invoice') || '{}');
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-8 animate-bounce">
              <div className="text-7xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Thank You for Shopping!</h1>
              <p className="text-gray-600">Your order has been placed successfully</p>
            </div>

            {/* Invoice Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-white text-2xl font-bold">INVOICE</h2>
                    <p className="text-blue-100 text-sm">Order ID: {invoice.orderId}</p>
                  </div>
                  <div className="text-right text-white">
                    <p className="text-sm">Date: {invoice.date?.split(',')[0]}</p>
                    <p className="text-xs">Time: {invoice.date?.split(',')[1]}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Customer Details */}
                <div className="mb-6 pb-4 border-b">
                  <h3 className="font-bold text-gray-700 mb-2">Deliver To:</h3>
                  <p className="text-gray-800">
                    {invoice.customer?.fullName}<br />
                    {invoice.customer?.address}, {invoice.customer?.city}<br />
                    {invoice.customer?.zipCode}<br />
                    📞 {invoice.customer?.phone}
                  </p>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">Order Summary:</h3>
                  <div className="space-y-2">
                    {invoice.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold">₹{item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{invoice.total}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="text-sm font-semibold text-green-600">{invoice.paymentMethod}</span>
                  </div>
                </div>

                {/* Delivery Message */}
                <div className="text-center p-4 bg-green-50 rounded-lg mb-6">
                  <p className="text-green-700">✅ Order Confirmed!</p>
                  <p className="text-sm text-gray-600 mt-1">Your order will be delivered within 15-20 minutes</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                  >
                    🖨️ Print Invoice
                  </button>
                  <button
                    onClick={closeInvoice}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Continue Shopping →
                  </button>
                </div>
              </div>
            </div>

            {/* WhatsApp Share */}
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  const msg = `Thank you for shopping with Jalzi!\nOrder ID: ${invoice.orderId}\nTotal: ₹${invoice.total}\nDelivery to: ${invoice.customer?.address}\nWe'll deliver soon! 🚚💧`;
                  window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
              >
                📱 Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
        <WhatsAppButton />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Steps Indicator */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step === 1 ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-green-600 text-white'}`}>
                {step === 1 ? '1' : '✓'}
              </div>
              <div className={`w-20 h-1 rounded-full ${step === 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step === 2 ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Form - Takes 2/3 width */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h1 className="text-white text-xl font-bold">
                    {step === 1 ? '📝 Delivery Details' : '💳 Payment & Confirm'}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">
                    {step === 1 ? 'Step 1 of 2' : 'Final step to place order'}
                  </p>
                </div>

                <div className="p-6">
                  {step === 1 ? (
                    <form onSubmit={handleNext} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                          placeholder="Rahul Sharma"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                          placeholder="9876543210"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                          rows="2"
                          placeholder="House No, Street, Landmark"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                            placeholder="Your City"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                            placeholder="110001"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-[1.02] mt-4"
                      >
                        Continue to Payment →
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        {/* Order Items */}
                        <div>
                          <h3 className="font-bold text-gray-800 mb-3">Your Items</h3>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {cartEntries.map(([name, qty]) => {
                              const product = products.find(p => p.name === name);
                              return (
                                <div key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                  <div>
                                    <p className="font-semibold text-gray-800">{product ? product.displayName : name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(name, -1)}
                                        className="w-7 h-7 bg-white rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                                      >
                                        -
                                      </button>
                                      <span className="font-medium">x{qty}</span>
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(name, 1)}
                                        className="w-7 h-7 bg-white rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <span className="font-bold text-blue-600">₹{(product?.price || 0) * qty}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Payment Options */}
                        <div>
                          <h3 className="font-bold text-gray-800 mb-3">Payment Method</h3>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                              <input
                                type="radio"
                                name="payment"
                                value="Cash on Delivery"
                                checked={selectedPayment === 'Cash on Delivery'}
                                onChange={() => setSelectedPayment('Cash on Delivery')}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span>💵 Cash on Delivery</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                              <input
                                type="radio"
                                name="payment"
                                value="Card"
                                checked={selectedPayment === 'Card'}
                                onChange={() => setSelectedPayment('Card')}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span>💳 Credit/Debit Card</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                              <input
                                type="radio"
                                name="payment"
                                value="UPI"
                                checked={selectedPayment === 'UPI'}
                                onChange={() => setSelectedPayment('UPI')}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span>📱 UPI (Google Pay, PhonePe)</span>
                            </label>
                          </div>
                          {paymentError && (
                            <p className="text-sm text-red-600 mt-3">{paymentError}</p>
                          )}
                          {selectedPayment !== 'Cash on Delivery' && (
                            <p className="text-sm text-gray-500 mt-3">
                              You will be redirected to a secure Razorpay checkout when you place the order.
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Placing Order...
                            </>
                          ) : (
                            `Place Order • ₹${totalPrice}`
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar - Takes 1/3 width */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-5 sticky top-24 text-white">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                  {cartEntries.map(([name, qty]) => {
                    const product = products.find(p => p.name === name);
                    return (
                      <div key={name} className="flex justify-between text-sm border-b border-gray-700 pb-2">
                        <div>
                          <span>{product ? product.displayName : name}</span>
                          <span className="text-gray-400 text-xs ml-1">x{qty}</span>
                        </div>
                        <span className="text-blue-400">₹{(product?.price || 0) * qty}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-700 pt-3 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-blue-400">₹{totalPrice}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 space-y-1 mt-4 pt-3 border-t border-gray-700">
                  <p>✓ Free Delivery</p>
                  <p>✓ 15-Minute Guarantee</p>
                  <p>✓ Secure Checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default Checkout;