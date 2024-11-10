const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const productRoutes = require("./routes/productRoutes");

dotenv.config();
const app = express();
morgan.format('custom', ':date[iso] :method :url');
app.use(morgan('custom'));
app.use("/public/uploads", express.static(path.join(__dirname, "/public/uploads")));
app.use(express.json());
app.use(cors());

// Product routes
app.use("/api", productRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
