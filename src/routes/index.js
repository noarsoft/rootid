const router = require('express').Router();

router.use('/schemax', require('./schemax.routes'));
router.use('/viewx', require('./viewx.routes'));
router.use('/formcfgx', require('./formcfgx.routes'));
router.use('/formx', require('./formx.routes'));

module.exports = router;
