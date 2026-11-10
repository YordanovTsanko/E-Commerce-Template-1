const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  isLoggedIn,
  editUser,
  getAdminAllUsers,
} = require("../controllers/authController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/isloggedin").get(isLoggedIn);
router.route("/user/edit/:id").put(isAuthenticated, editUser);

// админ
router.route("/admin/users").get(isAuthenticated, isAdmin, getAdminAllUsers);

module.exports = router;
