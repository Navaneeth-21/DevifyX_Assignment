const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    name: String,
    dob: Date,
  },
  settings: {
    notifications: Boolean,
    theme: String,
  },
  activityLogs: [{ action: String, timestamp: Date }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

module.exports = mongoose.model("User", userSchema);
