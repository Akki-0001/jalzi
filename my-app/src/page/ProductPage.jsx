import Navbar from '../Component/NavBar';
import Products from '../Component/ProductCard';
import Footer from '../Component/Footer';
import WhatsAppButton from '../Component/WhatsAppButton';

function ProductPage() {
  return (
    <>
      <Navbar />
      <div className="mt-16">
        <Products />
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default ProductPage;
