const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();
bcryptSalt = process.env.BCRYPT_SALT;
const Customer = require("../../models/customer.model");
const Add_Customer_Controller = async (req, res) => {
  // Extract customer data from the request body
  const { firstName, lastName, email, password } = req.body;

  let SaltToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(SaltToken, Number(bcryptSalt));
  // Create a new customer instance
  const newCustomer = await register_Customer(
    firstName,
    lastName,
    email,
    password,
    hash
  );

  if (newCustomer) {
    res.status(201).json({
      message:
        "Customer created successfully,Check your Email to activate your account !.",
      data: newCustomer,
    });
    // activate account of customer

    // const link = `${CLIENT_URL_ACTIVATE}?token=${hash}`;
    // sendEmail(
    //   newCustomer.email,
    //   "Activate Account ",
    //   {
    //     name: newCustomer.first_name + " " + newCustomer.last_name,
    //     link: link,
    //   },
    //   "../utils/email/template/requestActivateAccount.handlebars"
    // );
    // return link;
  } else {
    res.status(500).json({ message: "Customer failed" });
  }
};
const register_Customer = async (
  firstName,
  lastName,
  email,
  password,
  hash
) => {
  try {
    // console.log("Last Name:" + lastName);
    // console.log("First Name:" + firstName);
    // console.log("Password:" + password);
    // console.log("Email:" + email);
    // console.log("hash:" + hash);
    const hashedPassword = await bcrypt.hash(password, Number(bcryptSalt));

    // Create a new user
    const newUser = new Customer({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      token: hash, // TOken to check if account is active or not
      // valid_account: true,
      active: true,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("error :" + error);
    return false;
  }
};

module.exports = {
  Add_Customer_Controller,
};
