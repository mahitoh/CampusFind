import React from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";
import bg1 from "./assets/images/bg.jpg";
import bg2 from "./assets/images/download.jpg";
import bg3 from "./assets/images/download1.jpg";
import bg4 from "./assets/images/images.jpg";
import HomePageLayout from "./components/layout/HomePageLayout";
import { AuthProvider } from "./context/AuthContextNew";
import { ItemsProvider } from "./context/ItemsContext";

// Import routes configuration
import routes from "./routes";

// Import Debuggers
import AuthDebugger from "./components/common/AuthDebugger";
import ItemsDebugger from "./components/debug/ItemsDebugger";

function App() {
  const images = [bg1, bg2, bg3, bg4];

  // Define a routes renderer that overrides the homepage route
  const AppRoutes = () => {
    // Override the first route (homepage) with our HomePageLayout component
    const routesWithHomepage = [
      {
        ...routes[0],
        element: <HomePageLayout images={images} />,
      },
      ...routes.slice(1),
    ];

    // Use the useRoutes hook to render routes
    const element = useRoutes(routesWithHomepage);
    return element;
  };
  return (
    <AuthProvider>
      <ItemsProvider>
        <AppRoutes />
      </ItemsProvider>
    </AuthProvider>
  );
}

export default App;
