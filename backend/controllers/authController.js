const User = require(".././models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Премахва паролата преди да изпратим потребителя към фронтенда.
const toSafeUser = (user) => {
  if (!user) return null;
  const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
    ) {
      return next(
        new ErrorHandler(
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one symbol.",
          400
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.validate();
    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      user: toSafeUser(savedUser),
      message: "You have been registered successfully. Please log in...",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Login a user => /api/v1/login
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        errMessage: (info && info.message) || "Login failed",
      });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.status(200).json({ success: true, user: toSafeUser(user) });
    });
  })(req, res, next);
};

// Logout user => /api/v1/logout
exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    req.session.destroy(() => {
      const isProduction = process.env.NODE_ENV === "PRODUCTION";
      res.clearCookie("sid", {
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      });
      res.status(200).json({ success: true, message: "Logout successful" });
    });
  });
};

// Check if user is logged in => /api/v1/isloggedin
exports.isLoggedIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ success: true, user: toSafeUser(req.user) });
  }
  return res.status(401).json({ success: false, user: null });
};

// Edit user => /api/v1/user/edit/:id
exports.editUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;

  // Потребителят може да редактира само собствения си профил (админът — всички).
  if (req.user._id.toString() !== userId && req.user.role !== "admin") {
    return next(new ErrorHandler("You are not authorized for this.", 403));
  }

  // Позволяваме само тези полета — роля, количка и др. не могат да се сменят оттук.
  const allowed = ["firstName", "lastName", "email", "phoneNumber", "address", "city", "postCode", "state"];
  const updatedUserData = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updatedUserData[key] = req.body[key];
  });
  if (updatedUserData.phoneNumber) updatedUserData.phoneNumber = Number(updatedUserData.phoneNumber);
  if (updatedUserData.email) updatedUserData.email = String(updatedUserData.email).trim().toLowerCase();

  const { password, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (password) {
      if (!newPassword || !confirmPassword) {
        return next(new ErrorHandler("Please write new password and confirm it", 400));
      }
      if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("New password and confirm password do not match", 400));
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect", 400));
      }
      updatedUserData.password = await bcrypt.hash(newPassword, 10);
    }

    if (updatedUserData.email && updatedUserData.email !== user.email) {
      const existingUser = await User.findOne({ email: updatedUserData.email });
      if (existingUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }
    }

    await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: password ? "Password was updated" : "Profile was updated",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((value) => value.message).join(" ");
      return next(new ErrorHandler(message, 400));
    }
    return next(new ErrorHandler(error._message || "Internal Server Error", 500));
  }
});

//Admin get all users => /api/v1/admin/users
exports.getAdminAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({}).select("-cartItems");
  res.status(200).json({ success: true, users });
});
