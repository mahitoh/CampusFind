const Item = require("../models/Item");

// @desc    Get statistics about items
// @route   GET /api/stats
// @access  Public
exports.getStats = async (req, res, next) => {
  try {
    // Get counts by status
    const lostCount = await Item.countDocuments({ status: "Lost" });
    const foundCount = await Item.countDocuments({ status: "Found" });
    const claimedCount = await Item.countDocuments({ status: "Claimed" });
    const returnedCount = await Item.countDocuments({ status: "Returned" });

    // Get counts by category
    const electronics = await Item.countDocuments({ category: "Electronics" });
    const clothing = await Item.countDocuments({ category: "Clothing" });
    const books = await Item.countDocuments({ category: "Books" });
    const accessories = await Item.countDocuments({ category: "Accessories" });
    const documents = await Item.countDocuments({ category: "Documents" });
    const other = await Item.countDocuments({ category: "Other" });

    // Get recent activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentActivity = await Item.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    // Get total items
    const totalItems = await Item.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total: totalItems,
        statusCounts: {
          lost: lostCount,
          found: foundCount,
          claimed: claimedCount,
          returned: returnedCount,
        },
        categoryCounts: {
          electronics,
          clothing,
          books,
          accessories,
          documents,
          other,
        },
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};
