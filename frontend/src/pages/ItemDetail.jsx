import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPinIcon,
  BellIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { CalendarIcon } from "@heroicons/react/24/solid";

/**
 * Item Detail page component
 * Displays detailed information about a specific lost or found item
 */
const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch item data when component mounts
  useEffect(() => {
    // This would typically be an API call to get item details
    // For now, we'll use mock data
    const mockItems = [
      {
        id: "1",
        name: 'MacBook Pro 13"',
        location: "University Library, Study Room 4",
        date: "May 15, 2023",
        description:
          "Space gray MacBook Pro with stickers on the cover. Last seen in the library.",
        status: "Missing",
        reportedBy: "John Wilson",
        email: "j.wilson@example.edu",
        category: "Electronics",
        images: [],
      },
      {
        id: "2",
        name: "Hydroflask Water Bottle",
        location: "Science Building, Room 302",
        date: "May 17, 2023",
        description: "Blue 32oz Hydroflask with university logo sticker.",
        status: "Found",
        reportedBy: "Sarah Martinez",
        email: "s.martinez@example.edu",
        category: "Accessories",
        images: [],
      },
      {
        id: "3",
        name: "Student ID Card",
        location: "Student Center",
        date: "May 18, 2023",
        description: "Student ID for James Wilson.",
        status: "Missing",
        reportedBy: "James Wilson",
        email: "james.wilson@example.edu",
        category: "ID/Cards",
        images: [],
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      const foundItem = mockItems.find((item) => item.id === id);
      setItem(foundItem || null);
      setLoading(false);
    }, 500);
  }, [id]);

  // Handle claim/contact button click
  const handleActionClick = () => {
    if (item.status === "Found") {
      alert(
        `You are claiming: ${item.name}. A notification has been sent to the finder.`
      );
    } else {
      alert(`You are contacting the person who reported: ${item.name}.`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Item Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The item you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/lost-items"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Lost Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <MapPinIcon className="h-5 w-5 mr-1" />
              <span>Location</span>
            </Link>
            <Link
              to="/campus-map"
              className="text-gray-600 hover:text-gray-800"
            >
              Campus Map
            </Link>
            <Link to="/locations" className="text-gray-600 hover:text-gray-800">
              Locations
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/notifications"
              className="text-gray-600 hover:text-gray-800"
            >
              <BellIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/profile"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <div className="bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
                <span className="text-sm font-medium">JW</span>
              </div>
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/lost-items"
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back to Lost Items</span>
          </Link>
        </div>

        {/* Item Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Item Status Banner */}
          <div
            className={`px-6 py-3 ${
              item.status === "Missing" ? "bg-amber-500" : "bg-green-500"
            } text-white`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <span className="px-3 py-1 text-sm bg-white rounded-full font-medium text-gray-800">
                {item.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Item Image */}
              <div className="flex items-center justify-center bg-gray-200 h-64 rounded-md">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="object-contain h-full"
                  />
                ) : (
                  <span className="text-gray-400">No Image Available</span>
                )}
              </div>

              {/* Item Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-600 uppercase">Category</h3>
                  <p className="font-medium">{item.category}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 uppercase">Location</h3>
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
                    <p className="font-medium">{item.location}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 uppercase">
                    {item.status === "Missing"
                      ? "Date Last Seen"
                      : "Date Found"}
                  </h3>
                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
                    <p className="font-medium">{item.date}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 uppercase">
                    Reported By
                  </h3>
                  <p className="font-medium">{item.reportedBy}</p>
                  <p className="text-sm text-gray-600">{item.email}</p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleActionClick}
                    className={`w-full py-3 rounded-md font-medium ${
                      item.status === "Found"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {item.status === "Found"
                      ? "Claim This Item"
                      : "Contact Person"}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Description</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItemDetail;
