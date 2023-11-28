const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Customer = require("../../models/customer.model");
const sendEmail = require("../../utils/email/sendEmail");
const { internalError } = require("../../utils/500");
require("dotenv").config();
bcryptSalt = process.env.BCRYPT_SALT;
CLIENT_URL_ACTIVATE = process.env.CLIENT_URL_ACTIVATE;
const Add = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;
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
      username,
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

  const token = req.params.token;
  // console.log("token :", req.params.token);
  console.log("token : ", token);
  try {
    const customer = await Customer.findOne({ activate_token: token });
    console.log(" customer email : " + customer.email);
    customer.valid_account = true;
    await customer.save();
    req.session.customer = customer;
    return res.status(200).json({ message: " Account is Active " });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};
const getAll = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const Update = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { first_name, last_name, username, email } = req.body;

    // Find the customer by ID
    const existingCustomer = await Customer.findOne({ _id: customerId });

    // Update the fields
    existingCustomer.first_name = first_name;
    existingCustomer.last_name = last_name;
    existingCustomer.username = username;
    existingCustomer.email = email;
    // Save the updated customer
    const updatedCustomer = await existingCustomer.save();
    res.status(200).json({ success: true, customer: updatedCustomer });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const search = async (req, res) => {
  try {
    const customerId = req.params.id;
    // Find the customer by ID
    const customer = await Customer.findById(customerId);
    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};
const destroy = async (req, res) => {
  try {
    const identifier = req.params.id;
    let customer = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const customer = await Customer.findById(identifier);
    } else {
      customer = await Customer.findOne({ username: identifier });
    }

    // Soft delete the category and respond with a success message.
    await Customer.softDelete(req.user._id);
    res.json({
      status: 200,
      message: "Customer deleted successfully",
    });
    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

module.exports = {
  Add,
  Update,
  search,
  activate,
  getAll,
  destroy,
};
