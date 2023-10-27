const Categorie = require('../../models/categorie.model');
const { internalError } = require('../../utils/500');
const { body, validationResult} = require('express-validator')


const storingValidation = [
    body('categorieName').notEmpty()
]


const index = async (req, res) => {
    try {
        const categories = await Categorie.find({ deletedAt: null});

        res.json(categories);
    } catch (error) {
        res.json(internalError());
    }

}


const store = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }
        const existingDeletedCategorie = await Categorie.findOne({ categorieName: req.body.categorieName, deletedAt:{$ne: null}})

        if(existingDeletedCategorie){
            await existingDeletedCategorie.deleteOne();
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


module.exports = { index, store, storingValidation }