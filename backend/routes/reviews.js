const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
  editReview,
  deleteReview,
} = require("../controllers/reviewsController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.route("/review/new").post(isAuthenticated, createReview);
router.route("/review/:id").get(getProductReviews);
router.route("/review/edit/:id").put(isAuthenticated, editReview);
router.route("/review/delete/:id").delete(isAuthenticated, deleteReview);

module.exports = router;
