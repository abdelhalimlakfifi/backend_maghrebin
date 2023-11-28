// Import necessary modules and files
const Type = require("../../models/type.model"); // Import the Type model
const { internalError } = require("../../utils/500"); // Import internalError utility function
const { check, validationResult } = require("express-validator"); // Import check and validationResult from express-validator
const { uploadFileFunction } = require("../../utils/uploadFile"); // Import uploadFileFunction from utils

// Controller functions for handling CRUD operations

// Retrieve all types
const index = async (req, res) => {
  try {
    const types = await Type.find({ deletedAt: null })
    .populate("createdBy")
    .populate("updatedBy")
    .populate("deletedBy"); // Retrieve all types with deletedAt set to null
    res.json(types); // Send the types as a JSON response
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

// Create a new type
const store = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    // Upload the file using the uploadFileFunction
    const uploadedFile = await uploadFileFunction(
      req,
      res,
      "image",
      "types_images"
    );

    // Validation using express-validator
    await Promise.all([
      check("name").notEmpty(), // Check if the 'name' field is not empty
    ]);

    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(), // Return validation errors if any
      });
    }

    let imagePath = null;

    // Check if an image was uploaded
    if (uploadedFile == undefined) {
      return res.status(400).json({
        status: 400,
        error: "Image is required", // Return an error if image is required but not provided
      });
    }

    // Set the imagePath to the destination and originalname of the uploaded file
    imagePath = uploadedFile.destination + "/" + uploadedFile.filename;

    // Create a new Type instance
    let newType = new Type({
      name: req.body.name,
      image: imagePath,
      active: req.body.active,
      createdBy: req.user._id, // Set createdBy to the user's ID
      // createdBy: req.user ? req.user._id : "6551f9337992da1616afe8a0", // just for test
    });

    await newType.save(); // Save the newType instance to the database
    res.json(newType); // Send the newType as a JSON response
  } catch (error) {
    console.log(error); // Log any errors to the console
  }
};

// Retrieve a single type by identifier
const getOne = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const type = await Type.findById(identifier); // Find a type by its identifier

    // Check if type exists and is not soft-deleted
    if (type && type.deletedAt === null) {
      return res.json(type); // Send the type as a JSON response
    }

    // If type is not found or soft-deleted, return a 404 error
    res.status(404).json({
      message: "type Not found",
      status: 404,
    });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

// Update a type by identifier
const update = async (req, res) => {
  const uploadedFile = await uploadFileFunction(
    req,
    res,
    "image",
    "types_images"
  ); // Upload the file if provided
  const identifier = req.params.identifier;

  try {
    let imagePath = null;

    // If an image was uploaded, set imagePath to the destination and filename of the uploaded file
    if (uploadedFile != undefined) {
      imagePath = uploadedFile.destination + "/" + uploadedFile.filename;
    }

    let type = await Type.findById(identifier); // Find a type by its identifier

    // If type is not found or soft-deleted, return a 404 error
    if (!type || type.deletedAt !== null) {
      return res.status(404).json({
        status: 404,
        message: "Type not found",
      });
    }

    // Update type properties based on request body
    type.name = req.body.name ? req.body.name : type.name;
    type.active = req.body.active ? req.body.active : type.active;
    type.updatedBy = req.user._id; // Set updatedBy to the user's ID
    type.image = imagePath == null ? type.image : imagePath; // Set image to the new imagePath if provided

    await type.save();
    res.json({
      data: type,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(internalError("", error)); // Handle internal server error
  }
};

// Soft-delete a type by identifier
// const destroy = async (req, res) => {
//   const identifier = req.params.identifier;
//   const userId = req.user._id;
//   // const userId = req.headers.userid; // Extract userId from the headers
  
//   let type = await Type.findById(identifier);

//   // If type is not found, return a 404 error
//   if (!type) {
//     return res.status(404).json({
//       status: 404,
//       message: "Type not found",
//     });
//   }
//   // change req.user._id to req.params.identifier just to test (SHOULD FIX IT )
//   await type.softDelete(userId); // Soft-delete the type by updating the deletedAt field
//   res.json({
//     status: 200,
//     message: "Type deleted successfully",
//   });
// };

// Soft-delete a type by identifier
const destroy = async (req, res) => {
  const identifiers = req.body.ids;
  const userId = req.user._id;
  try {
    const types = await Type.find({ _id: { $in: identifiers } });

    if (!types || types.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Types not found",
      });
    }

    for (const type of types) {
      await type.softDelete(userId);
    }

    res.json({
      status: 200,
      message: "Types deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting types:", error.message);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// Export the controller functions
module.exports = { index, store, getOne, update, destroy };
