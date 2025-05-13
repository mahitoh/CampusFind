import Card from "./Card";

const Testimonials = () => {
  // Sample testimonial data - in a real application, this would come from an API
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      text: "I lost my laptop during finals week and was devastated. Thanks to CampusFind, I had it back within 24 hours!",
      image: "/src/assets/images/download.jpg", // Replace with actual images
      department: "Computer Science",
    },
    {
      id: 2,
      name: "Sarah Williams",
      text: "The platform is so easy to use! I found someone's keys and was able to return them the same day through CampusFind.",
      image: "/src/assets/images/download1.jpg", // Replace with actual images
      department: "Business Administration",
    },
    {
      id: 3,
      name: "Michael Chen",
      text: "Lost my wallet with all my IDs right before an exam. Posted it on CampusFind and had it back within hours. Lifesaver!",
      image: "/src/assets/images/images.jpg", // Replace with actual images
      department: "Engineering",
    },
  ];

  // Success statistics
  const stats = [
    { value: "94%", label: "Recovery Rate" },
    { value: "2,500+", label: "Items Found" },
    { value: "24hrs", label: "Average Recovery Time" },
  ];
  return (
    <section className="pt-0 pb-16 bg-white" id="testimonials">
      {/* Statistics */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-xl mb-12">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-indigo-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from students who have successfully recovered their lost items
            through our platform.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.department}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
