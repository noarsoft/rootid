const router = require('express').Router();
const ctrl = require('../controllers/formcfgx.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createSchema, updateSchema } = require('../validators/formcfgx.validator');

router.get('/', ctrl.findAll);
router.get('/:rootid', ctrl.findOne);
router.post('/', validate(createSchema), ctrl.create);
router.put('/:rootid', validate(updateSchema), ctrl.update);
router.delete('/:rootid', ctrl.remove);

module.exports = router;
