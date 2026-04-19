const Product = require('../../models/Product');

const getAll = async ({ category, search }) => {
  let query = { inStock: true };
  if (category) query.category = category;
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { tags: { $in: [new RegExp(search, 'i')] } }
  ];
  return await Product.find(query).sort({ isFeatured: -1, createdAt: -1 });
};

const getById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

const create = async (data) => await Product.create(data);
const update = async (id, data) => await Product.findByIdAndUpdate(id, data, { new: true });
const remove = async (id) => await Product.findByIdAndDelete(id);

module.exports = { getAll, getById, create, update, remove };
