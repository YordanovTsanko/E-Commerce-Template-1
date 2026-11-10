const Products = require("../models/products");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//Get products by category => /api/v1/products/:category
exports.getAllProdcutsByCat = catchAsyncErrors(async (req, res, next) => {
  try {
    if (
      ![
        "shoes",
        "woman cloths",
        "man cloths",
        "gym accessories",
        "electronics",
        "jewelry",
      ].includes(req.params.category)
    ) {
      return next(new ErrorHandler("Category not found", 404));
    }

    const productsData = await Products.find({
      category: req.params.category,
    });

    if (productsData.length === 0) {
      return next(new ErrorHandler("Products not found", 404));
    }

    res.status(200).json({
      success: true,
      products: productsData,
    });
  } catch (error) {
    return next(error);
  }
});

//Get single product by Id => /api/v1/products/:category/:id

exports.getSingleProductByID = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    return next(new ErrorHandler("Invalid product ID", 404));
  }

  const productData = await Products.findById(id);

  if (!productData) {
    return next(new ErrorHandler("Ops !!! Product not found.", 404));
  }

  res.status(200).json({
    success: true,
    product: productData,
  });
});
//Search products by Id => /api/v1/product/search/:field

exports.searchProduct = catchAsyncErrors(async (req, res, next) => {
  const searchString = req.params.field;

  // Ескейпваме специалните символи — иначе напр. "(" чупи RegExp и сървъра.
  const safe = String(searchString).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(safe, "i");

  const products = await Products.find({
    $or: [
      { name: { $regex: regex } },
      { description: { $regex: regex } },
      { category: { $regex: regex } },
    ],
  });

  res.status(200).json({
    success: true,
    products: products,
  });
});
//Admin add product => /api/v1/admin/product/new
exports.addNewProduct = catchAsyncErrors(async (req, res, next) => {
  //body must include name, img, price, category,description, @stock
  const product = new Products(req.body);

  await product.save();

  res.status(200).json({
    success: true,
    product: product,
    message: "Product added successfully",
  });
});
//Admin get all product => /api/v1/admin/products
exports.getAdminAllProdcuts = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Products.find({});

    res.status(200).json({
      success: true,
      products: products,
    });
  } catch (error) {
    return next(new ErrorHandler("Products not found.", 404));
  }
});

//Admin get single product => /api/v1/admin/product/:id
exports.getAdminSingleProductDetails = catchAsyncErrors(
  async (req, res, next) => {
    const productId = req.params.id;

    const product = await Products.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product: product,
    });
  }
);
//Admin delete product => /api/v1/admin/product/delete/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Products.findByIdAndDelete(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
