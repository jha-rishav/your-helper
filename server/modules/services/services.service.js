const Service = require('../../models/Service');

const getAll = async ({ category, search }) => {
  let query = { isActive: true };
  if (category) query.category = category;
  if (search) query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { tags: { $in: [new RegExp(search, 'i')] } }
  ];
  return await Service.find(query).sort({ isFeatured: -1, createdAt: -1 });
};

const getBySlug = async (slug) => {
  const service = await Service.findOne({ slug, isActive: true });
  if (!service) throw new Error('Service not found');
  return service;
};

const create = async (data) => await Service.create(data);

const update = async (id, data) => {
  const service = await Service.findByIdAndUpdate(id, data, { new: true });
  if (!service) throw new Error('Service not found');
  return service;
};

const remove = async (id) => {
  await Service.findByIdAndDelete(id);
};

module.exports = { getAll, getBySlug, create, update, remove };
