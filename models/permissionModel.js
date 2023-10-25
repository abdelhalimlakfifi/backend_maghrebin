const mongoose = require('mongoose');

const permessionSchema = new mongoose.Schema(
    {
        label:{
            type: String,
            required: true
        }, 
    },
    {timestamps: true }
)


const Permission = mongoose.model('Permission', permessionSchema,'permissions')


module.exports = Permission;