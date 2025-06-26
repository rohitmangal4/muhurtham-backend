// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAllUsers,
  deleteUser,
  toggleBlockUser,
  viewAllInterests
} = require('../controller/adminController');
const { adminOnly } = require('../middlewares/adminMiddleware');

// Admin Login
router.post('/login', adminLogin);

// Protected Admin Actions
router.get('/users', adminOnly, getAllUsers);
router.delete('/users/:id', adminOnly, deleteUser);
router.put('/users/:id/block', adminOnly, toggleBlockUser);
router.get('/interests', adminOnly, viewAllInterests);

module.exports = router;
