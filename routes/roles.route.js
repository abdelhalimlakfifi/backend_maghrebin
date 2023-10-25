const express = require('express');
const router = express.Router();
const {internalError} = require('../utils/500');
const Role = require('../models/roleModel')


// get
router.get("/",async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.json(internalError());
    }
    
});



// Post


// edit


// update


// delete



module.exports=router;