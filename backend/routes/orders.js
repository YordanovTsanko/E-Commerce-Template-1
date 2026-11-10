const express = require("express");
const router = express.Router();
const {
  newOrder,
  getUserOrders,
  getOrderById,
  addToCart,
  deleteFromCart,
  getItemsFromCart,
  clearCartAffterOrder,
  getAllOrders,
} = require("../controllers/ordersController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/orders").get(isAuthenticated, getUserOrders);
router.route("/order/clear/cart").put(isAuthenticated, clearCartAffterOrder);
router.route("/order/:id").get(isAuthenticated, getOrderById);

router.route("/cart/add/:id").put(isAuthenticated, addToCart);
router.route("/cart/delete/:id").delete(isAuthenticated, deleteFromCart);
router.route("/cart").get(isAuthenticated, getItemsFromCart);

// admin
router.route("/admin/orders").get(isAuthenticated, isAdmin, getAllOrders);

module.exports = router;
