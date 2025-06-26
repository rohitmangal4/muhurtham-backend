// controllers/userController.js
const User = require("../models/User");
const Interest = require("../models/Interest");

// ✅ Update Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/update/:id
const updateProfile = async (req, res) => {
  try {
    const updatedFields = {
      ...req.body,
      profileCompleted: true,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// ✅ Get Suggested Matches (Opposite Gender)
// const getSuggestedProfiles = async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.user.id);
//     const oppositeGender = currentUser.gender === "male" ? "female" : "male";

//     const suggestions = await User.find({
//       gender: oppositeGender,
//       profileCompleted: true,
//       _id: { $ne: currentUser._id },
//     });

//     res.json(suggestions);
//   } catch (err) {
//     console.error("Suggestion error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const getSuggestedProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const oppositeGender = currentUser.gender === "male" ? "female" : "male";

    // 🔎 Get list of receiverIds the user has already sent interest to
    const interests = await Interest.find({ senderId: currentUser._id });
    const sentIds = interests.map((i) => i.receiverId.toString());

    // 🔍 Fetch opposite gender profiles not already interested and not current user
    const suggestions = await User.find({
      gender: oppositeGender,
      profileCompleted: true,
      _id: {
        $nin: [currentUser._id, ...sentIds],
      },
    });

    res.json(suggestions);
  } catch (err) {
    console.error("Suggestion error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const viewProfile = async (req, res) => {
  try {
    const viewProfile = await User.findById(req.params.id).select("-password");
    if (!viewProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(viewProfile)
  } catch (error) {
    res.status(500).json({ message: "server error" }, error.message);
  }
};

module.exports = {
  updateProfile,
  getProfile,
  getSuggestedProfiles,
  viewProfile,
};
