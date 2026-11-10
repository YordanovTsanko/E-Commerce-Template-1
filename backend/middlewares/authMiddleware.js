const ErrorHandler = require("../utils/errorHandler");

// Пуска само влезли потребители (сесия от passport).
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return next(new ErrorHandler("Please log in first", 401));
};

// Пуска само администратори. Използвайте СЛЕД isAuthenticated.
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return next(new ErrorHandler("You are not authorized for this.", 403));
};
