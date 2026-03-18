const express = require('express');
const router = express.Router();
const { createOrder, getOrder } = require('../controllers/orders');

router.post('/', createOrder);
router.get('/:id', getOrder);

module.exports = router;