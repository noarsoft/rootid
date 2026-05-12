const router = require('express').Router();
const controller = require('../controllers/businessx.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createBusiness, updateBusiness } = require('../validators/businessx.validator');

router.get('/', controller.findAll);
router.post('/', validate(createBusiness), controller.create);
router.get('/:rootid', controller.findOne);
router.put('/:rootid', validate(updateBusiness), controller.update);
router.delete('/:rootid', controller.remove);
router.get('/:rootid/history', controller.history);

module.exports = router;
