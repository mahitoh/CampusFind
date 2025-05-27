const Claim = require("../models/Claim");
const Item = require("../models/Item");
const { createNotification } = require("./notificationController");

// @desc    Create a new claim for an item
// @route   POST /api/claims
// @access  Private
exports.createClaim = async (req, res, next) => {
  try {
    const { itemId, description, identifyingInfo, contactInfo } = req.body;

    // Check if item exists
    const item = await Item.findById(itemId).populate("user");
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    // Check if item is already claimed by this user
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user.id,
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        error: "You have already claimed this item",
      });
    }

    // Create claim
    const claim = await Claim.create({
      item: itemId,
      claimant: req.user.id,
      owner: item.user._id,
      description,
      identifyingInfo,
      contactInfo,
    });

    // Create notification for the item owner
    await createNotification({
      recipient: item.user._id,
      sender: req.user.id,
      type: "claim-request",
      title: "New Claim Request",
      message: `Someone has claimed your ${
        item.status === "Found" ? "found" : "lost"
      } item: ${item.title}`,
      relatedItem: item._id,
    });

    res.status(201).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims for a specific item
// @route   GET /api/claims/item/:itemId
// @access  Private
exports.getItemClaims = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    // Check if user is the owner of the item
    if (item.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to view these claims",
      });
    }

    const claims = await Claim.find({ item: req.params.itemId })
      .populate("claimant", "username email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims made by the user
// @route   GET /api/claims/my-claims
// @access  Private
exports.getUserClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimant: req.user.id })
      .populate("item", "title status images")
      .populate("owner", "username email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims for items owned by the user
// @route   GET /api/claims/received-claims
// @access  Private
exports.getReceivedClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ owner: req.user.id })
      .populate("item", "title status images")
      .populate("claimant", "username email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update claim status
// @route   PUT /api/claims/:id
// @access  Private
exports.updateClaimStatus = async (req, res, next) => {
  try {
    const { status, meetupLocation, meetupTime, notes } = req.body;

    let claim = await Claim.findById(req.params.id)
      .populate("item")
      .populate("claimant");

    if (!claim) {
      return res.status(404).json({
        success: false,
        error: "Claim not found",
      });
    }

    // Check if user is the owner of the item
    if (claim.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this claim",
      });
    }

    // Update claim
    claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status, meetupLocation, meetupTime, notes },
      { new: true }
    );

    // If claim is approved, create notification for the claimant
    if (status === "Approved") {
      await createNotification({
        recipient: claim.claimant,
        sender: req.user.id,
        type: "claim-approved",
        title: "Claim Approved",
        message: `Your claim for "${claim.item.title}" has been approved. Check the details for meetup information.`,
        relatedItem: claim.item._id,
      });

      // Update item status to Claimed
      await Item.findByIdAndUpdate(claim.item._id, { status: "Claimed" });
    }

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a claim (item returned to owner)
// @route   PUT /api/claims/:id/complete
// @access  Private
exports.completeClaim = async (req, res, next) => {
  try {
    let claim = await Claim.findById(req.params.id)
      .populate("item")
      .populate("claimant");

    if (!claim) {
      return res.status(404).json({
        success: false,
        error: "Claim not found",
      });
    }

    // Check if user is the owner of the item or the claimant
    if (
      claim.owner.toString() !== req.user.id &&
      claim.claimant.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to complete this claim",
      });
    }

    // Update claim status to Completed
    claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );

    // Update item status to Returned
    await Item.findByIdAndUpdate(claim.item._id, { status: "Returned" });

    // Create notification for both parties
    if (claim.claimant.toString() === req.user.id) {
      // Claimant has confirmed receipt
      await createNotification({
        recipient: claim.owner,
        sender: req.user.id,
        type: "system",
        title: "Item Successfully Returned",
        message: `The item "${claim.item.title}" has been successfully returned to its owner.`,
        relatedItem: claim.item._id,
      });
    } else {
      // Owner has confirmed handover
      await createNotification({
        recipient: claim.claimant,
        sender: req.user.id,
        type: "system",
        title: "Item Successfully Returned",
        message: `The item "${claim.item.title}" has been marked as successfully returned.`,
        relatedItem: claim.item._id,
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a claim
// @route   DELETE /api/claims/:id
// @access  Private
exports.deleteClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        error: "Claim not found",
      });
    }

    // Check if user is the claimant
    if (
      claim.claimant.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this claim",
      });
    }

    await claim.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
