// controllers/adminController.js
const UserRegister = require('../models/User');
const Interest = require('../models/Interest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await UserRegister.findOne({ email });
    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      token,
      user: {
        id: admin._id,
        fullName: admin.fullName,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ message: 'Admin login failed' });
  }
};

// 👤 Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserRegister.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// ❌ Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await UserRegister.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// 🚫 Block / ✅ Unblock User
const toggleBlockUser = async (req, res) => {
  try {
    const user = await UserRegister.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.blocked = !user.blocked;
    await user.save();

    res.json({ message: user.blocked ? 'User blocked' : 'User unblocked' });
  } catch (err) {
    res.status(500).json({ message: 'Block/unblock failed' });
  }
};

// 🔎 View All Interests
const viewAllInterests = async (req, res) => {
  try {
    const interests = await Interest.find().sort({ createdAt: -1 });
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch interests' });
  }
};

module.exports = {
  adminLogin,
  getAllUsers,
  deleteUser,
  toggleBlockUser,
  viewAllInterests
};
