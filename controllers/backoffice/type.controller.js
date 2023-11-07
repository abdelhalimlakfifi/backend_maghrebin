const Type = require('../../models/type.model');
const { internalError } = require('../../utils/500');
const { body, validationResult} = require('express-validator')
const mongoose = require('mongoose');

const storingVlidation = [
    body('name').notEmpty()
];


const index = async (req, res) => {
    try {
        const types = await Type.find({ deletedAt: null });
        res.json(types);
    } catch (error) {
        res.json(internalError("", error));
    }
}

const store = async (req, res) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }


        let newType = new Type({
            name: req.body.name,
            createdBy: req.user._id
        });

        await newType.save();
        res.json(newType);

    } catch (error) {
        res.json(internalError("", error));
    }
}

const getOne = async (req, res) => {
    try {
        const identifier = req.params.identifier;
        const type = await Type.findById(identifier);

        if(type && type.deletedAt === null)
        {
            return res.json(type);
        }


        res.status(404).json({
            message: "type Not found",
            status: 404
        })
    } catch (error) {
        res.json(internalError("", error));
    }
}


const update = async (req, res) => {
    const identifier = req.params.identifier;
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        let type;
        type = await Type.findById(identifier);
        
        if(!type || type.deletedAt !== null ){
            return res.status(404).json({
                status: 404,
                message: "Type not found"
            });
        }


        if(req.body.active)
        {
            res.send(req.body.active);
        }
        
        type.name = req.body.name;
        type.active = req.body.active
        type.updatedBy = req.user._id;

        await type.save();




        res.json({
            data: type,
            status: 200
        });

    } catch (error) {
        res.status(500).json(internalError("", error));
    }
}

const destroy = async (req, res) => {
    
    const identifier = req.params.identifier;
    let type = await Type.findById(identifier);
    if(!type){
        return res.status(404).json({
            status: 404,
            message: "Type not found"
        });
    }


    await type.softDelete(identifier);
        res.json({
            status: 200,
            message: "Type deleted successfully",
        });
}

module.exports = { index, store, getOne, update, destroy, storingVlidation};
