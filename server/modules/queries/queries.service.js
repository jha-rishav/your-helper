const Query = require('../../models/Query');

const getAll = async ({ category, search, page = 1 }) => {
  let query = {};
  if (category) query.category = category;
  if (search) query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } }
  ];
  return await Query.find(query)
    .populate('user', 'name')
    .populate('replies.user', 'name role')
    .sort({ createdAt: -1 })
    .limit(50);
};

const getById = async (id) => {
  const q = await Query.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
    .populate('user', 'name role')
    .populate('replies.user', 'name role');
  if (!q) throw new Error('Query not found');
  return q;
};

const create = async (userId, data) => {
  return await Query.create({ user: userId, ...data });
};

const addReply = async (queryId, userId, content, isAdmin) => {
  const q = await Query.findById(queryId);
  if (!q) throw new Error('Query not found');
  q.replies.push({ user: userId, content, isAdmin });
  await q.save();
  return await Query.findById(queryId)
    .populate('user', 'name role')
    .populate('replies.user', 'name role');
};

const markResolved = async (queryId) => {
  return await Query.findByIdAndUpdate(queryId, { isResolved: true }, { new: true });
};

const remove = async (id) => await Query.findByIdAndDelete(id);

module.exports = { getAll, getById, create, addReply, markResolved, remove };
