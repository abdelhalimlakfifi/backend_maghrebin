const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/backoffice/roles.controller");
const {
  authenticateToken,
} = require("../../middleware/backoffice/authMiddleware");
const {
  permissionMiddleware,
} = require("../../middleware/backoffice/permissions.middleware");

// get
router.get(
  "/",
  authenticateToken,
  permissionMiddleware("role-read"),
  roleController.getAll
);

// Post
router.post(
  "/store",
  authenticateToken,
  permissionMiddleware("role-add"),
  roleController.storingValidation,
  roleController.store
);

// get one
router.get(
  "/getone/:rolename",
  authenticateToken,
  permissionMiddleware("role-read"),
  roleController.getOne
);

// search
router.get(
  "/:search",
  authenticateToken,
  permissionMiddleware("role-read"),
  roleController.search
);

// update
router.put(
  "/update/:id",
  authenticateToken,
  permissionMiddleware("role-edit"),
  roleController.updatingValidation,
  roleController.update
);

// delete
router.delete(
  "/delete",
  authenticateToken,
  permissionMiddleware("role-delete"),
  roleController.destroy
);

module.exports = router;
