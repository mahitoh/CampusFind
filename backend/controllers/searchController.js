const Item = require("../models/Item");

// @desc    Search for items based on query
// @route   GET /api/search
// @access  Public
exports.searchItems = async (req, res, next) => {
  try {
    const { q, category, status, sortBy } = req.query;

    // Base query
    const query = {};

    // Add text search if query parameter exists
    if (q) {
      query.$text = { $search: q };
    }

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Build the query
    let itemQuery = Item.find(query);

    // Sort options
    if (sortBy === "recent") {
      itemQuery = itemQuery.sort("-createdAt");
    } else if (sortBy === "oldest") {
      itemQuery = itemQuery.sort("createdAt");
    } else if (sortBy === "alphabetical") {
      itemQuery = itemQuery.sort("title");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Item.countDocuments(query);

    // Apply pagination
    itemQuery = itemQuery.skip(startIndex).limit(limit);

    // Execute query
    const items = await itemQuery;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: items.length,
      pagination,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};
