const express = require("express");
const router = express.Router();
const {
  getAllProdcutsByCat,
  getSingleProductByID,
  addNewProduct,
  getAdminAllProdcuts,
  getAdminSingleProductDetails,
  deleteProduct,
  searchProduct,
} = require("../controllers/productsController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

router.route("/products/:category").get(getAllProdcutsByCat);
router.route("/products/:category/:id").get(getSingleProductByID);
router.route("/product/search/:field").get(searchProduct);

// admin routes
router.route("/admin/product/new").post(isAuthenticated, isAdmin, addNewProduct);
router.route("/admin/products").get(isAuthenticated, isAdmin, getAdminAllProdcuts);
router.route("/admin/product/:id").get(isAuthenticated, isAdmin, getAdminSingleProductDetails);
router.route("/admin/product/delete/:id").delete(isAuthenticated, isAdmin, deleteProduct);

module.exports = router;
