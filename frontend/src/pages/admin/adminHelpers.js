// Helper functions for filtering, sorting, and pagination

export const filterItems = (items, filters) => {
  const { searchTerm, filterStatus, filterCategory, dateRange } = filters;

  return items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;

    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const itemDate = new Date(item.dateReported);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = itemDate >= startDate && itemDate <= endDate;
    }

    return (
      matchesSearch && matchesStatus && matchesCategory && matchesDateRange
    );
  });
};

export const sortItems = (items, sortBy, sortOrder) => {
  return [...items].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "category":
        aValue = a.category;
        bValue = b.category;
        break;
      case "location":
        aValue = a.location;
        bValue = b.location;
        break;
      default:
        aValue = new Date(a.dateReported);
        bValue = new Date(b.dateReported);
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterUsers = (users, filters) => {
  const { userSearchTerm, userFilterRole, userFilterStatus } = filters;

  return users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase());

    const matchesRole =
      userFilterRole === "all" || user.role === userFilterRole;
    const matchesStatus =
      userFilterStatus === "all" ||
      (userFilterStatus === "active" && user.isActive !== false) ||
      (userFilterStatus === "inactive" && user.isActive === false);

    return matchesSearch && matchesRole && matchesStatus;
  });
};

export const sortUsers = (users, userSortBy, userSortOrder) => {
  return [...users].sort((a, b) => {
    let aValue, bValue;

    switch (userSortBy) {
      case "username":
        aValue = a.username?.toLowerCase() || "";
        bValue = b.username?.toLowerCase() || "";
        break;
      case "email":
        aValue = a.email?.toLowerCase() || "";
        bValue = b.email?.toLowerCase() || "";
        break;
      case "role":
        aValue = a.role || "";
        bValue = b.role || "";
        break;
      case "lastLogin":
        aValue = new Date(a.lastLogin || 0);
        bValue = new Date(b.lastLogin || 0);
        break;
      default:
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
    }

    if (userSortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const paginateData = (data, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

export const getTotalPages = (dataLength, itemsPerPage) => {
  return Math.ceil(dataLength / itemsPerPage);
};

export const exportToCsv = (data, filename, headers) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    headers.join(",") +
    "\n" +
    data
      .map((row) =>
        headers
          .map((header) => {
            const value = row[header] || "";
            // Escape quotes and wrap in quotes if contains comma or quotes
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateChartData = (items) => {
  const lostCount = items.filter((item) => item.status === "Lost").length;
  const foundCount = items.filter((item) => item.status === "Found").length;
  const claimedCount = items.filter((item) => item.status === "Claimed").length;
  const returnedCount = items.filter(
    (item) => item.status === "Returned"
  ).length;

  return {
    labels: ["Lost Items", "Found Items", "Claimed Items", "Returned Items"],
    datasets: [
      {
        data: [lostCount, foundCount, claimedCount, returnedCount],
        backgroundColor: [
          "#EF4444", // Red for lost items
          "#10B981", // Green for found items
          "#F59E0B", // Yellow for claimed items
          "#6366F1", // Blue for returned items
        ],
        borderColor: ["#DC2626", "#059669", "#D97706", "#4F46E5"],
        borderWidth: 2,
        hoverBackgroundColor: ["#F87171", "#34D399", "#FBBF24", "#818CF8"],
      },
    ],
  };
};
