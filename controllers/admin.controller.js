const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = require('../models/userModel');

const createUserByAdmin = async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
            role,  // Defaults to 'user' unless provided
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: { name, email, role } });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
}

const getAllUsers = async (req, res) => {
    const { page = 1, role } = req.query;  // Default to page 1 if no page is provided
    const limit = 2;  // Limit of users per page
    if (page < 1) {
        return res.status(400).json({ error: 'Page parameters are incorrect!' });
    }

    try {
        // Build the query for filtering by role if provided
        const query = {};
        if (role) {
            query.role = role;  // If role is specified, add it to the query
        }

        // Fetch users from the database with pagination and filtering
        const users = await User.find(query)
            .skip((page - 1) * limit)  // Skip users based on the current page
            .limit(limit)  // Limit to 10 users per page

        if (!users.length) {
            return res.status(400).json({ error: 'No User Found' });
        }
        // Get the total count of users for pagination metadata
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);  // Calculate total number of pages

        res.status(200).json({
            message: 'User got successfully',
            users,
            totalUsers,
            totalPages,
            currentPage: parseInt(page, 10),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const updateUserRole = async (req, res) => {
    const { id } = req.params; // Get the user ID from URL params
    const { role, name, email, password } = req.body; // Get the new role from the request body
    const adminId = req.user.userId; // Get the ID of the currently logged-in admin

    try {
        // Check if the admin is trying to change their own role
        if (id.toString() === adminId.toString()) {
            return res.status(403).json({ error: 'You cannot change your own role.' });
        }

        // Find the user to update
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (email) {
            const emailExists = await User.findOne({email});  // Check for any other user with the same email
            if (emailExists) {
                return res.status(400).json({ error: 'Email already in use by another user.' });
            }
            user.email = email; // Update email if it's unique
        }

        // Update the name if provided
        if (name) {
            user.name = name;
        }
        if (role) {
            user.role = role;
        }

        // Update the password if provided and hash it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: 'User role updated successfully.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params; // Get the user ID from URL params
    const adminId = req.user.userId; // Get the ID of the currently logged-in admin

    try {
        // Check if the admin is trying to delete their own account
        if (id.toString() === adminId.toString()) {
            return res.status(403).json({ error: 'You cannot delete your own account.' });
        }

        // Find the user to delete
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Delete the user from the database
        await user.deleteOne();

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
}

module.exports = { createUserByAdmin, getAllUsers, updateUserRole, deleteUser };