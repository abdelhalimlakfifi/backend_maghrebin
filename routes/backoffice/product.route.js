const express = require("express");
const router = express.Router();
const productController = require("../../controllers/backoffice/product.controller");

// get
router.get("/", productController.getAll);

// create
router.get("/create", productController.create);
// get one
router.get("/getone/:id", productController.getOne);

router.get("/getAll", productController.getAll);

// Post
router.post("/store", productController.store);

// search
router.get("/:search", productController.search);

// update
router.put("/update/:id", productController.update);

// delete
router.delete("/delete/:id", productController.remove);

module.exports = router;
