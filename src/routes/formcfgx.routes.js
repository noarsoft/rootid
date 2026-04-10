const router = require('express').Router();
const ctrl = require('../controllers/formcfgx.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createSchema, updateSchema } = require('../validators/formcfgx.validator');

router.get('/', ctrl.findAll);
router.get('/:root_id', ctrl.findOne);
router.post('/', validate(createSchema), ctrl.create);
router.put('/:root_id', validate(updateSchema), ctrl.update);
router.delete('/:root_id', ctrl.remove);

module.exports = router;
