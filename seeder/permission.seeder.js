const mongoose = require('mongoose');
const Permission = require('../models/permissionModel');
require('dotenv').config();
const connectDB = require('../config/db');


connectDB();



const permissionData = [
    // role
    { label: 'role-add' },
    { label: 'role-edit' },
    { label: 'role-read' },
    { label: 'role-delete' },
    { label: 'role-read-deleted' },

    //categorie
    { label: 'categorie-add' },
    { label: 'categorie-edit' },
    { label: 'categorie-read' },
    { label: 'categorie-delete' },
    { label: 'categorie-read-deleted' },

    //sub categorie
    { label: 'sub-categorie-add' },
    { label: 'sub-categorie-edit' },
    { label: 'sub-categorie-read' },
    { label: 'sub-categorie-delete' },
    { label: 'sub-categorie-read-delete' },
    

    //sizes
    { label: 'size-add' },
    { label: 'size-edit' },
    { label: 'size-read' },
    { label: 'size-delete' },
    { label: 'size-read-delete' },

    //colors
    { label: 'color-add' },
    { label: 'color-edit' },
    { label: 'color-read' },
    { label: 'color-delete' },
    { label: 'color-read-delete' },

    //tags
    { label: 'tag-add' },
    { label: 'tag-edit' },
    { label: 'tag-read' },
    { label: 'tag-delete' },
    { label: 'tag-read-delete' },

    //product
    { label: 'product-add' },
    { label: 'product-edit' },
    { label: 'product-read' },
    { label: 'product-delete' },
    { label: 'product-read-delete' },

    //user
    { label: 'user-add' },
    { label: 'user-edit' },
    { label: 'user-read' },
    { label: 'user-delete' },
    { label: 'user-read-delete' },

    //order
    { label: 'order-add' },
    { label: 'order-edit' },
    { label: 'order-read' },
    { label: 'order-delete' },
    { label: 'order-read-delete' },


    //cart
    { label: 'cart-add' },
    { label: 'cart-edit' },
    { label: 'cart-read' },
    { label: 'cart-delete' },
    { label: 'cart-read-delete' },
];


Permission.insertMany(permissionData)
    .then(() => {
        console.log("Data seeded successfully");
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        mongoose.connection.close();
    });

