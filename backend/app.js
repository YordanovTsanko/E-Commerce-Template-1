const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errors");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/user");
const auth = require("./routes/auth");
const products = require("./routes/products");
const orders = require("./routes/orders");
const reviews = require("./routes/reviews");
const productRoutes = require("./utils/addRandomProducts");

// Setting up .env file
dotenv.config({ path: ".env" });

const isProduction = process.env.NODE_ENV === "PRODUCTION";

// Адресите на фронтенда, които имат право да викат API-то.
// В .env: CLIENT_URL=http://localhost:3000,https://project-1-henna-tau.vercel.app
const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:3000,https://project-1-henna-tau.vercel.app"
)
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

// Render/Heroku стоят зад proxy — без това secure бисквитката не се изпраща.
app.set("trust proxy", 1);

//Setting up CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Заявки без Origin (Postman, curl, server-to-server) са позволени.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: ${origin} is not allowed`));
    },
    credentials: true, // ← позволява на браузъра да праща сесийната бисквитка
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

app.use(express.static("public"));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup session
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Фронтенд и бекенд на различни домейни (Vercel ↔ Render) изискват SameSite=None + Secure.
      // Локално (localhost:3000 ↔ localhost:5555) е същият "site" и стига Lax по http.
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дни
    },
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Passport configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // password е select:false в модела — тук го искаме изрично
        // Без значение от главни/малки букви — стари профили може да са с главни букви в имейла.
        const safeEmail = String(email).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const user = await User.findOne({
          email: new RegExp(`^${safeEmail}$`, "i"),
        }).select("+password");

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec(); // без паролата
    done(null, user || false);
  } catch (err) {
    done(err, null);
  }
});

app.use("/api/v1", auth);
app.use("/api/v1", products);
app.use("/api/v1", orders);
app.use("/api/v1", reviews);
app.use("/api/v1", productRoutes);

//Middleware errors
app.use(errorMiddleware);

module.exports = app;
