const { internalError } = require("../../utils/500");
const Role = require("../../models/role.model");
const Permission = require("../../models/permission.model");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const mongoose = require("mongoose");

const storingValidation = [
  body("role").notEmpty(),

  body("permissions")
    .notEmpty()
    .custom((value) => {
      if (Array.isArray(value) && value.length === 0) {
        throw new Error("permissions field must not be empty");
      }
      return true;
    }),
];

const updatingValidation = [
  body("role").notEmpty(),
  body("permissions")
    .notEmpty()
    .custom((value) => {
      if (Array.isArray(value) && value.length === 0) {
        throw new Error("permissions field must not be empty");
      }
      return true;
    }),
];

const getAll = async (req, res) => {
  try {
    const roles = await Role.find({ deletedAt: null })
      .populate("permissions")
      .populate("createdBy")
      .populate("updatedBy")
      .populate("deletedBy");
    res.json(roles);
  } catch (error) {
    res.json(internalError());
  }
};

const store = async (req, res) => {
  let roleData = req.body;

  const existingRole = await Role.findOne({
    role: roleData.role,
    deletedAt: { $ne: null },
  });

  if (existingRole) {
    await existingRole.deleteOne();
  }

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get all permissions from Database. (To get the ids);
    const permissions = await Permission.find({
      label: { $in: roleData.permissions },
    });

    const newRole = new Role({
      role: roleData.role,
      permissions: permissions.map((permission) => permission._id),
    });

    const savedRole = await newRole.save();
    res.json({
      data: savedRole,
      statu: 200,
    });
  } catch (error) {
    res.json(internalError());
  }
};

const getOne = async (req, res) => {
  try {
    const permission = await Role.findOne({
      $and: [{ role: req.params.rolename }, { deletedAt: null }],
    })
      .populate("permissions")
      .exec();

    if (!permission) {
      res.status(404);
      res.json({
        message: "Role not found",
        status: 404,
      });

      return;
    }

    res.json(permission);
  } catch (error) {
    res.json(internalError());
  }
};

const search = async (req, res) => {
  const query = req.params.search;
  try {
    const role = await Role.find({
      $or: [{ role: { $regex: query, $options: "i" } }],
      deletedAt: null,
    })
      .populate("permissions")
      .exec();

    if (role.length === 0) {
      res.status(404);
      res.json({
        statu: 404,
        message: "No role founded",
      });
      return;
    }

    res.json(role);
  } catch (error) {
    res.json(internalError("", error));
  }
};

const update = async (req, res) => {
  const roleData = req.body;
  const id = req.params.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get all permissions from Database. (To get the ids);
    const permissions = await Permission.find({
      label: { $in: roleData.permissions },
    });

    const role = await Role.findById(id);

    // Validate if role exist
    if (!role) {
      res.status(404);
      res.json({
        status: 404,
        message: "Role not found",
      });
      return;
    }

    // validate if role name repeated
    if (role.role !== roleData.role) {
      const sameName = await Role.findOne({
        $and: [{ role: roleData }, { _id: id }],
      });
      if (sameName) {
        res.json({
          status: 401,
          message: "This role already exists.",
        });

        return;
      }
    }

    role.role = roleData.role;
    role.permissions = permissions.map((permission) => permission._id);
    await role.save();

    res.json({
      data: role,
      statu: 200,
    });
  } catch (error) {
    res.json(internalError());
  }
};

// Halim
// const destroy = async (req, res) => {
//     const identifier = req.params.identifier; // Accept either _id or roleName as a parameter
//     let role;

//     // Check if the identifier is a valid MongoDB ObjectId (which suggests it's an _id)
//     if (mongoose.Types.ObjectId.isValid(identifier)) {
//         role = await Role.findById(identifier);
//     } else {
//       // If it's not a valid ObjectId, treat it as a roleName
//         role = await Role.findOne({ role: identifier });
//     }
//     try {
//         if (!role) {
//             return res.status(404).json({
//                 status: 404,
//                 message: "Role not found",
//             });
//         }
//       // You may want to perform additional checks here before deleting, such as checking if it's associated with other data.

//         await role.softDelete();

//         res.json({
//             status: 200,
//             message: "Role deleted successfully",
//         });
//     } catch (error) {
//         res.status(500).json(internalError("", error));
//     }
// };

// Soufiane
const destroy = async (req, res) => {
  const identifiers = req.body.ids;
  const userId = req.user._id;
  try {
    const roles = await Role.find({ _id: { $in: identifiers } });

    if (!roles || roles.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Roles not found",
      });
    }

    for (const role of roles) {
      await role.softDelete(userId);
    }

    res.json({
      status: 200,
      message: "Roles deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting roles:", error.message);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAll,
  store,
  getOne,
  search,
  update,
  destroy,
  storingValidation,
  updatingValidation,
};
