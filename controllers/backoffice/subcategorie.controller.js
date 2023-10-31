const { internalError } = require('../../utils/500');
const SubCategorie = require('../../models/subCetegorie.model');
const Type = require('../../models/type.model');
const Categorie = require('../../models/categorie.model');
const { body, validationResult} = require('express-validator')
require('dotenv').config();
const mongoose = require('mongoose');



const storingValidation = [
    body('name').notEmpty(),
    body('types')
        .notEmpty(),
    body('categoryId')
        .notEmpty()
        .custom(async (value) => {
            const categorie = await Categorie.findById(value);

            if(!categorie){
                throw new Error('Categorie not exist');
                return 
            }

            return true
        })
];


const getAll = async(req, res) => {

}

const store = async(req, res) => {

    const body = req.body;
    

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let categorie = await Categorie.findById(body.categoryId)

        if(!categorie){
            return res.status(404).json({ error: "Category not found" });
        }
        
        if (!body.types || body.types.length === 0) {
            return res.status(400).json({ error: "Types array is empty" });
        }

        // const typeIds = body.types.map(typeId => mongoose.Types.ObjectId(typeId));
        const typeDocuments = await Type.find({ _id: { $in: body.types } });

        if (typeDocuments.length !== body.types.length) {
            return res.status(404).json({ error: "Some Type IDs do not exist" });
        }


        const newSub = new SubCategorie({
            name: body.name,
            type: body.types,
        });

        await newSub.save();
        categorie.subcategorie.push(newSub._id);
        await categorie.save();

        res.json(newSub);


    } catch (error) {
        res.json(internalError("", error));
    }

}

const getOne = async(req, res) => {

}

const update = async(req, res) => {

}
const destroy = async(req, res) => {

}



module.exports = { getAll, store, getOne, update,destroy, storingValidation }