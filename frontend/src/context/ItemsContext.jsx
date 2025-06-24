import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import * as itemsService from "../services/itemsService";
import { formatImageUrl } from "../services/apiClient";

// Create a context for storing and sharing lost items data
const ItemsContext = createContext();

// Custom hook to use the items context
export const useItems = () => useContext(ItemsContext);

// Provider component that wraps your app and makes items available to any child component
export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userItemsLoading, setUserItemsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial items data - for fallback if API fails
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
    let isMounted = true;

    // Fetch items from the API
    const fetchItems = async () => {
      try {
        if (!isMounted) return;

        setLoading(true);
        const response = await itemsService.getItems();

        if (!isMounted) return;

        // Check if we have valid data from the API
        if (response && response.data && Array.isArray(response.data)) {
          // Format the image URLs with proper server base URL
          const formattedItems = response.data.map((item) => ({
            ...item,
            id: item._id || item.id, // Ensure we have an id field
            name: item.title || item.name, // Support both title and name fields
            status: item.status || "Missing", // Default to "Missing" if no status
            image:
              item.images && item.images.length > 0
                ? formatImageUrl(item.images[0])
                : null,
            images: (item.images || []).map((img) => formatImageUrl(img)),
          }));

          setItems(formattedItems);
        } else {
          // If API fails, use initial items as fallback
          setError("Could not load items from server, using fallback data");
          if (isMounted) {
            setItems(initialItems);
          }
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        if (isMounted) {
          // Fall back to initial items in case of API failure
          setItems(initialItems);
          setError("Could not connect to server, using fallback data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array is fine since initialItems is static  // Function to fetch user-specific items
  const fetchUserItems = useCallback(async () => {
    try {
      setUserItemsLoading(true);
      const response = await itemsService.getUserItems();

      if (response && response.data && Array.isArray(response.data)) {
        // Format the user items similar to general items
        const formattedUserItems = response.data.map((item) => ({
          ...item,
          id: item._id || item.id,
          name: item.title || item.name,
          date: new Date(item.date || item.createdAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          ),
          status: item.status || "Missing",
          image:
            item.images && item.images.length > 0
              ? formatImageUrl(item.images[0])
              : null,
          images: (item.images || []).map((img) => formatImageUrl(img)),
        }));

        setUserItems(formattedUserItems);
      } else {
        setUserItems([]);
      }
    } catch (err) {
      console.error("Error fetching user items:", err);
      setUserItems([]);
      setError("Could not load your items");
    } finally {
      setUserItemsLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props/state

  // Using the formatImageUrl function from apiClient.js
  // Function to add a new lost item
  const addLostItem = async (newItem) => {
    try {
      // Call the API to create a lost item
      const response = await itemsService.createLostItem({
        title: newItem.name,
        description: newItem.description,
        category: newItem.category,
        location: newItem.location,
        date: newItem.date,
        images: newItem.images || [],
      }); // If successful, add the item to our local state
      if (response && response.data) {
        // Format the API response to match our expected format
        const formattedItem = {
          id: response.data._id,
          name: response.data.title,
          description: response.data.description,
          location: response.data.location,
          date: new Date(response.data.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          status:
            response.data.status === "Lost" ? "Missing" : response.data.status,
          category: response.data.category,
          image:
            response.data.images && response.data.images.length > 0
              ? formatImageUrl(response.data.images[0])
              : null,
          images: (response.data.images || []).map((img) =>
            formatImageUrl(img)
          ),
        };

        setItems([formattedItem, ...items]);
        return formattedItem.id;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Failed to add lost item:", error);
      setError("Failed to add lost item. Please try again.");

      // Fallback to client-side generation in case of API failure
      const id =
        items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
      const itemToAdd = {
        ...newItem,
        id,
        status: "Missing",
        date: new Date(newItem.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };
      setItems([itemToAdd, ...items]);
      return id;
    }
  };

  // Function to add a found item
  const addFoundItem = async (newItem) => {
    try {
      // Call the API to create a found item
      const response = await itemsService.createFoundItem({
        title: newItem.name,
        description: newItem.description,
        category: newItem.category,
        location: newItem.location,
        date: newItem.date,
        images: newItem.images || [],
      }); // If successful, add the item to our local state
      if (response && response.data) {
        // Format the API response to match our expected format
        const formattedItem = {
          id: response.data._id,
          name: response.data.title,
          description: response.data.description,
          location: response.data.location,
          date: new Date(response.data.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          status: "Found",
          category: response.data.category,
          image:
            response.data.images && response.data.images.length > 0
              ? formatImageUrl(response.data.images[0])
              : null,
          images: (response.data.images || []).map((img) =>
            formatImageUrl(img)
          ),
        };

        setItems([formattedItem, ...items]);
        return formattedItem.id;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Failed to add found item:", error);
      setError("Failed to add found item. Please try again.");

      // Fallback to client-side generation in case of API failure
      const id =
        items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
      const itemToAdd = {
        ...newItem,
        id,
        status: "Found",
        date: new Date(newItem.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };
      setItems([itemToAdd, ...items]);
      return id;
    }
  };
  // Function to get a specific item by id
  const getItemById = async (id) => {
    try {
      // First check if we already have the item in our local state
      const localItem = items.find(
        (item) => item.id === id || item.id === Number(id)
      );
      if (localItem) return localItem;

      // If not in local state, fetch from API
      const response = await itemsService.getItemById(id);
      if (response && response.data) {
        // Format the API response
        const formattedItem = {
          id: response.data._id,
          name: response.data.title,
          description: response.data.description,
          location: response.data.location,
          date: new Date(response.data.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          status:
            response.data.status === "Lost" ? "Missing" : response.data.status,
          category: response.data.category,
          image:
            response.data.images && response.data.images.length > 0
              ? formatImageUrl(response.data.images[0])
              : null,
          images: (response.data.images || []).map((img) =>
            formatImageUrl(img)
          ),
        }; // Add to our local state cache
        setItems((prevItems) => {
          // Only add if not already in the list
          if (!prevItems.find((item) => item.id === formattedItem.id)) {
            return [...prevItems, formattedItem];
          }
          return prevItems;
        });

        return formattedItem;
      }
      return null;
    } catch (error) {
      console.error("Failed to get item details:", error);
      setError("Failed to get item details");
      return null;
    }
  };
  // Context value with items and functions
  const value = {
    items,
    userItems,
    loading,
    userItemsLoading,
    error,
    addLostItem,
    addFoundItem,
    getItemById,
    fetchUserItems,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};
