const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
const productRoutes = require("./routes/productRoutes");

dotenv.config();
const app = express();
morgan.format('custom', ':date[iso] :method :url');
app.use(morgan('custom'));
app.use(fileUpload());
app.use(cors({ origin: process.env.CLIENT_API, credentials: true }));
// app.use("/public/uploads", express.static(path.join(__dirname, "/public/uploads")));
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Product routes
app.use("/api", productRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
