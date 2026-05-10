const router = require('express').Router();
const controller = require('../controllers/businessx.controller');

router.get('/', controller.findAll);
router.post('/', controller.create);
router.get('/:rootid', controller.findOne);
router.put('/:rootid', controller.update);
router.delete('/:rootid', controller.remove);
router.get('/:rootid/history', controller.history);

module.exports = router;
