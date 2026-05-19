import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Component/NavBar';
import Hero from './Component/Herosection';
import StatsSection from './Component/StatsSection';
import Products from './Component/ProductCard';
import Services from './Component/Service';
import HowItWorks from './Component/HowItWorks';
import Testimonials from './Component/Testimonials';
import FAQSection from './Component/FAQSection';
import CTASection from './Component/CTASection';
import Footer from './Component/Footer';
import WhatsAppButton from './Component/WhatsAppButton';
import PhoneCallButton from './Component/PhoneCallButton';
import Subscription from './page/Subscription';
import Checkout from './page/Checkout';
import Contact from './page/Contact';
import ProductPage from './page/ProductPage';
import ProductDetail from './page/ProductDetail';
import AdminDashboard from './page/AdminDashboard';
import AuthPage from './page/AuthPage';
import Dashboard from './page/Dashboard';
import ScrollToTop from './Component/ScrollToTop';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Products />
      <Services />
      <StatsSection />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
      <PhoneCallButton />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/subscription' element={<Subscription />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;