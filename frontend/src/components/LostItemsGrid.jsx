import React, { useState, useEffect } from "react";
import LostItemCard from "./LostItemCard";

// Sample data for demonstration
const sampleLostItems = [
  {
    id: 1,
    title: 'Silver MacBook Pro 13"',
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 8, 2025",
    category: "Electronics",
    location: "Library",
    status: "Lost",
    description: "Found near the main entrance of the university library.",
  },
  {
    id: 2,
    title: "Blue Hydroflask Water Bottle",
    image:
      "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 7, 2025",
    category: "Personal Items",
    location: "Gym",
    status: "Found",
    description: "Left in the weight room at campus gym.",
  },
  {
    id: 3,
    title: "Black Leather Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 5, 2025",
    category: "Accessories",
    location: "Cafeteria",
    status: "Found",
    description: "Found under a table in the main cafeteria.",
  },
  {
    id: 4,
    title: "Student ID Card",
    image:
      "https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 9, 2025",
    category: "Documents",
    location: "Science Building",
    status: "Lost",
    description: "Lost somewhere in the Science building, possibly in Lab 204.",
  },
  {
    id: 5,
    title: "AirPods Pro with Case",
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 6, 2025",
    category: "Electronics",
    location: "Student Center",
    status: "Found",
    description: "Found on a table in the Student Center lounge area.",
  },
  {
    id: 6,
    title: "Textbook: Intro to Psychology",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 4, 2025",
    category: "Books",
    location: "Lecture Hall",
    status: "Lost",
    description:
      "Left behind in the Psychology Department's main lecture hall.",
  },
  {
    id: 7,
    title: "Car Keys with Red Keychain",
    image:
      "https://images.unsplash.com/photo-1514316454349-750a07dd6ecf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 9, 2025",
    category: "Accessories",
    location: "Parking Lot",
    status: "Found",
    description: "Found in Parking Lot B near the Engineering building.",
  },
  {
    id: 8,
    title: "Prescription Glasses",
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 7, 2025",
    category: "Accessories",
    location: "Computer Lab",
    status: "Found",
    description:
      "Black-framed prescription glasses found in CS building lab 101.",
  },
];

const LostItemsGrid = ({ title, subtitle }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const items = useState(sampleLostItems)[0];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-screen-2xl">
        <div
          className={`mb-10 transition-all duration-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-gray-600 mt-2">
              {subtitle}
            </p>
          )}
        </div>{" "}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`transition-all duration-500 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <LostItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LostItemsGrid;
