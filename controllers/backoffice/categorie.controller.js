// Import necessary libraries and modules.
const Categorie = require("../../models/categorie.model"); // Import the Categorie model.
const { internalError } = require("../../utils/500"); // Import a custom internalError function.
const { body, check, validationResult } = require("express-validator"); // Import express-validator for input validation.
const mongoose = require("mongoose"); // Import mongoose for working with MongoDB.
const { uploadFileFunction } = require("../../utils/uploadFile");

// Define a function to get all categories.
const index = async (req, res) => {
  try {
    // Find all categories that are not deleted and respond with the result.
    const categories = await Categorie.find({ deletedAt: null })
      .populate("createdBy")
      .populate("updatedBy")
      .populate("deletedBy")
      .populate("typeId");
    res.json(categories);
  } catch (error) {
    res.json(internalError());
  }
};

// Define a function to store a new category. => HALIM
// const store = async (req, res) => {
//   try {
//     const uploadedFile = await uploadFileFunction(
//       req,
//       res,
//       "category_image",
//       "categories_images"
//     );
//     await Promise.all([
//       check("name")
//         .notEmpty()
//         .withMessage("Category name is required")
//         .run(req),
//       check('typeId')
//           .isArray({ min: 1 })
//           .withMessage('At least one type ID is required')
//           .run(req),
//     ]);

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         errors: errors.array(),
//       });
//     }

//     const { name, typeIds } = req.body;

//     let imagePath = null;
//     if (uploadedFile == undefined) {
//       return res.status(400).json({
//         status: 400,
//         error: "Image is required",
//       });
//     }
//     imagePath = uploadedFile.destination + "/" + uploadedFile.filename;

//     const existingDeletedCategorie = await Categorie.findOne({
//       name: req.body.name,
//     });
//     if (existingDeletedCategorie) {
//       if (existingDeletedCategorie.deletedAt === null) {
//         res.status(409).json({ error: "Category already exists" });
//         return;
//       } else {
//         await existingDeletedCategorie.deleteOne();
//       }
//     }

//     const category = new Categorie({
//       name,
//       image: imagePath,
//       typeId: typeIds,
//     });

//     await category.save();

//     return res.status(200).json({
//       message: "Category saved successfully",
//       category,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Internal Server Error",
//     });
//   }
// };

// Define a function to store a new category. => SOUFIANE
const store = async (req, res) => {
  try {
    
    const uploadedFile = await uploadFileFunction(
      req,
      res,
      "category_image",
      "categories_images"
    );

    await Promise.all([
      check("name")
        .notEmpty()
        .withMessage("Category name is required")
        .run(req),
        check('typeIds')
        .isArray({ min: 1 })
        .withMessage('At least one type ID is required')
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, typeIds } = req.body;
    
    let imagePath = null;
    
    if (uploadedFile == undefined) {
      return res.status(400).json({
        status: 400,
        error: "Image is required",
      });
    }
    imagePath = uploadedFile.destination + "/" + uploadedFile.filename;

    const existingDeletedCategory = await Categorie.findOne({
      name: req.body.name,
      deletedAt: { $ne: null },
    });

    // If the category is deleted, restore it
    if (existingDeletedCategory) {
      await existingDeletedCategory.updateOne({ deletedAt: null });

      return res.status(200).json({
        message: "Category restored successfully",
        category: existingDeletedCategory,
      });
    }

    const existingCategory = await Categorie.findOne({
      name: req.body.name,
    });

    // If the category already exists, return a message
    if (existingCategory) {
      return res.status(201).json({
        message: "Category already exists",
        category: existingCategory,
      });
    }

    const category = new Categorie({
      name,
      image: imagePath,
      typeId: typeIds,
      createdBy: req.user._id
    });

    await category.save();

    return res.status(200).json({
      message: "Category saved successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// Define a function to get one category by name.
const getOne = async (req, res) => {
  try {
    const categorie = await Categorie.findOne({
      $and: [{ name: req.params.name }, { deletedAt: null }],
    })
      .populate("typeId")
      .exec();
    if (!categorie) {
      res.status(404);
      res.json({
        message: "Category not found",
        status: 404,
      });
      return;
    }
    return res.json(categorie);
  } catch (error) {
    res.json(internalError("", error));
  }
};

// Define a function to search for categories.
const search = async (req, res) => {
  const query = req.params.search;
  try {
    // Search for categories based on the query and respond with the result.
    const categories = await Categorie.find({
      $or: [{ name: { $regex: query, $options: "i" } }],
      deletedAt: null,
    })
      .populate("typeId")
      .exec();

    if (categories.length === 0) {
      res.status(404);
      res.json({
        status: 404,
        message: "No category found",
      });
      return;
    }

    res.json(categories);
  } catch (error) {
    res.json(internalError("", error));
  }
};

// Define a function to update a category.
const update = async (req, res) => {
  const id = req.params.id;
  try {
    const uploadedFile = await uploadFileFunction(
      req,
      res,
      "category_image",
      "categories_images"
    );
    await Promise.all([
      check("name")
        .notEmpty()
        .withMessage("Category name is required")
        .run(req),
      check("typeIds")
        .isArray({ min: 1 })
        .withMessage("At least one type ID is required")
        .run(req),
    ]);

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
    const category = await Categorie.findById(id);

    if (!category) {
      res.status(404);
      res.json({
        status: 404,
        message: "Category not found",
      });
      return;
    }

    if (category.name !== req.body.name) {
      const sameName = await Categorie.findOne({
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
        if (sameName.deletedAt != null) {
          await sameName.deleteOne();
        } else {
          res.json({
            status: 401,
            messgae: "This category already exists",
          });
          return;
        }
      }
    }

    let imagePath = null;
    if (uploadedFile == undefined) {
      imagePath = category.image;
    } else {
      imagePath = uploadedFile.destination + "/" + uploadedFile.filename;
    }

    // Update category properties and save the changes.
    category.name = req.body.name;
    category.typeId = req.body.typeIds;
    category.active = req.body.active;
    category.image = imagePath;
    category.updatedBy = req.user._id;
    await category.save();

    res.json({
      data: category,
      status: 200,
    });
  } catch (error) {
    res.json(internalError());
  }
};

// Define a function to delete a category. => HALIM
// const destroy = async (req, res) => {
//   const identifiers = req.body.ids;
//   const userId = req.user._id;

//   let category;
//   if (mongoose.Types.ObjectId.isValid(identifiers)) {
//     category = await Categorie.find({ _id: { $in: identifiers } });
//   } else {
//     category = await Categorie.findOne({ name: identifiers });
//   }

//   try {
//     if (!category) {
//       return res.status(404).json({
//         status: 404,
//         message: "Category not found",
//       });
//     }

//     // Soft delete the category and respond with a success message.
//     await category.softDelete(req.user._id);
//     res.json({
//       status: 200,
//       message: "Category deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json(internalError("", error));
//   }
// };

// Define a function to delete a category. => SOUFIANE
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

    const categories = await Categorie.find({ _id: { $in: identifiers } });

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Categories not found",
      });
    }

    // Soft delete the categories and respond with a success message.
    await Promise.all(
      categories.map((category) => category.softDelete(userId))
    );

    res.json({
      status: 200,
      message: "Categories deleted successfully",
    });
  } catch (error) {
    res.status(500).json(internalError("", error));
  }
};

// Export the defined functions and validation rules for use in other parts of the application.
module.exports = { index, store, getOne, search, update, destroy };
