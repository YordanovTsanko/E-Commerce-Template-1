const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Моля въведете име"],
    maxLength: [30, "Името не трябва да съдържа повече от 30 символа"],
  },
  lastName: {
    type: String,
    required: [true, "Моля въведете име"],
    maxLength: [30, "Името не трябва да съдържа повече от 30 символа"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please enter a phone number"],
    maxLength: [15, "Phone number must be less than 15 numbers"],
  },
  address: {
    type: String,
    maxLength: [50, "Address must be less than 50 characters"],
  },
  city: {
    type: String,
    maxLength: [20, "City must be less than 20 characters"],
  },
  postCode: {
    type: Number,
    maxLength: [20, "Post/Zip code must be less than 20 numbers"],
  },
  state: {
    type: String,
    maxLength: [20, "Province/State must be less than 20 characters"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLength: [6, "Password must be at least 6 characters"],
    select: false, // хешът никога не се връща към фронтенда, освен ако не е поискан с .select("+password")
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cartItems: [
    {
      name: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      image: {
        type: String,
      },
      price: {
        type: Number,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductTest",
      },
    },
  ],
});

userSchema.path("cartItems").default([]);


module.exports = mongoose.model("UserTest", userSchema);
