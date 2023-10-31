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
        .custom(async (value) => {

            console.log(value)
            const categorie = await Categorie.findById(value);

            if(!categorie){
                throw new Error('Categorie not exist');
                return 
            }

            return true
        })
];

// index
const getAll = async(req, res) => {

}

// 
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

    const body = req.body;
    if(!mongoose.Types.ObjectId.isValid(req.body.subCategorieId)){
        return res.status(401).json({ error: "Unknown Sub categorie" });
    }
    const sub = await SubCategorie.findById(req.body.subCategorieId);


    if(!sub){
        return res.status(404).json({
            error: "Unknown Sub Categorie"
        });
    }

    if(body.name.length !== 0){
        sub.name = body.name
    }

    const typeDocuments = await Type.find({ _id: { $in: body.types } });
    if (typeDocuments.length !== body.types.length) {
        return res.status(404).json({ error: "Some Type IDs do not exist" });
    }
    sub.type = body.types;

    if(!(body.categoryId.oldCategorie && body.categoryId.newCategorie)){
        return res.status(401).json({ error: "Categorie should not be empty" });
    }

    if(body.categoryId.oldCategorie !== body.categoryId.newCategorie){

        // delete subcategorie from old categorie
        const oldCategorie = await Categorie.findById(body.categoryId.oldCategorie);
        oldCategorie.subcategorie = oldCategorie.subcategorie.filter(subcat => subcat !== sub._id)

        res.json(oldCategorie);


    }

    // res.json(req.body)
}
const destroy = async(req, res) => {

}



module.exports = { getAll, store, getOne, update,destroy, storingValidation }