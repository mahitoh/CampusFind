import React, { Suspense } from "react";
import SignUp from "../pages/SignUp";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import LinkTest from "../pages/LinkTest";
import LogoutPage from "../pages/LogoutPage";
import LostItems from "../pages/LostItems";
import ReportMissing from "../pages/ReportMissing";
import SubmitFound from "../pages/SubmitFound";
import MyItems from "../pages/MyItems";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import {
  ProtectedRoute,
  PublicRoute,
  AdminRoute,
} from "../components/layout/RouteGuards";

/**
 * Routes configuration
 * Defines all application routes
 */
const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <SignUp isLoginMode={true} />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/test",
    element: <LinkTest />,
  },
  {
    path: "/lost-items",
    element: (
      <ProtectedRoute>
        <LostItems />
      </ProtectedRoute>
    ),
  },
  {
    path: "/report-missing",
    element: (
      <ProtectedRoute>
        <ReportMissing />
      </ProtectedRoute>
    ),
  },
  {
    path: "/submit-found",
    element: (
      <ProtectedRoute>
        <SubmitFound />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-items",
    element: (
      <ProtectedRoute>
        <MyItems />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
