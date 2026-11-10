const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Невалидно Mongo ID (напр. /order/abc)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // Грешки от валидацията на Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((value) => value.message)
      .join(" ");
  }

  // Дублиран уникален ключ (напр. имейл)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Email already exists";
  }

  // CORS отказ
  if (message.startsWith("CORS:")) statusCode = 403;

  if (Array.isArray(message)) message = message.join(" ");

  const body = { success: false, errMessage: message };
  if (process.env.NODE_ENV === "DEVELOPMENT") body.stack = err.stack;

  // Винаги връщаме отговор — преди при друг NODE_ENV заявката "висеше".
  res.status(statusCode).json(body);
};
