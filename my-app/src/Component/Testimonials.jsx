import { FaStar } from "react-icons/fa";

function Testimonials() {
  const reviews = [
    {
      name: "Priya Sharma",
      city: "New Delhi",
      text: "Jalzi has been my go-to water delivery service for 2 years. Pure quality and reliable delivery every time!",
      rating: 5,
    },
    {
      name: "Rahul Patel",
      city: "Delhi",
      text: "Best water quality I've had. Customer support is super helpful. Highly recommended!",
      rating: 5,
    },
    {
      name: "Ananya Singh",
      city: "Gurgaon",
      text: "Switched from another brand and never looked back. Jalzi is simply the best!",
      rating: 5,
    },
    {
      name: "Vikram Kumar",
      city: "Noida",
      text: "Affordable prices, premium quality, and punctual delivery. What more can you ask for?",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-2xl text-gray-600">Join thousands of satisfied customers</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition border-l-4 border-blue-600">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} size={20} className="text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 text-lg mb-6 leading-relaxed italic">
                "{review.text}"
              </p>

              <div>
                <h3 className="text-xl font-bold text-gray-800">{review.name}</h3>
                <p className="text-blue-600 font-semibold">{review.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
