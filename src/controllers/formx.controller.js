const service = require('../services/formx.service');

exports.findAll = async (req, res, next) => {
  try {
    const data = await service.findAll(req.query);
    res.json(data);
  } catch (err) { next(err); }
};

exports.findOne = async (req, res, next) => {
  try {
    const data = await service.findByRootId(req.params.root_id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.root_id, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.softDelete(req.params.root_id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
