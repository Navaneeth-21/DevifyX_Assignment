const mongoose = require("mongoose");
const constants = require("../utils/constants");

const exportRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: Object.values(constants.EXPORT_STATUSES),
    default: constants.EXPORT_STATUSES.PENDING,
  },
  requestedAt: { type: Date, default: Date.now },
  completedAt: Date,
  downloadLink: String,
  excludedCategories: [String], // For data redaction
});

module.exports = mongoose.model("ExportRequest", exportRequestSchema);
