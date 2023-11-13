const express = require('express');
const router = express.Router();
const colorController = require('../../controllers/backoffice/color.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');


// index
router.get('/', authenticateToken, colorController.index)
// store
router.post('/store', authenticateToken, colorController.storingValidation ,colorController.store);


// update
router.put('/update', authenticateToken, colorController.update);



module.exports = router