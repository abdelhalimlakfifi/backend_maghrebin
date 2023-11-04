const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginHistorySchema = new Schema({
    ip: {
        type: String,
    },
    infocustomer: {
        type: String,
    },
    login_at: {
        type: Date,
        default: Date.now,
    }
});

const customerSchema = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    valid_account: {
        type: Boolean,
        default: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    login_history: [loginHistorySchema],
    wishlist: {
        type: Schema.Types.ObjectId,
        ref: 'Wishlist' 
    }
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
