const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware');
const {permissionMiddleware} = require('../../middleware/backoffice/permissions.middleware');
const tagController = require('../../controllers/backoffice/tag.controller');




router.post('/store', authenticateToken, permissionMiddleware('tag-add'), tagController.storingValidation, tagController.store);
router.put('/update/:id', authenticateToken, permissionMiddleware('tag-edit'), tagController.update)


module.exports = router;