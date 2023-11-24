const mongoose = require("mongoose");
// const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;
const customers = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    categories_clicks: [
      {
        categorie_id: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categorie",
            default: null,
          },
        ],
        count: { type: Number, default: null },
      },
    ],
    login_history: [
      {
        ip: { type: String, default: null },
        device: { type: String, default: null },
        browser: { type: String, default: null },
        os: { type: String, default: null },
        created_at: { type: Date, default: Date.now },
      },
    ],

    updateLogs: [
      {
        field: { type: String, default: null },
        oldValue: { type: String, default: null },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    passwordLastUpdated: {
      type: Date,
      default: null,
    },
    passwordLastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    createdAt: "creation_date", // Use `creation_date` to store the created date
  }
);
// customers.plugin(findOrCreate);

const Customer = mongoose.model("Customer", customers);
module.exports = Customer;
