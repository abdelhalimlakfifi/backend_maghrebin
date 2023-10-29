const express = require('express');
const colorController = require('../../controllers/backoffice/colors.controller');

const router = express.Router();

router.get('/all', colorController.getAllColors);
router.post('/add', colorController.createColor);
router.put('/update/:id', colorController.updateColor);
router.delete('/delete/:id', colorController.deleteColor);

module.exports = router;


// router.get('/', colorController.getAllColors);
// router.post('/', colorController.createColor);
// router.put('/:id', colorController.updateColor);
// router.delete('/:id', colorController.deleteColor);