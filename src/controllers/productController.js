const productModel = require("../models/productModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

async function createProduct(req, res) {
  const { name, measureUnit, category } = req.body;
  const localFilePath = req.file?.path;

  if (!name || !measureUnit || !category) {
    return res
      .status(400)
      .json({ error: "Name, category and measureUnit are required" });
  }

  try {
    let imageUrl = null;

    // Upload to Cloudinary if the file exists
    if (localFilePath) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        localFilePath,
        { resource_type: "auto" }
      );
      imageUrl = cloudinaryResponse.secure_url;

      // Delete the local file after uploading to Cloudinary
      fs.unlinkSync(localFilePath);
    }

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
    console.error("Error in createProduct:", error);
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

async function searchProducts(req, res) {
  const { search } = req.query; // Retrieve the search term from query parameters

  if (!search) {
    return res
      .status(400)
      .json({ status: 400, message: "Search term is required" });
  }

  try {
    // Search for products that match the search term in the name or category
    const searchPattern = `%${search}%`; // For partial matching in SQL

    // You can modify the query to match 'name' and/or 'category' fields based on your requirement
    const results = await productModel.searchProductsByNameOrCategory(
      searchPattern
    );

    if (results.length === 0) {
      return res
        .status(200)
        .json({ status: 204, message: "No products found", data: [] });
    }

    return res.status(200).json({ status: 200, data: results });
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).json({ status: 500, message: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    // Extract the product id from the request parameters
    const { id } = req.params;

    const data = await productModel.getProductDetails(id);

    // Perform the delete operation
    const deleteData = await productModel.deleteProduct(id);
    if (deleteData != null) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong...",
      });
    }

    const imagePublicId = data.imageUrl
      ? data.imageUrl.split("/").slice(-1)[0].split(".")[0]
      : null;

    // Delete image from cloudinary if there is any product image available
    if (imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId, (error, result) => {
        if (error) {
          console.log("Error while deleting image from Cloudinary: ", error);
        } else {
          console.log("Image deleted from Cloudinary: ", result);
        }
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  searchProducts,
  deleteProduct,
};
