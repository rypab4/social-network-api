const router = require('express').Router();
const userRoutes = require('./user-routes');
//routes to use in local/api/...
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;