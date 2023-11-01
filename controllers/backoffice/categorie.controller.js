const Categorie = require('../../models/categorie.model');
const { internalError } = require('../../utils/500');
const { body, validationResult} = require('express-validator')
const mongoose = require('mongoose');

const storingValidation = [
    body('name').notEmpty(),
    body('typeIds').notEmpty()
]

// Get All 
const index = async (req, res) => {
    try {
        const categories = await Categorie.find({ deletedAt: null});

        res.json(categories);
    } catch (error) {
        res.json(internalError());
    }

}

// Store a new Categorie
const store = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }
        const existingDeletedCategorie = await Categorie.findOne({ name: req.body.name})


        if(existingDeletedCategorie){
            if(existingDeletedCategorie.deletedAt === null){
                res.status(409).json({ error: 'Categorie already exists' });
                return
            }else{
                await existingDeletedCategorie.deleteOne();
            }
        }



        let newCategorie = new Categorie({
            name: req.body.name,
            typeId: req.body.typeIds,
            createdBy: req.user._id
        })

        await newCategorie.save();

        res.json(newCategorie);
    } catch (error) {
        res.json(internalError("", error));
    }

}


// Get One categorie by Name
const getOne = async (req, res) => {
    try {
        const categorie = await Categorie.findOne({ $and: [{name: req.params.name}, {deletedAt:null}] }).populate('typeId').exec()
        if(!categorie){
            res.status(404);
            res.json({
                message: "Categorie Not found",
                status: 404
            })

            return
        }

        return res.json(categorie)
    } catch (error) {
        res.json(internalError("", error));
    }
}


// Search for categories
const search = async (req, res) => {
    const query = req.params.search;

    try {
        const categorie = await Categorie.find({
            $or:[
                { name: { $regex: query, $options:'i' }}
            ],
            deletedAt: null
        }).populate('typeId').exec();

        if(categorie.length === 0){
            res.status(404);
            res.json({
                status: 404,
                message: "No categorie founded"
            });
            return
        }

        res.json(categorie);
    } catch (error) {
        res.json(internalError("", error));
    }
}


// update
const update = async (req, res) => {
    const id = req.params.id
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(401).json({
                error: "Id not valid"
            });
            return
        }
        const categorie = await Categorie.findById(id);

        if(!categorie)
        {
            res.status(404);
            res.json({
                status: 404,
                message:"Categorie not found"
            });
            return
        }

        if(categorie.name !== req.body.name)
        {
            const sameName = await Categorie.findOne({
                $and:[{
                    name: req.body.name
                },{
                    _id: { $ne: id}
                }]
            });

            if(sameName){
                res.json({
                    status: 401,
                    messgae: "This Categorie already Exist"
                });

                return
            }

        }
        categorie.name = req.body.name;
        categorie.typeId = req.body.typeIds,
        categorie.updatedBy = req.user._id
        await categorie.save();
        res.json({
            data: categorie,
            status: 200
        });

    } catch (error) {
        res.send(error)
        // res.json(internalError());
    }
}

const destroy = async (req, res) => {
    const identifier = req.params.identifier;

    let categorie;
    if(mongoose.Types.ObjectId.isValid(identifier)){
        categorie = await Categorie.findById(identifier);
    }else{
        categorie = await Categorie.findOne({ name: identifier});
    }

    try {
        if(!categorie)
        {
            return res.status(404).json({
                status: 404,
                message: "Category not found"
            });
        }

        await categorie.softDelete(req.user._id);
        res.json({
            status: 200,
            message: "category deleted successfully",
        });

    } catch (error) {
        res.status(500).json(internalError("", error));
    }
}

module.exports = { index, store,getOne,search, update, destroy, storingValidation }