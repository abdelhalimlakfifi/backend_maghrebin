const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { internalError } = require("../../utils/500");
const Customer = require("../../models/customer.model");
const Wishlist = require("../../models/wishlist.model");
// const Product = require("../../models/productModel");
const mongoose = require("mongoose");

const storingValidation = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Register Customer
const registerCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, email, password } = req.body;
  const ip = req.ip;
  const infocustomer = req.headers["user-agent"];

  try {
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      login_history: [{ ip, infocustomer }],
    });

    const savedCustomer = await newCustomer.save();

    const newWishlist = new Wishlist({
      customer: savedCustomer._id, 
    });

    const savedWishlist = await newWishlist.save();

    savedCustomer.wishlist = savedWishlist._id;
    await savedCustomer.save();

    res.status(201).json({
      message: "Customer and Wishlist created",
      customer: savedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create customer and wishlist",
      error: error.message,
    });
  }
};

// Get Customer Data by ID
async function getCustomerData(req, res) {
  const customerId = req.params.id;

  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerDetails = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      creation_date: customer.creation_date,
    };

    res.status(200).json({ customer: customerDetails });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customer data" });
  }
}



// // Get Customer's Cart Information
// async function getCustomerCart(req, res) {
//   const customerId = req.params.id;

//   try {
//     const customer = await Customer.findById(customerId);

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // Assuming cart information is a field within the Customer model
//     const cart = customer.cart;

//     res.status(200).json({ cart });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving customer's cart information" });
//   }
// }

// // Get Customer's Order History
// async function getCustomerOrderHistory(req, res) {
//   const customerId = req.params.id;

//   try {
//     const customer = await Customer.findById(customerId);

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // Assuming order history is a field within the Customer model
//     const orderHistory = customer.orderHistory;

//     res.status(200).json({ orderHistory });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving customer's order history" });
//   }
// }

module.exports = {
  registerCustomer,
  getCustomerData,
  // getCustomerWishlist,
  // postCustomerWishlist,
  // deleteCustomerProduct,
  // getCustomerCart,
  // getCustomerOrderHistory,
  storingValidation,
};




// // Get Customer's Wishlist
// const getCustomerWishlist = async (req, res) => {
//   const customerId = req.params.id;

//   try {
//     const customer = await Customer.findById(customerId).populate({
//       path: "wishlist",
//       populate: {
//         path: "products",
//       },
//     });

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     const wishlist = customer.wishlist;

//     if (!wishlist) {
//       return res
//         .status(404)
//         .json({ message: "Wishlist not found for this customer" });
//     }

//     res.status(200).json({ wishlist });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching customer wishlist",
//       error: error.message,
//     });
//   }
// };

// // POST Customer's Wishlist
// const postCustomerWishlist = async (req, res) => {
//   const customerId = req.params.customerId; // Fetch the customer ID from the request parameters
//   const productId = req.body.productId; // Assuming the productId is sent in the request body

//   try {
//     // Check if the customer exists
//     const customer = await Customer.findById(customerId);
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // Check if the product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // // Store the all product details
//     const productDetails = product;
//     console.log(productDetails);

//     // Store only the product ID
//     const productIdToAdd = productId;

//     // Find the customer's wishlist
//     const wishlist = await Wishlist.findOne({ customer: customerId });

//     if (!wishlist) {
//       const newWishlist = new Wishlist({
//         customer: customerId,
//         // Store only the product ID in the products array
//         products: [productId],
        
//         // Store the entire product object in the products array
//         // products: [productDetails],
//       });
//       await newWishlist.save();
//     } else {
//       const foundProduct = wishlist.products.find(
//         (prod) => prod._id.toString() === productId
//       );
//       if (foundProduct) {
//         return res
//           .status(400)
//           .json({ message: "Product already in the wishlist" });
//       }

//       wishlist.products.push(productId); // Push the product ID or all the product info
//       await wishlist.save();
//     }

//     res
//       .status(200)
//       .json({ message: "Product added to the wishlist", productIdToAdd });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error adding product to the wishlist",
//       error: error.message,
//     });
//   }
// };

// // DELETE request to remove a product from the customer's wishlist
// const deleteCustomerProduct = async (req, res) => {
//   try {
//       const customerId = req.params.customerId;
//       const productId = req.body.productId;

//       // Find the customer
//       const customer = await Customer.findById(customerId);

//       if (!customer) {
//           return res.status(404).json({ message: "Customer not found" });
//       }

//       // Find the customer's wishlist
//       const wishlist = await Wishlist.findOne({ customer: customerId });

//       if (!wishlist) {
//           return res.status(404).json({ message: "Wishlist not found" });
//       }

//       // Remove the product from the wishlist
//       const index = wishlist.products.indexOf(productId);
//       if (index > -1) {
//           wishlist.products.splice(index, 1);
//           await wishlist.save();
//           return res.status(200).json({ message: "Product removed from wishlist" });
//       } else {
//           return res.status(404).json({ message: "Product not found in wishlist" });
//       }
//   } catch (err) {
//       return res.status(500).json({ message: err.message });
//   }
// };