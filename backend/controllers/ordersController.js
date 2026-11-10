const Orders = require(".././models/orders");
const User = require(".././models/user");
const Products = require(".././models/products");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { default: mongoose } = require("mongoose");

//CART
// Add to Cart => /api/v1/cart/add/:id
exports.addToCart = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ErrorHandler("Please log in first", 401));
    }

    const user = await User.findById(req.user.id);
    const productID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return next(new ErrorHandler("Invalid product ID", 400));
    }
    const product = await Products.findById(productID);

    if (!product) {
      return next(new ErrorHandler("Product not found!!!", 404));
    }

    const existingItem = user.cartItems.find((item) =>
      item.product.equals(product._id)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem = {
        name: product.name,
        quantity: 1,
        image: product.img,
        price: product.price,
        product: product._id,
      };

      user.cartItems.push(newItem);
    }

    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cartItems,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// Delete from Cart => /api/v1/cart/delete/:id
exports.deleteFromCart = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Please log in first", 401));
  }

  const user = await User.findById(req.user.id);

  const cartItemID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(cartItemID)) {
    return next(new ErrorHandler("Invalid product ID", 400));
  }

  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== cartItemID
  );

  await user.save();

  res.status(200).json({
    success: true,
    cart: user.cartItems,
  });
});
// Get Cart items => /api/v1/cart
exports.getItemsFromCart = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Please log in first", 401));
  }
  const user = await User.findById(req.user.id);


  res.status(200).json({
    success: true,
    cart: user.cartItems,
  });
});

//ORDERS

//create new order /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {

  if (!req.user) {
    return next(new ErrorHandler("Please log in first", 401));
  }
  try {
    const order = await Orders.create({
      ...req.body,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler("Error creating the new order", 404));
  }
});
// Get user orders => /api/v1/orders
exports.getUserOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    
  if (!req.user) {
    return next(new ErrorHandler("Please log in first", 401));
  }
  const orders = await Orders.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
  } catch (error) {
    return next(error);
  }
});
// Get single order => /api/v1/order/:id
exports.getOrderById = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(new ErrorHandler("Invalid order ID", 400));
  }

  const order = await Orders.findById(orderId).populate("user", "firstName lastName email");

  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }

  const isOwner = order.user && req.user && order.user._id.toString() === req.user._id.toString();
  if (!req.user || (!isOwner && req.user.role !== "admin")) {
    return next(
      new ErrorHandler("You are not authorized to view this order", 403)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});
// Clear cart after placing an order => /api/v1/order/clear/cart
exports.clearCartAffterOrder = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Please log in first", 401));
  }
  const user = await User.findById(req.user.id);
  user.cartItems = [];

  await user.save();

  res.status(200).json({
    success: true,
    cart: user.cartItems,
  });
});
//ADMIN Get user orders => /api/v1/admin/orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {

  const orders = await Orders.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});