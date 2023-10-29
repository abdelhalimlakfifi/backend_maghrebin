const express = require('express');
const sizeController = require('../../controllers/backoffice/size.controller');

const router = express.Router();

// Routes
router.get('/all', sizeController.getAllSizes);
router.post('/add', sizeController.createSize);
router.put('/update/:id', sizeController.updateSize);
router.delete('/delete/:id', sizeController.deleteSize);

module.exports = router;
