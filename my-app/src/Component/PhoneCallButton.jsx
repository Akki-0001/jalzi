import { FaPhoneAlt } from 'react-icons/fa';

function PhoneCallButton() {
  const phoneNumber = "+919876543210"; // replace with your actual support number

  return (
    <a
      href={`tel:${phoneNumber}`}
      title="Call Support"
      className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-lg transition-all duration-300 transform hover:scale-110 active:scale-95 z-40"
    >
      <FaPhoneAlt />
    </a>
  );
}

export default PhoneCallButton;
