const queriesService = require('./queries.service');

const getAll = async (req, res) => {
  try { res.json(await queriesService.getAll(req.query)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

const getById = async (req, res) => {
  try { res.json(await queriesService.getById(req.params.id)); }
  catch (err) { res.status(404).json({ message: err.message }); }
};

const create = async (req, res) => {
  try {
    const q = await queriesService.create(req.user._id, req.body);
    res.status(201).json(q);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const addReply = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const q = await queriesService.addReply(req.params.id, req.user._id, req.body.content, isAdmin);
    res.json(q);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const markResolved = async (req, res) => {
  try { res.json(await queriesService.markResolved(req.params.id)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};

const remove = async (req, res) => {
  try { await queriesService.remove(req.params.id); res.json({ message: 'Query deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAll, getById, create, addReply, markResolved, remove };
