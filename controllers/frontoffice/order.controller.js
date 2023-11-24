const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const create = async (req, res) => {
  try {
    // TODO : ID of customer and get the product id after verifications of customer account
    // const id = req.customer._id;
    const id = "655fb40d275a49940fa7dadb";
    // Extract product_id  from params
    const { product_id, quantity, price, cart_total_price } = req.query;
    console.log("product_id ", product_id);
    const existingProduct = await Product.findOne({ _id: product_id });

    if (!existingProduct) {
      // If the product_id is not found, return an error
      return res.status(404).json({ message: "Product not found" });
    }
    // Create a new order
    const newOrder = new Order({
      customer_id: id,
      order_items: [
        {
          product_id: product_id,
        },
        quantity,
        price,
      ],
      orderDate: new Date(),
      cart_total_price,
      // the satus of the order
      status: "Pending",
    });

    const savedOrder = await newOrder.save();

    res.status(200).json({ message: "Order created successfully", savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  create,
};
