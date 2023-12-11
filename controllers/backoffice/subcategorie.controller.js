const SubCategorie = require("../../models/subCetegorie.model");
const { internalError } = require("../../utils/500");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const storingValidation = [
  body("name").notEmpty(),
  body("typeId").notEmpty(),
  body("categoryId").notEmpty(),
];

// Get All
const index = async (req, res) => {
  try {
    const subCetegories = await SubCategorie.find({ deletedAt: null })
      .populate("createdBy")
      .populate("updatedBy")
      .populate("deletedBy")
      .populate("typeId")
      .populate("categorieId");
    res.json(subCetegories);
  } catch (error) {
    res.json(internalError());
  }
};

// Store
const store = async (req, res) => {
  try {
    const { name, typeIds, categorieIds } = req.body;

    // const exestingSub = await SubCategorie.findOne({ name: req.body.name });

    const existingDeletedSubCategory = await SubCategorie.findOne({
      name: { $regex: new RegExp("^" + req.body.name + "$", "i") },
      deletedAt: { $ne: null },
    });

    // If the newSub is deleted, restore it
    if (existingDeletedSubCategory) {
      await existingDeletedSubCategory.updateOne({ deletedAt: null });

      return res.status(200).json({
        message: "SubCategory restored successfully",
        newSub: existingDeletedSubCategory,
      });
    }

    const existingSubCategory = await SubCategorie.findOne({
      name: { $regex: new RegExp("^" + req.body.name + "$", "i") },
    });

    // If the newSub already exists, return a message
    if (existingSubCategory) {
      return res.status(201).json({
        message: "SubCategory already exists",
        newSub: existingSubCategory,
      });
    }

    let newSub = new SubCategorie({
      name,
      typeId: typeIds,
      categorieId: categorieIds,
      createdBy: req.user._id,
    });

    await newSub.save();

    return res.status(200).json({
      message: "SubCategory saved successfully",
      newSub,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// Get getOne
const getOne = async (req, res) => {
  try {
    const subCategorie = await SubCategorie.findOne({
      $and: [{ name: req.params.name }, { deletedAt: null }],
    })
      .populate("typeId")
      .exec();
    if (!subCategorie) {
      res.status(404);
      res.json({
        message: "Categorie Not found",
        status: 404,
      });

      return;
    }

    return res.json(subCategorie);
  } catch (error) {
    res.json(internalError("", error));
  }
};

// update
const update = async (req, res) => {
  const id = req.params.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(401).json({
        error: "Id not valid",
      });
      return;
    }

    const subCategorie = await SubCategorie.findById(id);

    if (!subCategorie) {
      return res.status(404).json({
        message: "Sub Category not found",
      });
    }

    if (subCategorie.name !== req.body.name) {
      const sameName = await SubCategorie.findOne({
        $and: [
          {
            name: req.body.name,
          },
          {
            _id: { $ne: id },
          },
        ],
      });

      if (sameName) {
        res.json({
          status: 401,
          messgae: "This Sub Categorie already Exist",
        });

        return;
      }
    }

    (subCategorie.name = req.body.name),
      (subCategorie.typeId = req.body.typeId),
      (subCategorie.categorieId = req.body.categoryId);

    await subCategorie.save();

    res.json({
      data: subCategorie,
      status: 200,
    });
  } catch (error) {
    res.json(internalError());
    // throw error
    // res.send("dasda")
  }
};

// Destroy
const destroy = async (req, res) => {
  const identifiers = req.body.ids;
  const userId = req.user._id;

  try {
    if (!identifiers || !identifiers.length) {
      return res.status(400).json({
        status: 400,
        message: "No category IDs provided for deletion",
      });
    }

    const subCategories = await SubCategorie.find({ _id: { $in: identifiers } });

    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Categories not found",
      });
    }

    // Soft delete the categories and respond with a success message.
    await Promise.all(
      subCategories.map((subCategory) => subCategory.softDelete(userId))
    );

    res.json({
      status: 200,
      message: "Categories deleted successfully",
    });
  } catch (error) {
    res.status(500).json(internalError("", error));
  }
};

module.exports = { index, store, getOne, update, destroy, storingValidation };
