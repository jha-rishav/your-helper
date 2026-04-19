const servicesService = require('./services.service');

const getAll = async (req, res) => {
  try {
    const services = await servicesService.getAll(req.query);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBySlug = async (req, res) => {
  try {
    const service = await servicesService.getBySlug(req.params.slug);
    res.json(service);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const service = await servicesService.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const service = await servicesService.update(req.params.id, req.body);
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await servicesService.remove(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getBySlug, create, update, remove };
