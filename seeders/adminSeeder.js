const User = require("../models/userModel.js");

const seedAdmin = async (req, res) => {
    try {
        const getUserCounts = await User.countDocuments();
        if (!getUserCounts) {
            const newUser = new User({
                name: "Admin",
                email: "admin@gmail.com",
                password: "SuperAdmin", // No need to hash here, it's handled in the model
                role: "admin"
            });
            // Save the user to the database
            await newUser.save();
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
};

module.exports = { seedAdmin }
