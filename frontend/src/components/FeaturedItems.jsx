import Card from "./Card";

const FeaturedItems = () => {
  // Sample data - in a real application, this would come from an API
  const items = [
    {
      id: 1,
      title: "Blue Backpack",
      description: "Found near the Science Building on May 10th",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&crop=center", // Blue backpack
      category: "Found",
    },
    {
      id: 2,
      title: "Laptop",
      description: "Lost at the Student Center on May 8th",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop&crop=center", // Laptop
      category: "Lost",
    },
    {
      id: 3,
      title: "Apple AirPods",
      description: "Found in the Library, 3rd floor",
      image:
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop&crop=center", // AirPods
      category: "Found",
    },
    {
      id: 4,
      title: "Water Bottle",
      description: "Lost at the Gym on May 11th",
      image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=200&fit=crop&crop=center", // Water bottle
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

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6 md:grid-cols-4">
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
