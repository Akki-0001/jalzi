import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What makes Jalzi water different from other brands?",
      answer: "Jalzi uses advanced RO and UV purification with mineral balancing. Every batch is BIS certified and tested for safety and purity.",
    },
    {
      question: "How quickly can I get my order delivered?",
      answer: "We offer same-day delivery for orders placed before 9 PM. Choose your preferred time slot during checkout.",
    },
    {
      question: "Is there a subscription option available?",
      answer: "Yes! We offer flexible subscription plans starting from ₹299/month. Save up to 20% with monthly subscriptions.",
    },
    {
      question: "What if I need to cancel my order?",
      answer: "You can cancel orders placed more than 2 hours before your scheduled delivery time with full refund.",
    },
    {
      question: "Do you provide empty bottle collection?",
      answer: "Yes! We collect empty bottles during next delivery for recycling. It's part of our sustainability initiative.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods: Credit/Debit cards, UPI, Net Banking, and Cash on Delivery.",
    },
  ];

  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-2xl text-gray-600">Got questions? We've got answers!</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-600 transition"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white transition"
              >
                <h3 className="text-lg font-bold text-gray-800 text-left">{faq.question}</h3>
                <FaChevronDown
                  size={20}
                  className={`text-blue-600 transform transition ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-8 py-6 bg-blue-50 border-t-2 border-blue-200">
                  <p className="text-gray-700 text-lg leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
