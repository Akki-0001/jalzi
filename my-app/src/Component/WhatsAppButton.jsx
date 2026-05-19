import { FaWhatsapp } from 'react-icons/fa';

function WhatsAppButton() {
  const phoneNumber = "919876543210"; // replace with your real number
  const message = "Hi Jalzi, I want to order water bottles.";

  const handleClick = () => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      title="Order on WhatsApp"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-40 cursor-pointer"
    >
      <FaWhatsapp />
    </button>
  );
}

export default WhatsAppButton;