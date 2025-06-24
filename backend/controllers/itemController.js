const Item = require("../models/Item");

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit", "search"];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    let query = Item.find(JSON.parse(queryStr)).populate({
      path: "user",
      select: "username email",
    });

    // Search functionality
    if (req.query.search) {
      query = Item.find({ $text: { $search: req.query.search } });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Item.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const items = await query;

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

// @desc    Get user's items
// @route   GET /api/items/my-items
// @access  Private
exports.getUserItems = async (req, res, next) => {
  try {
    // Find items created by the current user
    const items = await Item.find({ user: req.user.id })
      .populate({
        path: "user",
        select: "username email",
      })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate({
      path: "user",
      select: "username email",
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Handle file uploads
    if (req.files) {
      const images = [];
      req.files.forEach((file) => {
        images.push(`/uploads/${file.filename}`);
      });
      req.body.images = images;
    }

    const item = await Item.create(req.body);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    // Make sure user owns the item
    if (item.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "User not authorized",
      });
    }

    // Handle file uploads
    if (req.files) {
      const images = item.images || [];
      req.files.forEach((file) => {
        images.push(`/uploads/${file.filename}`);
      });
      req.body.images = images;
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    // Make sure user owns the item
    if (item.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "User not authorized",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
