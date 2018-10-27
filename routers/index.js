const express = require('express');
const router = express.Router();
const fleetsRouter = require('./handlers/fleets');
const vehiclesRouter = require('./handlers/vehicles');
const motionsRouter = require('./handlers/motions');

router.use('/fleets', fleetsRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/motions', motionsRouter);

module.exports = router;