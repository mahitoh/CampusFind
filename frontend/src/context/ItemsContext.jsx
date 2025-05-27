import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for storing and sharing lost items data
const ItemsContext = createContext();

// Custom hook to use the items context
export const useItems = () => useContext(ItemsContext);

// Provider component that wraps your app and makes items available to any child component
export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial items data (would typically come from an API)
  const initialItems = [
    {
      id: 1,
      name: 'MacBook Pro 13"',
      location: "University Library, Study Room 4",
      date: "May 15, 2023",
      description:
        "Space gray MacBook Pro with stickers on the cover. Last seen in the library.",
      status: "Missing",
      image: null,
      category: "Electronics",
    },
    {
      id: 2,
      name: "Hydroflask Water Bottle",
      location: "Science Building, Room 302",
      date: "May 17, 2023",
      description: "Blue 32oz Hydroflask with university logo sticker.",
      status: "Found",
      image: null,
      category: "Accessories",
    },
    {
      id: 3,
      name: "Student ID Card",
      location: "Student Center",
      date: "May 18, 2023",
      description: "Student ID for James Wilson.",
      status: "Missing",
      image: null,
      category: "ID/Cards",
    },
    {
      id: 4,
      name: "Gray North Face Backpack",
      location: "Gym Locker Room",
      date: "May 14, 2023",
      description:
        "Gray North Face backpack with laptop, textbooks, and calculator inside.",
      status: "Found",
      image: null,
      category: "Accessories",
    },
    {
      id: 5,
      name: "AirPods Pro",
      location: "Cafeteria",
      date: "May 10, 2023",
      description: "AirPods Pro in white case with small scratch on the back.",
      status: "Found",
      image: null,
      category: "Electronics",
    },
    {
      id: 6,
      name: "Psychology Textbook",
      location: "Psychology Building",
      date: "May 12, 2023",
      description:
        "Introduction to Psychology textbook with highlighted notes.",
      status: "Missing",
      image: null,
      category: "Books/Notes",
    },
  ];

  useEffect(() => {
    // Load initial items (simulating API call)
    setTimeout(() => {
      setItems(initialItems);
      setLoading(false);
    }, 500);

    // In a real app, you would fetch items from your API:
    // const fetchItems = async () => {
    //   try {
    //     const response = await fetch('/api/items');
    //     const data = await response.json();
    //     setItems(data);
    //   } catch (error) {
    //     console.error('Error fetching items:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchItems();
  }, []);

  // Function to add a new lost item
  const addLostItem = (newItem) => {
    // Generate a new id (would be handled by the backend in a real app)
    const id =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    // Add the new item with status "Missing" since it's a lost item
    const itemToAdd = {
      ...newItem,
      id,
      status: "Missing",
      // Format date as "Month DD, YYYY" if it's in a different format
      date: new Date(newItem.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    // Update the items list
    setItems([itemToAdd, ...items]); // Add to the beginning for chronological order

    return id; // Return the id for redirecting to the item details page
  };

  // Function to add a found item
  const addFoundItem = (newItem) => {
    // Generate a new id
    const id =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    // Add the new item with status "Found"
    const itemToAdd = {
      ...newItem,
      id,
      status: "Found",
      // Format date if needed
      date: new Date(newItem.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    // Update the items list
    setItems([itemToAdd, ...items]);

    return id;
  };

  // Function to get a specific item by id
  const getItemById = (id) => {
    return items.find((item) => item.id === Number(id));
  };

  // Context value with items and functions
  const value = {
    items,
    loading,
    addLostItem,
    addFoundItem,
    getItemById,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};
