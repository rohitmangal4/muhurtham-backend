// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  updateProfile,
  getProfile,
  getSuggestedProfiles,
  viewProfile
} = require('../controller/userController');

// Protected user actions
router.put('/update/:id', protect, updateProfile);
router.get('/me/:id', protect, getProfile);
router.get('/suggestions', protect, getSuggestedProfiles);
router.get('/view/:id',protect, viewProfile)

module.exports = router;
