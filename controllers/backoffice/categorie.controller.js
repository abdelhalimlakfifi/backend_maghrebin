const Categorie = require('../../models/categorie.model');
const { internalError } = require('../../utils/500');
const { body, validationResult} = require('express-validator')
const mongoose = require('mongoose');

const storingValidation = [
    body('name').notEmpty()
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
        const existingDeletedCategorie = await Categorie.findOne({ categorieName: req.body.categorieName})


        if(existingDeletedCategorie){
            if(existingDeletedCategorie.deletedAt === null){
                res.status(409).json({ error: 'Categorie already exists' });
                return
            }else{
                await existingDeletedCategorie.deleteOne();
            }
        }

        let newCategorie = new Categorie({
            categorieName: req.body.categorieName,
            subcategorie: [],
            createdBy: req.user._id,
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
        const categorie = await Categorie.findOne({ $and: [{categorieName: req.params.categoriename}, {deletedAt:null}] })
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
                { categorieName: { $regex: query, $options:'i' }}
            ],
            deletedAt: null
        });

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

        if(categorie.categorieName !== req.body.categorieName)
        {
            const sameName = await Categorie.findOne({
                $and:[{
                    categorieName: req.body.categorieName
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
        categorie.categorieName = req.body.categorieName;
        categorie.updatedBy = req.user._id
        await categorie.save();
        res.json({
            data: categorie,
            status: 200
        });

    } catch (error) {
        res.json(internalError("", error));
    }
}

const destroy = async (req, res) => {
    const identifier = req.params.identifier;

    let categorie;
    if(mongoose.Types.ObjectId.isValid(identifier)){
        categorie = await Categorie.findById(identifier);
    }else{
        categorie = await Categorie.findOne({ categorieName: identifier});
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