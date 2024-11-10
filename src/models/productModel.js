const supabase = require("../services/supabaseClient");

async function addProduct({ name, measureUnit, imageUrl, category }) {
  const { data, error } = await supabase
    .from("product")
    .insert([{ name, measureUnit, imageUrl, category }]);

  if (error) throw new Error(error.message);
  return data;
}

async function getAllProducts() {
  const { data, error } = await supabase.from("product").select("*");

  if (error) throw new Error(error.message);
  return data;
}

async function searchProductsByNameOrCategory(searchPattern) {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .or(`name.ilike.%${searchPattern}%,category.ilike.%${searchPattern}%`);

  if (error) throw new Error(error.message);
  return data;
}

async function deleteProduct(productId) {
  const { data, error } = await supabase
    .from("product")
    .delete()
    .eq("id", productId)
    .single();

  if (error) return new Error(error.message);
  return data;
}

async function getProductDetails(productId) {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("id", productId)
    .single(); // Ensures only one record is returned

  if (error) {
    throw new Error(error.message);
  }

  return data; // Returns the single product or null if not found
}

module.exports = {
  addProduct,
  getAllProducts,
  searchProductsByNameOrCategory,
  deleteProduct,
  getProductDetails,
};
