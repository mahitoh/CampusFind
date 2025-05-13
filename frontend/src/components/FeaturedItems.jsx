import Card from "./Card";

const FeaturedItems = () => {
  // Sample data - in a real application, this would come from an API
  const items = [
    {
      id: 1,
      title: "Blue Backpack",
      description: "Found near the Science Building on May 10th",
      image: "/src/assets/images/download.jpg", // Update with actual image paths
      category: "Found",
    },
    {
      id: 2,
      title: "Student ID Card",
      description: "Lost at the Student Center on May 8th",
      image: "/src/assets/images/download1.jpg", // Update with actual image paths
      category: "Lost",
    },
    {
      id: 3,
      title: "Apple AirPods",
      description: "Found in the Library, 3rd floor",
      image: "/src/assets/images/images.jpg", // Update with actual image paths
      category: "Found",
    },
    {
      id: 4,
      title: "Water Bottle",
      description: "Lost at the Gym on May 11th",
      image: "/src/assets/images/bg.jpg", // Update with actual image paths
      category: "Lost",
    },
  ];

  return (
    <section className="py-10 bg-gray-50" id="featured-items">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Recent Lost & Found Items</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through recently reported items or post about your own lost
            belongings.
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              category={item.category}
              onClick={() => alert(`Viewing details for ${item.title}`)}
            />
          ))}
        </div>
        {/* 
        <div className="text-center mt-10">
          <a
            href="/all-items"
            className="inline-block px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            View All Items
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default FeaturedItems;
