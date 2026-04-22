function createBaseController(service) {
  const findAll = async (req, res, next) => {
    try {
      const data = await service.findAll(req.query);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  const findOne = async (req, res, next) => {
    try {
      const data = await service.findByRootId(req.params.rootid);
      if (!data) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  const create = async (req, res, next) => {
    try {
      const data = await service.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };

  const update = async (req, res, next) => {
    try {
      const data = await service.update(req.params.rootid, req.body);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  const remove = async (req, res, next) => {
    try {
      await service.softDelete(req.params.rootid);
      res.json({ success: true, data: { message: 'Deleted' } });
    } catch (err) { next(err); }
  };

  return { findAll, findOne, create, update, remove };
}

module.exports = { createBaseController };
