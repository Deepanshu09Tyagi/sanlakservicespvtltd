const User = require('../models/userModel');

// Function to fetch users who registered in the last 7 days
const getRecentUsers = async () => {
    const getWithin7Days = new Date();
    getWithin7Days.setDate(getWithin7Days.getDate() - 7);
    try {
        const recentUsers = await User.find({ createdAt: { $gte: getWithin7Days }, });
        return recentUsers;
    } catch (error) {
        console.error('Error fetching recent users:', error);
        throw error;
    }
};

module.exports = { getRecentUsers };
