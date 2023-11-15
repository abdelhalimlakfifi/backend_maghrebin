const Tag = require('../../models/tag.model');
const { internalError } = require('../../utils/500');
const { body, validationResult } = require('express-validator');


const storingValidation = [
    body('name')
        .notEmpty(),
    body('description')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Description must be less than 100 characters')
]

const index = async (req, res) => {

}

const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }


    try {
        const existingTag = await Tag.findOne({name: req.body.name});
        if(existingTag){
            if(existingTag.deletedAt !=null ){
                existingTag.deleteOne()
            }else{
                return res.status(400).json({
                    status: 400,
                    error: "Tag name already exist"
                });
            }
        }


        const newTag = new Tag({
            name: req.body.name,
            description: req.body.description,
            createdBy: req.user._id
        });

        await newTag.save();
        return res.json(newTag);
    } catch (error) {
        console.log(error);
        res.status(500).json(internalError("Internal Server Error",error));
    }
}

const update = (req, res) => {

}

const destroy = (req, res) => {

}


module.exports = {index, store, update, destroy, storingValidation};