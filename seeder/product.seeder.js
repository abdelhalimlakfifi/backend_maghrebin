const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const Product = require("../models/product.model");
const Role = require("../models/role.model");

connectDB();

const addDynamicProduct = async () => {
  const sampleProductImage = new ProductImage({
    path: "https://i.dummyjson.com/data/products/2/1.jpg", // exemple image de product
    main: true,
    secondary: false,
  });
  sampleProductImage
    .save()
    .then((savedProductImage) => {
      console.log("New product image saved:", savedProductImage);
    })
    .catch((error) => {
      console.error("Error saving product image:", error);
    });
  const newProduct = new Product({
    ref: "ABC123", // Replace with an actual reference
    images: [
      {
        image_path: sampleProductImage.ObjectId(),
        colors: "655202934a93abaffeea2e28", // exemple de color de product
      },
    ],
    title: "Sample Product",
    short_description: "A short description for the sample product.",
    long_description: "A longer description for the sample product.",
    price: 99.99, // Replace with an actual price
    reviews: [
      {
        rating: 4.5, // Replace with an actual rating
        customer: "655fb40d275a49940fa7dadb",
      },
    ],
    types: ["655376fe9270b301e8d007ab"],
    categories_id: "65538221bdb712765d1dd297",
    sub_categorie_id: "6542cc01d6408fcdd4d10369",
    tags: ["65549e30cc190c3dce2c0563"],
    sizes: ["6553e1d8431500d4b4443c1a"],
    colors: ["655202934a93abaffeea2e28"],
    createdBy: "6551f9337992da1616afe8a0",
    updateLogs: [
      {
        field: "title",
        oldValue: "Old Title",
        updatedBy: "6551f9337992da1616afe8a0",
        updatedAt: new Date(),
      },
    ],
    deletedBy: null,
    deletedAt: null,
  });

  // Save the new product instance to the database
  newProduct
    .save()
    .then((savedProduct) => {
      console.log("New product saved:", savedProduct);
    })
    .catch((error) => {
      console.error("Error saving product:", error);
    });
};

addDynamicProduct();
