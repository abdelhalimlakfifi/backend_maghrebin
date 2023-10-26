const mongoose = require('mongoose');


const categorieSchema = new mongoose.Schema(
    {
        categorieName: {
            type: String,
            require: true,
            unique: true
        }
    }
)


// "CategoryName":"String",
        
//         "active":"boolean",

//         "created_at":"Date",
//         "created_by":"userId|nullable",

//         "updated_at":"Date",
//         "updated_By":"userId",

//         "deleted_at":"Date",
//         "deleted_by":"userId"