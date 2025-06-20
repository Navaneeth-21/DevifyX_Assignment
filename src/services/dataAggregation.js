const User = require('../models/User');

exports.aggregateUserData = async (userId, excludedCategories) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error('User not found');

  const data = {
    profile: !excludedCategories.includes('profile') ? user.profile : null,
    settings: !excludedCategories.includes('settings') ? user.settings : null,
    activityLogs: !excludedCategories.includes('activityLogs') ? user.activityLogs : null,
  };

  return data;
};