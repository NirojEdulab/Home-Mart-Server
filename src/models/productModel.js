const supabase = require('../services/supabaseClient');

async function addProduct({ name, measureUnit, imageUrl, category }) {
  const { data, error } = await supabase
    .from('product')
    .insert([{ name, measureUnit, imageUrl, category }]);

  if (error) throw new Error(error.message);
  return data;
}

async function getAllProducts() {
    const { data, error } = await supabase
      .from('product')
      .select('*');
  
    if (error) throw new Error(error.message);
    return data;
  }

module.exports = {
  addProduct,
  getAllProducts
};
