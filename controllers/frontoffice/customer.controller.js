const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Customer = require("../../models/customer.model");
const sendEmail = require("../../utils/email/sendEmail");
const { internalError } = require("../../utils/500");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
bcryptSalt = process.env.BCRYPT_SALT;
CLIENT_URL_ACTIVATE = process.env.CLIENT_URL_ACTIVATE;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(402).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({
      token,
    });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const Add = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    // network info of the customer
    const ip = req.ip;
    const info_customer = req.headers["user-agent"];
    // hashing token to validate account
    let SaltToken = crypto.randomBytes(32).toString("hex");
    const activate_token = await bcrypt.hash(SaltToken, Number(bcryptSalt));
    // Create a new customer instance
    const newCustomer = new Customer({
      first_name,
      last_name,
      email,
      password: hash,
      activate_token,
      login_history: [{ ip, info_customer }],
    });

    // Save the new customer to the database
    const savedCustomer = await newCustomer.save();
    // Activate account here
    const link = `${CLIENT_URL_ACTIVATE}?token=${activate_token}`;
    sendEmail(
      newCustomer.email,
      "Activate Account ",
      {
        name: newCustomer.first_name + " " + newCustomer.last_name,
        link: link,
      },
      "../../utils/email/templates/requestActivateAccount.handlebars"
    );
    res.status(200).json({
      success: true,
      email: "email successfully send to Customer",
      message: "Customer added successfully",
      customer: savedCustomer,
    });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};
const activate = async (req, res) => {
  // const userId = req.params["id"];

  const token = req.query.token;
  // console.log("token :", req.params.token);
  try {
    const customer = await Customer.findOne({ activate_token: token });
    console.log(" customer email : " + customer.email);
    customer.valid_account = true;
    await customer.save();
    // req.session.customer = customer;
    return res.status(200).json({ message: " Account is Active " });
  } catch (error) {
    res.json(internalError("error", error)); // Handle internal server error
  }
};
const getAll = async (req, res) => {
  try {
    const customers = await Customer.find(
      {},
      {
        _id: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        valid_account: 1,
        deletedAt: 1,
        deletedBy: 1,
      }
    );
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const Update = async (req, res) => {
  try {
    const customerId = req.params.id;
    // console.log("customerId ", customerId);
    const { first_name, last_name, email } = req.body;

    // Find the customer by ID
    const existingCustomer = await Customer.findOne({ _id: customerId });

    // who update the customer
    const updatedByUser = req.user ? req.user._id : null;
    const updatedByCustomer = req.customer ? req.customer._id : null;

    if (updatedByUser) {
      var updateLog = {
        field: "",
        oldValue: "",
        updatedByUser,
      };
    } else {
      var updateLog = {
        field: "",
        oldValue: "",
        updatedByCustomer,
      };
    }

    // Check each field for changes and update the updateLogs accordingly
    if (first_name && first_name !== existingCustomer.first_name) {
      updateLog.field = "first_name";
      updateLog.oldValue = existingCustomer.first_name;

      existingCustomer.updateLogs.push({ ...updateLog });
    }

    if (last_name && last_name !== existingCustomer.last_name) {
      updateLog.field = "last_name";
      updateLog.oldValue = existingCustomer.last_name;
      existingCustomer.updateLogs.push({ ...updateLog });
    }

    if (email && email !== existingCustomer.email) {
      updateLog.field = "email";
      updateLog.oldValue = existingCustomer.email;
      existingCustomer.updateLogs.push({ ...updateLog });
    }

    // Update the fields
    existingCustomer.first_name = first_name || existingCustomer.first_name;
    existingCustomer.last_name = last_name || existingCustomer.last_name;
    existingCustomer.email = email || existingCustomer.email;

    // Save the updated customer
    const updatedCustomer = await existingCustomer.save();
    res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const search = async (req, res) => {
  try {
    const customerId = req.params.id;
    // Find the customer by ID
    const customer = await Customer.findById(customerId, {
      first_name: 1,
      last_name: 1,
      email: 1,
    });
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};
const destroy = async (req, res) => {
  try {
    const identifier = req.params.id;
    const customer = await Customer.findById(identifier);
    await customer.softDelete(req.user._id);
    res.json({
      status: 200,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

module.exports = {
  login,
  Add,
  Update,
  search,
  activate,
  getAll,
  destroy,
};
