import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-4xl font-black text-blue-400 mb-4">JALZI</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Pure water delivered fresh to homes, offices, hostels and events across the city.
            </p>
            <div className="flex gap-4 mt-6">
              <FaFacebook size={24} className="cursor-pointer hover:text-blue-400 transition" />
              <FaTwitter size={24} className="cursor-pointer hover:text-blue-400 transition" />
              <FaInstagram size={24} className="cursor-pointer hover:text-blue-400 transition" />
              <FaLinkedin size={24} className="cursor-pointer hover:text-blue-400 transition" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6 border-b-2 border-blue-400 pb-2">Quick Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link to="/" className="hover:text-blue-400 transition font-semibold">Home</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition font-semibold">Products</Link></li>
              <li><Link to="/subscription" className="hover:text-blue-400 transition font-semibold">Subscription</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition font-semibold">Contact</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-2xl font-bold mb-6 border-b-2 border-blue-400 pb-2">Company</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-blue-400 transition font-semibold cursor-pointer">About Us</li>
              <li className="hover:text-blue-400 transition font-semibold cursor-pointer">Our Mission</li>
              <li className="hover:text-blue-400 transition font-semibold cursor-pointer">Privacy Policy</li>
              <li className="hover:text-blue-400 transition font-semibold cursor-pointer">Terms & Conditions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-2xl font-bold mb-6 border-b-2 border-blue-400 pb-2">Contact Info</h3>
            <div className="space-y-4 text-gray-300">
              <p className="flex items-center gap-3">
                <span className="text-blue-400 text-xl">📞</span> +91 9876543210
              </p>
              <p className="flex items-center gap-3">
                <span className="text-blue-400 text-xl">✉</span> support@jalzi.in
              </p>
              <p className="flex items-center gap-3">
                <span className="text-blue-400 text-xl">📍</span> New Delhi, India
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
          <p className="text-center md:text-left">© 2026 JALZI Water Delivery. All rights reserved.</p>
          <p className="mt-4 md:mt-0 text-center">Made with ❤️ for pure water lovers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;