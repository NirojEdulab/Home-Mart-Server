const productModel = require("../models/productModel");

async function createProduct(req, res) {
  const { name, measureUnit, category } = req.body;
  const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

  if (!name || !measureUnit || !category) {
    return res
      .status(400)
      .json({ error: "Name, category and measureUnit are required" });
  }

  try {
    const newProduct = await productModel.addProduct({
      name,
      measureUnit,
      imageUrl,
      category,
    });
    res
      .status(201)
      .json({ status: 201, message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
}

async function getAllProducts(req, res) {
  try {
    const allProducts = await productModel.getAllProducts();

    if (allProducts.length === 0) {
      return res
        .status(200)
        .json({ status: 204, message: "No products found", data: [] });
    }

    return res.status(200).json({ status: 200, data: allProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
};
