const productsService = require('./products.service');

const getAll = async (req, res) => {
  try { res.json(await productsService.getAll(req.query)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

const getById = async (req, res) => {
  try { res.json(await productsService.getById(req.params.id)); }
  catch (err) { res.status(404).json({ message: err.message }); }
};

const create = async (req, res) => {
  try { res.status(201).json(await productsService.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};

const update = async (req, res) => {
  try { res.json(await productsService.update(req.params.id, req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};

const remove = async (req, res) => {
  try { await productsService.remove(req.params.id); res.json({ message: 'Product deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAll, getById, create, update, remove };
