const express = require("express");
const ProductTest = require("../models/products");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const router = express.Router();

const productData = [
  {
    name: "Running Shoes",
    img: "https://www.exisport.eu/197184-thickbox_default/exisport-men-s-running-trail-shoes-hoka-one-one-zinal-fiesta-black-olive.jpg", 
    price: 79.99,
    description:
      "These high-performance running shoes are designed for maximum comfort and durability. Featuring a breathable mesh upper, cushioned sole, and a lightweight design, they are perfect for long-distance runs, daily training, or casual wear. The advanced cushioning system provides excellent shock absorption and support, while the durable outsole offers superior grip on various surfaces. Ideal for athletes and fitness enthusiasts seeking reliable footwear that combines style and functionality.",
    stock: 120,
    category: "shoes",
  },
  {
    name: "Summer Dress",
    img: "https://img.fruugo.com/product/4/01/364689014_max.jpg", 
    price: 49.99,
    description:
      "This elegant summer dress combines comfort and style, featuring a lightweight fabric and a flattering cut. The dress includes a beautiful floral print and adjustable straps for a perfect fit. Ideal for warm weather, it’s perfect for casual outings, beach trips, or summer parties. The breathable material ensures you stay cool and comfortable, while the vibrant colors add a touch of sophistication to your wardrobe. Dress it up with accessories or wear it casually for versatile styling options.",
    stock: 80,
    category: "woman cloths",
  },
  {
    name: "Tailored Suit",
    img: "https://www.brides.com/thmb/P-ZbtJF8zIzXDshLtgQFhGWtErc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/best-mens-wedding-suits-5096039-7f3397d2c41c45ed96410e79eab9e7a3.jpg", 
    price: 299.99,
    description:
      "This finely tailored suit is designed for a sharp, professional look. Crafted from high-quality fabric, it features a sleek, modern cut that enhances your silhouette. The suit includes a well-fitted jacket with notched lapels and flat-front trousers, providing a sophisticated and elegant appearance. Ideal for formal events, business meetings, or special occasions, this suit ensures you make a lasting impression with its impeccable fit and timeless style.",
    stock: 45,
    category: "man cloths",
  },
  {
    name: "4K Ultra HD Television",
    img: "https://s13emagst.akamaized.net/products/55734/55733749/images/res_c04745e351928341374f2370cc702467.jpg", 
    price: 499.99,
    description:
      "Experience cinema-quality visuals with this 4K Ultra HD television. Boasting a large screen and ultra-high-definition resolution, it delivers stunning clarity and vibrant colors that enhance your viewing experience. The television is equipped with smart features, allowing you to stream your favorite content from various apps directly on your screen. With multiple connectivity options and integrated sound systems, it offers an immersive entertainment experience right in your living room.",
    stock: 25,
    category: "electronics",
  },
  {
    name: "Gold Necklace",
    img: "https://sencowebfiles.s3.ap-south-1.amazonaws.com/products/uGzrnEU6Idgnk9kIBpRfGE6qFandQP3ZebVonnRm.jpeg", 
    price: 249.99,
    description:
      "This exquisite gold necklace features a delicate design with a high-polished finish that adds elegance to any outfit. Crafted from pure gold, it showcases a timeless style that complements both formal and casual wear. The necklace includes an adjustable chain, allowing you to customize the fit to your preference. Ideal for gifting or enhancing your own jewelry collection, it is a versatile accessory that brings a touch of luxury and sophistication.",
    stock: 60,
    category: "jewelry",
  },
  {
    name: "Yoga Mat",
    img: "https://i5.walmartimages.com/seo/Everyday-Essentials-All-Purpose-1-2-Inch-High-Density-Foam-Exercise-Yoga-Mat-Anti-Tear-with-Carrying-Strap-Blue_f4b717d9-6dc1-4198-b0f8-3e88d8a2d09f.02e132731c4b639cee0057c099b45f37.jpeg", 
    price: 39.99,
    description:
      "This premium yoga mat is designed for comfort and stability during your workout sessions. Made from high-density, non-slip material, it provides excellent cushioning and support for various exercises, including yoga, Pilates, and stretching. The mat’s textured surface ensures a secure grip, while its lightweight and portable design make it easy to take to classes or use at home. With its durability and easy-to-clean surface, it’s the perfect accessory for a consistent fitness routine.",
    stock: 100,
    category: "gym accessories",
  },
  {
    name: "Smartwatch with Fitness Tracker",
    img: "https://fitvii.com/cdn/shop/files/FITVII-Fitness-Tracker_-Smart-Watch-_Answer-Make-Calls_-with-24-7-Blood-Pressure-Heart-Rate-Monitor_-Blood-Oxygen-Sleep-Tracking-Fitness-Watch_-Waterproof-Step-Calorie-Activity-Tracke_14634855-eb67-4768-9ee7-d1f19a6c5d22.jpg", 
    price: 179.99,
    description:
      "Stay connected and track your health with this advanced smartwatch featuring a built-in fitness tracker. It offers a range of health monitoring features including heart rate tracking, step counting, and sleep analysis. The smartwatch also provides notifications for calls, messages, and apps directly on your wrist. Its stylish design includes a customizable watch face and a comfortable strap, making it suitable for both workouts and everyday wear. The long battery life ensures you stay connected and informed throughout the day.",
    stock: 90,
    category: "electronics",
  },
  {
    name: "Leather Wallet",
    img: "https://www.holtzleather.com/cdn/shop/products/Big-Dixie-Bifold-Leather-Wallet-Holtz-Leather-1-980x980_1200x.jpg", 
    price: 59.99,
    description:
      "This sophisticated leather wallet combines elegance with practicality. Crafted from high-quality leather, it features multiple compartments for cards, cash, and ID, ensuring you stay organized while on the go. The wallet’s sleek design fits comfortably in your pocket or handbag, while its durable construction guarantees long-lasting use. Ideal for daily use or as a stylish gift, it adds a touch of luxury to your everyday essentials with its refined craftsmanship and classic design.",
    stock: 150,
    category: "man cloths",
  },
  {
    name: "Fitness Tracker",
    img: "https://i.ebayimg.com/images/g/z2cAAOSwTF9djg1i/s-l1600.jpg", 
    price: 89.99,
    description:
      "Monitor your health and fitness with this versatile fitness tracker. It tracks various metrics including steps taken, calories burned, and heart rate, helping you stay on top of your wellness goals. The tracker features a sleek, waterproof design and a high-resolution display that provides easy access to your fitness data and notifications. With its long battery life and compatibility with both iOS and Android devices, it’s an essential tool for anyone looking to maintain an active and healthy lifestyle.",
    stock: 110,
    category: "gym accessories",
  },
  {
    name: "Classic Wristwatch",
    img: "https://coppins.co.uk/wp-content/uploads/2023/01/24012201738-copy.jpg", 
    price: 149.99,
    description:
      "This classic wristwatch offers timeless elegance with its traditional design and high-quality craftsmanship. Featuring a precise quartz movement, it provides accurate timekeeping with minimal maintenance. The watch includes a durable leather strap and a clean, easy-to-read dial, making it suitable for both formal and casual occasions. Its versatile style complements any outfit, while its robust construction ensures reliable performance for years to come. Perfect as a personal accessory or a thoughtful gift for a loved one.",
    stock: 70,
    category: "jewelry",
  },
  {
    name: "Wireless Earbuds",
    img: "https://m.media-amazon.com/images/I/716gAr0KA6L.jpg", 
    price: 119.99,
    description:
      "Enjoy your music with these high-quality wireless earbuds, designed for exceptional sound and comfort. The earbuds feature advanced Bluetooth technology for seamless connectivity and a secure fit that stays comfortable during extended use. With built-in controls and a long-lasting battery, you can easily manage your audio and stay connected without interruption. The included charging case ensures that your earbuds are always ready to go, providing both convenience and portability for your daily activities.",
    stock: 85,
    category: "electronics",
  },
];

const createRandomProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    for (let i = 0; i < 10; i++) {
      const product = productData[i];
      const newProduct = new ProductTest({
        name: product.name,
        img: product.img,
        price: product.price,
        category: product.category,
        description: product.description,
        stock: product.stock,
        rating: product.rating,
      });
      await newProduct.save();
    }
    res.status(200).json({
      success: true,
      message: "Products added successfully.",
    });
  } catch (error) {
    next(error);
  }
});

const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
router.post("/admin/random/products", isAuthenticated, isAdmin, createRandomProducts);

module.exports = router;
