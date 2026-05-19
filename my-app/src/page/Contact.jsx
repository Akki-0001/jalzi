import { useState } from 'react';
import Navbar from '../Component/NavBar';
import Footer from '../Component/Footer';
import WhatsAppButton from '../Component/WhatsAppButton';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-3">Contact Us</h1>
            <p className="text-gray-600 text-lg">We'd love to hear from you. Get in touch with us today!</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Phone */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                <div className="flex items-start gap-6">
                  <div className="bg-blue-600 text-white p-4 rounded-xl">
                    <FaPhone size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Phone</h3>
                    <p className="text-gray-600 text-lg">+91 9876543210</p>
                    <p className="text-gray-500">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                <div className="flex items-start gap-6">
                  <div className="bg-blue-600 text-white p-4 rounded-xl">
                    <FaEnvelope size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600 text-lg">support@waterdelivery.com</p>
                    <p className="text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                <div className="flex items-start gap-6">
                  <div className="bg-blue-600 text-white p-4 rounded-xl">
                    <FaMapMarkerAlt size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Address</h3>
                    <p className="text-gray-600 text-lg">123 Water Street</p>
                    <p className="text-gray-600">New Delhi, Delhi 110001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-blue-600 pb-4">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full border-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 p-4 rounded-xl focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full border-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 p-4 rounded-xl focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full border-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 p-4 rounded-xl focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message here..."
                    rows="5"
                    className="w-full border-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 p-4 rounded-xl focus:outline-none transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl text-lg font-bold shadow-lg transition transform hover:scale-105 cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b-2 border-blue-600 pb-4">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">What is your delivery area?</h3>
                <p className="text-gray-600">We deliver across Delhi and nearby areas. Check our delivery zone in the app or call us for confirmation.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">How much is the delivery charge?</h3>
                <p className="text-gray-600">Delivery is FREE for orders above ₹200. For orders below that, a nominal charge of ₹20 applies.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Can I cancel my order?</h3>
                <p className="text-gray-600">Yes, you can cancel orders placed more than 2 hours before your scheduled delivery time.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">How do you ensure water quality?</h3>
                <p className="text-gray-600">We use advanced filtration and RO systems. All our water is tested regularly and BIS certified.</p>
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

export default Contact;
