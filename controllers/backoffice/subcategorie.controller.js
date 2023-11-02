const SubCategorie = require('../../models/subCetegorie.model');
const { internalError } = require('../../utils/500');
const { body, validationResult} = require('express-validator')
const mongoose = require('mongoose');


const storingValidation = [
    body('name').notEmpty(),
    body('typeId').notEmpty(),
    body('categoryId').notEmpty()
];



// Get All
const index = async (req, res) => {
    try {
        const subCetegories = await SubCategorie.find({ deletedAt: null });
        res.json(subCetegories);
        
    } catch (error) {
        res.json(internalError());
    }
}

// Store
const store = async (req, res) => {
    
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }

        const exestingSub = await SubCategorie.findOne({name: req.body.name});

        if(exestingSub){
            if(exestingSub.deletedAt === null){
                res.status(409).json({ error: 'SubCategorie already exists' });
                return
            }else{
                await exestingSub.deleteOne();
            }
        }

        let newSub = new SubCategorie({
            name: req.body.name,
            typeId: req.body.typeId,
            categorieId: req.body.categoryId
        });

        await newSub.save();

        res.json(newSub);
    } catch (error) {
        res.json(internalError());
    }
}


// Get getOne
const getOne = async (req, res) => {

    try {
        const subCategorie = await SubCategorie.findOne({ $and: [{name: req.params.name}, {deletedAt:null}] }).populate('typeId').exec()
        if(!subCategorie){
            res.status(404);
            res.json({
                message: "Categorie Not found",
                status: 404
            })

            return
        }

        return res.json(subCategorie)
    } catch (error) {
        res.json(internalError("", error));
    }
}



// update
const update = async (req, res) => {
    const id = req.params.id;

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

        const subCategorie = await SubCategorie.findById(id);

        if(!subCategorie)
        {
            return res.status(404).json({
                message:"Sub Category not found"
            });

        }


        if(subCategorie.name !== req.body.name)
        {
            const sameName = await SubCategorie.findOne({
                $and:[{
                    name: req.body.name
                },{
                    _id: { $ne: id}
                }]
            });

            if(sameName){
                res.json({
                    status: 401,
                    messgae: "This Sub Categorie already Exist"
                });

                return
            }
        }

        subCategorie.name = req.body.name,
        subCategorie.typeId = req.body.typeId,
        subCategorie.categorieId = req.body.categoryId

        await subCategorie.save();

        res.json({
            data: subCategorie,
            status: 200
        });

    } catch (error) {
        res.json(internalError());
        // throw error
        // res.send("dasda")
    }
}


// Destroy
const destroy = async (req, res) => {
    const identifier = req.params.identifier;

    let subCategorie;
    if(mongoose.Types.ObjectId.isValid(identifier)){
        subCategorie = await SubCategorie.findById(identifier);
    }else{
        subCategorie = await SubCategorie.findOne({ name: identifier});
    }

    try {
        if(!subCategorie)
        {
            return res.status(404).json({
                status: 404,
                message: "Subcategory not found"
            });
        }

        await subCategorie.softDelete(req.user._id);
        res.json({
            status: 200,
            message: "sub Category deleted successfully",
        });
    } catch (error) {
        
    }
}


module.exports = { index, store, getOne, update, destroy, storingValidation };

