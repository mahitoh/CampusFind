import { createContext, useContext, useState, useEffect } from "react";
import * as adminService from "../services/adminService";
import { useAuth } from "./AuthContextNew";

// Create the Admin Context
const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState({
    stats: {
      totalItems: 0,
      pendingApproval: 0,
      successfulMatches: 0,
      activeUsers: 0,
    },
    items: [],
    users: [],
    pendingItems: [],
  });
  const [loading, setLoading] = useState(false);

  // Load admin data when user changes
  useEffect(() => {
    if (user && user.role === "admin") {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      // Load stats
      const statsResult = await adminService.getSystemStats();
      if (statsResult.success) {
        setAdminData((prev) => ({
          ...prev,
          stats: { ...prev.stats, ...statsResult.data },
        }));
      }

      // Load all items
      const itemsResult = await adminService.getAllItems();
      if (itemsResult.success) {
        const items = itemsResult.data.data || itemsResult.data;
        const pending = items.filter(
          (item) => item.status === "Pending" || item.status === "Under Review"
        );

        setAdminData((prev) => ({
          ...prev,
          items,
          pendingItems: pending,
          stats: {
            ...prev.stats,
            totalItems: items.length,
            pendingApproval: pending.length,
          },
        }));
      }

      // Load all users
      const usersResult = await adminService.getAllUsers();
      if (usersResult.success) {
        const users = usersResult.data.data || usersResult.data;
        setAdminData((prev) => ({
          ...prev,
          users,
          stats: {
            ...prev.stats,
            activeUsers: users.length,
          },
        }));
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveItem = async (itemId) => {
    try {
      const result = await adminService.updateItemStatus(itemId, {
        status: "Active",
      });

      if (result.success) {
        await loadAdminData(); // Reload data
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const rejectItem = async (itemId) => {
    try {
      const result = await adminService.deleteItem(itemId);

      if (result.success) {
        await loadAdminData(); // Reload data
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    adminData,
    loading,
    loadAdminData,
    approveItem,
    rejectItem,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
